// /contacto y /contacto/demo — punto de conversión (formulario → Google Sheets)
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Steps, Badge, CheckLine, ConsentLine } from "../../components/ui.jsx";
import { Breadcrumbs, CTABand } from "../../components/chrome.jsx";
import { Container } from "../../components/ui.jsx";
import { WHATSAPP_URL, HAS_WHATSAPP } from "../../lib/nav.js";
import { trackEvent } from "../../lib/analytics.js";
import { submitLead, FormSubmitError } from "../../lib/forms.js";
import { validateFields, hasErrors } from "../../lib/formValidation.js";
import { LABELS } from "../../lib/copy.js";
import { PAISES, getLada, buildWhatsappE164 } from "../../lib/paisesLadas.js";
import { BUSINESS_MODELS } from "../../lib/leadCatalogs.js";

const SITUACIONES = [
  { k: "A", label: "Apenas empiezo / explorando" },
  { k: "B", label: "Empresa establecida que busca escalar" },
  { k: "C", label: "Profesionalizar mi red de distribuidores" },
  { k: "D", label: "Ya tengo software propio / modernizar" }
];

const TAMANIOS = ["Menos de 100 distribuidores", "100 – 1,000", "1,000 – 10,000", "Más de 10,000"];

// Inputs de calificación · alimentan el scoring del CRM (Fase 2).
// Opcionales para no meter fricción, pero cuanto más se llenen mejor prioriza el equipo comercial.
// NOTA: los strings deben conservar las keywords que matchea el Apps Script (decisor principal, evaluando, etc.).
const DECISION_ROLES = [
  "Tomo la decisión final",
  "Decido con mi equipo",
  "Recomiendo, otro decide",
  "Investigo para el equipo"
];
const BUDGET_STAGES = [
  "Ya asignado",
  "Evaluando este año",
  "Sin presupuesto aún"
];
const TIMELINES = [
  "0-3 meses",
  "3-6 meses",
  "6-12 meses",
  "Sin urgencia"
];
const IMPLEMENTATION_READINESS = [
  "Equipo interno",
  "Partner tecnológico",
  "Acompañamiento completo"
];

const INITIAL = {
  nombre: "",
  empresa: "",
  whatsapp: "",
  ladaCustom: "",
  email: "",
  pais: "",
  modelo: "",
  tamanio: "",
  decision_role: "",
  budget_readiness: "",
  timeline: "",
  implementation_readiness: "",
  mensaje: "",
  website: "" // honeypot
};

function FormularioContacto({ demo }) {
  const renderedAt = useMemo(() => Date.now(), []);
  const [values, setValues] = useState(INITIAL);
  const [situacion, setSituacion] = useState("A");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const ladaSeleccionada = values.pais === "Otro" ? values.ladaCustom.trim() : getLada(values.pais);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFields(values, {
      nombre: { required: true },
      empresa: { required: true },
      email: { required: true, email: true },
      pais: { required: true, message: "Selecciona tu país." },
      whatsapp: { required: true, digitsMin: 6, digitsMax: 15, digitsMessage: "Número inválido. Solo dígitos, entre 6 y 15." }
    });
    if (values.pais === "Otro" && !values.ladaCustom.replace(/\D/g, "")) {
      errors.ladaCustom = "Ingresa la lada de tu país (ej. +49).";
    }
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setStatus("error");
      setErrorMsg("Revisa los campos marcados antes de enviar.");
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setErrorMsg("");

    const formType = demo ? "demo" : "diagnostico";
    trackEvent("form_submit", { form_type: formType, route: situacion });

    try {
      await submitLead({
        formType,
        honeypot: values.website,
        renderedAt,
        fields: {
          nombre: values.nombre,
          empresa: values.empresa,
          whatsapp: buildWhatsappE164(ladaSeleccionada, values.whatsapp),
          email: values.email,
          pais: values.pais,
          modelo: values.modelo,
          tamanio: demo ? values.tamanio : "",
          situacion,
          decision_role: values.decision_role,
          budget_readiness: values.budget_readiness,
          timeline: values.timeline,
          implementation_readiness: values.implementation_readiness,
          mensaje: values.mensaje
        }
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof FormSubmitError ? err.message : "Hubo un problema al enviar. Intentá de nuevo.");
    }
  };

  const resetForm = () => {
    setValues(INITIAL);
    setSituacion("A");
    setStatus("idle");
    setErrorMsg("");
    setFieldErrors({});
  };

  if (status === "sent") {
    return (
      <div className="card card--pad-lg" style={{ textAlign: "center", boxShadow: "var(--shadow-md)" }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Check" size={30} strokeWidth={2.4} style={{ color: "var(--status-success)" }} />
        </span>
        <h2 style={{ marginTop: 20, fontSize: 24, fontWeight: 700 }}>¡Recibimos tu solicitud!</h2>
        <p style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          Un ejecutivo se pondrá en contacto para tu {demo ? "demo" : "diagnóstico"} por WhatsApp o correo en horario hábil.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={resetForm}>Enviar otra solicitud</Button>
          <Button variant="ghost" to="/">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      className="card card--pad-lg"
      onSubmit={handleSubmit}
      noValidate
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>{demo ? "Formulario de calificación" : "Solicita tu diagnóstico"}</h3>

      <div className="contact-grid">
        <div className={`field${fieldErrors.nombre ? " has-error" : ""}`}>
          <label htmlFor="c-nombre">Nombre completo <span className="req">*</span></label>
          <input id="c-nombre" name="nombre" value={values.nombre} onChange={update("nombre")} placeholder="María González" required autoComplete="name" aria-invalid={fieldErrors.nombre ? "true" : undefined} />
          {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
        </div>
        <div className={`field${fieldErrors.empresa ? " has-error" : ""}`}>
          <label htmlFor="c-empresa">Empresa <span className="req">*</span></label>
          <input id="c-empresa" name="empresa" value={values.empresa} onChange={update("empresa")} placeholder="Nombre de tu empresa" required autoComplete="organization" aria-invalid={fieldErrors.empresa ? "true" : undefined} />
          {fieldErrors.empresa && <span className="field-error">{fieldErrors.empresa}</span>}
        </div>
        <div className={`field${fieldErrors.pais ? " has-error" : ""}`}>
          <label htmlFor="c-pais">País <span className="req">*</span></label>
          <select id="c-pais" name="pais" value={values.pais} onChange={update("pais")} required aria-invalid={fieldErrors.pais ? "true" : undefined}>
            <option value="" disabled>Elige tu país</option>
            {PAISES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          {fieldErrors.pais && <span className="field-error">{fieldErrors.pais}</span>}
        </div>
        <div className={`field${fieldErrors.whatsapp || fieldErrors.ladaCustom ? " has-error" : ""}`}>
          <label htmlFor="c-whatsapp">WhatsApp <span className="req">*</span></label>
          <div className="phone-input">
            {values.pais === "Otro" ? (
              <input
                id="c-lada"
                name="ladaCustom"
                type="tel"
                className="phone-input__lada phone-input__lada--editable"
                value={values.ladaCustom}
                onChange={update("ladaCustom")}
                placeholder="+00"
                aria-label="Lada del país"
                aria-invalid={fieldErrors.ladaCustom ? "true" : undefined}
              />
            ) : (
              <span className="phone-input__lada" aria-hidden="true">{ladaSeleccionada || "+--"}</span>
            )}
            <input
              id="c-whatsapp"
              name="whatsapp"
              type="tel"
              className="phone-input__number"
              value={values.whatsapp}
              onChange={update("whatsapp")}
              placeholder={values.pais === "México" ? "33 1234 5678" : "Número local"}
              required
              autoComplete="tel-national"
              aria-invalid={fieldErrors.whatsapp ? "true" : undefined}
              disabled={!values.pais}
            />
          </div>
          <span className="hint">
            {!values.pais ? "Selecciona tu país primero" : "Solo el número local, sin lada"}
          </span>
          {fieldErrors.ladaCustom && <span className="field-error">{fieldErrors.ladaCustom}</span>}
          {fieldErrors.whatsapp && <span className="field-error">{fieldErrors.whatsapp}</span>}
        </div>
        <div className={`field${fieldErrors.email ? " has-error" : ""}`}>
          <label htmlFor="c-email">Email {demo ? "corporativo" : ""} <span className="req">*</span></label>
          <input id="c-email" name="email" type="email" value={values.email} onChange={update("email")} placeholder="nombre@empresa.com" required autoComplete="email" aria-invalid={fieldErrors.email ? "true" : undefined} />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="c-modelo">Modelo de negocio</label>
          <select id="c-modelo" name="modelo" value={values.modelo} onChange={update("modelo")}>
            <option value="" disabled>Elige tu modelo</option>
            {BUSINESS_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {demo && (
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="c-tamanio">Tamaño de la red / operación</label>
            <select id="c-tamanio" name="tamanio" value={values.tamanio} onChange={update("tamanio")}>
              <option value="" disabled>Selecciona</option>
              {TAMANIOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>¿Cuál se parece más a tu situación?</div>
        <div className="contact-grid" style={{ gap: 10 }}>
          {SITUACIONES.map((s) => (
            <button
              type="button"
              key={s.k}
              className={`choice ${situacion === s.k ? "is-active" : ""}`}
              onClick={() => setSituacion(s.k)}
              aria-pressed={situacion === s.k}
            >
              <span style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                border: "1.5px solid var(--nz-red)",
                background: situacion === s.k ? "var(--nz-red)" : "transparent",
                color: situacion === s.k ? "#fff" : "var(--nz-red)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12
              }}>{s.k}</span>
              <span style={{ fontSize: 13.5, lineHeight: 1.4 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
          {demo ? "Para preparar mejor tu demo" : "Cuéntanos un poco más de tu contexto"}
        </div>
        <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", margin: "0 0 12px" }}>
          {demo
            ? "Estos datos nos permiten llegar con propuestas específicas a tu situación. Contesta solo lo que aplique."
            : "Nos ayuda a llegar a la primera llamada con propuestas más aterrizadas. Puedes dejar en blanco lo que no aplique."}
        </p>
        <div className="contact-grid">
          <div className="field">
            <label htmlFor="c-role">Tu rol en la decisión</label>
            <select id="c-role" name="decision_role" value={values.decision_role} onChange={update("decision_role")}>
              <option value="">Sin especificar</option>
              {DECISION_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-budget">Presupuesto</label>
            <select id="c-budget" name="budget_readiness" value={values.budget_readiness} onChange={update("budget_readiness")}>
              <option value="">Sin especificar</option>
              {BUDGET_STAGES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-timeline">Ventana de decisión</label>
            <select id="c-timeline" name="timeline" value={values.timeline} onChange={update("timeline")}>
              <option value="">Sin especificar</option>
              {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-impl">Recursos de implementación</label>
            <select id="c-impl" name="implementation_readiness" value={values.implementation_readiness} onChange={update("implementation_readiness")}>
              <option value="">Sin especificar</option>
              {IMPLEMENTATION_READINESS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="field" style={{ marginTop: 18 }}>
        <label htmlFor="c-mensaje">¿Qué necesitas?</label>
        <textarea id="c-mensaje" name="mensaje" value={values.mensaje} onChange={update("mensaje")} placeholder={demo ? "Cuéntanos de tu operación para preparar un demo relevante" : "Cuéntanos brevemente tu situación y tu objetivo"} />
      </div>

      {/* Honeypot: los bots suelen llenar todos los inputs. Humanos no ven este campo. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Sitio web (no llenar)<input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update("website")} /></label>
      </div>

      <ConsentLine style={{ marginTop: 18 }} />

      {status === "error" && (
        <div role="alert" style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "var(--status-danger-tint, #fdecec)", color: "var(--status-danger, #b3261e)", fontSize: 13.5 }}>
          {errorMsg}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Button type="submit" size="lg" block disabled={sending} placement="submit-form">
          {sending ? "Enviando..." : demo ? LABELS.demo : LABELS.diagnostico}
        </Button>
      </div>
    </form>
  );
}

export default function Contacto({ demo = false }) {
  return (
    <>
      <div className="phero" style={{ borderBottom: "none", background: "var(--nz-white)" }}>
        <div className="phero__ring" style={{ width: 560, height: 560, right: -200, top: -240, opacity: 0.7 }} />
        <Breadcrumbs items={demo ? [{ label: "Contacto", to: "/contacto" }, { label: "Demo" }] : [{ label: "Contacto" }]} />
        <Container>
          <div className="cols-form" style={{ padding: "44px 0 72px" }}>
            <div className="anim-fade-up">
              <span className="eyebrow">{demo ? "Demo" : "Empieza por el diagnóstico"}</span>
              <h1 style={{ marginTop: 16 }}>
                {demo ? <>Ve la plataforma en acción, <span style={{ color: "var(--nz-red)" }}>de forma controlada</span></> : <>Empecemos por <span style={{ color: "var(--nz-red)" }}>entender tu operación</span></>}
              </h1>
              <p className="lead">
                {demo
                  ? "Te mostramos en breve qué resuelve la plataforma y cómo opera tu modelo. El demo completo es guiado y se reserva para prospectos calificados: teaser público + acceso restringido. Así protegemos la lógica premium de la plataforma."
                  : "La conversación empieza por tu alcance y necesidad real — no por precio. Cuéntanos dónde estás hoy y te proponemos el recorrido (plan, software, capacitación) a tu medida."}
              </p>

              {demo && (
                <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
                  <CheckLine>Qué verás: core comercial, Oficina Virtual, comisiones y NIA</CheckLine>
                  <CheckLine>Demo real agendado y guiado por un ejecutivo</CheckLine>
                  <CheckLine>Adaptado a tu modelo de negocio</CheckLine>
                </div>
              )}

              <div style={{ marginTop: 32 }}>
                <Steps items={demo ? [
                  { title: "Solicitas", description: "Llenas el formulario de calificación." },
                  { title: "Calificamos", description: "Validamos perfil y agendamos." },
                  { title: "Demo guiado", description: "Acceso controlado y temporal con un ejecutivo." },
                  { title: "Recorrido recomendado", description: "Un camino claro, no solo un producto." }
                ] : [
                  { title: "Envía el formulario", description: "La experiencia valida datos, consentimiento y origen." },
                  { title: "Te contactamos", description: "Por WhatsApp o correo, en horario hábil." },
                  { title: "Sesión de diagnóstico", description: "Videollamada corta sobre tu operación." },
                  { title: "Recorrido recomendado", description: "Un camino claro, no solo un producto." }
                ]} />
              </div>
            </div>
            <div className="anim-fade-up" style={{ animationDelay: "120ms" }}>
              <FormularioContacto demo={demo} />
            </div>
          </div>
        </Container>
      </div>

      <Section bg="page" tight style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading eyebrow="Otras formas de empezar" title="Elige tu puerta de entrada" />
        <div className="grid-3" style={{ marginTop: 36 }}>
          <Reveal>
            <Link to={demo ? "/contacto" : "/contacto/demo"} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}>
              <span className="bubble"><Icon name={demo ? "CalendarCheck" : "PlayCircle"} size={21} /></span>
              <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>{demo ? LABELS.diagnostico : LABELS.demo}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                {demo ? "La puerta de entrada al ecosistema: entendemos tu caso antes de proponer." : "Teaser público + demo real controlado para prospectos calificados."}
              </p>
              <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                {demo ? "Ir a diagnóstico" : "Solicitar demo"} <Icon name="ArrowRight" size={14} />
              </span>
            </Link>
          </Reveal>
          {HAS_WHATSAPP && (
            <Reveal delay={90}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="card card--hover"
                style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}
                onClick={() => trackEvent("whatsapp_click", { placement: "contact_card" })}
              >
                <span className="bubble" style={{ background: "#E8F8EE", color: "#1F7A4D" }}><Icon name="MessageCircle" size={21} /></span>
                <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>WhatsApp directo</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>Seguimiento con reglas claras, trazable hasta el CRM.</p>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                  Abrir WhatsApp <Icon name="ArrowUpRight" size={14} />
                </span>
              </a>
            </Reveal>
          )}
          <Reveal delay={180}>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
              <span className="bubble"><Icon name="MapPin" size={21} /></span>
              <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>Oficinas y datos</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                Teléfonos, correo y presencia internacional: México, LATAM, EE. UU., Canadá y Europa.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                <Badge tone="info">ES disponible</Badge>
                <Badge tone="neutral">Otros idiomas · Próximamente</Badge>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABand
        title={demo ? "¿Prefieres empezar por el diagnóstico?" : "¿Prefieres ver la plataforma primero?"}
        description="Los dos caminos llevan al mismo lugar: un recorrido a la medida de tu operación."
        primaryLabel={demo ? LABELS.diagnostico : LABELS.demo}
        primaryTo={demo ? "/contacto" : "/contacto/demo"}
        secondaryLabel="Ver soluciones"
        secondaryTo="/soluciones"
      />
    </>
  );
}
