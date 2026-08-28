import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeads } from "./api.js";
import { HAS_DASHBOARD_PASSWORD } from "../lib/env.js";
import { Header } from "./components/Header.jsx";
import { Counters } from "./components/Counters.jsx";
import { LeadsTable } from "./components/LeadsTable.jsx";
import { Filters, applyFilters } from "./components/Filters.jsx";
import { PasswordGate, isAuthenticated, clearAuth } from "./components/PasswordGate.jsx";

const INITIAL_FILTERS = {
  search: "",
  categories: [],
  routes: [],
  stage: "",
  country: "",
  owner: "",
  dateFrom: "",
  dateTo: "",
};

const CSV_COLUMNS = [
  "created_at",
  "category",
  "score_priority",
  "full_name",
  "job_title",
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
  const [authed, setAuthed] = useState(() => !HAS_DASHBOARD_PASSWORD || isAuthenticated());
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchLeads();
      setLeads(data.leads || []);
      setLastUpdated(new Date());
      setStatus("ok");
      setError(null);
    } catch (err) {
      setError(String(err));
      setStatus("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setLeads([]);
    setStatus("loading");
    setFilters(INITIAL_FILTERS);
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const filteredLeads = useMemo(() => applyFilters(leads, filters), [leads, filters]);
  const hasActiveFilters =
    filters.search ||
    (filters.categories || []).length > 0 ||
    (filters.routes || []).length > 0 ||
    filters.stage ||
    filters.country ||
    filters.owner ||
    filters.dateFrom ||
    filters.dateTo;
  const isFiltered = filteredLeads.length !== leads.length;

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
        count={leads.length}
        lastUpdated={lastUpdated}
        onRefresh={load}
        refreshing={refreshing}
        onLogout={HAS_DASHBOARD_PASSWORD ? handleLogout : null}
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
            <Filters filters={filters} setFilters={setFilters} leads={leads} />

            {isFiltered && (
              <div className="filter-summary">
                Mostrando <strong>{filteredLeads.length}</strong> de <strong>{leads.length}</strong> leads
              </div>
            )}

            <Counters leads={filteredLeads} />
            <LeadsTable
              leads={filteredLeads}
              hasActiveFilters={!!hasActiveFilters}
              onClearFilters={clearFilters}
            />
          </>
        )}
      </main>

      <footer className="dashboard-footer">
        <span>Netzen · Dashboard interno · prueba</span>
        <span>Data desde Google Sheets vía Apps Script</span>
      </footer>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="skeleton-shell">
      <div className="skeleton-filters">
        <div className="skeleton-line skeleton-line-wide" />
        <div className="skeleton-pills">
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
        </div>
      </div>
      <div className="skeleton-counters">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-counter" />
        ))}
      </div>
      <div className="skeleton-table">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
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
