// /contacto y /contacto/demo — punto de conversión (formulario → CRM)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Steps, Badge, CheckLine, ConsentLine } from "../../components/ui.jsx";
import { Breadcrumbs, CTABand } from "../../components/chrome.jsx";
import { Container } from "../../components/ui.jsx";
import { WHATSAPP_URL } from "../../lib/nav.js";
import { trackEvent } from "../../lib/analytics.js";

const SITUACIONES = [
  { k: "A", label: "Apenas empiezo / explorando" },
  { k: "B", label: "Empresa establecida que busca escalar" },
  { k: "C", label: "Profesionalizar mi red de distribuidores" },
  { k: "D", label: "Ya tengo software propio / modernizar" }
];

const MODELOS = ["Venta directa", "Multinivel", "Retail", "Franquicias", "E-commerce", "Punto de venta"];

function FormularioContacto({ demo }) {
  const [sent, setSent] = useState(false);
  const [situacion, setSituacion] = useState("A");

  if (sent) {
    return (
      <div className="card card--pad-lg" style={{ textAlign: "center", boxShadow: "var(--shadow-md)" }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Check" size={30} strokeWidth={2.4} style={{ color: "var(--status-success)" }} />
        </span>
        <h2 style={{ marginTop: 20, fontSize: 24, fontWeight: 700 }}>Solicitud validada</h2>
        <p style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          La experiencia de envío quedó completa. Cuando se conecte esta versión con el CRM, el equipo podrá dar seguimiento a tu {demo ? "demo protegido" : "diagnóstico"} por WhatsApp o correo.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setSent(false)}>Enviar otra solicitud</Button>
          <Button variant="ghost" to="/">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card card--pad-lg"
      onSubmit={(e) => {
        e.preventDefault();
        trackEvent("form_submit", {
          form_type: demo ? "demo_protegido" : "diagnostico",
          route: situacion
        });
        setSent(true);
      }}
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>{demo ? "Formulario de calificación" : "Solicita tu diagnóstico"}</h3>
      <div className="contact-grid">
        <div className="field"><label>{demo ? "Nombre y cargo" : "Nombre completo"} <span className="req">*</span></label><input placeholder={demo ? "Nombre · Dirección / Operaciones" : "Ej. Ana Torres"} required /></div>
        <div className="field"><label>Empresa <span className="req">*</span></label><input placeholder="Nombre de tu empresa" required /></div>
        <div className="field"><label>WhatsApp</label><input type="tel" placeholder="+52 33 1234 5678" /><span className="hint">Con código de país</span></div>
        <div className="field"><label>Email {demo ? "corporativo" : ""} <span className="req">*</span></label><input type="email" placeholder="ana@empresa.com" required /></div>
        <div className="field">
          <label>País</label>
          <select defaultValue=""><option value="" disabled>Elige tu país</option>{["México", "Colombia", "Perú", "Ecuador", "Estados Unidos", "Otro"].map((p) => <option key={p}>{p}</option>)}</select>
        </div>
        <div className="field">
          <label>Modelo de negocio</label>
          <select defaultValue=""><option value="" disabled>Elige tu modelo</option>{MODELOS.map((m) => <option key={m}>{m}</option>)}</select>
        </div>
        {demo && (
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Tamaño de la red / operación</label>
            <select defaultValue=""><option value="" disabled>Selecciona</option>{["Menos de 100 distribuidores", "100 – 1,000", "1,000 – 10,000", "Más de 10,000"].map((t) => <option key={t}>{t}</option>)}</select>
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
      <div className="field" style={{ marginTop: 18 }}>
        <label>¿Qué necesitas?</label>
        <textarea placeholder={demo ? "Cuéntanos de tu operación para preparar un demo relevante" : "Cuéntanos brevemente tu situación y tu objetivo"} />
      </div>
      <ConsentLine style={{ marginTop: 18 }} />
      <div style={{ marginTop: 20 }}>
        <Button size="lg" block>{demo ? "Solicitar demo protegido" : "Agenda tu diagnóstico"}</Button>
      </div>
      <p style={{ marginTop: 12, fontSize: 11.5, color: "var(--text-tertiary)", textAlign: "center" }}>
        Integración preparada para atribución por canal. La conexión final al CRM está pendiente.
      </p>
    </form>
  );
}

export default function Contacto({ demo = false }) {
  return (
    <>
      <div className="phero" style={{ borderBottom: "none", background: "var(--nz-white)" }}>
        <div className="phero__ring" style={{ width: 560, height: 560, right: -200, top: -240, opacity: 0.7 }} />
        <Breadcrumbs items={demo ? [{ label: "Contacto", to: "/contacto" }, { label: "Demo protegido" }] : [{ label: "Contacto" }]} />
        <Container>
          <div className="cols-form" style={{ padding: "44px 0 72px" }}>
            <div className="anim-fade-up">
              <span className="eyebrow">{demo ? "Demo protegido" : "Empieza por el diagnóstico"}</span>
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
              <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>{demo ? "Agenda tu diagnóstico" : "Solicita un demo protegido"}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                {demo ? "La puerta de entrada al ecosistema: entendemos tu caso antes de proponer." : "Teaser público + demo real controlado para prospectos calificados."}
              </p>
              <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                {demo ? "Ir a diagnóstico" : "Solicitar demo"} <Icon name="ArrowRight" size={14} />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
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
        primaryLabel={demo ? "Agenda tu diagnóstico" : "Solicita un demo protegido"}
        primaryTo={demo ? "/contacto" : "/contacto/demo"}
        secondaryLabel="Ver soluciones"
        secondaryTo="/soluciones"
      />
    </>
  );
}
