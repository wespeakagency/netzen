import React from "react";
import {
  Users,
  AlertOctagon,
  Flame,
  TrendingUp,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  isUncontacted24h,
  isHot,
  isPipelineActive,
  isClosedRecent,
  CLOSED_STAGES,
} from "./Filters.jsx";

const DAY_MS = 24 * 60 * 60 * 1000;
const CLEAR_PRESET = {};

export function Counters({ leads, onSelectPreset }) {
  const total = leads.length;
  const now = Date.now();

  const uncontacted = leads.filter((l) => isUncontacted24h(l, now)).length;
  const hot = leads.filter(isHot).length;
  const active = leads.filter(isPipelineActive).length;
  const closedRecent = leads.filter((l) => isClosedRecent(l, now)).length;

  // Deltas: comparan la cuenta del periodo actual con el periodo inmediatamente anterior
  // usando created_at (inflow) y last_touch_at (para cerrados). Sirve como "vs ayer / semana pasada".
  const totalToday = countCreatedInWindow(leads, now, DAY_MS, 0);
  const totalYesterday = countCreatedInWindow(leads, now, DAY_MS, 1);

  const hotThisWeek = countCreatedInWindow(leads.filter(isHot), now, 7 * DAY_MS, 0);
  const hotPrevWeek = countCreatedInWindow(leads.filter(isHot), now, 7 * DAY_MS, 1);

  const activeThisWeek = countCreatedInWindow(leads.filter(isPipelineActive), now, 7 * DAY_MS, 0);
  const activePrevWeek = countCreatedInWindow(leads.filter(isPipelineActive), now, 7 * DAY_MS, 1);

  const closedPrevMonth = countClosedInWindow(leads, now, 30 * DAY_MS, 1);

  const cards = [
    {
      key: "total",
      label: "Total leads",
      value: total,
      tone: "neutral",
      icon: Users,
      preset: CLEAR_PRESET,
      delta: buildDelta(totalToday, totalYesterday, "vs ayer", { unit: "abs" }),
      caption: `${totalToday} nuevos hoy`,
    },
    {
      key: "uncontacted",
      label: "Sin contactar >24h",
      value: uncontacted,
      tone: "alert",
      icon: AlertOctagon,
      pct: rawPct(uncontacted, total),
      preset: { uncontacted24h: true },
      // Metrica de "estado ahora": 0 es buena noticia, invertimos el color.
      goodWhenZero: true,
    },
    {
      key: "hot",
      label: "Hot · P1 + P2",
      value: hot,
      tone: "hot",
      icon: Flame,
      pct: rawPct(hot, total),
      preset: { categories: ["P1", "P2"] },
      delta: buildDelta(hotThisWeek, hotPrevWeek, "vs 7d anteriores", { unit: "pct" }),
      caption: `${hotThisWeek} nuevos en 7d`,
    },
    {
      key: "active",
      label: "En pipeline activo",
      value: active,
      tone: "active",
      icon: TrendingUp,
      pct: rawPct(active, total),
      preset: { pipelineActive: true },
      delta: buildDelta(activeThisWeek, activePrevWeek, "vs 7d anteriores", { unit: "pct" }),
      caption: `${activeThisWeek} nuevos en 7d`,
    },
    {
      key: "closed",
      label: "Cerrados últimos 30d",
      value: closedRecent,
      tone: "closed",
      icon: CheckCircle,
      pct: rawPct(closedRecent, total),
      preset: { closedRecent: true },
      delta: buildDelta(closedRecent, closedPrevMonth, "vs 30d anteriores", { unit: "pct" }),
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
        const isZeroGood = c.goodWhenZero && c.value === 0;

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

            <div className="counter-value-row">
              <div className={`counter-value${isZeroGood ? " counter-value--ok" : ""}`}>
                {c.value}
              </div>
              {c.delta && <DeltaPill delta={c.delta} />}
            </div>

            {c.pct != null && !isZeroGood && (
              <div className="counter-progress">
                <div className="counter-progress-fill" style={{ width: `${c.pct}%` }} />
              </div>
            )}

            <div className="counter-sub">
              {isZeroGood
                ? "Todo al día"
                : c.caption
                  ? c.caption
                  : c.pct != null
                    ? `${c.pct}% del total`
                    : ""}
            </div>
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

function DeltaPill({ delta }) {
  const { direction, display, tooltip } = delta;
  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  return (
    <span className={`counter-delta counter-delta--${direction}`} title={tooltip}>
      <Icon size={12} strokeWidth={2.6} />
      {display}
    </span>
  );
}

function rawPct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}

// Cuenta leads creados en la ventana [now - (offset+1)*windowMs, now - offset*windowMs).
// offset=0 es el periodo actual, offset=1 el inmediatamente anterior.
function countCreatedInWindow(leads, now, windowMs, offset) {
  const end = now - offset * windowMs;
  const start = end - windowMs;
  let count = 0;
  for (const lead of leads) {
    if (!lead.created_at) continue;
    const t = new Date(lead.created_at).getTime();
    if (!Number.isFinite(t)) continue;
    if (t >= start && t < end) count++;
  }
  return count;
}

// Cuenta cerrados por last_touch_at en la ventana equivalente.
function countClosedInWindow(leads, now, windowMs, offset) {
  const end = now - offset * windowMs;
  const start = end - windowMs;
  let count = 0;
  for (const lead of leads) {
    if (!CLOSED_STAGES.has(lead.lifecycle_stage)) continue;
    const ref = lead.last_touch_at || lead.created_at;
    if (!ref) continue;
    const t = new Date(ref).getTime();
    if (!Number.isFinite(t)) continue;
    if (t >= start && t < end) count++;
  }
  return count;
}

// Construye la delta con direccion, texto compacto y tooltip explicativo.
// unit "abs" muestra +N/-N, unit "pct" muestra +N%/-N%. Cuando previous es 0 y hay algo nuevo
// devuelve "nuevo" en vez de dividir por cero.
function buildDelta(current, previous, contextLabel, { unit }) {
  const diff = current - previous;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const abs = Math.abs(diff);

  let display;
  if (unit === "pct") {
    if (previous === 0) {
      display = current > 0 ? "nuevo" : "0";
    } else {
      const pct = Math.round((diff / previous) * 100);
      display = `${pct > 0 ? "+" : ""}${pct}%`;
    }
  } else {
    display = `${diff > 0 ? "+" : diff < 0 ? "-" : ""}${abs}`;
  }

  return {
    direction,
    display,
    tooltip: `${current} ahora, ${previous} ${contextLabel}`,
  };
}
