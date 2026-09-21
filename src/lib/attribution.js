// Captura y persistencia de atribución de campaña + contexto de navegación interna.
// Fuente de verdad para: de dónde llegó el lead (UTMs, gclid, fbclid), landing page,
// referrer, ruta anterior dentro del sitio, y session_id para correlacionar formularios.
//
// Persistencia: sessionStorage (no localStorage — no queremos cruzar pestañas).
// Todo envuelto en try/catch: private mode / cookies bloqueadas no rompen el flujo.
//
// Modelo de atribución:
//   first-touch → key `netzen_attribution`, se setea UNA vez al aterrizar. Nunca se pisa.
//   last-touch  → key `netzen_attribution_last`, se pisa cuando llegan UTMs nuevas.

const KEY_FIRST = "netzen_attribution";
const KEY_LAST = "netzen_attribution_last";
const KEY_SESSION = "netzen_session_id";
const KEY_PREV_ROUTE = "netzen_previous_route";
const KEY_CURR_ROUTE = "netzen_current_route";

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const CLICK_IDS = ["gclid", "fbclid"];

const EMPTY_ATTRIBUTION = {
  utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", utm_term: "",
  gclid: "", fbclid: "",
  landing_page: "", landing_referrer: "",
  first_seen_iso: "", first_seen_ms: 0
};

function hasWindow() {
  return typeof window !== "undefined";
}

function safeGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore — private mode, quota, etc.
  }
}

function readJSON(key) {
  const raw = safeGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJSON(key, obj) {
  try {
    safeSet(key, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

function parseSearchParams() {
  if (!hasWindow()) return {};
  const params = new URLSearchParams(window.location.search || "");
  const result = {};
  [...UTM_PARAMS, ...CLICK_IDS].forEach((k) => {
    const v = params.get(k);
    if (v) result[k] = v;
  });
  return result;
}

function hasAnyCampaignParam(parsed) {
  return UTM_PARAMS.some((k) => parsed[k]) || CLICK_IDS.some((k) => parsed[k]);
}

function generateSessionId() {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
  } catch {
    // fall through
  }
  // Fallback: 32 hex chars, no crypto guarantees.
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

export function initAttribution() {
  if (!hasWindow()) return;

  const parsed = parseSearchParams();
  const existing = readJSON(KEY_FIRST);

  if (!existing) {
    const now = new Date();
    const attribution = {
      utm_source: parsed.utm_source || "",
      utm_medium: parsed.utm_medium || "",
      utm_campaign: parsed.utm_campaign || "",
      utm_content: parsed.utm_content || "",
      utm_term: parsed.utm_term || "",
      gclid: parsed.gclid || "",
      fbclid: parsed.fbclid || "",
      landing_page: window.location.hash.replace(/^#/, "") || "/",
      landing_referrer: (typeof document !== "undefined" && document.referrer) || "",
      first_seen_iso: now.toISOString(),
      first_seen_ms: now.getTime()
    };
    writeJSON(KEY_FIRST, attribution);
  }

  // Last-touch: solo si el aterrizaje actual trae parámetros de campaña.
  if (hasAnyCampaignParam(parsed)) {
    const now = new Date();
    const lastTouch = {
      utm_source: parsed.utm_source || "",
      utm_medium: parsed.utm_medium || "",
      utm_campaign: parsed.utm_campaign || "",
      utm_content: parsed.utm_content || "",
      utm_term: parsed.utm_term || "",
      gclid: parsed.gclid || "",
      fbclid: parsed.fbclid || "",
      seen_iso: now.toISOString()
    };
    writeJSON(KEY_LAST, lastTouch);
  }

  // Aseguramos session_id desde el arranque.
  getSessionId();
}

export function getAttribution() {
  if (!hasWindow()) return { ...EMPTY_ATTRIBUTION, last: null };
  const first = readJSON(KEY_FIRST) || EMPTY_ATTRIBUTION;
  const last = readJSON(KEY_LAST); // puede ser null si nunca hubo campaña
  return { ...first, last };
}

export function getSessionId() {
  if (!hasWindow()) return "";
  const existing = safeGet(KEY_SESSION);
  if (existing) return existing;
  const fresh = generateSessionId();
  safeSet(KEY_SESSION, fresh);
  return fresh;
}

export function trackPreviousRoute(pathname) {
  if (!hasWindow() || !pathname) return;
  const currentBefore = safeGet(KEY_CURR_ROUTE) || "";
  // Solo movemos la previa si realmente cambió la ruta.
  if (currentBefore && currentBefore !== pathname) {
    safeSet(KEY_PREV_ROUTE, currentBefore);
  }
  safeSet(KEY_CURR_ROUTE, pathname);
}

export function getPreviousRoute() {
  if (!hasWindow()) return "";
  return safeGet(KEY_PREV_ROUTE) || "";
}
