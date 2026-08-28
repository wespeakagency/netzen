// /recursos/blog/articulo — plantilla de detalle de artículo
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Section, Reveal, Container, Badge, ConsentLine } from "../../components/ui.jsx";
import { Breadcrumbs, CTABand } from "../../components/chrome.jsx";
import { ARTICULOS } from "./data.js";
import { Newsletter } from "./Hub.jsx";
import { trackEvent } from "../../lib/analytics.js";
import { submitLead, FormSubmitError } from "../../lib/forms.js";

function LeadMagnet() {
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
    trackEvent("form_submit", { form_type: "lead_magnet_articulo" });
    try {
      await submitLead({
        formType: "lead_magnet_articulo",
        honeypot: website,
        renderedAt,
        fields: { nombre, email, articulo: "omnicanalidad-real" }
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof FormSubmitError ? err.message : "Hubo un problema. Intentá de nuevo.");
    }
  };

  return (
    <div className="card card--pad-lg" style={{ borderColor: "var(--nz-red-tint-strong)", background: "var(--nz-red-wash)", margin: "34px 0" }}>
      {status === "sent" ? (
        <div style={{ textAlign: "center" }}>
          <span style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Check" size={26} style={{ color: "var(--status-success)" }} />
          </span>
          <h3 style={{ marginTop: 14, fontSize: 19, fontWeight: 700 }}>¡Recibimos tu solicitud!</h3>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>Te enviamos la guía a <strong>{email}</strong> en los próximos minutos.</p>
        </div>
      ) : (
        <>
          <Badge tone="accent">Descarga gratuita</Badge>
          <h3 style={{ marginTop: 12, fontSize: 21, fontWeight: 800 }}>Guía: cómo conectar tus canales en una sola operación</h3>
          <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Recibe el PDF con el checklist de omnicanalidad para empresas de venta directa. Te lo enviamos por correo.
          </p>
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ marginTop: 18, display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr auto", alignItems: "end" }}
            className="leadmagnet-form"
          >
            <div className="field">
              <label htmlFor="lm-nombre">Nombre</label>
              <input id="lm-nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="lm-email">Correo corporativo</label>
              <input id="lm-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@empresa.com" required autoComplete="email" />
            </div>
            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              <Icon name="Download" size={16} /> {status === "sending" ? "Enviando..." : "Descargar guía"}
            </button>
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label>Sitio web (no llenar)<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
            </div>
            <ConsentLine compact style={{ gridColumn: "1 / -1" }} />
            {status === "error" && (
              <div role="alert" style={{ gridColumn: "1 / -1", padding: "8px 12px", borderRadius: 8, background: "var(--status-danger-tint, #fdecec)", color: "var(--status-danger, #b3261e)", fontSize: 13 }}>
                {errorMsg}
              </div>
            )}
          </form>
          <p style={{ marginTop: 12, fontSize: 11.5, color: "var(--text-tertiary)" }}>
            La descarga genera un contacto atribuido al artículo y a su canal de origen. <Link to="/recursos/guias">Ver todas las guías →</Link>
          </p>
        </>
      )}
    </div>
  );
}

const TOC = ["Qué es la omnicanalidad", "Canales y mercados conectados", "Beneficios para escalar", "Cómo lo opera Netzen"];

export default function Articulo() {
  return (
    <>
      <div className="phero" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <Breadcrumbs items={[{ label: "Recursos", to: "/recursos" }, { label: "Blog", to: "/recursos/blog" }, { label: "Omnicanalidad real" }]} />
        <Container>
          <div style={{ maxWidth: 780, padding: "44px 0 40px" }} className="anim-fade-up">
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Badge tone="accent">Omnicanalidad</Badge>
              <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>28 de junio de 2026 · Equipo Netzen · 7 min de lectura</span>
            </div>
            <h1 style={{ marginTop: 16, fontSize: "clamp(30px,3.8vw,42px)", fontWeight: 800, lineHeight: 1.14 }}>
              Omnicanalidad real: integrar venta directa, retail y e-commerce en una sola operación
            </h1>
          </div>
        </Container>
      </div>

      <Section bg="page">
        <div className="cols-article">
          <article className="article">
            <div style={{
              aspectRatio: "16/7", borderRadius: 20, marginBottom: 34,
              background: "linear-gradient(130deg, var(--nz-blue-tint), var(--nz-red-tint))",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span className="bubble bubble--lg" style={{ background: "rgba(255,255,255,0.85)" }}><Icon name="Globe" size={28} /></span>
            </div>

            <h2 id="s1">Qué significa omnicanalidad</h2>
            <p>
              La omnicanalidad integra canales y mercados —venta directa, retail, e-commerce, punto de venta y otros— en una sola operación
              conectada. No se trata de tener varios canales sueltos, sino de que compartan catálogo, inventario, precios y datos de la red.
            </p>
            <blockquote>
              No es «vender en varios lugares»: es operar todos tus canales como un solo negocio.
            </blockquote>

            <h2 id="s2">Canales y mercados conectados</h2>
            <p>
              Cuando cada canal opera con su propio sistema, la empresa termina reconciliando información a mano: inventarios que no cuadran,
              promociones que no llegan a todos los puntos y comisiones que no reconocen la venta digital. Una operación conectada elimina
              esas islas: el pedido de e-commerce descuenta el mismo inventario que el punto de venta y alimenta el mismo motor de comisiones.
            </p>

            <h2 id="s3">Beneficios para escalar y profesionalizar</h2>
            <p>
              Para una empresa establecida, la omnicanalidad es la diferencia entre crecer sumando complejidad o crecer sumando ventas.
              Con un solo catálogo, reglas por canal y datos consolidados, abrir un mercado nuevo deja de ser un proyecto de sistemas
              y se vuelve una decisión comercial.
            </p>

            <LeadMagnet />

            <h2 id="s4">Cómo lo opera la plataforma Netzen</h2>
            <p>
              El core comercial de la plataforma opera todos los canales desde un mismo lugar: catálogos y precios por canal, promociones
              sincronizadas, inventario en tiempo real y comisiones que reconocen cada venta sin importar dónde ocurrió.
            </p>
            <p>
              Tema relacionado en producto: <Link to="/plataforma/software-netzen" style={{ fontWeight: 700 }}>Plataforma · Software Netzen</Link> opera
              todos los canales desde un mismo lugar. <Link to="/plataforma/software-netzen">Ver módulo →</Link>
            </p>
          </article>

          <aside style={{ position: "sticky", top: 130 }}>
            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 12 }}>En este artículo</div>
              <div style={{ display: "grid", gap: 4 }}>
                {TOC.map((t, i) => (
                  <a key={t} href={`#s${i + 1}`} style={{ display: "flex", gap: 10, padding: "7px 10px", borderRadius: 8, fontSize: 13.5, color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nz-red-wash)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <span style={{ color: "var(--nz-red)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section bg="card" tight style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>Artículos relacionados</div>
        <div className="grid-3">
          {ARTICULOS.slice(1, 4).map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <Link to="/recursos/blog/articulo" className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 10, color: "inherit", height: "100%" }}>
                <Badge tone="neutral">{a.cat}</Badge>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35 }}>{a.title}</h3>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "var(--nz-red)" }}>
                  Leer <Icon name="ArrowRight" size={13} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="page" tight>
        <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Boletín</div>
            <h2 style={{ fontSize: 26, fontWeight: 800 }}>Suscríbete al boletín</h2>
            <p style={{ marginTop: 10, fontSize: 15, color: "var(--text-secondary)" }}>Recibe los artículos nuevos en tu correo.</p>
          </div>
          <Newsletter compact />
        </div>
      </Section>

      <CTABand
        title="¿Quieres llevar esto a tu operación?"
        description="Agenda un diagnóstico con un especialista."
        primaryLabel="Agenda tu diagnóstico"
        primaryTo="/contacto"
        secondaryLabel="Más artículos"
        secondaryTo="/recursos/blog"
      />
    </>
  );
}
