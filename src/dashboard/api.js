import { SHEETS_ENDPOINT } from "../lib/env.js";
import { getSessionToken } from "./components/PasswordGate.jsx";

const EDITABLE_FIELDS = ["lifecycle_stage"];
export const LEAD_EDIT_FIELDS = [
  "full_name", "job_title", "work_email", "whatsapp", "country_code",
  "company_name", "route_code", "business_model", "owner", "next_action", "notes"
];
const TOUCH_EVENTS_CACHE_TTL_MS = 30_000;

export const touchEventsCache = new Map();

function authParam() {
  const t = getSessionToken();
  return t ? `&token=${encodeURIComponent(t)}` : "";
}

function authToken() {
  return getSessionToken();
}

function handleUnauthorized(data) {
  if (data?.error === "unauthorized") {
    import("./components/PasswordGate.jsx").then(({ clearAuth }) => clearAuth());
    window.location.reload();
  }
}

export async function fetchLeads() {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  const url = `${SHEETS_ENDPOINT}?action=leads${authParam()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  handleUnauthorized(data);
  return data;
}

export async function fetchMetrics() {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  const url = `${SHEETS_ENDPOINT}?action=metrics${authParam()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  handleUnauthorized(data);
  return data;
}

export async function fetchCatalogs() {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
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
  const url = `${SHEETS_ENDPOINT}?action=touchEvents&lead_id=${encodeURIComponent(leadId)}${authParam()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  handleUnauthorized(data);
  touchEventsCache.set(leadId, {
    events: Array.isArray(data?.events) ? data.events : [],
    fetchedAt: Date.now()
  });
  return data;
}

export function prefetchTouchEvents(leadId) {
  void fetchTouchEvents(leadId).catch(() => {});
}

const LOG_CONTACT_CHANNELS = new Set(["whatsapp_dashboard", "email_dashboard"]);

export async function logContactFromDashboard(leadId, channel) {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  if (!leadId) throw new Error("leadId requerido");
  if (!LOG_CONTACT_CHANNELS.has(channel)) throw new Error(`channel no soportado: ${channel}`);

  const url = `${SHEETS_ENDPOINT}?action=logContact&lead_id=${encodeURIComponent(leadId)}&channel=${encodeURIComponent(channel)}${authParam()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "No se pudo registrar el contacto");
  touchEventsCache.delete(leadId);
  return data;
}

export async function updateLead({ leadId, field, value }) {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  if (!leadId) throw new Error("leadId requerido");
  if (!EDITABLE_FIELDS.includes(field)) throw new Error(`Campo no editable: ${field}`);

  const body = {
    action: "updateLead",
    token: authToken(),
    lead_id: leadId,
    field,
    value
  };
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

async function mutateLead(action, payload) {
  if (!SHEETS_ENDPOINT) throw new Error("VITE_SHEETS_ENDPOINT no configurado");
  const res = await fetch(SHEETS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token: authToken(), actor: "dashboard-internal", ...payload })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "No se pudo completar la operación");
  return data;
}

export function editLead({ leadId, changes, reason = "" }) {
  if (!leadId) throw new Error("leadId requerido");
  const safeChanges = Object.fromEntries(
    Object.entries(changes || {}).filter(([key]) => LEAD_EDIT_FIELDS.includes(key))
  );
  if (!Object.keys(safeChanges).length) throw new Error("No hay cambios permitidos");
  return mutateLead("editLead", { lead_id: leadId, changes: safeChanges, reason });
}

export function archiveLead({ leadId, reason, confirmation }) {
  return mutateLead("archiveLead", { lead_id: leadId, reason, confirmation });
}

export function restoreLead({ leadId, reason = "Restaurado desde dashboard", confirmation }) {
  return mutateLead("restoreLead", { lead_id: leadId, reason, confirmation });
}
