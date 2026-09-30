// Code.gs — endpoint POST + scoring V1 spec-compliant
// Cambios V1:
//   - computeScoring lee pesos desde 04_SCORE_WEIGHTS (por ruta A/B/C/D, con versionado)
//   - Intent desde 08_INTENT_MAP (por form_type)
//   - Formula spec 12.2: axis = round(100 * SUM(score_i * weight_i) / (3 * SUM(weight_i)))
//   - Confidence spec 12.2: round(100 * SUM(weight_answered) / SUM(weight_applicable))
//   - Thresholds spec 12.3: P1 (>=80 & conf>=70), P2 (60-79 & conf>=60), P3 (40-59), P4 (<40 con datos), PENDIENTE (conf<60)
//   - Route E => scoring separado pendiente (spec seccion 8), se guarda como PENDIENTE con flag
//   - NO_SCORABLE por form_type (newsletter, guia, webinar, articulo)
//   - flags guarda "form_web - <score_model_version>" para auditoria (score_model_version = v1 hoy)
//   - Cache de pesos/intent via CacheService (TTL 300s). invalidateScoreCache_() lo limpia.

const SHEET_NAME = "01_LEADS";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const SCORE_CACHE_TTL_S = 300;

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");

    // Router de acciones. Si no hay action, se asume submit de lead (comportamiento legacy).
    const action = String(payload.action || "").trim();
    if (action === "updateLead") {
      return handleUpdateLead_(payload);
    }

    const formType = String(payload.form_type || "").slice(0, 60);
    const fields = payload.fields || {};
    const meta = payload.meta || {};

    if (!formType) return jsonResponse({ ok: false, error: "form_type requerido" });
    if (!isValidEmail(fields.email)) return jsonResponse({ ok: false, error: "email invalido" });

    const ip = (e.parameter && e.parameter.ip) || "unknown";
    if (!checkRateLimit(ip)) {
      return jsonResponse({ ok: false, error: "Demasiadas solicitudes. Espera un minuto." });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: "Hoja no encontrada" });

    const now = new Date();
    const leadId = Utilities.getUuid().slice(0, 12);
    const firstPortalId = "P_" + formType.toUpperCase().replace(/[^A-Z0-9_]/g, "_").slice(0, 40);

    const notesParts = [];
    if (fields.decision_role) notesParts.push("Rol: " + truncate(fields.decision_role));
    if (fields.budget_readiness) notesParts.push("Presupuesto: " + truncate(fields.budget_readiness));
    if (fields.timeline) notesParts.push("Timeline: " + truncate(fields.timeline));
    if (fields.implementation_readiness) notesParts.push("Recursos: " + truncate(fields.implementation_readiness));
    if (fields.situacion) notesParts.push("Situacion: " + truncate(fields.situacion));
    if (fields.mensaje) notesParts.push("Mensaje: " + truncate(fields.mensaje, 2000));
    if (fields.tamanio) notesParts.push("Tamano: " + truncate(fields.tamanio));
    if (fields.webinar) notesParts.push("Webinar: " + truncate(fields.webinar));
    if (fields.guia) notesParts.push("Guia: " + truncate(fields.guia));
    if (fields.articulo) notesParts.push("Articulo: " + truncate(fields.articulo));
    if (meta.page_path) notesParts.push("Ruta: " + truncate(meta.page_path));
    if (meta.referrer) notesParts.push("Referrer: " + truncate(meta.referrer));
    const notes = notesParts.join(" - ").slice(0, 2000);

    const scoring = computeScoring(fields, formType);
    const routeCode = truncate(fields.situacion, 40);
    const flagsValue = "form_web - " + (scoring.model_version || "v1") + (scoring.flag ? " - " + scoring.flag : "");

    sheet.appendRow([
      leadId, now, now,
      truncate(fields.nombre), truncate(fields.cargo),
      truncate(fields.email),
      asText(fields.whatsapp),
      truncate(fields.pais),
      truncate(fields.empresa),
      firstPortalId, routeCode,
      truncate(fields.modelo),
      scoring.alignment, scoring.potential, scoring.intent,
      scoring.priority, scoring.confidence, scoring.category,
      "nuevo", "",
      "Calificar y contactar", now, notes,
      flagsValue,
      truncate(meta.utm_source, 200),
      truncate(meta.utm_medium, 200),
      truncate(meta.utm_campaign, 200),
      truncate(meta.utm_content, 200),
      truncate(meta.utm_term, 200),
      truncate(meta.gclid, 500),
      truncate(meta.fbclid, 500),
      truncate(meta.landing_page, 500),
      truncate(meta.landing_referrer, 500),
      truncate(meta.first_seen, 40),
      truncate(meta.utm_source_last, 200),
      truncate(meta.utm_medium_last, 200),
      truncate(meta.utm_campaign_last, 200),
      truncate(meta.previous_route, 500),
      truncate(meta.session_id, 60),
      truncate(fields.situacion, 40),
      truncate(fields.tamanio, 200),
      truncate(fields.decision_role, 200),
      truncate(fields.budget_readiness, 200),
      truncate(fields.timeline, 200),
      truncate(fields.implementation_readiness, 200),
      truncate(fields.mensaje, 2000)
    ]);

    try {
      sendLeadNotification_(leadId, formType, fields, scoring, meta);
    } catch (mailErr) {
      Logger.log("Error enviando notificacion: " + mailErr);
    }

    return jsonResponse({ ok: true, lead_id: leadId, scoring: scoring });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message || err) });
  }
}

// ============================================================
// SCORING V1 — spec-compliant, pesos desde 04_SCORE_WEIGHTS
// ============================================================

// Mapea payload field -> {axis, dimension, score_0_3, is_answered}
// Solo estas dimensiones son APLICABLES en V1 (el form no captura las otras 5 del spec).
function mapFieldsToDimensions_(fields) {
  const out = [];

  // decision_role -> decision_authority (potential)
  const dr = String(fields.decision_role || "").toLowerCase();
  if (fields.decision_role !== undefined) {
    var s;
    if (dr.indexOf("tomo la decision") !== -1 || dr.indexOf("final") !== -1) s = 3;
    else if (dr.indexOf("decido con") !== -1 || dr.indexOf("co") !== -1 && dr.indexOf("decision") !== -1) s = 2;
    else if (dr.indexOf("recomiendo") !== -1 || dr.indexOf("influ") !== -1) s = 1;
    else if (dr.indexOf("investigo") !== -1 || dr.indexOf("research") !== -1) s = 0;
    else s = null;
    out.push({ axis: 'potential', dimension: 'decision_authority', score: s, answered: s !== null });
  }

  // budget_readiness -> budget_capacity (potential)
  const br = String(fields.budget_readiness || "").toLowerCase();
  if (fields.budget_readiness !== undefined) {
    var s2;
    if (br.indexOf("asignado") !== -1 || br.indexOf("aprobado") !== -1 || br.indexOf("approved") !== -1) s2 = 3;
    else if (br.indexOf("identificado") !== -1 || br.indexOf("rango") !== -1) s2 = 2;
    else if (br.indexOf("evaluando") !== -1 || br.indexOf("explorando") !== -1 || br.indexOf("exploring") !== -1) s2 = 1;
    else if (br.indexOf("sin presupuesto") !== -1 || br.indexOf("no ") === 0 || br.indexOf("none") !== -1) s2 = 0;
    else s2 = null;
    out.push({ axis: 'potential', dimension: 'budget_capacity', score: s2, answered: s2 !== null });
  }

  // timeline -> buying_timeline (potential)
  const tl = String(fields.timeline || "").toLowerCase();
  if (fields.timeline !== undefined) {
    var s3;
    if (tl.indexOf("0-3") !== -1) s3 = 3;
    else if (tl.indexOf("3-6") !== -1) s3 = 2;
    else if (tl.indexOf("6-12") !== -1 || tl.indexOf("6+") !== -1) s3 = 1;
    else if (tl.indexOf("sin urgencia") !== -1 || tl.indexOf("sin fecha") !== -1) s3 = 0;
    else s3 = null;
    out.push({ axis: 'potential', dimension: 'buying_timeline', score: s3, answered: s3 !== null });
  }

  // implementation_readiness -> implementation_readiness (alignment)
  const ir = String(fields.implementation_readiness || "").toLowerCase();
  if (fields.implementation_readiness !== undefined) {
    var s4;
    if (ir.indexOf("interno") !== -1) s4 = 3;
    else if (ir.indexOf("partner") !== -1) s4 = 2;
    else if (ir.indexOf("acompanamiento") !== -1 || ir.indexOf("acompañamiento") !== -1) s4 = 1;
    else if (ir.indexOf("sin recursos") !== -1) s4 = 0;
    else s4 = null;
    out.push({ axis: 'alignment', dimension: 'implementation_readiness', score: s4, answered: s4 !== null });
  }

  // tamanio -> operation_scale (potential) - solo si form lo pide (demo)
  const tam = String(fields.tamanio || "").toLowerCase();
  if (fields.tamanio !== undefined && tam.length > 0) {
    var s5;
    if (tam.indexOf("mas de 10") !== -1 || tam.indexOf("10.000+") !== -1 || tam.indexOf("10000+") !== -1) s5 = 3;
    else if (tam.indexOf("1000") !== -1 || tam.indexOf("1.000") !== -1) s5 = 2;
    else if (tam.indexOf("100") !== -1) s5 = 1;
    else if (tam.indexOf("menos") !== -1) s5 = 0;
    else s5 = null;
    if (s5 !== null) out.push({ axis: 'potential', dimension: 'operation_scale', score: s5, answered: true });
  }

  return out;
}

// Lee pesos activos de 04_SCORE_WEIGHTS. Cachea el resultado 5 min.
// Retorna: { model_version, byRoute: { A: { alignment: {dim: weight}, potential: {dim: weight} }, ... } }
function getActiveWeights_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('score_weights_active');
  if (cached) return JSON.parse(cached);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('04_SCORE_WEIGHTS');
  if (!sheet) return null;
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return null;

  const headers = values[0];
  const idx = {
    version: headers.indexOf('version'),
    route_code: headers.indexOf('route_code'),
    axis: headers.indexOf('axis'),
    dimension: headers.indexOf('dimension'),
    weight_pct: headers.indexOf('weight_pct'),
    is_active: headers.indexOf('is_active')
  };

  const byRoute = {};
  var modelVersion = null;
  for (var i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[idx.is_active]) continue;
    const route = String(row[idx.route_code]);
    const axis = String(row[idx.axis]);
    const dim = String(row[idx.dimension]);
    const w = Number(row[idx.weight_pct]) || 0;
    if (!byRoute[route]) byRoute[route] = { alignment: {}, potential: {} };
    if (byRoute[route][axis]) byRoute[route][axis][dim] = w;
    modelVersion = String(row[idx.version]);
  }

  const result = { model_version: modelVersion || 'v1', byRoute: byRoute };
  cache.put('score_weights_active', JSON.stringify(result), SCORE_CACHE_TTL_S);
  return result;
}

// Lee intent map activo. Cache 5 min.
// Retorna: { byForm: { form_type: { value, scorable } } }
function getActiveIntent_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('intent_map_active');
  if (cached) return JSON.parse(cached);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('08_INTENT_MAP');
  if (!sheet) return null;
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return null;

  const headers = values[0];
  const idx = {
    form_type: headers.indexOf('form_type'),
    intent_value: headers.indexOf('intent_value'),
    scorable: headers.indexOf('scorable'),
    is_active: headers.indexOf('is_active')
  };

  const byForm = {};
  for (var i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[idx.is_active]) continue;
    byForm[String(row[idx.form_type]).toLowerCase()] = {
      value: Number(row[idx.intent_value]) || 0,
      scorable: !!row[idx.scorable]
    };
  }
  const result = { byForm: byForm };
  cache.put('intent_map_active', JSON.stringify(result), SCORE_CACHE_TTL_S);
  return result;
}

function invalidateScoreCache_() {
  const cache = CacheService.getScriptCache();
  cache.removeAll(['score_weights_active', 'intent_map_active']);
}

// Formula spec 12.2 axis_score
function computeAxisScore_(dimensions, weights) {
  var num = 0;
  var den = 0;
  for (var i = 0; i < dimensions.length; i++) {
    const d = dimensions[i];
    const w = weights[d.dimension];
    if (w === undefined || w === 0) continue; // no aplicable en esta ruta
    if (!d.answered) continue;                // aplicable pero no respondido -> reduce confidence, no cuenta aqui
    num += d.score * w;
    den += w;
  }
  if (den === 0) return null;
  return Math.round(100 * num / (3 * den));
}

// Formula spec 12.2 confidence
function computeConfidence_(dimensions, weightsByAxis) {
  var wAnswered = 0;
  var wApplicable = 0;
  for (var i = 0; i < dimensions.length; i++) {
    const d = dimensions[i];
    const w = (weightsByAxis[d.axis] || {})[d.dimension];
    if (w === undefined || w === 0) continue; // no aplicable en esta ruta
    wApplicable += w;
    if (d.answered) wAnswered += w;
  }
  if (wApplicable === 0) return 0;
  return Math.round(100 * wAnswered / wApplicable);
}

function categorize_(priority, confidence) {
  // Spec 12.3
  if (confidence < 60) return 'PENDIENTE';
  if (priority >= 80 && confidence >= 70) return 'P1';
  if (priority >= 60) return 'P2';
  if (priority >= 40) return 'P3';
  return 'P4';
}

function computeScoring(fields, formType) {
  const intentMap = getActiveIntent_();
  const formKey = String(formType || '').toLowerCase();
  const intentEntry = intentMap && intentMap.byForm[formKey];

  // NO_SCORABLE: form de contenido (newsletter, guia, webinar, articulo)
  if (intentEntry && !intentEntry.scorable) {
    return {
      alignment: "", potential: "", intent: intentEntry.value,
      priority: "", confidence: "", category: "NO_SCORABLE",
      model_version: (getActiveWeights_() || {}).model_version || "v1",
      flag: "form_type_no_scorable"
    };
  }

  const weights = getActiveWeights_();
  if (!weights) {
    // Fallback: si no hay pestana de pesos, marcar como PENDIENTE con flag
    return {
      alignment: "", potential: "", intent: "", priority: "", confidence: "",
      category: "PENDIENTE", model_version: "none", flag: "missing_score_weights"
    };
  }

  const routeCode = String(fields.situacion || "").toUpperCase();

  // Route E -> ACCOUNT_EXPANSION, formula distinta (spec seccion 8). V1 lo marca PENDIENTE con flag.
  if (routeCode === 'E') {
    return {
      alignment: "", potential: "", intent: intentEntry ? intentEntry.value : "",
      priority: "", confidence: "", category: "PENDIENTE",
      model_version: weights.model_version, flag: "route_E_requires_expansion_scoring"
    };
  }

  // Rutas fuera de A/B/C/D (o vacia) -> no se puede scorear con pesos por ruta
  if (!weights.byRoute[routeCode]) {
    // Aun asi calculamos con default 'B' como aproximacion, y flag
    const dims = mapFieldsToDimensions_(fields);
    const anyAnswered = dims.some(function (d) { return d.answered; });
    if (!anyAnswered) {
      return {
        alignment: "", potential: "", intent: intentEntry ? intentEntry.value : "",
        priority: "", confidence: "", category: "PENDIENTE",
        model_version: weights.model_version, flag: "route_missing_and_no_dims"
      };
    }
    // sin ruta -> PENDIENTE porque no podemos aplicar pesos correctos
    return {
      alignment: "", potential: "", intent: intentEntry ? intentEntry.value : "",
      priority: "", confidence: "", category: "PENDIENTE",
      model_version: weights.model_version, flag: "route_missing"
    };
  }

  const routeWeights = weights.byRoute[routeCode];
  const dims = mapFieldsToDimensions_(fields);

  // Sin ninguna dimension respondida -> PENDIENTE
  const anyAnswered = dims.some(function (d) { return d.answered; });
  if (!anyAnswered) {
    return {
      alignment: "", potential: "", intent: intentEntry ? intentEntry.value : "",
      priority: "", confidence: 0, category: "PENDIENTE",
      model_version: weights.model_version, flag: "no_dimensions_answered"
    };
  }

  const alignDims = dims.filter(function (d) { return d.axis === 'alignment'; });
  const potDims = dims.filter(function (d) { return d.axis === 'potential'; });

  const alignment = computeAxisScore_(alignDims, routeWeights.alignment);
  const potential = computeAxisScore_(potDims, routeWeights.potential);
  const intent = intentEntry ? intentEntry.value : 0;
  const confidence = computeConfidence_(dims, routeWeights);

  // Si un eje no tiene pesos aplicables/respondidos, usarlo como 0 para no romper la formula.
  const aVal = alignment === null ? 0 : alignment;
  const pVal = potential === null ? 0 : potential;
  const priority = Math.round(0.50 * aVal + 0.35 * pVal + 0.15 * intent);
  const category = categorize_(priority, confidence);

  return {
    alignment: aVal, potential: pVal, intent: intent,
    priority: priority, confidence: confidence, category: category,
    model_version: weights.model_version
  };
}

// ============================================================
// Utils compartidos
// ============================================================

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function truncate(value, max) {
  if (max === undefined) max = 500;
  if (value === undefined || value === null) return "";
  const str = String(value);
  return str.length > max ? str.slice(0, max) : str;
}

function asText(value) {
  const str = truncate(value);
  if (!str) return "";
  const first = str.charAt(0);
  if (first === "+" || first === "=" || first === "-" || first === "@") {
    return "'" + str;
  }
  return str;
}

function checkRateLimit(ip) {
  const key = "rl_" + ip;
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  const stored = props.getProperty(key);
  let bucket = stored ? JSON.parse(stored) : { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  bucket.count += 1;
  props.setProperty(key, JSON.stringify(bucket));
  return bucket.count <= RATE_LIMIT_MAX;
}

// ============================================================
// Notificaciones — sin cambios de logica, misma implementacion
// ============================================================

function getNotificationConfig_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("06_CONFIG");
  if (!sheet) return null;
  var values = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < values.length; i++) {
    var key = String(values[i][0] || "").trim();
    var value = String(values[i][1] || "").trim();
    if (key) config[key] = value;
  }
  if (!config.notification_email) return null;
  return {
    email: config.notification_email,
    onlyHot: String(config.notification_only_hot || "").toLowerCase() === "true",
    bcc: config.notification_bcc || ""
  };
}

function traducirSituacion_(codigo) {
  var mapa = {
    "A": "A - Apenas empiezo / explorando",
    "B": "B - Empresa establecida que busca escalar",
    "C": "C - Profesionalizar mi red de distribuidores",
    "D": "D - Ya tengo software propio / modernizar",
    "E": "E - Cliente actual - expansion"
  };
  return mapa[String(codigo || "").toUpperCase()] || String(codigo || "") || "No especificada";
}

function traducirTipoFormulario_(tipo) {
  var mapa = {
    "diagnostico": "Solicitud de diagnostico",
    "demo": "Solicitud de demo",
    "demo_protegido": "Solicitud de demo",
    "solucion": "Solicitud desde recorrido de soluciones",
    "webinar": "Registro a webinar",
    "guia_destacada": "Descarga de guia",
    "newsletter": "Suscripcion al newsletter",
    "contacto": "Formulario de contacto"
  };
  return mapa[String(tipo || "").toLowerCase()] || String(tipo || "Formulario");
}

function armarLinkWhatsApp_(numero, nombre) {
  if (!numero) return "";
  var numeroLimpio = String(numero).replace(/[^0-9]/g, "");
  if (!numeroLimpio) return "";
  var primerNombre = String(nombre || "").split(" ")[0] || "";
  var mensaje = "Hola " + primerNombre + ", soy del equipo de Netzen. Recibimos tu solicitud en el sitio y me pongo en contacto para conversar sobre tu operacion ";
  return "https://wa.me/" + numeroLimpio + "?text=" + encodeURIComponent(mensaje);
}

function armarLinkEmail_(email, nombre) {
  if (!email) return "";
  var primerNombre = String(nombre || "").split(" ")[0] || "";
  var subject = "Netzen - Seguimiento a tu solicitud";
  var body = "Hola " + primerNombre + ",\n\nSoy del equipo de Netzen. Recibimos tu solicitud y me pongo en contacto para conversar sobre tu operacion y ver como podemos ayudarte.\n\nCuando te resulte conveniente, agendemos una llamada corta.\n\nSaludos.";
  return "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

function escapeHtml_(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sendLeadNotification_(leadId, formType, fields, scoring, meta) {
  var config = getNotificationConfig_();
  if (!config) {
    Logger.log("Notificaciones no configuradas. Ver pestana 06_CONFIG.");
    return;
  }
  if (config.onlyHot && scoring.category !== "P1" && scoring.category !== "P2") {
    return;
  }

  var template = HtmlService.createTemplateFromFile("emailLead");
  template.nombre = fields.nombre || "Sin nombre";
  template.empresa = fields.empresa || "Sin empresa";
  template.email = fields.email || "";
  template.whatsapp = fields.whatsapp || "-";
  template.pais = fields.pais || "-";
  template.modelo = fields.modelo || "-";
  template.situacion = traducirSituacion_(fields.situacion);
  template.rol = fields.decision_role || "-";
  template.presupuesto = fields.budget_readiness || "-";
  template.timeline = fields.timeline || "-";
  template.recursos = fields.implementation_readiness || "-";
  template.tipoFormulario = traducirTipoFormulario_(formType);
  template.fecha = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
  // WhatsApp y Email: links DIRECTOS (wa.me / mailto). Sin redirect por Apps Script.
  // El tracking del touch se hace via tracking pixel (ver template.trackingPixelUrl):
  // cuando Irving abre el email, el cliente carga la imagen 1x1 -> se dispara handleTrackContact_
  // con channel="email_opened", que avanza lifecycle_stage nuevo->contactado y loguea el touch.
  template.whatsappLink = armarLinkWhatsApp_(fields.whatsapp, fields.nombre);
  template.emailLink = armarLinkEmail_(fields.email, fields.nombre);
  template.trackingPixelUrl = buildTrackingPixelUrl_(leadId);

  try {
    template.sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  } catch (e) {
    template.sheetUrl = "";
  }

  var mensajeRaw = fields.mensaje || "";
  if (mensajeRaw) {
    template.mensaje = escapeHtml_(mensajeRaw).replace(/\n/g, "<br>");
  } else {
    template.mensaje = "<em style='color:#9ca3af;'>Sin mensaje adicional</em>";
  }

  var html = template.evaluate().getContent();

  // Subject unico por lead (con leadId) para evitar que Gmail agrupe emails "iguales" en threads
  // y recorte el contenido con "[Mensaje recortado]", lo que impide que el tracking pixel se cargue.
  var asunto = "Nuevo lead #" + String(leadId).slice(0, 6) + " · " + (fields.empresa || "Sin empresa") + " · " + (fields.nombre || "Sin nombre");

  var bodyPlano = "";
  bodyPlano += "NETZEN - Nuevo lead recibido\n\n";
  bodyPlano += (fields.nombre || "Sin nombre") + "\n";
  bodyPlano += (fields.empresa || "Sin empresa") + "\n\n";
  bodyPlano += "CONTACTO\n";
  bodyPlano += "Email: " + (fields.email || "-") + "\n";
  bodyPlano += "WhatsApp: " + (fields.whatsapp || "-") + "\n";
  bodyPlano += "Pais: " + (fields.pais || "-") + "\n";
  bodyPlano += "Modelo de negocio: " + (fields.modelo || "-") + "\n\n";
  bodyPlano += "SITUACION DEL PROSPECTO\n";
  bodyPlano += traducirSituacion_(fields.situacion) + "\n\n";
  bodyPlano += "CALIFICACION\n";
  bodyPlano += "Rol en la decision: " + (fields.decision_role || "-") + "\n";
  bodyPlano += "Presupuesto: " + (fields.budget_readiness || "-") + "\n";
  bodyPlano += "Timeline: " + (fields.timeline || "-") + "\n";
  bodyPlano += "Recursos: " + (fields.implementation_readiness || "-") + "\n\n";
  bodyPlano += "MENSAJE\n" + (fields.mensaje || "(sin mensaje)") + "\n\n";
  bodyPlano += "Tipo: " + traducirTipoFormulario_(formType) + "\n";
  bodyPlano += "Recibido: " + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + "\n";

  var options = {
    to: config.email,
    subject: asunto,
    body: bodyPlano,
    htmlBody: html
  };
  if (config.bcc) {
    options.bcc = config.bcc;
  }
  MailApp.sendEmail(options);
}

// ============================================================
// UPDATE LEAD — mutacion desde el dashboard interno
// Autorizada por token compartido (Script Properties: DASHBOARD_API_TOKEN).
// Whitelist estricta de campos editables y valores por enum.
// ============================================================

const UPDATE_ALLOWED_FIELDS = {
  lifecycle_stage: ["nuevo", "contactado", "calificado", "propuesta", "cerrado_ganado", "cerrado_perdido", "nurture"]
};

function handleUpdateLead_(payload) {
  const expectedToken = PropertiesService.getScriptProperties().getProperty("DASHBOARD_API_TOKEN");
  if (!expectedToken) return jsonResponse({ ok: false, error: "server_misconfig: DASHBOARD_API_TOKEN no seteado" });

  const token = String(payload.token || "");
  if (token !== expectedToken) return jsonResponse({ ok: false, error: "unauthorized" });

  const leadId = String(payload.lead_id || "").trim();
  const field = String(payload.field || "").trim();
  const value = String(payload.value || "").trim();

  if (!leadId) return jsonResponse({ ok: false, error: "lead_id requerido" });
  if (!UPDATE_ALLOWED_FIELDS[field]) return jsonResponse({ ok: false, error: "field no editable: " + field });
  if (UPDATE_ALLOWED_FIELDS[field].indexOf(value) === -1) return jsonResponse({ ok: false, error: "valor invalido para " + field });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ ok: false, error: "Hoja no encontrada" });

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return jsonResponse({ ok: false, error: "hoja vacia" });

  const headers = values[0];
  const idColIdx = headers.indexOf("lead_id");
  const fieldColIdx = headers.indexOf(field);
  if (idColIdx === -1) return jsonResponse({ ok: false, error: "columna lead_id no encontrada" });
  if (fieldColIdx === -1) return jsonResponse({ ok: false, error: "columna " + field + " no encontrada" });

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idColIdx]) === leadId) {
      sheet.getRange(i + 1, fieldColIdx + 1).setValue(value);
      // Actualiza updated_at si existe la columna, para dejar rastro de la mutacion.
      const updatedColIdx = headers.indexOf("updated_at");
      if (updatedColIdx !== -1) sheet.getRange(i + 1, updatedColIdx + 1).setValue(new Date());
      return jsonResponse({ ok: true, lead_id: leadId, field: field, value: value });
    }
  }
  return jsonResponse({ ok: false, error: "lead_id no encontrado" });
}

// ============================================================
// TRACK CONTACT — click de boton WhatsApp/Email desde el correo de notificacion
// Endpoint GET publico (?action=trackContact). HMAC(lead_id|channel) para evitar
// que un tercero dispare mutaciones. Avanza lifecycle_stage "nuevo" -> "contactado"
// de forma idempotente y redirige al destino real via HTML (Apps Script no soporta 302).
// ============================================================

function getTrackingSecret_() {
  return PropertiesService.getScriptProperties().getProperty("TRACKING_SECRET") || "";
}

function signTrack_(leadId, channel) {
  var secret = getTrackingSecret_();
  if (!secret) return "";
  var raw = Utilities.computeHmacSha256Signature(leadId + "|" + channel, secret);
  // base16 truncado a 16 chars: suficiente contra fuerza bruta (2^64) y queda un URL corto.
  return raw.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("").slice(0, 16);
}

function buildTrackingUrl_(leadId, channel) {
  var token = signTrack_(leadId, channel);
  if (!token) return ""; // Sin secret configurado -> caller usa link directo
  var base;
  try { base = ScriptApp.getService().getUrl(); }
  catch (e) { return ""; }
  if (!base) return "";
  return base + "?action=trackContact&lead_id=" + encodeURIComponent(leadId) + "&channel=" + channel + "&t=" + token;
}

// URL del pixel de tracking (1x1 invisible) que se embebe en el email.
// Cuando el cliente de correo abre el email, carga la imagen -> dispara el tracker.
function buildTrackingPixelUrl_(leadId) {
  return buildTrackingUrl_(leadId, "email_opened");
}

function handleTrackContact_(e) {
  var leadId = String((e.parameter && e.parameter.lead_id) || "").trim();
  var channel = String((e.parameter && e.parameter.channel) || "").trim();
  var token = String((e.parameter && e.parameter.t) || "").trim();

  // Canales soportados:
  // - "email_opened": pixel invisible que se dispara al abrir el email de notificacion.
  //   Retorna respuesta liviana (no HTML) porque el cliente de correo espera una imagen.
  // - "whatsapp": legacy, redirect wrapper (mantiene compatibilidad si algun link viejo lo usa).
  var isPixel = channel === "email_opened";
  if (!leadId || (channel !== "email_opened" && channel !== "whatsapp") || !token) {
    return isPixel ? pixelResponse_() : htmlTrackError_("Link invalido.");
  }
  var expected = signTrack_(leadId, channel);
  if (!expected) return isPixel ? pixelResponse_() : htmlTrackError_("El servidor no tiene TRACKING_SECRET configurado.");
  if (token !== expected) return isPixel ? pixelResponse_() : htmlTrackError_("Link invalido o adulterado.");

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return isPixel ? pixelResponse_() : htmlTrackError_("Hoja de leads no encontrada.");

  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (lockErr) {
    return isPixel ? pixelResponse_() : htmlTrackError_("Sistema ocupado, intentalo en unos segundos.");
  }

  try {
    var values = sheet.getDataRange().getValues();
    if (values.length <= 1) return isPixel ? pixelResponse_() : htmlTrackError_("No hay leads registrados.");

    var headers = values[0];
    var idColIdx = headers.indexOf("lead_id");
    var stageColIdx = headers.indexOf("lifecycle_stage");
    var whatsappColIdx = headers.indexOf("whatsapp");
    var nombreColIdx = headers.indexOf("full_name");
    var touchColIdx = headers.indexOf("last_touch_at");
    if (idColIdx === -1 || stageColIdx === -1) {
      return isPixel ? pixelResponse_() : htmlTrackError_("Columnas requeridas no encontradas.");
    }

    var destination = "";
    var found = false;
    var previousStage = "";
    var stageAdvanced = false;

    for (var i = 1; i < values.length; i++) {
      if (String(values[i][idColIdx]) === leadId) {
        found = true;
        previousStage = String(values[i][stageColIdx] || "").trim();
        // Idempotente: solo avanza desde "nuevo" o vacio. No pisa estados posteriores.
        if (previousStage === "" || previousStage === "nuevo") {
          sheet.getRange(i + 1, stageColIdx + 1).setValue("contactado");
          stageAdvanced = true;
        }
        if (touchColIdx !== -1) sheet.getRange(i + 1, touchColIdx + 1).setValue(new Date());
        if (!isPixel) {
          var whatsapp = whatsappColIdx !== -1 ? String(values[i][whatsappColIdx] || "") : "";
          var nombre = nombreColIdx !== -1 ? String(values[i][nombreColIdx] || "") : "";
          destination = armarLinkWhatsApp_(whatsapp, nombre);
        }
        SpreadsheetApp.flush();
        break;
      }
    }

    if (!found) return isPixel ? pixelResponse_() : htmlTrackError_("Lead no encontrado.");

    // Log del touch event en hoja separada (best-effort, no bloquea la respuesta si falla)
    try {
      logTouchEvent_({
        leadId: leadId,
        channel: channel,
        source: isPixel ? "email_pixel" : "email_notification",
        previousStage: previousStage,
        stageAdvanced: stageAdvanced,
        userAgent: String((e.parameter && e.parameter.ua) || ""),
      });
    } catch (logErr) {
      Logger.log("Error logueando touch event: " + logErr);
    }

    if (isPixel) return pixelResponse_();
    if (!destination) return htmlTrackError_("No hay WhatsApp registrado para este lead.");
    return htmlTrackRedirect_(destination, channel);
  } finally {
    lock.releaseLock();
  }
}

// Respuesta liviana para el tracking pixel. Apps Script ContentService no soporta MIME
// de imagen directamente, pero el <img> del email tiene display:none, asi que el cliente
// nunca renderiza la respuesta. Lo importante es que el GET se ejecute (ya se ejecuto).
function pixelResponse_() {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}

// Hoja 02_TOUCH_EVENTS con columnas: event_id, event_at, lead_id, channel, source,
// previous_stage, stage_advanced, user_agent. Se crea vacia al primer uso si no existe.
function logTouchEvent_(evt) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("02_TOUCH_EVENTS");
  if (!sheet) {
    sheet = ss.insertSheet("02_TOUCH_EVENTS");
    sheet.appendRow([
      "event_id", "event_at", "lead_id", "channel", "source",
      "previous_stage", "stage_advanced", "user_agent"
    ]);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
    Utilities.getUuid().slice(0, 12),
    new Date(),
    String(evt.leadId || ""),
    String(evt.channel || ""),
    String(evt.source || ""),
    String(evt.previousStage || ""),
    !!evt.stageAdvanced,
    String(evt.userAgent || "").slice(0, 500),
  ]);
}

function htmlTrackRedirect_(destination, channel) {
  var label = channel === "whatsapp" ? "WhatsApp" : "tu cliente de correo";
  var safeDest = String(destination).replace(/"/g, "&quot;");
  // Apps Script sirve el HTML dentro de un iframe cross-origin (script.googleusercontent.com).
  // wa.me y muchos otros destinos rechazan carga en iframe (X-Frame-Options).
  // Solucion: forzar el redirect en la ventana top con target="_top" + window.top.location.
  var html = ''
    + '<!doctype html><html lang="es"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>Abriendo ' + label + '...</title>'
    + '<base target="_top">'
    + '<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f6f6;color:#0b1220;'
    + 'margin:0;padding:40px 20px;text-align:center}.card{max-width:420px;margin:60px auto;background:#fff;'
    + 'padding:32px 24px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08)}h1{font-size:20px;margin:0 0 12px;color:#AA0000}'
    + 'p{margin:12px 0;line-height:1.5}a.btn{display:inline-block;margin-top:16px;padding:12px 24px;'
    + 'background:#AA0000;color:#fff;text-decoration:none;border-radius:8px;font-weight:600}</style></head><body>'
    + '<div class="card"><h1>Abriendo ' + label + '...</h1>'
    + '<p>Si no abre en unos segundos, hace click en el boton:</p>'
    + '<a class="btn" href="' + safeDest + '" target="_top" rel="noopener">Continuar</a>'
    + '<p style="font-size:12px;color:#6b7280;margin-top:24px">Estado del lead actualizado a <strong>contactado</strong>.</p>'
    + '</div>'
    + '<script>'
    + 'var dest=' + JSON.stringify(destination) + ';'
    + 'try{(window.top||window).location.replace(dest);}'
    + 'catch(e){window.location.replace(dest);}'
    + '</script>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle("Abriendo " + label + "...")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function htmlTrackError_(msg) {
  var safeMsg = escapeHtml_(msg);
  var html = ''
    + '<!doctype html><html lang="es"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>Netzen - Link no valido</title>'
    + '<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f6f6;color:#0b1220;'
    + 'margin:0;padding:40px 20px;text-align:center}.card{max-width:420px;margin:60px auto;background:#fff;'
    + 'padding:32px 24px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08)}h1{font-size:20px;margin:0 0 12px;color:#AA0000}'
    + 'p{margin:12px 0;line-height:1.5;color:#374151}</style></head><body>'
    + '<div class="card"><h1>No pudimos abrir el contacto</h1>'
    + '<p>' + safeMsg + '</p><p style="font-size:12px;color:#6b7280">Podes volver al correo y usar el email o WhatsApp del prospecto directamente.</p>'
    + '</div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle("Netzen - Error");
}

// ============================================================
// TOUCH EVENTS — historial de actividad de un lead para el dashboard
// Endpoint GET publico: ?action=touchEvents&lead_id=XXX
// Devuelve los ultimos 20 eventos de 02_TOUCH_EVENTS filtrados por lead_id.
// ============================================================

const TOUCH_EVENTS_MAX = 20;

function handleTouchEvents_(e) {
  var leadId = String((e.parameter && e.parameter.lead_id) || "").trim();
  if (!leadId) return jsonResponse({ ok: false, error: "lead_id requerido", events: [] });

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("02_TOUCH_EVENTS");
  // Si la hoja no existe aun (nunca hubo un touch event), devolver array vacio.
  if (!sheet) return jsonResponse({ ok: true, events: [] });

  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return jsonResponse({ ok: true, events: [] });

  var headers = values[0];
  var idx = {
    event_id: headers.indexOf("event_id"),
    event_at: headers.indexOf("event_at"),
    lead_id: headers.indexOf("lead_id"),
    channel: headers.indexOf("channel"),
    source: headers.indexOf("source"),
    previous_stage: headers.indexOf("previous_stage"),
    stage_advanced: headers.indexOf("stage_advanced"),
  };
  if (idx.lead_id === -1) return jsonResponse({ ok: false, error: "schema invalido", events: [] });

  var events = [];
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idx.lead_id]) !== leadId) continue;
    events.push({
      event_id: idx.event_id !== -1 ? String(values[i][idx.event_id] || "") : "",
      event_at: idx.event_at !== -1 ? toIsoDate_(values[i][idx.event_at]) : "",
      channel: idx.channel !== -1 ? String(values[i][idx.channel] || "") : "",
      source: idx.source !== -1 ? String(values[i][idx.source] || "") : "",
      previous_stage: idx.previous_stage !== -1 ? String(values[i][idx.previous_stage] || "") : "",
      stage_advanced: idx.stage_advanced !== -1 ? !!values[i][idx.stage_advanced] : false,
    });
  }

  // Sort desc por event_at (mas reciente primero), cap a 20.
  events.sort(function (a, b) { return (b.event_at || "").localeCompare(a.event_at || ""); });
  if (events.length > TOUCH_EVENTS_MAX) events = events.slice(0, TOUCH_EVENTS_MAX);

  return jsonResponse({ ok: true, events: events });
}

function toIsoDate_(v) {
  if (v instanceof Date) return v.toISOString();
  if (!v) return "";
  try {
    var d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toISOString();
  } catch (e) { return String(v); }
}
