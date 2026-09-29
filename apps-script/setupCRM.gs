// setupCRM.gs — bootstrap del CRM Netzen en Google Sheets
// Cambios V1 (score model versionado):
//   - Nueva pestana 04_SCORE_WEIGHTS con los 40 pesos por ruta A/B/C/D del spec 12.2
//   - Nueva pestana 08_INTENT_MAP con intent fijo por form_type (portal)
//   - 04_SCORE_MAP se mantiene para mapeo opcion -> dimension (spec 12.1)
//   - Ambas nuevas pestanas soportan versionado + vigencia (is_active, valid_from, valid_to)
//   - rollbackCRMTabs actualizado para incluir las nuevas pestanas

function setupCRMTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupReadme_(ss);
  setupLeads_(ss);
  setupSubmissions_(ss);
  setupCatalogs_(ss);
  setupScoreMap_(ss);
  setupScoreWeights_(ss);
  setupIntentMap_(ss);
  setupMetrics_(ss);
  setupConfig_(ss);
  invalidateScoreCache_();
  SpreadsheetApp.getUi().alert(
    'Setup CRM Netzen completado. Pestanas: 00_README, 01_LEADS, 02_SUBMISSIONS, 03_CATALOGS, 04_SCORE_MAP, 04_SCORE_WEIGHTS, 08_INTENT_MAP, 05_METRICS, 06_CONFIG'
  );
}

function setupReadme_(ss) {
  const sheet = getOrCreateSheet_(ss, '00_README');
  sheet.clear();
  sheet.getRange(1, 1, 1, 4).setValues([['Seccion', 'Contenido', 'Propietario', 'Ultima actualizacion']]);
  const rows = [
    ['Proposito', 'Sistema documental CRM Netzen - version prueba', 'Dylan', '2026-09-28'],
    ['01_LEADS', 'Backlog principal de leads con score y prioridad P1-P4', 'Comercial Netzen', '2026-09-28'],
    ['02_SUBMISSIONS', 'Registro de envios con metadata', 'Sistema', '2026-09-28'],
    ['03_CATALOGS', 'Listas maestras', 'Marketing', '2026-09-28'],
    ['04_SCORE_MAP', 'Mapa de scoring opcion -> dimension (spec 12.1)', 'Marketing', '2026-09-28'],
    ['04_SCORE_WEIGHTS', 'Pesos por ruta A/B/C/D con versionado (spec 12.2). Fuente de verdad del score.', 'Marketing', '2026-09-28'],
    ['08_INTENT_MAP', 'Intent fijo por form_type (portal). Spec seccion 12.1 tabla intent.', 'Marketing', '2026-09-28'],
    ['05_METRICS', 'Formulas agregadas para el dashboard', 'Sistema', '2026-09-28'],
    ['06_CONFIG', 'Configuracion editable del sistema (correos de notificacion, filtros, etc.)', 'Sistema', '2026-09-28']
  ];
  sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  formatHeader_(sheet, 4);
}

function setupLeads_(ss) {
  const sheet = getOrCreateSheet_(ss, '01_LEADS');
  sheet.clear();
  const headers = ['lead_id', 'created_at', 'last_touch_at', 'full_name', 'job_title', 'work_email', 'whatsapp',
    'country_code', 'company_name', 'first_portal_id', 'route_code', 'business_model', 'score_alignment', 'score_potential',
    'score_intent', 'score_priority', 'score_confidence', 'category', 'lifecycle_stage', 'owner', 'next_action',
    'next_action_at', 'notes', 'flags', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid',
    'fbclid', 'landing_page', 'landing_referrer', 'first_seen', 'utm_source_last', 'utm_medium_last', 'utm_campaign_last',
    'previous_route', 'session_id',
    'situacion', 'network_size', 'decision_role', 'budget_readiness', 'timeline', 'implementation_readiness', 'user_message'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader_(sheet, headers.length);
  applyValidation_(sheet, 11, ['A', 'B', 'C', 'D', 'E']);
  applyValidation_(sheet, 18, ['P1', 'P2', 'P3', 'P4', 'PENDIENTE', 'NO_SCORABLE']);
  applyValidation_(sheet, 19, ['nuevo', 'contactado', 'calificado', 'propuesta', 'cerrado_ganado', 'cerrado_perdido', 'nurture']);
}

function setupSubmissions_(ss) {
  const sheet = getOrCreateSheet_(ss, '02_SUBMISSIONS');
  sheet.clear();
  const headers = ['submission_id', 'received_at', 'portal_id', 'route_code', 'lead_id', 'source_path', 'referrer',
    'utm_source', 'utm_medium', 'utm_campaign', 'device', 'payload_summary', 'validation_status', 'processing_status'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader_(sheet, headers.length);
  applyValidation_(sheet, 4, ['A', 'B', 'C', 'D', 'E']);
  applyValidation_(sheet, 11, ['desktop', 'mobile', 'tablet']);
  applyValidation_(sheet, 13, ['ok', 'invalid_email', 'invalid_phone', 'privacy_missing', 'spam_suspected']);
  applyValidation_(sheet, 14, ['pending', 'processed', 'error', 'skipped']);
}

function setupCatalogs_(ss) {
  const sheet = getOrCreateSheet_(ss, '03_CATALOGS');
  sheet.clear();
  sheet.getRange(1, 1, 1, 5).setValues([['catalog_name', 'code', 'label', 'active', 'notes']]);
  const rows = [
    ['products', 'plataforma', 'Plataforma', true, 'Producto principal SaaS'],
    ['products', 'academy', 'Academy', true, 'Programas formativos'],
    ['products', 'consulting', 'Consulting', true, 'Servicios de consultoria'],
    ['products', 'soluciones', 'Soluciones por modelo', true, 'Verticales'],
    ['stages', 'nuevo', 'Nuevo', true, ''],
    ['stages', 'contactado', 'Contactado', true, ''],
    ['stages', 'calificado', 'Calificado', true, ''],
    ['stages', 'propuesta', 'Propuesta enviada', true, ''],
    ['stages', 'cerrado_ganado', 'Cerrado ganado', true, ''],
    ['stages', 'cerrado_perdido', 'Cerrado perdido', true, ''],
    ['stages', 'nurture', 'Nurture', true, ''],
    ['categories', 'P1', 'Urgente - contactar menor 4h', true, 'priority >= 80 y confidence >= 70'],
    ['categories', 'P2', 'MQL - contactar menor 24h', true, 'priority 60-79 y confidence >= 60'],
    ['categories', 'P3', 'Nurture guiado', true, 'priority 40-59'],
    ['categories', 'P4', 'Nurture largo - reserva', true, 'priority menor 40'],
    ['categories', 'PENDIENTE', 'Pendiente calificacion', true, 'confidence menor 60'],
    ['categories', 'NO_SCORABLE', 'No calificable', true, 'Contenido, newsletter, guia'],
    ['owners', 'comercial_1', 'Comercial 1', true, 'Placeholder'],
    ['owners', 'comercial_2', 'Comercial 2', true, 'Placeholder'],
    ['owners', 'marketing_nurture', 'Marketing Nurture', true, 'Cola de nurturing'],
    ['owners', 'academy_b2b', 'Academy B2B', true, 'Academy corporativa'],
    ['countries', 'MX', 'Mexico', true, ''],
    ['countries', 'CO', 'Colombia', true, ''],
    ['countries', 'AR', 'Argentina', true, ''],
    ['countries', 'CL', 'Chile', true, ''],
    ['countries', 'PE', 'Peru', true, ''],
    ['countries', 'ES', 'Espana', true, ''],
    ['countries', 'US', 'Estados Unidos', true, ''],
    ['routes', 'A', 'Apenas empiezo', true, 'Emprendedor / lanzamiento'],
    ['routes', 'B', 'Empresa establecida escalando', true, 'Escala + migracion'],
    ['routes', 'C', 'Red de distribuidores', true, 'B2B / cohortes'],
    ['routes', 'D', 'Modernizar sin migrar todo', true, 'Piloto modular'],
    ['routes', 'E', 'Cliente actual - expansion', true, 'Upsell / retencion - scoring separado (spec seccion 8)']
  ];
  sheet.getRange(2, 1, rows.length, 5).setValues(rows);
  formatHeader_(sheet, 5);
}

function setupScoreMap_(ss) {
  const sheet = getOrCreateSheet_(ss, '04_SCORE_MAP');
  sheet.clear();
  sheet.getRange(1, 1, 1, 7).setValues([['field_id', 'option_code', 'option_label', 'axis', 'dimension', 'points', 'notes']]);
  const rows = [
    ['buying_timeline', '0-3_months', '0 a 3 meses', 'potential', 'buying_timeline', 3, 'Timing corto'],
    ['buying_timeline', '3-6_months', '3 a 6 meses', 'potential', 'buying_timeline', 2, ''],
    ['buying_timeline', '6-plus_months', '6+ meses', 'potential', 'buying_timeline', 1, ''],
    ['buying_timeline', 'no_date', 'Sin fecha', 'potential', 'buying_timeline', 0, ''],
    ['decision_role', 'final_decision', 'Decision final', 'potential', 'decision_authority', 3, ''],
    ['decision_role', 'co_decide', 'Co-decision', 'potential', 'decision_authority', 2, ''],
    ['decision_role', 'influencer', 'Influencia', 'potential', 'decision_authority', 1, ''],
    ['decision_role', 'researcher', 'Solo investiga', 'potential', 'decision_authority', 0, ''],
    ['budget_readiness', 'approved', 'Aprobado', 'potential', 'budget_capacity', 3, ''],
    ['budget_readiness', 'identified', 'Rango identificado', 'potential', 'budget_capacity', 2, ''],
    ['budget_readiness', 'exploring', 'Explorando', 'potential', 'budget_capacity', 1, ''],
    ['budget_readiness', 'none', 'No disponible', 'potential', 'budget_capacity', 0, ''],
    ['process_openness', 'consultative', 'Acompanamiento consultivo', 'alignment', 'process_openness', 3, ''],
    ['process_openness', 'diagnostic', 'Diagnostico', 'alignment', 'process_openness', 2, ''],
    ['process_openness', 'info_only', 'Solo informacion', 'alignment', 'process_openness', 1, ''],
    ['process_openness', 'price_only', 'Solo precio', 'alignment', 'process_openness', 0, 'Hard flag']
  ];
  sheet.getRange(2, 1, rows.length, 7).setValues(rows);
  formatHeader_(sheet, 7);
  applyValidation_(sheet, 4, ['alignment', 'potential', 'intent']);
}

// NUEVO — Pesos por ruta segun spec 12.2.
// Los pesos suman 100 dentro de cada eje x ruta. Versionable (columnas version, is_active, valid_from, valid_to).
// Cuando negocio quiera cambiar pesos: crear un nuevo bloque con version "v2", ponerlo is_active=true y marcar v1 is_active=false + valid_to = fecha.
function setupScoreWeights_(ss) {
  const sheet = getOrCreateSheet_(ss, '04_SCORE_WEIGHTS');
  sheet.clear();
  const headers = ['version', 'route_code', 'axis', 'dimension', 'weight_pct', 'is_active', 'valid_from', 'valid_to', 'notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const today = Utilities.formatDate(new Date(), 'America/Mexico_City', 'yyyy-MM-dd');
  const V = 'v1';
  const ACT = true;
  const rows = [];

  // Spec 12.2 — orden: alignment [stage_fit, need_severity, solution_match, process_openness, implementation_readiness]
  //                     potential [budget_capacity, operation_scale, decision_authority, buying_timeline, expansion_scope]
  const matrix = {
    A: { alignment: [25, 10, 25, 20, 20], potential: [25, 15, 20, 20, 20] },
    B: { alignment: [15, 25, 25, 15, 20], potential: [15, 25, 20, 15, 25] },
    C: { alignment: [15, 20, 25, 15, 25], potential: [20, 30, 20, 15, 15] },
    D: { alignment: [10, 25, 25, 20, 20], potential: [15, 20, 20, 20, 25] }
  };
  const alignDims = ['stage_fit', 'need_severity', 'solution_match', 'process_openness', 'implementation_readiness'];
  const potDims = ['budget_capacity', 'operation_scale', 'decision_authority', 'buying_timeline', 'expansion_scope'];

  Object.keys(matrix).forEach(function (route) {
    matrix[route].alignment.forEach(function (w, i) {
      rows.push([V, route, 'alignment', alignDims[i], w, ACT, today, '', 'Spec v1.0 seccion 12.2']);
    });
    matrix[route].potential.forEach(function (w, i) {
      rows.push([V, route, 'potential', potDims[i], w, ACT, today, '', 'Spec v1.0 seccion 12.2']);
    });
  });

  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  formatHeader_(sheet, headers.length);
  applyValidation_(sheet, 3, ['alignment', 'potential']);
  applyValidation_(sheet, 6, [true, false]);
}

// NUEVO — Intent fijo por form_type (portal). Spec 12.1 "Intencion — valor fijo por portal o subintencion (20-100)".
// Los form_type marcados scorable=false son NO_SCORABLE por defecto (newsletter, guia, webinar, articulo).
function setupIntentMap_(ss) {
  const sheet = getOrCreateSheet_(ss, '08_INTENT_MAP');
  sheet.clear();
  const headers = ['version', 'form_type', 'intent_value', 'scorable', 'is_active', 'valid_from', 'valid_to', 'notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const today = Utilities.formatDate(new Date(), 'America/Mexico_City', 'yyyy-MM-dd');
  const V = 'v1';
  const rows = [
    [V, 'diagnostico',    90, true,  true, today, '', 'Solicitud de diagnostico - alta intencion'],
    [V, 'demo',           80, true,  true, today, '', 'Demo - pedido comercial'],
    [V, 'demo_protegido', 80, true,  true, today, '', 'Alias legacy de demo'],
    [V, 'contacto',       70, true,  true, today, '', 'Contacto general con calificacion'],
    [V, 'solucion',       60, true,  true, today, '', 'Recorrido de soluciones'],
    [V, 'webinar',        45, false, true, today, '', 'Registro a webinar - NO_SCORABLE'],
    [V, 'articulo',       45, false, true, today, '', 'Interaccion con articulo - NO_SCORABLE'],
    [V, 'guia_destacada', 35, false, true, today, '', 'Descarga de guia - NO_SCORABLE'],
    [V, 'guia',           35, false, true, today, '', 'Descarga de guia (alias) - NO_SCORABLE'],
    [V, 'newsletter',     20, false, true, today, '', 'Suscripcion newsletter - NO_SCORABLE']
  ];
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  formatHeader_(sheet, headers.length);
  applyValidation_(sheet, 4, [true, false]);
  applyValidation_(sheet, 5, [true, false]);
}

function setupMetrics_(ss) {
  const sheet = getOrCreateSheet_(ss, '05_METRICS');
  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['Metrica', 'Valor', 'Notas']]);
  const rows = [
    ['Total leads', '=COUNTA(01_LEADS!A2:A)', 'Todos los leads'],
    ['Leads P1', '=COUNTIF(01_LEADS!R2:R, "P1")', 'Urgente'],
    ['Leads P2', '=COUNTIF(01_LEADS!R2:R, "P2")', 'MQL'],
    ['Leads P3', '=COUNTIF(01_LEADS!R2:R, "P3")', 'Nurture guiado'],
    ['Leads P4', '=COUNTIF(01_LEADS!R2:R, "P4")', 'Reserva'],
    ['Leads PENDIENTE', '=COUNTIF(01_LEADS!R2:R, "PENDIENTE")', 'Falta info'],
    ['Leads NO_SCORABLE', '=COUNTIF(01_LEADS!R2:R, "NO_SCORABLE")', 'Contenido'],
    ['Leads esta semana', '=COUNTIFS(01_LEADS!B2:B, ">="&(TODAY()-7))', 'Ultimos 7 dias'],
    ['Leads este mes', '=COUNTIFS(01_LEADS!B2:B, ">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1))', 'Mes actual'],
    ['Leads ruta A', '=COUNTIF(01_LEADS!K2:K, "A")', 'Apenas empiezo'],
    ['Leads ruta B', '=COUNTIF(01_LEADS!K2:K, "B")', 'Empresa establecida'],
    ['Leads ruta C', '=COUNTIF(01_LEADS!K2:K, "C")', 'Red distribuidores'],
    ['Leads ruta D', '=COUNTIF(01_LEADS!K2:K, "D")', 'Modernizar'],
    ['Leads ruta E', '=COUNTIF(01_LEADS!K2:K, "E")', 'Cliente actual'],
    ['Promedio score priority', '=IFERROR(AVERAGE(01_LEADS!P2:P), 0)', 'Score priority promedio'],
    ['Promedio confidence', '=IFERROR(AVERAGE(01_LEADS!Q2:Q), 0)', 'Confianza promedio']
  ];
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  formatHeader_(sheet, 3);
}

function setupConfig_(ss) {
  const sheet = getOrCreateSheet_(ss, '06_CONFIG');
  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['key', 'value', 'descripcion']]);
  const rows = [
    ['notification_email', 'tu-correo@ejemplo.com', 'Correo destino para notificaciones de leads nuevos. Multiples, separados por comas sin espacios.'],
    ['notification_only_hot', 'true', 'Si es true solo notifica P1 y P2. Si es false notifica todos los leads incluyendo P3 P4 y PENDIENTE.'],
    ['notification_bcc', '', 'Correo en copia oculta. Opcional. Dejar vacio si no aplica.']
  ];
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  formatHeader_(sheet, 3);
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 400);
}

function getOrCreateSheet_(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function formatHeader_(sheet, numCols) {
  const header = sheet.getRange(1, 1, 1, numCols);
  header.setFontWeight('bold');
  header.setBackground('#1f2937');
  header.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}

function applyValidation_(sheet, col, values) {
  const range = sheet.getRange(2, col, 500, 1);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  range.setDataValidation(rule);
}

// Menu utilitario: correr solo la creacion/reset de pesos e intent sin tocar el resto.
function rebuildScoreConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupScoreWeights_(ss);
  setupIntentMap_(ss);
  invalidateScoreCache_();
  SpreadsheetApp.getUi().alert('SCORE_WEIGHTS e INTENT_MAP recargados. Cache invalidado.');
}

function rollbackCRMTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const names = ['00_README', '01_LEADS', '02_SUBMISSIONS', '03_CATALOGS', '04_SCORE_MAP', '04_SCORE_WEIGHTS', '08_INTENT_MAP', '05_METRICS', '06_CONFIG'];
  names.forEach(function (name) {
    const sheet = ss.getSheetByName(name);
    if (sheet) ss.deleteSheet(sheet);
  });
  invalidateScoreCache_();
  SpreadsheetApp.getUi().alert('Rollback completado.');
}
