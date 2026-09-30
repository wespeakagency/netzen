import React, { useEffect, useRef, useState } from "react";
import { X, Mail, MessageCircle, ChevronDown, ChevronRight, Copy, Check, Edit3, Activity } from "lucide-react";
import { fetchTouchEvents } from "../api.js";

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
  nurture: "Interés futuro",
};

export function LeadDrawer({ lead, onClose, onUpdateLead }) {
  const closeBtnRef = useRef(null);
  const [showAttribution, setShowAttribution] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
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
                className="lead-drawer-stage-select lead-drawer-stage-select--wide"
                value={lead.lifecycle_stage || "nuevo"}
                onChange={handleStageChange}
                disabled={stageStatus === "saving"}
                aria-label="Cambiar estado del lead"
              >
                {Object.entries(STAGE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>
          )}

          <Section title="Contexto de negocio">
            <Field label="Cargo" value={lead.job_title} />
            <Field label="País" value={lead.country_code} />
            <Field label="Modelo" value={lead.business_model} />
            <Field label="Tamaño de la red" value={lead.network_size} />
            <Field
              label="Situación"
              value={SITUACION_LABELS[lead.situacion] || lead.situacion}
            />
          </Section>

          <Section title="Calificación">
            <Field label="Rol en la decisión" value={lead.decision_role} />
            <Field label="Presupuesto" value={lead.budget_readiness} />
            <Field label="Ventana de decisión" value={lead.timeline} />
            <Field label="Recursos" value={lead.implementation_readiness} />
          </Section>

          <ScoringBreakdown lead={lead} />

          {lead.user_message && (
            <Section title="Mensaje del prospecto">
              <p className="lead-drawer-message">{lead.user_message}</p>
            </Section>
          )}

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
function timeSince(dateValue, lifecycleStage) {
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
    { key: "alignment", label: "Alignment", value: lead.score_alignment },
    { key: "potential", label: "Potential", value: lead.score_potential },
    { key: "intent", label: "Intent", value: lead.score_intent },
    { key: "confidence", label: "Confidence", value: lead.score_confidence },
  ].filter((d) => d.value != null && d.value !== "" && Number.isFinite(Number(d.value)));

  const priority = lead.score_priority;
  if (dims.length === 0 && (priority == null || priority === "")) return null;

  const priorityTier = getScoreTier(priority);
  const confidence = Number(lead.score_confidence);
  const lowConfidence = Number.isFinite(confidence) && confidence < 60;

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
            <p className="lead-drawer-scoring-formula">
              50% Alignment · 35% Potential · 15% Intent
            </p>
          </div>
        )}
        {dims.length > 0 && (
          <div className="lead-drawer-scoring-bars">
            {dims.map((d) => {
              const num = Number(d.value);
              const tier = getScoreTier(num);
              const width = Math.max(0, Math.min(100, num));
              return (
                <div key={d.key} className="lead-drawer-score-bar">
                  <div className="lead-drawer-score-bar-head">
                    <span className="lead-drawer-score-bar-label">{d.label}</span>
                    <span className="lead-drawer-score-bar-num">{num}</span>
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

function describeTouchEvent(evt) {
  const channel = String(evt.channel || "").toLowerCase();
  if (channel === "email_opened") {
    return { icon: Mail, tone: "email", title: "Email de notificación abierto" };
  }
  if (channel === "whatsapp") {
    return { icon: MessageCircle, tone: "whatsapp", title: "WhatsApp clickeado" };
  }
  if (channel === "manual" || channel === "dashboard") {
    return { icon: Edit3, tone: "manual", title: "Actualización manual" };
  }
  return { icon: Activity, tone: "neutral", title: channel || "Evento" };
}
