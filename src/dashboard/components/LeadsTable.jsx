import React, { useMemo, useState } from "react";
import { AlertCircle, Zap, Timer, Clock, HelpCircle, Info, Eye } from "lucide-react";
import { LeadDrawer, STAGE_LABELS } from "./LeadDrawer.jsx";

const COLUMNS = [
  { key: "category", label: "Categoría", type: "category", width: "110px" },
  { key: "score_priority", label: "Score", type: "score", width: "80px" },
  { key: "full_name", label: "Nombre", type: "text" },
  { key: "company_name", label: "Empresa", type: "text" },
  { key: "route_code", label: "Ruta", type: "route", width: "60px" },
  { key: "lifecycle_stage", label: "Estado", type: "stage" },
  { key: "work_email", label: "Email", type: "text" },
  { key: "whatsapp", label: "WhatsApp", type: "text" },
  { key: "country_code", label: "País", type: "country", width: "60px" },
  { key: "created_at", label: "Creado", type: "date", width: "100px" },
];

const CATEGORY_ICONS = {
  P1: AlertCircle,
  P2: Zap,
  P3: Timer,
  P4: Clock,
  PENDIENTE: HelpCircle,
  NO_SCORABLE: Info,
};

const COUNTRY_ISO = {
  "méxico": "MX", "mexico": "MX",
  "costa rica": "CR",
  "nicaragua": "NI",
  "colombia": "CO",
  "perú": "PE", "peru": "PE",
  "chile": "CL",
  "argentina": "AR",
  "brasil": "BR", "brazil": "BR",
  "uruguay": "UY",
  "paraguay": "PY",
  "bolivia": "BO",
  "ecuador": "EC",
  "venezuela": "VE",
  "guatemala": "GT",
  "honduras": "HN",
  "el salvador": "SV",
  "panamá": "PA", "panama": "PA",
  "república dominicana": "DO", "republica dominicana": "DO",
  "cuba": "CU",
  "puerto rico": "PR",
  "estados unidos": "US", "eeuu": "US", "usa": "US",
  "españa": "ES", "espana": "ES", "spain": "ES",
  "canadá": "CA", "canada": "CA",
};

function toIsoCountry(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (raw.length === 2) return raw.toUpperCase();
  return COUNTRY_ISO[raw.toLowerCase()] || raw.slice(0, 2).toUpperCase();
}

export function LeadsTable({ leads, hasActiveFilters, onClearFilters, onUpdateLead }) {
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const selectedLead = useMemo(
    () => (selectedLeadId ? leads.find((l) => l.lead_id === selectedLeadId) || null : null),
    [leads, selectedLeadId]
  );

  const sorted = useMemo(() => {
    const copy = [...leads];
    copy.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as < bs) return sortDir === "asc" ? -1 : 1;
      if (as > bs) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [leads, sortBy, sortDir]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir(col === "score_priority" || col === "created_at" ? "desc" : "asc");
    }
  };

  if (!leads.length) {
    return (
      <div className="empty-state">
        {hasActiveFilters ? (
          <>
            <h3>Ningún lead coincide con los filtros aplicados</h3>
            <p>Probá ajustar la búsqueda o quitar filtros para ver más resultados.</p>
            {onClearFilters && (
              <button className="btn btn-primary" onClick={onClearFilters}>
                Limpiar filtros
              </button>
            )}
          </>
        ) : (
          <>
            <h3>No hay leads para mostrar</h3>
            <p>Cuando entren leads por los formularios del sitio, aparecerán acá.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th className="col-context">Contexto</th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={sortBy === col.key ? "sorted" : ""}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span className="sort-arrow">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((lead, idx) => {
              const cat = lead.category || "PENDIENTE";
              const rowId = lead.lead_id || `row-${idx}`;
              const openDrawer = () => setSelectedLeadId(lead.lead_id || null);
              return (
                <tr
                  key={rowId}
                  data-category={cat}
                  className="lead-row"
                  onClick={openDrawer}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDrawer();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalle de ${lead.full_name || lead.work_email || "lead"}`}
                >
                  <td className="cell-context">
                    <button
                      type="button"
                      className="row-context-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer();
                      }}
                      title="Ver contexto completo"
                    >
                      <Eye size={13} />
                      Ver
                    </button>
                  </td>
                  {COLUMNS.map((col) => {
                    const rawValue = lead[col.key];
                    const tooltip = getCellTooltip(rawValue, col.type);
                    return (
                      <td
                        key={col.key}
                        className={`cell-${col.type}`}
                        title={tooltip || undefined}
                      >
                        {renderCell(rawValue, col.type)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLeadId(null)} onUpdateLead={onUpdateLead} />
    </>
  );
}

function renderCell(value, type) {
  if (value == null || value === "") return <span className="cell-empty">—</span>;

  if (type === "date") {
    try {
      const d = new Date(value);
      if (isNaN(d)) return String(value);
      return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "2-digit" });
    } catch {
      return String(value);
    }
  }

  if (type === "category") {
    const Icon = CATEGORY_ICONS[value] || HelpCircle;
    const cls = `badge badge-${String(value).toLowerCase()}`;
    return (
      <span className={cls}>
        <Icon size={12} />
        {value}
      </span>
    );
  }

  if (type === "score") {
    const numeric = Number(value);
    const cls = numeric >= 80 ? "score-high" : numeric >= 60 ? "score-mid" : "score-low";
    return <span className={`cell-score ${cls}`}>{numeric}</span>;
  }

  if (type === "route") {
    return <span className="badge-route">{value}</span>;
  }

  if (type === "stage") {
    const label = STAGE_LABELS[value] || String(value).replace(/_/g, " ");
    return <span className="stage-tag">{label}</span>;
  }

  if (type === "country") {
    return <span className="country-code">{toIsoCountry(value)}</span>;
  }

  return String(value);
}

function getCellTooltip(value, type) {
  if (value == null || value === "") return "";
  if (type === "text") return String(value);
  if (type === "country") return String(value);
  return "";
}
