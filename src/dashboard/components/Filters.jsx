import React, { useMemo } from "react";

const CATEGORIES = ["P1", "P2", "P3", "P4", "PENDIENTE", "NO_SCORABLE"];
const ROUTES = ["A", "B", "C", "D", "E"];

const EMPTY_FILTERS = {
  search: "",
  categories: [],
  routes: [],
  stage: "",
  country: "",
  owner: "",
  aging: "",
  uncontacted24h: false,
  pipelineActive: false,
  closedRecent: false,
  dateFrom: "",
  dateTo: "",
  showArchived: false,
};

const QUICK_PRESETS = [
  { key: "all", label: "Todos", preset: {} },
  { key: "uncontacted", label: "Sin contactar", preset: { stage: "nuevo" } },
  { key: "hot", label: "Hot", preset: { categories: ["P1", "P2"] } },
  { key: "aging", label: "Sin actividad >7d", preset: { aging: ">7d" } },
];

function matchesPreset(filters, preset) {
  if (preset.key === "all") return isEmptyFilters(filters);
  const p = preset.preset;
  if (p.stage != null && filters.stage !== p.stage) return false;
  if (p.aging != null && filters.aging !== p.aging) return false;
  if (p.categories != null) {
    const set = new Set(p.categories);
    const cur = new Set(filters.categories || []);
    if (set.size !== cur.size) return false;
    for (const v of set) if (!cur.has(v)) return false;
  }
  return true;
}

function isEmptyFilters(f) {
  return (
    !f.search &&
    (!f.categories || f.categories.length === 0) &&
    (!f.routes || f.routes.length === 0) &&
    !f.stage &&
    !f.country &&
    !f.owner &&
    !f.aging &&
    !f.uncontacted24h &&
    !f.pipelineActive &&
    !f.closedRecent &&
    !f.showArchived &&
    !f.dateFrom &&
    !f.dateTo
  );
}

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

  const clearAll = () => setFilters({ ...EMPTY_FILTERS });

  const applyPreset = (preset) => {
    setFilters({ ...EMPTY_FILTERS, ...preset.preset });
  };

  const hasActiveFilters =
    filters.search ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.routes && filters.routes.length > 0) ||
    filters.stage ||
    filters.country ||
    filters.owner ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.showArchived;

  return (
    <section className="filters">
      <div className="filters-quick-chips" role="group" aria-label="Filtros rápidos">
        {QUICK_PRESETS.map((preset) => {
          const active = matchesPreset(filters, preset);
          return (
            <button
              key={preset.key}
              type="button"
              className={`quick-chip ${active ? "quick-chip--active" : ""}`}
              onClick={() => applyPreset(preset)}
              aria-pressed={active}
            >
              {preset.label}
            </button>
          );
        })}
        <button
          type="button"
          className={`quick-chip quick-chip--archive ${filters.showArchived ? "quick-chip--active" : ""}`}
          onClick={() => setValue("showArchived", !filters.showArchived)}
          aria-pressed={!!filters.showArchived}
        >
          {filters.showArchived ? "Archivados" : "Ver archivados"}
        </button>
      </div>

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

// Umbrales de tiempo compartidos entre filtros y counters (mantener sincronizados)
const AGING_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;
export const UNCONTACTED_THRESHOLD_MS = 24 * 60 * 60 * 1000;
export const CLOSED_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export const HOT_CATEGORIES = new Set(["P1", "P2"]);
export const ACTIVE_STAGES = new Set(["contactado", "calificado", "propuesta"]);
export const CLOSED_STAGES = new Set(["cerrado_ganado", "cerrado_perdido"]);

export function isUncontacted24h(lead, now = Date.now()) {
  const stage = lead.lifecycle_stage || "nuevo";
  if (stage !== "nuevo") return false;
  if (!lead.created_at) return false;
  const created = new Date(lead.created_at).getTime();
  if (!Number.isFinite(created)) return false;
  return now - created >= UNCONTACTED_THRESHOLD_MS;
}

export function isHot(lead) {
  return HOT_CATEGORIES.has(lead.category);
}

export function isPipelineActive(lead) {
  return ACTIVE_STAGES.has(lead.lifecycle_stage);
}

export function isClosedRecent(lead, now = Date.now()) {
  if (!CLOSED_STAGES.has(lead.lifecycle_stage)) return false;
  const ref = lead.last_touch_at || lead.created_at;
  if (!ref) return false;
  const t = new Date(ref).getTime();
  if (!Number.isFinite(t)) return false;
  return now - t <= CLOSED_WINDOW_MS;
}

export function isAgingCold(lead, now = Date.now()) {
  const currentStage = lead.lifecycle_stage || "nuevo";
  if (currentStage !== "nuevo") return false;
  if (!lead.created_at) return false;
  const created = new Date(lead.created_at).getTime();
  if (!Number.isFinite(created)) return false;
  return now - created >= AGING_THRESHOLD_MS;
}

export function applyFilters(leads, filters) {
  if (!filters) return leads;

  const search = (filters.search || "").trim().toLowerCase();
  const categories = filters.categories || [];
  const routes = filters.routes || [];
  const stage = filters.stage || "";
  const country = filters.country || "";
  const owner = filters.owner || "";
  const aging = filters.aging || "";
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom + "T00:00:00") : null;
  const dateTo = filters.dateTo ? new Date(filters.dateTo + "T23:59:59") : null;
  const now = Date.now();

  return leads.filter((lead) => {
    if (categories.length && !categories.includes(lead.category)) return false;
    if (routes.length && !routes.includes(lead.route_code)) return false;
    if (stage && lead.lifecycle_stage !== stage) return false;
    if (country && lead.country_code !== country) return false;
    if (owner && lead.owner !== owner) return false;

    if (aging === ">7d" && !isAgingCold(lead, now)) return false;
    if (filters.uncontacted24h && !isUncontacted24h(lead, now)) return false;
    if (filters.pipelineActive && !isPipelineActive(lead)) return false;
    if (filters.closedRecent && !isClosedRecent(lead, now)) return false;

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
