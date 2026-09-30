import React from "react";
import { Users, AlertOctagon, Flame, TrendingUp, CheckCircle } from "lucide-react";
import {
  isUncontacted24h,
  isHot,
  isPipelineActive,
  isClosedRecent,
} from "./Filters.jsx";

// Preset "clear" (todos los filtros vacios) para el card Total.
const CLEAR_PRESET = {};

export function Counters({ leads, onSelectPreset }) {
  const total = leads.length;
  const now = Date.now();

  const uncontacted = leads.filter((l) => isUncontacted24h(l, now)).length;
  const hot = leads.filter(isHot).length;
  const active = leads.filter(isPipelineActive).length;
  const closedRecent = leads.filter((l) => isClosedRecent(l, now)).length;

  const cards = [
    {
      key: "total", label: "Total leads", value: total, tone: "neutral",
      icon: Users, preset: CLEAR_PRESET,
    },
    {
      key: "uncontacted", label: "Sin contactar >24h", value: uncontacted, tone: "alert",
      icon: AlertOctagon, pct: rawPct(uncontacted, total),
      preset: { uncontacted24h: true },
    },
    {
      key: "hot", label: "Hot · P1 + P2", value: hot, tone: "hot",
      icon: Flame, pct: rawPct(hot, total),
      preset: { categories: ["P1", "P2"] },
    },
    {
      key: "active", label: "En pipeline activo", value: active, tone: "active",
      icon: TrendingUp, pct: rawPct(active, total),
      preset: { pipelineActive: true },
    },
    {
      key: "closed", label: "Cerrados últimos 30d", value: closedRecent, tone: "closed",
      icon: CheckCircle, pct: rawPct(closedRecent, total),
      preset: { closedRecent: true },
    },
  ];

  const isClickable = typeof onSelectPreset === "function";

  return (
    <section className="counters">
      {cards.map((c) => {
        const Icon = c.icon;
        const commonProps = {
          className: `counter counter-${c.tone}${isClickable ? " counter--clickable" : ""}`,
        };
        const content = (
          <>
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
                <div className="counter-progress-fill" style={{ width: `${c.pct}%` }} />
              </div>
            )}
            {c.pct != null && (
              <div className="counter-sub">{c.pct}% del total</div>
            )}
          </>
        );

        if (!isClickable) {
          return <div key={c.key} {...commonProps}>{content}</div>;
        }

        return (
          <button
            key={c.key}
            type="button"
            {...commonProps}
            onClick={() => onSelectPreset(c.preset)}
            aria-label={`Filtrar por ${c.label}`}
          >
            {content}
          </button>
        );
      })}
    </section>
  );
}

function rawPct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}
