import React, { useMemo, useState } from "react";
import { AlertCircle, Zap, Timer, Clock, HelpCircle, Info, Mail, MessageCircle, Copy, Check } from "lucide-react";

const COLUMNS = [
  { key: "category", label: "Categoría", type: "category", width: "110px" },
  { key: "score_priority", label: "Score", type: "score", width: "80px" },
  { key: "full_name", label: "Nombre", type: "text" },
  { key: "company_name", label: "Empresa", type: "text" },
  { key: "route_code", label: "Ruta", type: "route", width: "60px" },
  { key: "lifecycle_stage", label: "Estado", type: "stage" },
  { key: "job_title", label: "Cargo", type: "text" },
  { key: "work_email", label: "Email", type: "text" },
  { key: "whatsapp", label: "WhatsApp", type: "text" },
  { key: "country_code", label: "País", type: "country", width: "60px" },
  { key: "owner", label: "Propietario", type: "text" },
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

export function LeadsTable({ leads, hasActiveFilters, onClearFilters }) {
  const [sortBy, setSortBy] = useState("score_priority");
  const [sortDir, setSortDir] = useState("desc");
  const [copiedRow, setCopiedRow] = useState(null);

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
      setSortDir(col === "score_priority" ? "desc" : "asc");
    }
  };

  const handleCopyPhone = async (phone, leadId) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedRow(leadId);
      setTimeout(() => setCopiedRow(null), 1500);
    } catch {
      // ignorar
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
    <div className="table-wrapper">
      <table className="leads-table">
        <thead>
          <tr>
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
            <th className="col-actions" style={{ width: "120px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((lead, idx) => {
            const cat = lead.category || "PENDIENTE";
            const rowId = lead.lead_id || `row-${idx}`;
            return (
              <tr key={rowId} data-category={cat}>
                {COLUMNS.map((col) => (
                  <td key={col.key} className={`cell-${col.type}`}>
                    {renderCell(lead[col.key], col.type)}
                  </td>
                ))}
                <td className="cell-actions">
                  {lead.work_email && (
                    <a
                      href={`mailto:${lead.work_email}`}
                      className="row-action"
                      title={`Enviar email a ${lead.work_email}`}
                    >
                      <Mail size={14} />
                    </a>
                  )}
                  {lead.whatsapp && (
                    <a
                      href={`https://wa.me/${cleanPhone(lead.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="row-action"
                      title={`WhatsApp a ${lead.whatsapp}`}
                    >
                      <MessageCircle size={14} />
                    </a>
                  )}
                  {lead.whatsapp && (
                    <button
                      className="row-action"
                      onClick={() => handleCopyPhone(String(lead.whatsapp), rowId)}
                      title="Copiar teléfono"
                    >
                      {copiedRow === rowId ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function cleanPhone(phone) {
  return String(phone).replace(/[^\d+]/g, "");
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
    return <span className="stage-tag">{String(value).replace(/_/g, " ")}</span>;
  }

  if (type === "country") {
    return <span className="country-code">{value}</span>;
  }

  return String(value);
}
