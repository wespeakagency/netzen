import React from "react";
import { Icon, Badge } from "../../../components/ui.jsx";

export function ProblemCard({ problem }) {
  return (
    <div className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span className="bubble"><Icon name={problem.icon} size={21} /></span>
      <h3 style={{ fontSize: 17, fontWeight: 700 }}>{problem.title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{problem.desc}</p>
    </div>
  );
}

export function CatalogItemCard({ item }) {
  return (
    <div className="card card--hover" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <span className="bubble"><Icon name={item.icon} size={21} /></span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{item.name}</h3>
          <Badge tone={item.tone}>{item.badge}</Badge>
        </div>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{item.desc}</p>
      </div>
    </div>
  );
}
