import React, { useMemo } from "react";

const CATEGORIES = ["P1", "P2", "P3", "P4", "PENDIENTE", "NO_SCORABLE"];
const ROUTES = ["A", "B", "C", "D", "E"];

export function Filters({ filters, setFilters, leads }) {
  const stages = useMemo(() => uniqueValues(leads, "lifecycle_stage"), [leads]);
  const countries = useMemo(() => uniqueValues(leads, "country_code"), [leads]);
  const owners = useMemo(() => uniqueValues(leads, "owner"), [leads]);

  const toggleArrayValue = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: next });
  };

  const setValue = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearAll = () => {
    setFilters({
      search: "",
      categories: [],
      routes: [],
      stage: "",
      country: "",
      owner: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.routes && filters.routes.length > 0) ||
    filters.stage ||
    filters.country ||
    filters.owner ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <section className="filters">
      <div className="filters-row filters-row-primary">
        <div className="filter-group filter-search">
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={filters.search || ""}
            onChange={(e) => setValue("search", e.target.value)}
            className="input-text"
          />
        </div>

        {hasActiveFilters && (
          <button className="btn btn-ghost" onClick={clearAll}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label className="filter-label">Prioridad</label>
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pill pill-${cat.toLowerCase()} ${
                  (filters.categories || []).includes(cat) ? "active" : ""
                }`}
                onClick={() => toggleArrayValue("categories", cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Ruta</label>
          <div className="filter-pills">
            {ROUTES.map((route) => (
              <button
                key={route}
                className={`pill pill-route ${
                  (filters.routes || []).includes(route) ? "active" : ""
                }`}
                onClick={() => toggleArrayValue("routes", route)}
              >
                {route}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select
            value={filters.stage || ""}
            onChange={(e) => setValue("stage", e.target.value)}
            className="input-select"
          >
            <option value="">Todos</option>
            {stages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">País</label>
          <select
            value={filters.country || ""}
            onChange={(e) => setValue("country", e.target.value)}
            className="input-select"
          >
            <option value="">Todos</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

<div className="filter-group">
          <label className="filter-label">Desde</label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => setValue("dateFrom", e.target.value)}
            className="input-date"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Hasta</label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => setValue("dateTo", e.target.value)}
            className="input-date"
          />
        </div>
      </div>
    </section>
  );
}

function uniqueValues(leads, key) {
  const set = new Set();
  leads.forEach((l) => {
    const v = l[key];
    if (v != null && v !== "") set.add(String(v));
  });
  return [...set].sort();
}

export function applyFilters(leads, filters) {
  if (!filters) return leads;

  const search = (filters.search || "").trim().toLowerCase();
  const categories = filters.categories || [];
  const routes = filters.routes || [];
  const stage = filters.stage || "";
  const country = filters.country || "";
  const owner = filters.owner || "";
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom + "T00:00:00") : null;
  const dateTo = filters.dateTo ? new Date(filters.dateTo + "T23:59:59") : null;

  return leads.filter((lead) => {
    if (categories.length && !categories.includes(lead.category)) return false;
    if (routes.length && !routes.includes(lead.route_code)) return false;
    if (stage && lead.lifecycle_stage !== stage) return false;
    if (country && lead.country_code !== country) return false;
    if (owner && lead.owner !== owner) return false;

    if (dateFrom || dateTo) {
      const created = lead.created_at ? new Date(lead.created_at) : null;
      if (!created || isNaN(created)) return false;
      if (dateFrom && created < dateFrom) return false;
      if (dateTo && created > dateTo) return false;
    }

    if (search) {
      const haystack = [
        lead.full_name,
        lead.work_email,
        lead.company_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
