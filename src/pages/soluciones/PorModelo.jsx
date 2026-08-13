// /soluciones/por-modelo — landing interactiva por modelo de negocio
// El selector cambia en vivo la landing de ejemplo (plantilla para /soluciones/[modelo]).
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, CheckLine, MockFrame, MockBars, TagChip } from "../../components/ui.jsx";
import { PageHero, CTABand, Breadcrumbs } from "../../components/chrome.jsx";
import { MODELOS_NEGOCIO, MODELOS_ORDER } from "./data.js";
import { Container } from "../../components/ui.jsx";

export default function PorModelo() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("modelo");
  const [modelo, setModelo] = useState(MODELOS_NEGOCIO[initial] ? initial : "venta-directa");
  const m = MODELOS_NEGOCIO[modelo];

  useEffect(() => {
    const p = params.get("modelo");
    if (p && MODELOS_NEGOCIO[p]) setModelo(p);
  }, [params]);

  const pick = (slug) => { setModelo(slug); setParams({ modelo: slug }, { replace: true }); };

  return (
    <>
      <div className="phero">
        <div className="phero__ring" style={{ width: 520, height: 520, right: -180, top: -220, opacity: 0.7 }} />
        <Breadcrumbs items={[{ label: "Soluciones", to: "/soluciones" }, { label: "Por modelo de negocio" }]} />
        <Container>
          <div style={{ padding: "56px 0 30px", maxWidth: 780 }} className="anim-fade-up">
            <span className="eyebrow">Por modelo de negocio · landings dedicadas</span>
            <h1 style={{ marginTop: 16, fontSize: "clamp(32px,4vw,46px)", fontWeight: 800, lineHeight: 1.1 }}>
              Una plataforma para <span style={{ color: "var(--nz-red)" }}>tu modelo de negocio</span>
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              Netzen no es solo multinivel: opera cualquier modelo de comercialización. Elige tu modelo y mira cómo se ve su recorrido.
            </p>
          </div>
          <div className="anim-fade-up" style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingBottom: 44, animationDelay: "120ms" }}>
            {MODELOS_ORDER.map((slug) => (
              <TagChip key={slug} active={slug === modelo} onClick={() => pick(slug)} icon={MODELOS_NEGOCIO[slug].icon}>
                {MODELOS_NEGOCIO[slug].name}
              </TagChip>
            ))}
          </div>
        </Container>
      </div>

      {/* ===== landing del modelo activo ===== */}
      <div key={modelo} className="anim-fade-up">
        <Section bg="page">
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <div>
              <span className="badge badge--accent">{m.name}</span>
              <h2 style={{ marginTop: 16, fontSize: "clamp(26px,3.2vw,36px)", fontWeight: 800, lineHeight: 1.12 }}>
                Software para {m.name.toLowerCase()}
              </h2>
              <p className="lead" style={{ marginTop: 16 }}>{m.hero}</p>
              <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Button size="lg" to="/contacto/demo">Solicita un demo protegido</Button>
                <Button size="lg" variant="secondary" to="/contacto">Agenda tu diagnóstico</Button>
              </div>
            </div>
            <MockFrame url={`app.netzen.mx/${modelo}`}>
              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span className="bubble bubble--sm"><Icon name={m.icon} size={15} /></span>
                  <b style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>{m.name} · vista del producto</b>
                </div>
                <MockBars heights={[46, 64, 52, 82, 60, 92, 74]} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
                  {m.capacidades.slice(0, 3).map((c) => (
                    <div key={c} style={{ background: "var(--nz-chalk)", borderRadius: 10, padding: "9px 11px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{c}</div>
                  ))}
                </div>
              </div>
            </MockFrame>
          </div>
        </Section>

        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="Cómo funciona" title={`Cómo Netzen opera tu ${m.name.toLowerCase()}`} />
          <div className="grid-3" style={{ marginTop: 40 }}>
            {m.opera.map((o, i) => (
              <Reveal key={o.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span className="bubble"><Icon name={o.icon} size={21} /></span>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{o.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{o.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="grid-2" style={{ marginTop: 40, gap: 40 }}>
            <Reveal style={{ display: "grid", gap: 13 }}>
              {m.capacidades.slice(0, 3).map((c) => <CheckLine key={c}>{c}</CheckLine>)}
            </Reveal>
            <Reveal delay={100} style={{ display: "grid", gap: 13 }}>
              {m.capacidades.slice(3).map((c) => <CheckLine key={c}>{c}</CheckLine>)}
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p style={{ marginTop: 34, fontSize: 14, color: "var(--text-secondary)" }}>
              Cada landing enlaza a los módulos que más importan a su modelo:{" "}
              <Link to="/plataforma" style={{ fontWeight: 700 }}>Ver Plataforma →</Link>{" · "}
              <Link to="/consulting" style={{ fontWeight: 700 }}>Ver Consulting →</Link>
            </p>
          </Reveal>
        </Section>
      </div>

      <CTABand
        title={`Lleva tu ${m.name.toLowerCase()} a una sola plataforma`}
        description="La conversación empieza por entender tu operación y mostrarte el producto; el precio llega después del diagnóstico."
        primaryLabel="Solicita un demo protegido"
        primaryTo="/contacto/demo"
        secondaryLabel="Agenda tu diagnóstico"
        secondaryTo="/contacto"
      />
    </>
  );
}
