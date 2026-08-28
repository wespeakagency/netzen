import React from "react";
import { Users, AlertCircle, Zap, Timer, Clock, HelpCircle } from "lucide-react";

const ICON_MAP = {
  total: Users,
  p1: AlertCircle,
  p2: Zap,
  p3: Timer,
  p4: Clock,
  pending: HelpCircle,
};

export function Counters({ leads }) {
  const total = leads.length;
  const p1 = leads.filter((l) => l.category === "P1").length;
  const p2 = leads.filter((l) => l.category === "P2").length;
  const p3 = leads.filter((l) => l.category === "P3").length;
  const p4 = leads.filter((l) => l.category === "P4").length;
  const pending = leads.filter((l) => l.category === "PENDIENTE").length;

  const cards = [
    { key: "total", label: "Total leads", value: total, tone: "neutral" },
    { key: "p1", label: "P1 · Urgente", value: p1, tone: "p1", pct: rawPct(p1, total) },
    { key: "p2", label: "P2 · MQL", value: p2, tone: "p2", pct: rawPct(p2, total) },
    { key: "p3", label: "P3 · Nurture", value: p3, tone: "p3", pct: rawPct(p3, total) },
    { key: "p4", label: "P4 · Reserva", value: p4, tone: "p4", pct: rawPct(p4, total) },
    { key: "pending", label: "Pendiente", value: pending, tone: "pending", pct: rawPct(pending, total) },
  ];

  return (
    <section className="counters">
      {cards.map((c) => {
        const Icon = ICON_MAP[c.key];
        return (
          <div key={c.key} className={`counter counter-${c.tone}`}>
            <div className="counter-head">
              <div className="counter-label">{c.label}</div>
              {Icon && (
                <div className="counter-icon">
                  <Icon size={18} />
                </div>
              )}
            </div>
            <div className="counter-value">{c.value}</div>
            {c.pct != null && (
              <div className="counter-progress">
                <div
                  className="counter-progress-fill"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            )}
            {c.pct != null && (
              <div className="counter-sub">
                {c.pct}% del total
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function rawPct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}
