// Justificación del scoring: replica la lógica de mapeo del backend para explicar
// por qué un lead recibió determinado score en cada eje.
//
// IMPORTANTE: mantener sincronizado con apps-script/Code.gs → mapFieldsToDimensions_
// Si cambia la lógica de mapeo allá, actualizar acá también.

export const AXIS_LABELS = {
  alignment: "Alineamiento",
  potential: "Potencial",
  intent: "Intención",
};

// Devuelve una etiqueta cualitativa por score (0-100). Diferenciada para "confidence"
// porque semánticamente mide completitud de datos, no calidad del lead.
export function tierLabelForScore(score, dimension) {
  const n = Number(score);
  if (!Number.isFinite(n)) return { label: "Sin dato", tier: "none" };
  if (dimension === "confidence") {
    if (n >= 100) return { label: "Completa", tier: "high" };
    if (n >= 70) return { label: "Alta", tier: "high" };
    if (n >= 60) return { label: "Suficiente", tier: "mid" };
    return { label: "Preliminar", tier: "cold" };
  }
  if (n >= 80) return { label: "Excelente", tier: "high" };
  if (n >= 60) return { label: "Bueno", tier: "mid" };
  if (n >= 40) return { label: "Regular", tier: "low" };
  return { label: "Bajo", tier: "cold" };
}

// Genera un highlight cualitativo del patrón general del scoring (para mostrar bajo el círculo).
// Ejemplo: "Fuerte intención de compra. Potencial en desarrollo."
export function buildScoringHighlight(lead) {
  const confidence = Number(lead.score_confidence);
  const alignment = Number(lead.score_alignment);
  const potential = Number(lead.score_potential);
  const intent = Number(lead.score_intent);

  if (Number.isFinite(confidence) && confidence < 60) {
    return "Score preliminar. Faltan datos para confirmar el potencial.";
  }

  const axes = [
    { key: "intent", label: "intención de compra", value: intent },
    { key: "alignment", label: "alineamiento", value: alignment },
    { key: "potential", label: "potencial", value: potential },
  ].filter((a) => Number.isFinite(a.value));

  if (axes.length === 0) return "";

  const sorted = [...axes].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const parts = [];
  if (strongest.value >= 70) parts.push(`Fuerte ${strongest.label}.`);
  else if (strongest.value >= 50) parts.push(`${capitalizeFirst(strongest.label)} sólido.`);

  if (weakest !== strongest && weakest.value < 50) {
    parts.push(`${capitalizeFirst(weakest.label)} en desarrollo.`);
  }

  return parts.join(" ") || "Calificación balanceada en todos los ejes.";
}

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const DIMENSION_LABELS = {
  decision_authority: "Rol en la decisión",
  budget_capacity: "Presupuesto",
  buying_timeline: "Ventana de decisión",
  implementation_readiness: "Recursos de implementación",
  operation_scale: "Tamaño de la operación",
};

// Nombres de íconos de lucide-react por dimensión (el componente los resuelve).
export const DIMENSION_ICONS = {
  decision_authority: "Users",
  budget_capacity: "Wallet",
  buying_timeline: "CalendarClock",
  implementation_readiness: "Wrench",
  operation_scale: "BarChart3",
  form_type: "Sparkles",
};

function scoreDecisionRole(value) {
  const v = String(value || "").toLowerCase();
  if (!v) return null;
  if (v.includes("tomo la decision") || v.includes("final")) return 3;
  if (v.includes("decido con")) return 2;
  if (v.includes("recomiendo") || v.includes("influ")) return 1;
  if (v.includes("investigo") || v.includes("research")) return 0;
  return null;
}

function scoreBudget(value) {
  const v = String(value || "").toLowerCase();
  if (!v) return null;
  if (v.includes("asignado") || v.includes("aprobado") || v.includes("approved")) return 3;
  if (v.includes("identificado") || v.includes("rango")) return 2;
  if (v.includes("evaluando") || v.includes("explorando") || v.includes("exploring")) return 1;
  if (v.includes("sin presupuesto") || v.startsWith("no ") || v.includes("none")) return 0;
  return null;
}

function scoreTimeline(value) {
  const v = String(value || "").toLowerCase();
  if (!v) return null;
  if (v.includes("0-3")) return 3;
  if (v.includes("3-6")) return 2;
  if (v.includes("6-12") || v.includes("6+")) return 1;
  if (v.includes("sin urgencia") || v.includes("sin fecha")) return 0;
  return null;
}

function scoreImplementation(value) {
  const v = String(value || "").toLowerCase();
  if (!v) return null;
  if (v.includes("interno")) return 3;
  if (v.includes("partner")) return 2;
  if (v.includes("acompanamiento") || v.includes("acompañamiento")) return 1;
  if (v.includes("sin recursos")) return 0;
  return null;
}

function scoreOperationScale(value) {
  const v = String(value || "").toLowerCase();
  if (!v) return null;
  if (v.includes("mas de 10") || v.includes("10.000+") || v.includes("10000+")) return 3;
  if (v.includes("1000") || v.includes("1.000")) return 2;
  if (v.includes("100")) return 1;
  if (v.includes("menos")) return 0;
  return null;
}

// Genera el desglose de dimensiones aplicables al lead con su score 0-3 y a qué eje aporta.
// Retorna array vacío si el lead no tiene respuestas de calificación.
export function computeScoringBreakdown(lead) {
  const items = [];

  if (lead.decision_role) {
    items.push({
      dimension: "decision_authority",
      label: DIMENSION_LABELS.decision_authority,
      axis: "potential",
      answer: lead.decision_role,
      score: scoreDecisionRole(lead.decision_role),
    });
  }

  if (lead.budget_readiness) {
    items.push({
      dimension: "budget_capacity",
      label: DIMENSION_LABELS.budget_capacity,
      axis: "potential",
      answer: lead.budget_readiness,
      score: scoreBudget(lead.budget_readiness),
    });
  }

  if (lead.timeline) {
    items.push({
      dimension: "buying_timeline",
      label: DIMENSION_LABELS.buying_timeline,
      axis: "potential",
      answer: lead.timeline,
      score: scoreTimeline(lead.timeline),
    });
  }

  if (lead.implementation_readiness) {
    items.push({
      dimension: "implementation_readiness",
      label: DIMENSION_LABELS.implementation_readiness,
      axis: "alignment",
      answer: lead.implementation_readiness,
      score: scoreImplementation(lead.implementation_readiness),
    });
  }

  // network_size en la hoja proviene del campo tamanio del form
  if (lead.network_size) {
    const s = scoreOperationScale(lead.network_size);
    if (s !== null) {
      items.push({
        dimension: "operation_scale",
        label: DIMENSION_LABELS.operation_scale,
        axis: "potential",
        answer: lead.network_size,
        score: s,
      });
    }
  }

  return items;
}

// Deriva el tipo de formulario a partir del first_portal_id (formato: "P_<TYPE>")
export function getFormType(lead) {
  const raw = String(lead.first_portal_id || "").trim();
  if (!raw.startsWith("P_")) return "";
  return raw.slice(2).toLowerCase().replace(/_/g, " ");
}

// Meta por categoría: cómo abrir la narrativa (opening) y qué acción sugerir.
// El opening es cualitativo (sin números) para que se lea como un colega describiendo el lead.
const CATEGORY_META = {
  P1: {
    tier: "high",
    opening: () => "tiene todos los indicadores de un lead listo para cerrar.",
    action: "Contáctalo hoy mismo. Ya cumple con los criterios de compra, no hace falta calificar más.",
  },
  P2: {
    tier: "mid",
    opening: () => "muestra buenas señales de compra.",
    action: "Contáctalo en las próximas 24h. Usa esa primera charla para resolver los puntos que aún quedan abiertos.",
  },
  P3: {
    tier: "low",
    opening: () => "está en fase exploratoria, todavía no busca cerrar pronto.",
    action: "Súmalo a nurture. Mándale contenido útil y reevalúa en 1-2 semanas.",
  },
  P4: {
    tier: "cold",
    opening: () => "está lejos de una decisión de compra hoy.",
    action: "Baja prioridad. Puedes hacer follow-up ocasional o dejarlo enfriar en nurture pasivo.",
  },
  PENDIENTE: {
    tier: "none",
    opening: () => "completó parte del formulario pero faltan datos clave para calificarlo.",
    action: "Antes de priorizarlo, contáctalo para completar la información que falta.",
  },
  NO_SCORABLE: {
    tier: "none",
    opening: () => "descargó contenido pero no completó un formulario de calificación.",
    action: "No requiere seguimiento comercial activo, ya entra al nurture automático.",
  },
};

// Descripciones neutras de cada score, redactadas para leerse fluidas dentro de una oración.
// Un mismo texto sirve tanto para fortalezas como para debilidades (el wrapper da el contexto).
const SCORE_INTERPRETATION = {
  decision_authority: {
    3: "es el decisor final del proyecto",
    2: "decide junto a su equipo",
    1: "solo tiene rol influyente",
    0: "no participa directamente en la decisión",
  },
  budget_capacity: {
    3: "ya tiene presupuesto aprobado",
    2: "identificó un rango de presupuesto",
    1: "el presupuesto todavía está en evaluación",
    0: "no tiene presupuesto asignado",
  },
  buying_timeline: {
    3: "planea comprar en 0-3 meses",
    2: "planea comprar en 3-6 meses",
    1: "planea comprar en 6-12 meses",
    0: "no tiene una fecha definida",
  },
  implementation_readiness: {
    3: "cuenta con equipo interno para implementar",
    2: "cuenta con partner tecnológico para implementar",
    1: "necesita acompañamiento externo para implementar",
    0: "no tiene recursos de implementación",
  },
  operation_scale: {
    3: "opera con más de 10.000 puntos",
    2: "opera con miles de puntos",
    1: "opera con cientos de puntos",
    0: "es una operación chica",
  },
};

function interpret(dimension, score) {
  const dim = SCORE_INTERPRETATION[dimension];
  if (!dim || score == null) return "";
  return dim[score] || "";
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pushPhraseListSegments(segments, phrases, { capitalizeFirst = false } = {}) {
  phrases.forEach((phrase, index) => {
    if (index > 0) {
      segments.push({ text: index === phrases.length - 1 ? " y " : ", " });
    }

    segments.push({
      text: index === 0 && capitalizeFirst ? capitalize(phrase) : phrase,
      bold: true,
    });
  });
}

// Genera un resumen narrativo del lead (opening + descripción + acción).
// Devuelve null si no hay categoría reconocible.
export function buildScoringNarrative(lead, items) {
  const category = String(lead.category || "").toUpperCase();
  const meta = CATEGORY_META[category];
  if (!meta) return null;

  const firstName = String(lead.full_name || "").split(" ")[0] || "Este prospecto";
  const strengths = items.filter((it) => it.score != null && it.score >= 2);
  const weaknesses = items.filter((it) => it.score != null && it.score <= 1);

  const strengthPhrases = strengths.map((s) => interpret(s.dimension, s.score)).filter(Boolean);
  const weaknessPhrases = weaknesses.map((w) => interpret(w.dimension, w.score)).filter(Boolean);

  const summarySegments = [
    { text: firstName, bold: true },
    { text: ` ${meta.opening()}` },
  ];

  if (strengthPhrases.length && weaknessPhrases.length) {
    summarySegments.push({ text: " " });
    pushPhraseListSegments(summarySegments, strengthPhrases, { capitalizeFirst: true });
    summarySegments.push({ text: ". Todavía queda definir " });
    pushPhraseListSegments(summarySegments, weaknessPhrases);
    summarySegments.push({ text: "." });
  } else if (strengthPhrases.length) {
    summarySegments.push({ text: " " });
    pushPhraseListSegments(summarySegments, strengthPhrases, { capitalizeFirst: true });
    summarySegments.push({ text: "." });
  } else if (weaknessPhrases.length) {
    summarySegments.push({ text: " Todavía queda definir " });
    pushPhraseListSegments(summarySegments, weaknessPhrases);
    summarySegments.push({ text: "." });
  }

  const summary = summarySegments.map((segment) => segment.text).join("");

  return {
    // Estructurado para render con bullets: opening en párrafo, luego listas separadas.
    openingLead: firstName,
    openingRest: ` ${meta.opening()}`,
    strengths: strengthPhrases.map(capitalize),
    weaknesses: weaknessPhrases.map(capitalize),
    // Compat con render viejo de párrafo unificado.
    summarySegments,
    summary,
    action: meta.action,
    tier: meta.tier,
  };
}
