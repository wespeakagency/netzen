import React, { useEffect, useRef, useState } from "react";
import {
  X, Mail, MessageCircle, ChevronDown, ChevronRight, Copy, Check, Edit3, Activity,
  Users, Wallet, CalendarClock, Wrench, BarChart3, Sparkles, HelpCircle,
} from "lucide-react";
import { fetchTouchEvents } from "../api.js";
import {
  computeScoringBreakdown,
  buildScoringNarrative,
  buildScoringHighlight,
  tierLabelForScore,
  AXIS_LABELS,
  DIMENSION_ICONS,
  getFormType,
} from "../scoring.js";

const DIMENSION_ICON_MAP = {
  Users, Wallet, CalendarClock, Wrench, BarChart3, Sparkles,
};

const SITUACION_LABELS = {
  A: "Apenas empieza / explorando",
  B: "Empresa establecida que busca escalar",
  C: "Profesionalizar red de distribuidores",
  D: "Ya tiene software propio / modernizar",
};

export const STAGE_LABELS = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  propuesta: "Propuesta",
  cerrado_ganado: "Cerrado, ganado",
  cerrado_perdido: "Cerrado, perdido",
  // nurture queda como fallback de display para leads legacy pero no se ofrece como opción
  // seleccionable (el label confunde y el pipeline lineal es más claro).
  nurture: "Interés futuro",
};

// Stages que aparecen como <option> en el dropdown de edición. Excluye "nurture" a propósito.
const SELECTABLE_STAGES = ["nuevo", "contactado", "calificado", "propuesta", "cerrado_ganado", "cerrado_perdido"];

export function LeadDrawer({ lead, onClose, onUpdateLead }) {
  const closeBtnRef = useRef(null);
  const [showAttribution, setShowAttribution] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showScoreExplain, setShowScoreExplain] = useState(true);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [stageStatus, setStageStatus] = useState("idle"); // idle | saving | error
  const [stageError, setStageError] = useState("");
  const [touchEvents, setTouchEvents] = useState([]);
  const [touchStatus, setTouchStatus] = useState("idle"); // idle | loading | ok | error

  const handleStageChange = async (e) => {
    const newStage = e.target.value;
    if (!lead || !onUpdateLead || newStage === lead.lifecycle_stage) return;
    setStageStatus("saving");
    setStageError("");
    try {
      await onUpdateLead({ leadId: lead.lead_id, field: "lifecycle_stage", value: newStage });
      setStageStatus("idle");
      // Refetch touch events para reflejar el cambio manual en el timeline sin esperar refresh general.
      if (lead.lead_id) {
        fetchTouchEvents(lead.lead_id, { force: true })
          .then((data) => setTouchEvents(Array.isArray(data?.events) ? data.events : []))
          .catch(() => { /* silencioso, el cambio de estado ya fue exitoso */ });
      }
    } catch (err) {
      setStageStatus("error");
      setStageError(err.message || "No se pudo guardar");
    }
  };

  const handleCopyPhone = async () => {
    if (!lead?.whatsapp) return;
    try {
      await navigator.clipboard.writeText(String(lead.whatsapp));
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 1500);
    } catch {
      // ignorar
    }
  };

  useEffect(() => {
    if (!lead) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lead, onClose]);

  // Carga touch events cuando cambia el lead. Si el endpoint no existe aun (deploy pendiente),
  // fallback a array vacio en vez de romper el drawer.
  useEffect(() => {
    if (!lead?.lead_id) {
      setTouchEvents([]);
      setTouchStatus("idle");
      return;
    }
    let cancelled = false;
    setTouchStatus("loading");
    fetchTouchEvents(lead.lead_id)
      .then((data) => {
        if (cancelled) return;
        setTouchEvents(Array.isArray(data?.events) ? data.events : []);
        setTouchStatus("ok");
      })
      .catch(() => {
        if (cancelled) return;
        setTouchEvents([]);
        setTouchStatus("error");
      });
    return () => { cancelled = true; };
  }, [lead?.lead_id]);

  if (!lead) return null;

  const title = lead.full_name || lead.work_email || "Lead sin nombre";
  const subtitle = lead.company_name || "";
  const scoreTier = getScoreTier(lead.score_priority);
  const aging = timeSince(lead.created_at, lead.lifecycle_stage);

  return (
    <div
      className="lead-drawer-overlay"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="lead-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lead-drawer-header">
          <div className="lead-drawer-header-top">
            <div className="lead-drawer-title-block">
              <h2 id="lead-drawer-title">{title}</h2>
              {subtitle && <p className="lead-drawer-subtitle">{subtitle}</p>}
            </div>
            <button
              ref={closeBtnRef}
              className="lead-drawer-close"
              onClick={onClose}
              aria-label="Cerrar detalle del lead"
            >
              <X size={18} />
            </button>
          </div>

          <div className="lead-drawer-meta-row">
            {lead.category && (
              <span className={`badge badge-${String(lead.category).toLowerCase()}`}>
                {lead.category}
              </span>
            )}
            {lead.score_priority != null && lead.score_priority !== "" && (
              <span className={`lead-drawer-score-chip lead-drawer-score-chip--${scoreTier}`}>
                <span className="lead-drawer-score-chip-num">{lead.score_priority}</span>
              </span>
            )}
            {lead.lifecycle_stage && (
              <span className={`lead-drawer-stage-pill lead-drawer-stage-pill--${lead.lifecycle_stage}`}>
                {STAGE_LABELS[lead.lifecycle_stage] || lead.lifecycle_stage}
              </span>
            )}
            {aging && (
              <span
                className={`lead-drawer-aging-pill lead-drawer-aging-pill--${aging.tier}`}
                title={`Creado ${formatDate(lead.created_at)}`}
              >
                {aging.label}
              </span>
            )}
            {lead.route_code && (
              <span className="lead-drawer-route-pill">Ruta {lead.route_code}</span>
            )}
          </div>
        </header>

        <div className="lead-drawer-body">
          {(lead.whatsapp || lead.work_email) && (
            <div className="lead-drawer-actions">
              {lead.whatsapp && (
                <a
                  href={`https://wa.me/${cleanPhone(lead.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lead-drawer-action lead-drawer-action--whatsapp"
                >
                  <MessageCircle size={16} />
                  <span className="lead-drawer-action-label">
                    <span>Abrir WhatsApp</span>
                    <span className="lead-drawer-action-sub">{lead.whatsapp}</span>
                  </span>
                </a>
              )}
              {lead.work_email && (
                <a
                  href={`mailto:${lead.work_email}`}
                  className="lead-drawer-action lead-drawer-action--email"
                >
                  <Mail size={16} />
                  <span className="lead-drawer-action-label">
                    <span>Enviar email</span>
                    <span className="lead-drawer-action-sub">{lead.work_email}</span>
                  </span>
                </a>
              )}
              {lead.whatsapp && (
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="lead-drawer-action lead-drawer-action--ghost"
                  title="Copiar teléfono"
                >
                  {phoneCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="lead-drawer-action-label">
                    <span>{phoneCopied ? "Copiado" : "Copiar teléfono"}</span>
                  </span>
                </button>
              )}
            </div>
          )}

          {onUpdateLead && (
            <div className="lead-drawer-stage-edit-block">
              <div className="lead-drawer-stage-edit-head">
                <span className="lead-drawer-stage-edit-label">Estado del lead</span>
                {stageStatus === "saving" && (
                  <span className="lead-drawer-stage-hint">Guardando…</span>
                )}
                {stageStatus === "error" && (
                  <span className="lead-drawer-stage-hint lead-drawer-stage-hint--error">
                    {stageError}
                  </span>
                )}
              </div>
              <select
                className={`lead-drawer-stage-select lead-drawer-stage-select--wide lead-drawer-stage-select--${lead.lifecycle_stage || "nuevo"}`}
                value={lead.lifecycle_stage || "nuevo"}
                onChange={handleStageChange}
                disabled={stageStatus === "saving"}
                aria-label="Cambiar estado del lead"
              >
                {SELECTABLE_STAGES.map((k) => (
                  <option key={k} value={k}>{STAGE_LABELS[k]}</option>
                ))}
              </select>
              <PipelineStepper current={lead.lifecycle_stage || "nuevo"} />
            </div>
          )}

          {lead.user_message && (
            <Section title="Mensaje del prospecto">
              <p className="lead-drawer-message">{lead.user_message}</p>
            </Section>
          )}

          <Section title="Datos del prospecto">
            <Field label="Cargo" value={lead.job_title} />
            <Field label="País" value={lead.country_code} />
            <Field label="Modelo" value={lead.business_model} />
            <Field label="Tamaño de la red" value={lead.network_size} />
            <Field
              label="Situación"
              value={SITUACION_LABELS[lead.situacion] || lead.situacion}
            />
          </Section>
          {/* Rol, presupuesto, ventana y recursos ya viven en la tab "Respuestas" del "¿Por qué este score?"
              con más contexto (score 0-3 + eje al que aportan). Eliminados de acá para evitar duplicación. */}

          <ScoreExplain
            lead={lead}
            open={showScoreExplain}
            onToggle={() => setShowScoreExplain((v) => !v)}
          />

          <ScoringBreakdown lead={lead} />

          <Section title="Metadata">
            <Field label="Creado" value={formatDate(lead.created_at)} />
          </Section>

          <section className="lead-drawer-section">
            <button
              type="button"
              className="lead-drawer-collapsible"
              onClick={() => setShowTimeline((v) => !v)}
              aria-expanded={showTimeline}
            >
              {showTimeline ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Historial de actividad</span>
            </button>
            {showTimeline && (
              <div className="lead-drawer-section-body">
                <TouchTimeline
                  events={touchEvents}
                  status={touchStatus}
                />
              </div>
            )}
          </section>

          {hasAttribution(lead) && (
            <section className="lead-drawer-section">
              <button
                type="button"
                className="lead-drawer-collapsible"
                onClick={() => setShowAttribution((v) => !v)}
                aria-expanded={showAttribution}
              >
                {showAttribution ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>Origen (atribución)</span>
              </button>
              {showAttribution && (
                <div className="lead-drawer-section-body">
                  <Field label="UTM source" value={lead.utm_source} />
                  <Field label="UTM medium" value={lead.utm_medium} />
                  <Field label="UTM campaign" value={lead.utm_campaign} />
                  <Field label="UTM content" value={lead.utm_content} />
                  <Field label="UTM term" value={lead.utm_term} />
                  <Field label="gclid" value={lead.gclid} />
                  <Field label="fbclid" value={lead.fbclid} />
                  <Field
                    label="Landing page"
                    value={toDomain(lead.landing_page)}
                    tooltip={lead.landing_page}
                  />
                  <Field
                    label="Landing referrer"
                    value={toDomain(lead.landing_referrer)}
                    tooltip={lead.landing_referrer}
                  />
                  <Field label="Primer contacto" value={formatDate(lead.first_seen)} />
                  <Field label="Ruta previa" value={lead.previous_route} />
                </div>
              )}
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }) {
  const rendered = React.Children.toArray(children).filter(Boolean);
  if (rendered.length === 0) return null;

  return (
    <section className="lead-drawer-section">
      <h3 className="lead-drawer-section-title">{title}</h3>
      <div className="lead-drawer-section-body">{rendered}</div>
    </section>
  );
}

function Field({ label, value, children, tooltip }) {
  if (value == null || value === "") return null;
  return (
    <div className="lead-drawer-field">
      <span className="lead-drawer-field-label">{label}</span>
      <span className="lead-drawer-field-value" title={tooltip || undefined}>
        {String(value)}
        {children}
      </span>
    </div>
  );
}

function toDomain(url) {
  if (!url) return "";
  const raw = String(url).trim();
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return raw.length > 40 ? raw.slice(0, 37) + "…" : raw;
  }
}

function cleanPhone(phone) {
  return String(phone).replace(/[^\d+]/g, "");
}

function formatDate(value) {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (isNaN(d)) return String(value);
    return d.toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
}

function getScoreTier(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return "none";
  if (n >= 80) return "high";
  if (n >= 60) return "mid";
  if (n >= 40) return "low";
  return "cold";
}

function hasAttribution(lead) {
  const keys = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "gclid", "fbclid", "landing_page", "landing_referrer", "first_seen", "previous_route",
  ];
  return keys.some((k) => lead[k]);
}

// Retorna label relativo ("hace 2 horas") + tier de color segun edad y estado.
// tier "cold" solo si es viejo Y el lead sigue en estado inicial (nuevo/vacio).
export function timeSince(dateValue, lifecycleStage) {
  if (!dateValue) return null;
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return null;
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return { label: "recién creado", tier: "recent" };

  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  let label;
  if (diffMin < 1) label = "hace unos segundos";
  else if (diffMin < 60) label = `hace ${diffMin} min`;
  else if (diffHr < 24) label = `hace ${diffHr} h`;
  else if (diffDay === 1) label = "hace 1 día";
  else label = `hace ${diffDay} días`;

  const untouched = !lifecycleStage || lifecycleStage === "nuevo";
  let tier = "recent";
  if (diffDay >= 7 && untouched) tier = "cold";
  else if (diffHr >= 24) tier = "warm";

  return { label, tier };
}

function ScoringBreakdown({ lead }) {
  const dims = [
    { key: "alignment", label: "Alineamiento", value: lead.score_alignment },
    { key: "potential", label: "Potencial", value: lead.score_potential },
    { key: "intent", label: "Intención", value: lead.score_intent },
    { key: "confidence", label: "Confianza", value: lead.score_confidence },
  ].filter((d) => d.value != null && d.value !== "" && Number.isFinite(Number(d.value)));

  const priority = lead.score_priority;
  if (dims.length === 0 && (priority == null || priority === "")) return null;

  const priorityTier = getScoreTier(priority);
  const priorityTierMeta = tierLabelForScore(priority);
  const confidence = Number(lead.score_confidence);
  const lowConfidence = Number.isFinite(confidence) && confidence < 60;
  const highlight = buildScoringHighlight(lead);

  return (
    <section className="lead-drawer-section">
      <h3 className="lead-drawer-section-title">Scoring</h3>
      <div className="lead-drawer-section-body">
        {priority != null && priority !== "" && (
          <div className="lead-drawer-scoring-header">
            <div className={`lead-drawer-scoring-priority lead-drawer-scoring-priority--${priorityTier}`}>
              <span className="lead-drawer-scoring-priority-num">{priority}</span>
              <span className="lead-drawer-scoring-priority-label">Prioridad</span>
            </div>
            <div className="lead-drawer-scoring-header-body">
              <div className={`lead-drawer-scoring-verdict lead-drawer-scoring-verdict--${priorityTierMeta.tier}`}>
                {priorityTierMeta.label}
              </div>
              {highlight && (
                <p className="lead-drawer-scoring-highlight">{highlight}</p>
              )}
              <p className="lead-drawer-scoring-formula">
                50% Alineamiento · 35% Potencial · 15% Intención
              </p>
            </div>
          </div>
        )}
        {dims.length > 0 && (
          <div className="lead-drawer-scoring-bars">
            {dims.map((d) => {
              const num = Number(d.value);
              const tier = getScoreTier(num);
              const tierMeta = tierLabelForScore(num, d.key);
              const width = Math.max(0, Math.min(100, num));
              return (
                <div key={d.key} className="lead-drawer-score-bar">
                  <div className="lead-drawer-score-bar-head">
                    <span className="lead-drawer-score-bar-label">{d.label}</span>
                    <div className="lead-drawer-score-bar-value">
                      <span className={`lead-drawer-score-bar-tier lead-drawer-score-bar-tier--${tierMeta.tier}`}>
                        {tierMeta.label}
                      </span>
                      <span className={`lead-drawer-score-bar-num lead-drawer-score-bar-num--${tier}`}>{num}</span>
                    </div>
                  </div>
                  <div className="lead-drawer-score-bar-track">
                    <div
                      className={`lead-drawer-score-bar-fill lead-drawer-score-bar-fill--${tier}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {lowConfidence && (
          <p className="lead-drawer-scoring-note">
            Score preliminar, confianza baja ({confidence}%)
          </p>
        )}
      </div>
    </section>
  );
}

function TouchTimeline({ events, status }) {
  if (status === "loading") {
    return <p className="lead-drawer-timeline-empty">Cargando historial…</p>;
  }
  if (status === "error") {
    return (
      <p className="lead-drawer-timeline-empty">
        No se pudo cargar el historial (verificá que el backend esté actualizado).
      </p>
    );
  }
  if (!events || events.length === 0) {
    return <p className="lead-drawer-timeline-empty">Sin actividad registrada aún.</p>;
  }

  return (
    <ul className="lead-drawer-timeline">
      {events.map((e) => {
        const meta = describeTouchEvent(e);
        const Icon = meta.icon;
        const timeMeta = timeSince(e.event_at);
        return (
          <li key={e.event_id || `${e.event_at}-${e.channel}`} className="lead-drawer-timeline-item">
            <span className={`lead-drawer-timeline-icon lead-drawer-timeline-icon--${meta.tone}`}>
              <Icon size={12} />
            </span>
            <div className="lead-drawer-timeline-body">
              <div className="lead-drawer-timeline-title">{meta.title}</div>
              {e.stage_advanced && e.previous_stage && (
                <div className="lead-drawer-timeline-sub">
                  Estado: {e.previous_stage} → contactado
                </div>
              )}
              <div className="lead-drawer-timeline-time">
                {timeMeta ? timeMeta.label : formatDate(e.event_at)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ScoreExplain({ lead, open, onToggle }) {
  const items = computeScoringBreakdown(lead);
  const intent = Number(lead.score_intent);
  const hasIntent = Number.isFinite(intent) && intent !== 0;
  const formType = getFormType(lead);
  const narrative = buildScoringNarrative(lead, items);
  const [tab, setTab] = useState("why"); // "why" | "answers"

  if (items.length === 0 && !hasIntent && !narrative) return null;

  const hasWhy = !!narrative;
  const hasAnswers = items.length > 0 || hasIntent;
  const showTabs = hasWhy && hasAnswers;
  const activeTab = !showTabs ? (hasWhy ? "why" : "answers") : tab;

  return (
    <section className="lead-drawer-section">
      <button
        type="button"
        className="lead-drawer-collapsible"
        onClick={onToggle}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span>¿Por qué este score?</span>
      </button>
      {open && (
        <div className="lead-drawer-section-body">
          {showTabs && (
            <div className="lead-drawer-explain-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "why"}
                className={`lead-drawer-explain-tab ${activeTab === "why" ? "is-active" : ""}`}
                onClick={() => setTab("why")}
              >
                Por qué
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "answers"}
                className={`lead-drawer-explain-tab ${activeTab === "answers" ? "is-active" : ""}`}
                onClick={() => setTab("answers")}
              >
                Respuestas
              </button>
            </div>
          )}

          {activeTab === "why" && narrative && (
            <div className={`lead-drawer-narrative lead-drawer-narrative--${narrative.tier}`}>
              <p className="lead-drawer-narrative-opening">
                {narrative.openingLead && <strong>{narrative.openingLead}</strong>}
                {narrative.openingRest}
              </p>

              {narrative.strengths && narrative.strengths.length > 0 && (
                <div className="lead-drawer-narrative-list lead-drawer-narrative-list--pos">
                  <div className="lead-drawer-narrative-list-title">Fortalezas</div>
                  <ul>
                    {narrative.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {narrative.weaknesses && narrative.weaknesses.length > 0 && (
                <div className="lead-drawer-narrative-list lead-drawer-narrative-list--neg">
                  <div className="lead-drawer-narrative-list-title">A resolver</div>
                  <ul>
                    {narrative.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {narrative.action && (
                <p className="lead-drawer-narrative-action">
                  <span className="lead-drawer-narrative-action-label">Próximo paso</span>
                  {narrative.action}
                </p>
              )}
            </div>
          )}

          {activeTab === "answers" && (
            <>
              <ul className="lead-drawer-explain">
                {items.map((it) => {
                  const Icon = DIMENSION_ICON_MAP[DIMENSION_ICONS[it.dimension]] || HelpCircle;
                  return (
                    <li
                      key={it.dimension}
                      className={`lead-drawer-explain-item lead-drawer-explain-item--${it.axis}`}
                    >
                      <div className="lead-drawer-explain-head">
                        <span className={`lead-drawer-explain-icon lead-drawer-explain-icon--${it.axis}`}>
                          <Icon size={14} />
                        </span>
                        <span className="lead-drawer-explain-label">{it.label}</span>
                        <span className={`lead-drawer-explain-axis-pill lead-drawer-explain-axis-pill--${it.axis}`}>
                          {AXIS_LABELS[it.axis] || it.axis}
                        </span>
                      </div>
                      <div className="lead-drawer-explain-answer">"{it.answer}"</div>
                      <ScoreDots score={it.score} />
                    </li>
                  );
                })}
                {hasIntent && (
                  <li className="lead-drawer-explain-item lead-drawer-explain-item--intent">
                    <div className="lead-drawer-explain-head">
                      <span className="lead-drawer-explain-icon lead-drawer-explain-icon--intent">
                        <Sparkles size={14} />
                      </span>
                      <span className="lead-drawer-explain-label">Tipo de formulario</span>
                      <span className="lead-drawer-explain-axis-pill lead-drawer-explain-axis-pill--intent">
                        {AXIS_LABELS.intent}
                      </span>
                    </div>
                    {formType && (
                      <div className="lead-drawer-explain-answer">"{formType}"</div>
                    )}
                    <div className="lead-drawer-explain-intent-value">
                      <span className="lead-drawer-explain-intent-num">{intent}</span>
                      <span className="lead-drawer-explain-intent-unit">/ 100</span>
                    </div>
                  </li>
                )}
              </ul>
              <p className="lead-drawer-explain-note">
                Cada eje se calcula como promedio ponderado de sus dimensiones,
                según los pesos configurados por ruta.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function ScoreDots({ score }) {
  if (score == null) {
    return (
      <div className="lead-drawer-explain-dots lead-drawer-explain-dots--none">
        <span className="lead-drawer-explain-dot-label">Sin clasificar</span>
      </div>
    );
  }
  const dots = [0, 1, 2].map((i) => i < score);
  const tier = scoreClass(score);
  return (
    <div className={`lead-drawer-explain-dots lead-drawer-explain-dots--${tier}`}>
      {dots.map((filled, i) => (
        <span
          key={i}
          className={`lead-drawer-explain-dot ${filled ? "lead-drawer-explain-dot--filled" : ""}`}
          aria-hidden="true"
        />
      ))}
      <span className="lead-drawer-explain-dot-label">{score}/3</span>
    </div>
  );
}

function scoreClass(score) {
  if (score == null) return "none";
  if (score >= 3) return "high";
  if (score >= 2) return "mid";
  if (score >= 1) return "low";
  return "cold";
}

// Etapas del pipeline lineal (nurture queda fuera, se muestra como side track).
const PIPELINE_STAGES = [
  { key: "nuevo", label: "Nuevo" },
  { key: "contactado", label: "Contactado" },
  { key: "calificado", label: "Calificado" },
  { key: "propuesta", label: "Propuesta" },
  { key: "closed", label: "Cerrado" },
];

function pipelineIndex(stage) {
  if (stage === "cerrado_ganado" || stage === "cerrado_perdido") return 4;
  const found = PIPELINE_STAGES.findIndex((s) => s.key === stage);
  return found === -1 ? -1 : found;
}

function PipelineStepper({ current }) {
  // Nurture no es parte del pipeline lineal, se rotula aparte para no confundir con progreso.
  if (current === "nurture") {
    return (
      <div className="pipeline-stepper pipeline-stepper--offtrack">
        <span className="pipeline-offtrack-dot" />
        <span className="pipeline-offtrack-label">
          Este lead está en <strong>Interés futuro</strong>, fuera del pipeline lineal.
        </span>
      </div>
    );
  }

  const currentIdx = pipelineIndex(current);
  const outcome = current === "cerrado_ganado" ? "ganado"
    : current === "cerrado_perdido" ? "perdido"
    : null;

  return (
    <div className="pipeline-stepper" role="list" aria-label="Progreso en el pipeline">
      {PIPELINE_STAGES.map((stage, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;
        const state = isPast ? "past" : isCurrent ? "current" : "future";
        const showOutcome = stage.key === "closed" && outcome && (isCurrent || isPast);
        const label = showOutcome
          ? (outcome === "ganado" ? "Ganado" : "Perdido")
          : stage.label;
        const outcomeMod = showOutcome ? ` pipeline-step--${outcome}` : "";

        return (
          <React.Fragment key={stage.key}>
            <div
              className={`pipeline-step pipeline-step--${state}${outcomeMod}`}
              role="listitem"
              aria-current={isCurrent ? "step" : undefined}
              data-current-stage={isCurrent ? current : undefined}
            >
              <span className="pipeline-step-dot" />
              <span className="pipeline-step-label">{label}</span>
            </div>
            {idx < PIPELINE_STAGES.length - 1 && (
              <span
                className={`pipeline-connector ${idx < currentIdx ? "pipeline-connector--past" : ""}`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function describeTouchEvent(evt) {
  const channel = String(evt.channel || "").toLowerCase();
  if (channel === "email_opened") {
    return { icon: Mail, tone: "email", title: "Email de notificación abierto" };
  }
  if (channel === "whatsapp") {
    return { icon: MessageCircle, tone: "whatsapp", title: "WhatsApp clickeado" };
  }
  if (channel === "manual" || channel === "dashboard") {
    return { icon: Edit3, tone: "manual", title: "Estado actualizado desde el dashboard" };
  }
  return { icon: Activity, tone: "neutral", title: channel || "Evento" };
}
