import { SHEETS_ENDPOINT } from "../lib/env.js";

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
