import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeads, fetchCatalogs, updateLead, editLead, archiveLead, restoreLead } from "./api.js";
import { HAS_FORMS_BACKEND } from "../lib/env.js";
import { Header } from "./components/Header.jsx";
import { Counters } from "./components/Counters.jsx";
import { LeadsTable } from "./components/LeadsTable.jsx";
import { STAGE_LABELS } from "./components/LeadDrawer.jsx";
import { Filters, applyFilters } from "./components/Filters.jsx";
import { PasswordGate, isAuthenticated, clearAuth } from "./components/PasswordGate.jsx";
import { useToast } from "./hooks/useToast.js";

const INITIAL_FILTERS = {
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

export const isLeadArchived = (lead) => /\[\[CRM_ARCHIVE:v1\|/.test(String(lead?.flags || ""));

const CSV_COLUMNS = [
  "created_at",
  "category",
  "score_priority",
  "full_name",
  "company_name",
  "work_email",
  "whatsapp",
  "country_code",
  "route_code",
  "lifecycle_stage",
  "owner",
  "notes",
];

export function App() {
  const [authed, setAuthed] = useState(() => !HAS_FORMS_BACKEND || isAuthenticated());
  const [leads, setLeads] = useState([]);
  const [catalogs, setCatalogs] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const { toasts, showToast, dismissToast } = useToast();

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setRefreshing(true);
    try {
      const [data, catalogData] = await Promise.all([
        fetchLeads(),
        fetchCatalogs().catch(() => ({ catalogs: {} })),
      ]);
      setLeads(data.leads || []);
      setCatalogs(catalogData.catalogs || {});
      setLastUpdated(new Date());
      setStatus("ok");
      setError(null);
    } catch (err) {
      setError(String(err));
      if (!silent) setStatus("error");
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  useEffect(() => {
    if (!authed) return;

    let intervalId = null;

    const start = () => {
      if (intervalId != null) return;
      intervalId = setInterval(() => load({ silent: true }), 60_000);
    };

    const stop = () => {
      if (intervalId == null) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        load({ silent: true });
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [authed, load]);

  const handlePatchLead = useCallback(({ leadId, patch }) => {
    if (!leadId || !patch) return;
    setLeads((prev) => prev.map((l) => (l.lead_id === leadId ? { ...l, ...patch } : l)));
  }, []);

  const handleUpdateLead = useCallback(async ({ leadId, field, value }) => {
    let previousValue;
    setLeads((prev) => prev.map((l) => {
      if (l.lead_id !== leadId) return l;
      previousValue = l[field];
      return { ...l, [field]: value };
    }));
    try {
      await updateLead({ leadId, field, value });
      if (field === "lifecycle_stage") {
        showToast({
          type: "success",
          message: `Estado actualizado a ${STAGE_LABELS[value] || String(value).replace(/_/g, " ")}`
        });
      }
    } catch (err) {
      setLeads((prev) => prev.map((l) => (l.lead_id === leadId ? { ...l, [field]: previousValue } : l)));
      if (field === "lifecycle_stage") {
        showToast({
          type: "error",
          message: "No se pudo guardar. Reintentar",
          actionLabel: "Reintentar",
          onAction: () => {
            handleUpdateLead({ leadId, field, value }).catch(() => {});
          }
        });
      }
      throw err;
    }
  }, [showToast]);

  const handleEditLead = useCallback(async ({ leadId, changes, reason }) => {
    await editLead({ leadId, changes, reason });
    setLeads((prev) => prev.map((lead) => lead.lead_id === leadId ? { ...lead, ...changes } : lead));
    showToast({ type: "success", message: "Datos del lead actualizados" });
  }, [showToast]);

  const handleArchiveLead = useCallback(async ({ leadId, reason, confirmation }) => {
    const result = await archiveLead({ leadId, reason, confirmation });
    setLeads((prev) => prev.map((lead) => lead.lead_id === leadId ? { ...lead, flags: result.flags } : lead));
    showToast({ type: "success", message: "Lead archivado sin eliminar sus datos" });
  }, [showToast]);

  const handleRestoreLead = useCallback(async ({ leadId, reason, confirmation }) => {
    const result = await restoreLead({ leadId, reason, confirmation });
    setLeads((prev) => prev.map((lead) => lead.lead_id === leadId ? { ...lead, flags: result.flags } : lead));
    showToast({ type: "success", message: "Lead restaurado" });
  }, [showToast]);

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setLeads([]);
    setStatus("loading");
    setFilters(INITIAL_FILTERS);
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const visibleByArchive = useMemo(
    () => leads.filter((lead) => filters.showArchived ? isLeadArchived(lead) : !isLeadArchived(lead)),
    [leads, filters.showArchived]
  );
  const filteredLeads = useMemo(() => applyFilters(visibleByArchive, filters), [visibleByArchive, filters]);
  const hasActiveFilters =
    filters.search ||
    (filters.categories || []).length > 0 ||
    (filters.routes || []).length > 0 ||
    filters.stage ||
    filters.country ||
    filters.owner ||
    filters.aging ||
    filters.uncontacted24h ||
    filters.pipelineActive ||
    filters.closedRecent ||
    filters.showArchived ||
    filters.dateFrom ||
    filters.dateTo;
  const isFiltered = filteredLeads.length !== visibleByArchive.length;

  const applyCounterPreset = useCallback((preset) => {
    setFilters({ ...INITIAL_FILTERS, ...(preset || {}) });
  }, []);

  const handleExport = () => {
    if (!filteredLeads.length) return;
    const csv = toCsv(filteredLeads, CSV_COLUMNS);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `netzen-leads-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="dashboard-shell">
      <Header
        count={visibleByArchive.length}
        lastUpdated={lastUpdated}
        onRefresh={load}
        refreshing={refreshing}
        onLogout={HAS_FORMS_BACKEND ? handleLogout : null}
        onExport={status === "ok" && filteredLeads.length > 0 ? handleExport : null}
      />

      <main className="dashboard-body">
        {status === "loading" && <DashboardSkeleton />}

        {status === "error" && (
          <div className="state-panel state-error">
            <h2>Error de conexión</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={load}>Reintentar</button>
          </div>
        )}

        {status === "ok" && (
          <>
            <Filters filters={filters} setFilters={setFilters} leads={visibleByArchive} />

            {isFiltered && (
              <div className="filter-summary">
                Mostrando <strong>{filteredLeads.length}</strong> de <strong>{visibleByArchive.length}</strong> leads
              </div>
            )}

            <Counters leads={visibleByArchive} onSelectPreset={applyCounterPreset} />
            <LeadsTable
              leads={filteredLeads}
              catalogs={catalogs}
              hasActiveFilters={!!hasActiveFilters}
              onClearFilters={clearFilters}
              onUpdateLead={handleUpdateLead}
              onPatchLead={handlePatchLead}
              onEditLead={handleEditLead}
              onArchiveLead={handleArchiveLead}
              onRestoreLead={handleRestoreLead}
            />
          </>
        )}
      </main>

      <footer className="dashboard-footer">
        <span>Netzen · Dashboard interno · {new Date().getFullYear()}</span>
        <span>Data desde Google Sheets vía Apps Script</span>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="skeleton-shell">
      <div className="skeleton-filters">
        <div className="skeleton-quick-chips">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton-chip" />
          ))}
        </div>
        <div className="skeleton-search-row">
          <div className="skeleton-search" />
          <div className="skeleton-button" />
        </div>
        <div className="skeleton-filter-groups">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-filter-group">
              <div className="skeleton-label" />
              <div className="skeleton-control" />
            </div>
          ))}
        </div>
      </div>
      <div className="skeleton-counters">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-counter">
            <div className="skeleton-counter-label" />
            <div className="skeleton-counter-number" />
            <div className="skeleton-counter-progress" />
          </div>
        ))}
      </div>
      <div className="skeleton-table">
        <div className="skeleton-table-head">
          {[12, 8, 18, 16, 8, 12, 14, 18, 14, 8, 12].map((width, i) => (
            <div key={i} className="skeleton-table-cell" style={{ flex: width }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-row">
            {[12, 8, 18, 16, 8, 12, 14, 18, 14, 8, 12].map((width, cellIndex) => (
              <div key={cellIndex} className="skeleton-table-cell" style={{ flex: width }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notificaciones">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type || "success"}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <span className="toast-message">{toast.message}</span>
          {toast.actionLabel && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                onDismiss(toast.id);
                toast.onAction?.();
              }}
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function toCsv(rows, columns) {
  const header = columns.join(",");
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const value = row[col];
          if (value == null) return "";
          const stringified = String(value).replace(/"/g, '""');
          return /[",\n]/.test(stringified) ? `"${stringified}"` : stringified;
        })
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}
