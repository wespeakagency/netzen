import React from "react";
import { RefreshCw, LogOut, Download } from "lucide-react";

export function Header({ count, lastUpdated, onRefresh, refreshing, onLogout, onExport }) {
  const timeAgo = lastUpdated ? formatTimeAgo(lastUpdated) : "";

  return (
    <header className="dashboard-header">
      <div className="dashboard-brand">
        <span className="brand-red">Netzen</span>
        <span className="brand-separator">·</span>
        <span className="brand-title">Dashboard interno</span>
      </div>
      <div className="dashboard-actions">
        <div className="dashboard-meta">
          {count > 0 && <span className="meta-count">{count} leads</span>}
          {timeAgo && <span className="meta-time">Actualizado {timeAgo}</span>}
        </div>
        {onExport && (
          <button
            className="btn btn-ghost btn-icon"
            onClick={onExport}
            title="Exportar CSV"
          >
            <Download size={15} />
            <span>CSV</span>
          </button>
        )}
        <button
          className="btn btn-primary btn-icon"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={15} className={refreshing ? "spin" : ""} />
          <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
        </button>
        {onLogout && (
          <button
            className="btn btn-ghost btn-icon"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </header>
  );
}

function formatTimeAgo(date) {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "hace unos segundos";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  return `hace ${diffHr} h`;
}
