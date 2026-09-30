import { SHEETS_ENDPOINT, DASHBOARD_API_TOKEN } from "../lib/env.js";

const EDITABLE_FIELDS = ["lifecycle_stage"];
const TOUCH_EVENTS_CACHE_TTL_MS = 30_000;

export const touchEventsCache = new Map();

export async function fetchLeads() {
  if (!SHEETS_ENDPOINT) {
    throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  }
  const url = `${SHEETS_ENDPOINT}?action=leads`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchMetrics() {
  if (!SHEETS_ENDPOINT) {
    throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  }
  const url = `${SHEETS_ENDPOINT}?action=metrics`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchCatalogs() {
  if (!SHEETS_ENDPOINT) {
    throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  }
  const url = `${SHEETS_ENDPOINT}?action=catalogs`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchTouchEvents(leadId, { force = false } = {}) {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  if (!leadId) throw new Error("leadId requerido");
  const cached = touchEventsCache.get(leadId);
  if (!force && cached && Date.now() - cached.fetchedAt < TOUCH_EVENTS_CACHE_TTL_MS) {
    return { events: cached.events };
  }
  const url = `${SHEETS_ENDPOINT}?action=touchEvents&lead_id=${encodeURIComponent(leadId)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  touchEventsCache.set(leadId, {
    events: Array.isArray(data?.events) ? data.events : [],
    fetchedAt: Date.now()
  });
  return data;
}

export function prefetchTouchEvents(leadId) {
  void fetchTouchEvents(leadId).catch(() => {
    // Prefetch no debe afectar la interacción principal de la tabla.
  });
}

export async function updateLead({ leadId, field, value }) {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  if (!DASHBOARD_API_TOKEN) throw new Error("VITE_DASHBOARD_API_TOKEN no configurado");
  if (!leadId) throw new Error("leadId requerido");
  if (!EDITABLE_FIELDS.includes(field)) throw new Error(`Campo no editable: ${field}`);

  const body = {
    action: "updateLead",
    token: DASHBOARD_API_TOKEN,
    lead_id: leadId,
    field,
    value
  };
  // Content-Type text/plain evita el preflight CORS de Apps Script (mismo patrón que submitLead).
  const res = await fetch(SHEETS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Error desconocido al actualizar");
  return data;
}
