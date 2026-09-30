import React from "react";
import { Link } from "react-router-dom";
import { Icon, Reveal } from "../../../components/ui.jsx";

export function moduleSummary(module) {
  if (typeof module.lead !== "string") return "";
  return `${module.lead.split(":")[0].split(".")[0]}.`;
}

export function PlatformModuleCard({ module, to, index, summary = moduleSummary(module), ctaLabel = "Ver módulo" }) {
  return (
    <Link to={to} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", color: "inherit" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="bubble"><Icon name={module.icon} size={21} /></span>
        {typeof index === "number" && (
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "var(--nz-gray-400)" }}>{String(index + 1).padStart(2, "0")}</span>
        )}
      </div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{module.name}</h3>
        {summary && <p style={{ marginTop: 7, fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{summary}</p>}
      </div>
      <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
        {ctaLabel} <Icon name="ArrowRight" size={14} />
      </span>
    </Link>
  );
}

export function RelatedModuleCard({ module, to }) {
  return (
    <Link to={to} className="card card--hover" style={{ display: "flex", gap: 14, alignItems: "center", color: "inherit" }}>
      <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={module.icon} size={19} /></span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{module.short}</span>
      </span>
      <Icon name="ArrowRight" size={17} style={{ color: "var(--nz-red)" }} />
    </Link>
  );
}

export function EcosystemConnectionCard({ connection }) {
  return (
    <Reveal>
      <div className="card" style={{ borderColor: "var(--nz-red-tint-strong)", background: "var(--nz-white)", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
        <span className="bubble"><Icon name={connection.icon} size={21} /></span>
        <div style={{ flex: 1, minWidth: "min(260px, 100%)" }}>
          <p style={{ fontSize: 15, lineHeight: 1.65 }}>
            <b style={{ color: "var(--nz-red)" }}>{connection.text[0]}</b>{connection.text[1]}
          </p>
          <Link to={connection.to} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
            {connection.linkLabel} <Icon name="ArrowRight" size={15} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
