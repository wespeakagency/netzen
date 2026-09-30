import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Zap, Timer, Clock, HelpCircle, Info, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { LeadDrawer, STAGE_LABELS } from "./LeadDrawer.jsx";

const PAGE_SIZE = 25;

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
  const [page, setPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, sorted.length);
  const visible = useMemo(() => sorted.slice(pageStart, pageEnd), [sorted, pageStart, pageEnd]);

  // Reset a pagina 1 cuando cambian los filtros (leads) o el sort.
  useEffect(() => {
    setPage(1);
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

  const openDrawerFor = (lead) => setSelectedLeadId(lead.lead_id || null);

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
            {visible.map((lead, idx) => {
              const cat = lead.category || "PENDIENTE";
              const rowId = lead.lead_id || `row-${idx}`;
              return (
                <tr
                  key={rowId}
                  data-category={cat}
                  className="lead-row"
                  onClick={() => openDrawerFor(lead)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDrawerFor(lead);
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
                        openDrawerFor(lead);
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

      <div className="leads-cards" role="list" aria-label="Listado de leads">
        {visible.map((lead, idx) => (
          <LeadCard
            key={lead.lead_id || `card-${idx}`}
            lead={lead}
            onClick={() => openDrawerFor(lead)}
          />
        ))}
      </div>

      {sorted.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={pageStart + 1}
          rangeEnd={pageEnd}
          total={sorted.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}

      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLeadId(null)} onUpdateLead={onUpdateLead} />
    </>
  );
}

function LeadCard({ lead, onClick }) {
  const cat = lead.category || "PENDIENTE";
  const Icon = CATEGORY_ICONS[cat] || HelpCircle;
  const score = lead.score_priority;
  const scoreCls =
    score == null || score === ""
      ? ""
      : Number(score) >= 80
        ? "score-high"
        : Number(score) >= 60
          ? "score-mid"
          : "score-low";
  const stageLabel = lead.lifecycle_stage
    ? STAGE_LABELS[lead.lifecycle_stage] || String(lead.lifecycle_stage).replace(/_/g, " ")
    : "";
  const stageMod = lead.lifecycle_stage || "";
  const createdLabel = formatShortDate(lead.created_at);
  const label = `Ver detalle de ${lead.full_name || lead.work_email || "lead"}`;

  return (
    <div
      className="lead-card"
      data-category={cat}
      role="listitem"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="lead-card-head">
        <span className={`badge badge-${String(cat).toLowerCase()}`}>
          <Icon size={12} />
          {cat}
        </span>
        {score != null && score !== "" && (
          <span className={`cell-score ${scoreCls}`}>{Number(score)}</span>
        )}
        {lead.route_code && <span className="badge-route">{lead.route_code}</span>}
      </div>

      <div className="lead-card-title">
        {lead.full_name || <span className="cell-empty">Sin nombre</span>}
      </div>
      {lead.company_name && (
        <div className="lead-card-subtitle">{lead.company_name}</div>
      )}

      <div className="lead-card-meta">
        {stageLabel && (
          <span className={`stage-tag stage-tag--${stageMod}`}>{stageLabel}</span>
        )}
        {createdLabel && <span className="lead-card-date">{createdLabel}</span>}
      </div>
    </div>
  );
}

function formatShortDate(value) {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (isNaN(d)) return String(value);
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "2-digit" });
  } catch {
    return String(value);
  }
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

function Pagination({ currentPage, totalPages, rangeStart, rangeEnd, total, onPrev, onNext }) {
  return (
    <nav className="leads-pagination" aria-label="Paginación de leads">
      <div className="leads-pagination-info">
        Mostrando <strong>{rangeStart}</strong>–<strong>{rangeEnd}</strong> de <strong>{total}</strong> leads
      </div>
      <div className="leads-pagination-controls">
        <button
          type="button"
          className="leads-pagination-btn"
          onClick={onPrev}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>
        <span className="leads-pagination-status">
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          className="leads-pagination-btn"
          onClick={onNext}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <span>Siguiente</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
