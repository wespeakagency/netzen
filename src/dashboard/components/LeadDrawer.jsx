import React, { useEffect, useRef, useState } from "react";
import {
  X, Mail, MessageCircle, ChevronDown, ChevronRight, Copy, Check, Edit3, Activity,
  Users, Wallet, CalendarClock, Wrench, BarChart3, Sparkles, HelpCircle,
  Archive, ArchiveRestore, Save, ShieldAlert, ArrowRight, ExternalLink,
} from "lucide-react";
import { fetchTouchEvents } from "../api.js";
import { BUSINESS_MODELS } from "../../lib/leadCatalogs.js";
import { PAISES, detectCountryFromPhone, replaceLadaInPhone, getLada } from "../../lib/paisesLadas.js";
import {
  computeScoringBreakdown,
  buildScoringNarrative,
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

const EDIT_FIELDS = [
  ["full_name", "Nombre"], ["job_title", "Cargo"], ["work_email", "Email"],
  ["whatsapp", "WhatsApp"], ["country_code", "País", "countries"], ["company_name", "Empresa"],
  ["route_code", "Ruta", "routes"], ["business_model", "Modelo", "business_models"], ["owner", "Propietario"],
  ["next_action", "Próxima acción"], ["notes", "Notas"]
];

const EDIT_FIELD_SPANS = {
  full_name: "half", company_name: "half",
  job_title: "half", owner: "half",
  work_email: "half", whatsapp: "half",
  country_code: "third", business_model: "third", route_code: "third",
  next_action: "wide", notes: "wide",
};

const isArchived = (lead) => /\[\[CRM_ARCHIVE:v1\|/.test(String(lead?.flags || ""));

export function LeadDrawer({ lead, catalogs = {}, onClose, onUpdateLead, onEditLead, onArchiveLead, onRestoreLead }) {
  const closeBtnRef = useRef(null);
  const [showAttribution, setShowAttribution] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showScoreExplain, setShowScoreExplain] = useState(true);
  const [explainTab, setExplainTab] = useState("why"); // "why" | "answers" | "bars"
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [stageStatus, setStageStatus] = useState("idle"); // idle | saving | error
  const [stageError, setStageError] = useState("");
  const [touchEvents, setTouchEvents] = useState([]);
  const [touchStatus, setTouchStatus] = useState("idle"); // idle | loading | ok | error
  const [scoringPopoverOpen, setScoringPopoverOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  const [sensitiveStatus, setSensitiveStatus] = useState("idle");
  const [sensitiveError, setSensitiveError] = useState("");
  const scoringPopoverRef = useRef(null);
  const scoringHoverTimerRef = useRef(null);

  // Cerrar popover con Escape (para accesibilidad por teclado).
  useEffect(() => {
    if (!scoringPopoverOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setScoringPopoverOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [scoringPopoverOpen]);

  const openScoringPopover = () => {
    if (scoringHoverTimerRef.current) {
      clearTimeout(scoringHoverTimerRef.current);
      scoringHoverTimerRef.current = null;
    }
    setScoringPopoverOpen(true);
  };
  const scheduleCloseScoringPopover = () => {
    if (scoringHoverTimerRef.current) clearTimeout(scoringHoverTimerRef.current);
    scoringHoverTimerRef.current = setTimeout(() => setScoringPopoverOpen(false), 120);
  };

  const openScoringDetail = () => {
    setScoringPopoverOpen(false);
    setShowScoreExplain(true);
    setExplainTab("bars");
    setTimeout(() => {
      document.getElementById("scoring-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const scrollToAnchor = (id) => {
    setScoringPopoverOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const changeStage = async (newStage) => {
    if (!lead || !onUpdateLead || newStage === lead.lifecycle_stage) return;
    setStageStatus("saving");
    setStageError("");
    try {
      await onUpdateLead({ leadId: lead.lead_id, field: "lifecycle_stage", value: newStage });
      setStageStatus("idle");
      if (lead.lead_id) {
        fetchTouchEvents(lead.lead_id, { force: true })
          .then((data) => setTouchEvents(Array.isArray(data?.events) ? data.events : []))
          .catch(() => {});
      }
    } catch (err) {
      setStageStatus("error");
      setStageError(err.message || "No se pudo guardar");
    }
  };
  const handleStageChange = (e) => changeStage(e.target.value);

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

  const openEdit = () => {
    setEditValues(Object.fromEntries(EDIT_FIELDS.map(([key]) => [key, String(lead?.[key] || "")] )));
    setSensitiveError("");
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const changes = Object.fromEntries(
      EDIT_FIELDS.map(([key]) => [key, String(editValues[key] || "").trim()])
        .filter(([key, value]) => value !== String(lead?.[key] || "").trim())
    );
    if (!Object.keys(changes).length) { setEditOpen(false); return; }
    setSensitiveStatus("saving");
    setSensitiveError("");
    try {
      await onEditLead({ leadId: lead.lead_id, changes, reason: "Edición confirmada desde dashboard" });
      setEditOpen(false);
    } catch (err) {
      setSensitiveError(err.message || "No se pudieron guardar los cambios");
    } finally { setSensitiveStatus("idle"); }
  };

  const submitArchiveAction = async ({ reason, confirmation }) => {
    setSensitiveStatus("saving");
    setSensitiveError("");
    try {
      if (confirmAction === "archive") {
        await onArchiveLead({ leadId: lead.lead_id, reason, confirmation });
      } else {
        await onRestoreLead({ leadId: lead.lead_id, reason, confirmation });
      }
      setConfirmAction(null);
      onClose();
    } catch (err) {
      setSensitiveError(err.message || "No se pudo completar la operación");
    } finally { setSensitiveStatus("idle"); }
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
          <div className="lead-drawer-header-glow" aria-hidden="true" />
          <button
            ref={closeBtnRef}
            className="lead-drawer-close"
            onClick={onClose}
            aria-label="Cerrar detalle del lead"
          >
            <X size={18} />
          </button>

          <div className="lead-drawer-header-top">
            <div className="lead-drawer-title-block">
              <p className="lead-drawer-kicker">
                <span>Lead</span>
                {lead.category && <span className="lead-drawer-kicker-dot" aria-hidden="true" />}
                {lead.category && <span className={`lead-drawer-kicker-cat lead-drawer-kicker-cat--${String(lead.category).toLowerCase()}`}>{lead.category}</span>}
              </p>
              <h2 id="lead-drawer-title" className="lead-drawer-title">
                {title}<span className="lead-drawer-title-dot" aria-hidden="true">.</span>
              </h2>
              {(subtitle || lead.business_model || lead.job_title || lead.country_code) && (
                <p className="lead-drawer-subtitle">
                  {[subtitle, lead.job_title, lead.business_model, lead.country_code].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            {lead.score_priority != null && lead.score_priority !== "" && (
              <div className="lead-drawer-score-medallion">
                <button
                  type="button"
                  className={`lead-drawer-score-medallion-btn lead-drawer-score-medallion-btn--${scoreTier}`}
                  onClick={openScoringDetail}
                  aria-label={`Score ${lead.score_priority} sobre 100. Ver desglose completo.`}
                  title="Ver desglose del score"
                >
                  <span className="lead-drawer-score-medallion-label">Score</span>
                  <span className="lead-drawer-score-medallion-num">{lead.score_priority}</span>
                </button>
              </div>
            )}
          </div>

          <div className="lead-drawer-meta-row">
            {lead.lifecycle_stage && (
              <button
                type="button"
                className={`lead-drawer-stage-pill lead-drawer-stage-pill--${lead.lifecycle_stage} lead-drawer-stage-pill--interactive`}
                onClick={() => scrollToAnchor("stage-edit-anchor")}
                title="Cambiar estado"
              >
                {STAGE_LABELS[lead.lifecycle_stage] || lead.lifecycle_stage}
              </button>
            )}
            {(aging || lead.route_code) && (
              <span className="lead-drawer-meta-line">
                {aging && (
                  <span
                    className={`lead-drawer-meta-line-aging lead-drawer-meta-line-aging--${aging.tier}`}
                    title={`Creado ${formatDate(lead.created_at)}`}
                  >
                    {aging.label}
                  </span>
                )}
                {aging && lead.route_code && <span className="lead-drawer-meta-line-dot" aria-hidden="true" />}
                {lead.route_code && (
                  <span className="lead-drawer-meta-line-route">Ruta {lead.route_code}</span>
                )}
              </span>
            )}
          </div>
        </header>

        <div className="lead-drawer-body">
          <div className="lead-record-actions">
            {!isArchived(lead) && onEditLead && (
              <button type="button" className="btn btn-ghost" onClick={openEdit}><Edit3 size={15} /> Editar datos</button>
            )}
            {!isArchived(lead) && onArchiveLead && (
              <button type="button" className="btn btn-danger-ghost" onClick={() => { setSensitiveError(""); setConfirmAction("archive"); }}>
                <Archive size={15} /> Archivar
              </button>
            )}
            {isArchived(lead) && onRestoreLead && (
              <button type="button" className="btn btn-primary" onClick={() => { setSensitiveError(""); setConfirmAction("restore"); }}>
                <ArchiveRestore size={15} /> Restaurar lead
              </button>
            )}
          </div>
          {(lead.whatsapp || lead.work_email) && (
            <div className="lead-drawer-actions">
              {lead.whatsapp && (
                <a
                  href={`https://wa.me/${cleanPhone(lead.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lead-drawer-action lead-drawer-action--whatsapp"
                >
                  <span className="lead-drawer-action-icon" aria-hidden="true"><MessageCircle size={16} /></span>
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
                  <span className="lead-drawer-action-icon" aria-hidden="true"><Mail size={16} /></span>
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
                  <span className="lead-drawer-action-icon" aria-hidden="true">{phoneCopied ? <Check size={16} /> : <Copy size={16} />}</span>
                  <span className="lead-drawer-action-label">
                    <span>{phoneCopied ? "Copiado" : "Copiar teléfono"}</span>
                  </span>
                </button>
              )}
            </div>
          )}

          {onUpdateLead && (
            <div className="lead-drawer-stage-edit-block" id="stage-edit-anchor">
              <div className="lead-drawer-stage-edit-head">
                <h3 className="lead-drawer-section-title">Estado del lead</h3>
                {stageStatus === "saving" && (
                  <span className="lead-drawer-stage-hint">Guardando…</span>
                )}
                {stageStatus === "error" && (
                  <span className="lead-drawer-stage-hint lead-drawer-stage-hint--error">
                    {stageError}
                  </span>
                )}
              </div>
              <PipelineStepper
                current={lead.lifecycle_stage || "nuevo"}
                onSelect={changeStage}
                disabled={stageStatus === "saving"}
              />
              <details className="lead-drawer-stage-manual">
                <summary>Cambiar manualmente</summary>
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
              </details>
            </div>
          )}

          {lead.user_message && (
            <Section title="Mensaje del prospecto">
              <p className="lead-drawer-message">{lead.user_message}</p>
            </Section>
          )}

          <Section title="Datos del prospecto">
            <div className="lead-drawer-datacards">
              {lead.business_model && (
                <div className="lead-drawer-datacard">
                  <span className="lead-drawer-datacard-label">Modelo</span>
                  <span className="lead-drawer-datacard-value">{lead.business_model}</span>
                </div>
              )}
              {lead.network_size && (
                <div className="lead-drawer-datacard">
                  <span className="lead-drawer-datacard-label">Tamaño de la red</span>
                  <span className="lead-drawer-datacard-value">{lead.network_size}</span>
                </div>
              )}
              {(SITUACION_LABELS[lead.situacion] || lead.situacion) && (
                <div className="lead-drawer-datacard">
                  <span className="lead-drawer-datacard-label">Situación</span>
                  <span className="lead-drawer-datacard-value">
                    {SITUACION_LABELS[lead.situacion] || lead.situacion}
                  </span>
                </div>
              )}
            </div>
          </Section>
          {/* Rol, presupuesto, ventana y recursos ya viven en la tab "Respuestas" del "¿Por qué este score?"
              con más contexto (score 0-3 + eje al que aportan). Eliminados de acá para evitar duplicación. */}

          <div id="scoring-anchor">
            <ScoreExplain
              lead={lead}
              open={showScoreExplain}
              onToggle={() => setShowScoreExplain((v) => !v)}
              tab={explainTab}
              onTabChange={setExplainTab}
            />
          </div>

          <Section title="Historial de actividad">
            <TouchTimeline
              events={touchEvents}
              status={touchStatus}
            />
          </Section>

          <div className="lead-drawer-meta-zone">
            <p className="lead-drawer-meta-zone-eyebrow">Antecedentes y registro</p>

            <Section title="Metadata">
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

          <footer className="lead-drawer-footer">
            <span className="lead-drawer-footer-id">Lead <strong>#{lead.lead_id || "—"}</strong></span>
            <span className="lead-drawer-footer-dot" aria-hidden="true" />
            <span>Actualizado {formatDate(lead.last_touch_at || lead.updated_at || lead.created_at)}</span>
            {lead.sheet_url && (
              <>
                <span className="lead-drawer-footer-dot" aria-hidden="true" />
                <a
                  href={lead.sheet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lead-drawer-footer-link"
                >
                  Ver en Sheet <ExternalLink size={11} />
                </a>
              </>
            )}
          </footer>
        </div>
      </aside>
      {editOpen && (
        <div className="sensitive-modal-overlay" onClick={(e) => { e.stopPropagation(); if (sensitiveStatus !== "saving") setEditOpen(false); }}>
          <form className="sensitive-modal" onSubmit={saveEdit} onClick={(e) => e.stopPropagation()}>
            <div className="sensitive-modal-head"><div><h3>Editar datos sensibles</h3><p>Solo se guardarán los campos modificados y quedarán auditados.</p></div></div>
            <div className="lead-edit-grid">
              {EDIT_FIELDS.map(([key, label, catalogName]) => (
                <label key={key} className={`lead-edit-field lead-edit-field--${EDIT_FIELD_SPANS[key] || "half"}`}>
                  <span>{label}</span>
                  {catalogName ? (
                    <select value={editValues[key] || ""} onChange={(e) => setEditValues((v) => syncCountryPhone(v, key, e.target.value))}>
                      {buildEditOptions(key, lead?.[key], catalogs, catalogName).map((option) => (
                        <option key={`${key}-${option.value}`} value={option.value} disabled={option.disabled}>{option.label}</option>
                      ))}
                    </select>
                  ) : key === "notes" || key === "next_action" ? (
                    <textarea value={editValues[key] || ""} maxLength={2000} onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))} />
                  ) : (
                    <input type={key === "work_email" ? "email" : "text"} value={editValues[key] || ""} maxLength={key === "whatsapp" ? 40 : 320} required={key === "full_name"} onChange={(e) => setEditValues((v) => syncCountryPhone(v, key, e.target.value))} />
                  )}
                </label>
              ))}
            </div>
            {sensitiveError && <p className="sensitive-modal-error">{sensitiveError}</p>}
            <div className="sensitive-modal-actions">
              <button type="button" className="btn btn-ghost" disabled={sensitiveStatus === "saving"} onClick={() => setEditOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={sensitiveStatus === "saving"}><Save size={15} /> {sensitiveStatus === "saving" ? "Guardando…" : "Confirmar cambios"}</button>
            </div>
          </form>
        </div>
      )}
      {confirmAction && (
        <SensitiveConfirmation
          action={confirmAction}
          lead={lead}
          busy={sensitiveStatus === "saving"}
          error={sensitiveError}
          onCancel={() => setConfirmAction(null)}
          onConfirm={submitArchiveAction}
        />
      )}
    </div>
  );
}

// Sincroniza país <-> WhatsApp en el form de edición. Cuando el usuario cambia
// el número, si el prefijo mapea a un país conocido lo actualiza. Cuando cambia
// el país, si el número tiene una lada distinta la reemplaza. Evita pisar
// selecciones válidas cuando el prefijo es ambiguo (ej: +1).
function syncCountryPhone(prev, key, value) {
  if (key === "whatsapp") {
    const detected = detectCountryFromPhone(value, prev.country_code);
    if (detected && detected !== prev.country_code) {
      return { ...prev, whatsapp: value, country_code: detected };
    }
    return { ...prev, whatsapp: value };
  }
  if (key === "country_code") {
    const newLada = getLada(value);
    if (newLada && prev.whatsapp) {
      return { ...prev, country_code: value, whatsapp: replaceLadaInPhone(prev.whatsapp, newLada) };
    }
    return { ...prev, country_code: value };
  }
  return { ...prev, [key]: value };
}

function buildEditOptions(field, currentValue, catalogs, catalogName) {
  const current = String(currentValue || "").trim();
  const catalogItems = Array.isArray(catalogs?.[catalogName]) ? catalogs[catalogName] : [];
  const canonical = field === "country_code"
    ? PAISES.map(({ name }) => ({ value: name, label: name }))
    : catalogItems.length
      ? catalogItems.map((item) => ({ value: String(item.code), label: String(item.label || item.code) }))
    : field === "business_model"
      ? BUSINESS_MODELS.map((value) => ({ value, label: value }))
      : [];
  const placeholder = field === "country_code" ? "Selecciona un país" : "Selecciona una opción";
  const options = [{ value: "", label: placeholder, disabled: true }, ...canonical];
  if (current && !options.some((option) => option.value === current)) {
    options.splice(1, 0, { value: current, label: `${current} (valor histórico)` });
  }
  return options;
}

function SensitiveConfirmation({ action, lead, busy, error, onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const archive = action === "archive";
  const valid = confirmation === String(lead.lead_id) && (!archive || reason.trim().length >= 5);
  return (
    <div className="sensitive-modal-overlay" onClick={(e) => { e.stopPropagation(); if (!busy) onCancel(); }}>
      <form className="sensitive-modal sensitive-modal--confirm" onSubmit={(e) => { e.preventDefault(); if (valid) onConfirm({ reason: reason.trim(), confirmation }); }} onClick={(e) => e.stopPropagation()}>
        <ShieldAlert size={30} className="sensitive-modal-warning" />
        <h3>{archive ? "Archivar lead" : "Restaurar lead"}</h3>
        <p>{archive ? "El lead se ocultará del dashboard activo, pero NO se eliminará. La acción quedará registrada." : "El lead volverá al listado activo. La restauración quedará registrada."}</p>
        <label className="lead-edit-field"><span>Motivo {archive ? "(obligatorio)" : "(opcional)"}</span><textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} required={archive} /></label>
        <label className="lead-edit-field"><span>Escribe el ID para confirmar: <strong>{lead.lead_id}</strong></span><input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="off" /></label>
        {error && <p className="sensitive-modal-error">{error}</p>}
        <div className="sensitive-modal-actions">
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={onCancel}>Cancelar</button>
          <button type="submit" className={archive ? "btn btn-danger" : "btn btn-primary"} disabled={!valid || busy}>{busy ? "Procesando…" : archive ? "Archivar sin eliminar" : "Restaurar"}</button>
        </div>
      </form>
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

function ScoringPeekPopover({ lead, onSeeMore }) {
  const dims = [
    { key: "alignment", label: "Alineamiento", value: lead.score_alignment },
    { key: "potential", label: "Potencial", value: lead.score_potential },
    { key: "intent", label: "Intención", value: lead.score_intent },
    { key: "confidence", label: "Confianza", value: lead.score_confidence },
  ].filter((d) => d.value != null && d.value !== "" && Number.isFinite(Number(d.value)));

  return (
    <div className="lead-drawer-scoring-popover" role="dialog" aria-label="Desglose del score">
      <div className="lead-drawer-scoring-popover-title">Desglose del score</div>
      {dims.length === 0 ? (
        <p className="lead-drawer-scoring-popover-empty">Sin datos de scoring por dimensión.</p>
      ) : (
        <div className="lead-drawer-scoring-bars lead-drawer-scoring-bars--compact">
          {dims.map((d) => {
            const num = Number(d.value);
            const tier = getScoreTier(num);
            const tierMeta = tierLabelForScore(num, d.key);
            const width = Math.max(0, Math.min(100, num));
            return (
              <div key={d.key} className="lead-drawer-score-bar">
                <div className="lead-drawer-score-bar-head">
                  <span className="lead-drawer-score-bar-label">{d.label}</span>
                  <span className={`lead-drawer-score-bar-tier lead-drawer-score-bar-tier--${tierMeta.tier}`}>
                    {tierMeta.label}
                  </span>
                  <span className={`lead-drawer-score-bar-num lead-drawer-score-bar-num--${tier}`}>{num}</span>
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
      <button
        type="button"
        className="lead-drawer-scoring-popover-cta"
        onClick={onSeeMore}
      >
        Ver detalle
      </button>
    </div>
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

function ScoreExplain({ lead, open, onToggle, tab, onTabChange }) {
  const items = computeScoringBreakdown(lead);
  const intent = Number(lead.score_intent);
  const hasIntent = Number.isFinite(intent) && intent !== 0;
  const formType = getFormType(lead);
  const narrative = buildScoringNarrative(lead, items);

  const bars = [
    { key: "alignment", label: "Alineamiento", value: lead.score_alignment },
    { key: "potential", label: "Potencial", value: lead.score_potential },
    { key: "intent", label: "Intención", value: lead.score_intent },
    { key: "confidence", label: "Confianza", value: lead.score_confidence },
  ].filter((d) => d.value != null && d.value !== "" && Number.isFinite(Number(d.value)));

  if (items.length === 0 && !hasIntent && !narrative && bars.length === 0) return null;

  const hasWhy = !!narrative;
  const hasAnswers = items.length > 0 || hasIntent;
  const hasBars = bars.length > 0;
  const availableTabs = [
    hasWhy && "why",
    hasAnswers && "answers",
    hasBars && "bars",
  ].filter(Boolean);
  const showTabs = availableTabs.length > 1;
  const activeTab = availableTabs.includes(tab) ? tab : availableTabs[0];
  const setTab = (t) => onTabChange?.(t);

  const confidence = Number(lead.score_confidence);
  const lowConfidence = Number.isFinite(confidence) && confidence < 60;

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
              {hasWhy && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "why"}
                  className={`lead-drawer-explain-tab ${activeTab === "why" ? "is-active" : ""}`}
                  onClick={() => setTab("why")}
                >
                  Por qué
                </button>
              )}
              {hasAnswers && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "answers"}
                  className={`lead-drawer-explain-tab ${activeTab === "answers" ? "is-active" : ""}`}
                  onClick={() => setTab("answers")}
                >
                  Respuestas
                </button>
              )}
              {hasBars && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "bars"}
                  className={`lead-drawer-explain-tab ${activeTab === "bars" ? "is-active" : ""}`}
                  onClick={() => setTab("bars")}
                >
                  Barras
                </button>
              )}
            </div>
          )}

          {activeTab === "bars" && hasBars && (
            <>
              <div className="lead-drawer-scoring-bars">
                {bars.map((d) => {
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
              {lowConfidence && (
                <p className="lead-drawer-scoring-note">
                  Score preliminar, confianza baja ({confidence}%)
                </p>
              )}
            </>
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
                <div className="lead-drawer-narrative-action">
                  <span className="lead-drawer-narrative-action-icon" aria-hidden="true">
                    <ArrowRight size={16} />
                  </span>
                  <div className="lead-drawer-narrative-action-body">
                    <span className="lead-drawer-narrative-action-label">Próximo paso</span>
                    <p className="lead-drawer-narrative-action-text">{narrative.action}</p>
                  </div>
                </div>
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

// Etapas abiertas del pipeline lineal. Cerrado se maneja aparte como outcome.
const PIPELINE_STAGES = [
  { key: "nuevo", label: "Nuevo" },
  { key: "contactado", label: "Contactado" },
  { key: "calificado", label: "Calificado" },
  { key: "propuesta", label: "Propuesta" },
];

function pipelineIndex(stage) {
  if (stage === "cerrado_ganado" || stage === "cerrado_perdido") return PIPELINE_STAGES.length;
  const found = PIPELINE_STAGES.findIndex((s) => s.key === stage);
  return found === -1 ? -1 : found;
}

function PipelineStepper({ current, onSelect, disabled }) {
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
  const isClosed = current === "cerrado_ganado" || current === "cerrado_perdido";
  const outcome = current === "cerrado_ganado" ? "ganado"
    : current === "cerrado_perdido" ? "perdido"
    : null;

  const handleClick = (stageKey) => {
    if (disabled || !onSelect) return;
    onSelect(stageKey);
  };

  return (
    <div className="pipeline-stepper-wrap">
      <div className="pipeline-stepper" role="list" aria-label="Progreso en el pipeline">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const state = isPast ? "past" : isCurrent ? "current" : "future";

          return (
            <React.Fragment key={stage.key}>
              <button
                type="button"
                className={`pipeline-step pipeline-step--${state}`}
                onClick={() => handleClick(stage.key)}
                disabled={disabled || isCurrent}
                role="listitem"
                aria-current={isCurrent ? "step" : undefined}
                data-current-stage={isCurrent ? current : undefined}
                title={isCurrent ? stage.label : `Mover a ${stage.label}`}
              >
                <span className="pipeline-step-dot" />
                <span className="pipeline-step-label">{stage.label}</span>
              </button>
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

      <div className={`pipeline-outcome ${isClosed ? "pipeline-outcome--closed" : ""}`}>
        <span className="pipeline-outcome-label">
          {isClosed ? "Cerrado como" : "Cerrar como"}
        </span>
        <div className="pipeline-outcome-choices" role="group" aria-label="Outcome de cierre">
          <button
            type="button"
            className={`pipeline-outcome-btn pipeline-outcome-btn--ganado ${outcome === "ganado" ? "is-active" : ""}`}
            onClick={() => handleClick("cerrado_ganado")}
            disabled={disabled || outcome === "ganado"}
            aria-pressed={outcome === "ganado"}
          >
            <span className="pipeline-outcome-dot" aria-hidden="true" />
            <span>Ganado</span>
          </button>
          <button
            type="button"
            className={`pipeline-outcome-btn pipeline-outcome-btn--perdido ${outcome === "perdido" ? "is-active" : ""}`}
            onClick={() => handleClick("cerrado_perdido")}
            disabled={disabled || outcome === "perdido"}
            aria-pressed={outcome === "perdido"}
          >
            <span className="pipeline-outcome-dot" aria-hidden="true" />
            <span>Perdido</span>
          </button>
        </div>
      </div>
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
