import { SHEETS_ENDPOINT, DASHBOARD_API_TOKEN } from "../lib/env.js";

const EDITABLE_FIELDS = ["lifecycle_stage"];

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
