// /recursos/webinars — sesiones en vivo y biblioteca on-demand
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, TagChip, Badge, Steps, ConsentLine } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { WEBINARS, GRABACIONES } from "./data.js";
import { trackEvent } from "../../lib/analytics.js";

const TEMAS = ["Todos", "Industria", "Tecnología / plataforma", "Academy", "Consulting", "Casos"];

function RegistroForm() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="card card--pad-lg" style={{ textAlign: "center", boxShadow: "var(--shadow-md)" }}>
        <span style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Check" size={28} style={{ color: "var(--status-success)" }} />
        </span>
        <h3 style={{ marginTop: 16, fontSize: 20, fontWeight: 700 }}>Registro validado</h3>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          El envío de accesos, recordatorios y grabaciones se activará al conectar esta versión con el CRM.
        </p>
      </div>
    );
  }
  return (
    <form
      className="card card--pad-lg"
      onSubmit={(e) => {
        e.preventDefault();
        trackEvent("form_submit", { form_type: "webinar" });
        setSent(true);
      }}
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 16 }}>Formulario de registro</h3>
      <div style={{ display: "grid", gap: 14 }}>
        <div className="field"><label>Nombre <span className="req">*</span></label><input placeholder="Nombre y apellido" required /></div>
        <div className="field"><label>Empresa</label><input placeholder="Nombre de tu empresa" /></div>
        <div className="field"><label>Correo corporativo <span className="req">*</span></label><input type="email" placeholder="correo@empresa.com" required /></div>
        <div className="field">
          <label>¿Qué webinar te interesa?</label>
          <select defaultValue="">
            <option value="" disabled>Selecciona</option>
            {WEBINARS.map((w) => <option key={w.title}>{w.title}</option>)}
          </select>
        </div>
        <ConsentLine compact />
        <Button block>Registrarme</Button>
        <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", margin: 0, textAlign: "center" }}>Integración preparada para atribución por canal.</p>
      </div>
    </form>
  );
}

export default function Webinars() {
  const [tema, setTema] = useState("Todos");
  const list = tema === "Todos" ? GRABACIONES : GRABACIONES.filter((g) => g.cat === tema);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos", to: "/recursos" }, { label: "Webinars y eventos" }]}
        eyebrow="Recursos · Webinars y eventos"
        title={<>Sesiones en vivo y grabaciones para <span style={{ color: "var(--nz-red)" }}>dominar la industria</span></>}
        lead="Tecnología, profesionalización de redes de distribuidores y estrategia. Reutilizan contenido de los demos y de Academy, y conectan con el evento de industria que Netzen busca reactivar en 2027."
        actions={<>
          <Button size="lg" onClick={() => document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" })}>Regístrate al próximo webinar</Button>
          <Button size="lg" variant="secondary" to="/recursos">Ver todos los recursos</Button>
        </>}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Próximos webinars" title="Sesiones en vivo con registro" lead="Fechas y ponentes se anuncian al confirmar cada sesión." />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {WEBINARS.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <div className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                <div style={{
                  aspectRatio: "16/8", borderRadius: 12, position: "relative",
                  background: "linear-gradient(140deg, var(--nz-blue), var(--nz-blue-600))",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(245,245,245,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={w.icon} size={23} style={{ color: "#F5F5F5" }} />
                  </span>
                  <span className="badge badge--accent" style={{ position: "absolute", top: 12, left: 12 }}>En vivo</span>
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.35 }}>{w.title}</h3>
                <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{w.meta}</span>
                <span
                  onClick={() => document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)", cursor: "pointer" }}
                >
                  Registrarme <Icon name="ArrowRight" size={14} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading eyebrow="A tu ritmo" title="Grabaciones disponibles (on-demand)" lead="Biblioteca de sesiones pasadas. Filtra por tema; cada reproducción puede pedir registro para descargar materiales." />
        <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TEMAS.map((t) => <TagChip key={t} active={tema === t} onClick={() => setTema(t)}>{t}</TagChip>)}
        </div>
        <div key={tema} className="grid-2 anim-fade-up" style={{ marginTop: 30 }}>
          {list.map((g) => (
            <div key={g.title} className="card card--hover" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{
                width: 52, height: 52, borderRadius: "50%", background: "var(--nz-red-tint)", color: "var(--nz-red)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer",
                transition: "transform 180ms var(--ease-out)"
              }}>
                <Icon name="PlayCircle" size={26} />
              </span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35 }}>{g.title}</h3>
                <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>{g.dur} · {g.cat}</span>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && <p style={{ marginTop: 18, color: "var(--text-tertiary)", fontSize: 14 }}>Pronto habrá grabaciones de este tema.</p>}
      </Section>

      <Section bg="page" id="registro">
        <div className="grid-2" style={{ gap: 56, alignItems: "start" }}>
          <div>
            <SectionHeading eyebrow="Regístrate" title="Recibe el acceso al webinar en vivo y la grabación posterior" />
            <Reveal delay={120} style={{ marginTop: 30 }}>
              <Steps items={[
                { title: "Te registras", description: "Llenas un formulario corto." },
                { title: "Recibes el acceso", description: "Enlace por correo y recordatorio por WhatsApp." },
                { title: "Acceso a la grabación", description: "Y material complementario descargable." }
              ]} />
            </Reveal>
          </div>
          <Reveal variant="right" delay={80}><RegistroForm /></Reveal>
        </div>
      </Section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Cómo se conecta con el ecosistema" />
        <div className="grid-2" style={{ marginTop: 30 }}>
          {[
            { icon: "GraduationCap", text: <><b>Webinars</b> → reutiliza contenido de demos y Academy: el material en vivo se transforma en biblioteca y en lead magnets.</>, to: "/academy", label: "Ver Academy" },
            { icon: "CalendarDays", text: <><b>Webinars → Nosotros · Eventos</b>: vincula con la reactivación del evento de industria 2027 (con patrocinadores).</>, to: "/nosotros/eventos", label: "Ver Eventos" }
          ].map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={c.icon} size={19} /></span>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{c.text}</p>
                </div>
                <Link to={c.to} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                  {c.label} <Icon name="ArrowRight" size={15} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="¿Prefieres una sesión 1 a 1?"
        description="Agenda un diagnóstico y resolvemos tu caso concreto."
        primaryLabel="Agenda tu diagnóstico"
        primaryTo="/contacto"
        secondaryLabel="Ver recursos"
        secondaryTo="/recursos"
      />
    </>
  );
}
