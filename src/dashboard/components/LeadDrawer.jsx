import React, { useEffect, useRef, useState } from "react";
import { X, Mail, MessageCircle, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

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
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [stageStatus, setStageStatus] = useState("idle"); // idle | saving | error
  const [stageError, setStageError] = useState("");

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

  if (!lead) return null;

  const title = lead.full_name || lead.work_email || "Lead sin nombre";
  const subtitle = lead.company_name || "";
  const scoreTier = getScoreTier(lead.score_priority);

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

          <Section title="Contexto de negocio">
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

          {lead.user_message && (
            <Section title="Mensaje del prospecto">
              <p className="lead-drawer-message">{lead.user_message}</p>
            </Section>
          )}

          <Section title="Seguimiento">
            <div className="lead-drawer-field">
              <div className="lead-drawer-field-label">Estado</div>
              <div className="lead-drawer-stage-edit">
                <select
                  className="lead-drawer-stage-select"
                  value={lead.lifecycle_stage || "nuevo"}
                  onChange={handleStageChange}
                  disabled={stageStatus === "saving" || !onUpdateLead}
                  aria-label="Cambiar estado del lead"
                >
                  {Object.entries(STAGE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
                {stageStatus === "saving" && <span className="lead-drawer-stage-hint">Guardando…</span>}
                {stageStatus === "error" && <span className="lead-drawer-stage-hint lead-drawer-stage-hint--error">{stageError}</span>}
              </div>
            </div>
            <Field label="Creado" value={formatDate(lead.created_at)} />
          </Section>

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
