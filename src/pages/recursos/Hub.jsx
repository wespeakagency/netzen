// /recursos — centro de contenidos
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge, ConsentLine } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { trackEvent } from "../../lib/analytics.js";
import { submitLead, FormSubmitError } from "../../lib/forms.js";
import { isRouteEnabled } from "../../lib/featureFlags.js";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

const ALL_FORMATOS = [
  { to: "/recursos/blog", icon: "Newspaper", title: "Blog", badge: null, desc: "Artículos sobre industria, omnicanalidad, fidelización, regulación y crecimiento comercial." },
  { to: "/recursos/casos", icon: "Trophy", title: "Casos de éxito", badge: ["warning", "Con permiso del cliente"], desc: "Testimonios y relaciones de 10–15 años con clientes como evidencia de resultados." },
  { to: "/recursos/guias", icon: "FileText", title: "Guías y descargables", badge: ["accent", "Lead magnet"], desc: "Checklists, plantillas y guías en PDF: la experiencia queda preparada para atribución por canal." },
  { to: "/recursos/glosario", icon: "BookMarked", title: "Glosario", badge: null, desc: "Términos de la industria de la A a la Z para SEO y claridad: omnicanalidad, fidelización, genealogía." },
  { to: "/recursos/webinars", icon: "Video", title: "Webinars y eventos", badge: null, desc: "Grabaciones, sesiones en vivo y vínculo al evento de industria 2027." }
];
const FORMATOS = ALL_FORMATOS.filter((f) => isRouteEnabled(f.to));

function FormatoCard({ f }) {
  return (
    <Link to={f.to} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span className="bubble"><Icon name={f.icon} size={21} /></span>
        {f.badge && <Badge tone={f.badge[0]}>{f.badge[1]}</Badge>}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700 }}>{f.title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{f.desc}</p>
      <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
        Ver {f.title.toLowerCase().split(" ")[0]} <Icon name="ArrowRight" size={14} />
      </span>
    </Link>
  );
}

function Newsletter({ compact }) {
  const renderedAt = useMemo(() => Date.now(), []);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    trackEvent("form_submit", { form_type: "newsletter" });
    try {
      await submitLead({
        formType: "newsletter",
        honeypot: website,
        renderedAt,
        fields: { nombre, email }
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof FormSubmitError ? err.message : "Hubo un problema. Intentá de nuevo.");
    }
  };

  return (
    <form className="card card--pad-lg" onSubmit={handleSubmit} noValidate style={{ boxShadow: "var(--shadow-md)" }}>
      {status === "sent" ? (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <span style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Check" size={26} style={{ color: "var(--status-success)" }} />
          </span>
          <h3 style={{ marginTop: 14, fontSize: 19, fontWeight: 700 }}>¡Listo, quedaste suscrito!</h3>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>Vas a recibir el contenido nuevo directo en tu correo.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="bubble"><Icon name="Mail" size={20} /></span>
            <h3 style={{ fontSize: 19, fontWeight: 700 }}>Recibe el contenido nuevo por correo</h3>
          </div>
          <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Suscríbete y recibe artículos, guías y avisos de webinars.
          </p>
          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            {!compact && (
              <div className="field">
                <label htmlFor="nl-nombre">Nombre</label>
                <input id="nl-nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="María González" autoComplete="name" />
              </div>
            )}
            <div className="field">
              <label htmlFor="nl-email">Correo corporativo <span className="req">*</span></label>
              <input id="nl-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" required autoComplete="email" />
            </div>
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label>Sitio web (no llenar)<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
            </div>
            <ConsentLine compact />
            {status === "error" && (
              <div role="alert" style={{ padding: "8px 12px", borderRadius: 8, background: "var(--status-danger-tint, #fdecec)", color: "var(--status-danger, #b3261e)", fontSize: 13 }}>
                {errorMsg}
              </div>
            )}
            <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
              {status === "sending" ? "Enviando..." : "Suscribirme"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export { Newsletter };

export default function RecursosHub() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos" }]}
        eyebrow="Centro de recursos"
        title={<>Contenido que <span style={{ color: "var(--nz-red)" }}>educa al mercado</span> y convierte visitantes en prospectos</>}
        lead="Artículos, casos de éxito, guías descargables, glosario y webinars. El centro de contenidos posiciona a Netzen en buscadores, resuelve dudas y prepara oportunidades con origen medible."
        actions={<>
          {isRouteEnabled("/recursos/guias")
            ? <Button size="lg" to="/recursos/guias">Descarga una guía</Button>
            : <Button size="lg" to="/recursos/blog">Ver el blog</Button>}
          <Button size="lg" variant="secondary" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
        </>}
        aside={<Newsletter />}
      />

      <Section bg="page">
        <SectionHeading
          eyebrow="Nivel 2 · Tipos de recurso"
          title="Explora por formato"
          lead="Cada tipo de contenido tiene su propia ruta y su propia función: educar, demostrar o convertir."
        />
        <div
          className={FORMATOS.length === 2 ? "grid-2" : "grid-3"}
          style={{ marginTop: 44 }}
        >
          {FORMATOS.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <FormatoCard f={f} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Cómo se conecta con los otros núcleos" />
        <div className="grid-2" style={{ marginTop: 32 }}>
          {[
            (isRouteEnabled("/recursos/webinars") && isRouteEnabled("/nosotros/eventos"))
              ? { icon: "Video", text: <><b>Recursos · Webinars</b> → reutiliza contenido de demos y Academy, y vincula a Nosotros · Eventos (reactivación del evento de industria 2027).</>, to: "/nosotros/eventos", label: "Ver Eventos" }
              : null,
            isRouteEnabled("/recursos/guias")
              ? { icon: "FileText", text: <><b>Recursos · Guías</b> → cada descarga queda preparada para conectar el interés con un diagnóstico atribuido.</>, to: "/contacto", label: "Ver Contacto" }
              : { icon: "Newspaper", text: <><b>Recursos · Blog</b> → contenido editorial que educa al mercado y prepara la conversación de diagnóstico.</>, to: "/contacto", label: "Ver Contacto" }
          ].filter(Boolean).map((c, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
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
        title="¿Listo para pasar del contenido a la acción?"
        description="Agenda un diagnóstico y convierte lo aprendido en un plan concreto."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel={isRouteEnabled("/recursos/guias") ? "Ver guías" : "Ver el blog"}
        secondaryTo={isRouteEnabled("/recursos/guias") ? "/recursos/guias" : "/recursos/blog"}
      />
    </>
  );
}
