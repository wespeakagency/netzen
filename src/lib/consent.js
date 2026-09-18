// NETZEN · Gestión de consentimiento de cookies (Google Consent Mode v2)
// El snippet de GTM en index.html arranca con TODO denegado por default.
// Este módulo actualiza el estado según la elección del usuario y lo persiste.

const STORAGE_KEY = "netzen_consent_v1";
const CHANGED_EVENT = "netzen:consent-changed";

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted",
  personalization_storage: "denied",
  security_storage: "granted"
};

const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  functionality_storage: "granted",
  personalization_storage: "granted",
  security_storage: "granted"
};

function pushConsent(state, meta = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Google Consent Mode v2: GTM reconoce el comando "consent" solo cuando
  // se pushea un Arguments object (patrón gtag), no un Array literal.
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "update", state);
  // Evento custom para triggers manuales en GTM si el marketer los quiere
  window.dataLayer.push({
    event: "netzen_consent_update",
    consent_status: meta.status,
    consent_source: meta.source || "banner"
  });
}

export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasChoice() {
  return readConsent() !== null;
}

function writeConsent(status) {
  if (typeof window === "undefined") return;
  const record = { status, timestamp: new Date().toISOString(), version: 1 };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {}
  window.dispatchEvent(new CustomEvent(CHANGED_EVENT, { detail: record }));
}

export function acceptAll(source = "banner") {
  pushConsent(GRANTED, { status: "granted", source });
  writeConsent("granted");
}

export function denyAll(source = "banner") {
  pushConsent(DENIED, { status: "denied", source });
  writeConsent("denied");
}

export function resetConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(CHANGED_EVENT, { detail: null }));
}

// Re-aplica el estado guardado al cargar (útil si el usuario navega entre páginas).
// Si nunca eligió, no toca nada (queda el default "denied" que puso el snippet en <head>).
export function applyStoredConsent() {
  const stored = readConsent();
  if (!stored) return;
  if (stored.status === "granted") pushConsent(GRANTED, { status: "granted", source: "restore" });
  else pushConsent(DENIED, { status: "denied", source: "restore" });
}

export const CONSENT_CHANGED_EVENT = CHANGED_EVENT;
