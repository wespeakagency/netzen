// /plataforma/:slug — plantilla de detalle de módulo
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, MockFrame, MockBars, CheckLine, Badge, Steps } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { MODULOS } from "./data.js";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

/* ---------- mocks por tipo ---------- */
function ChatMock() {
  return (
    <MockFrame url="app.netzen.mx/nia">
      <div style={{ padding: 18, display: "grid", gap: 12 }}>
        <div style={{ justifySelf: "end", maxWidth: "82%", background: "var(--nz-red)", color: "#fff", borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: 13.5 }}>
          ¿Cómo van las ventas de este mes por sucursal?
        </div>
        <div style={{ justifySelf: "start", maxWidth: "88%", background: "var(--nz-chalk)", borderRadius: "16px 16px 16px 4px", padding: "12px 14px", fontSize: 13 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span className="bubble bubble--sm" style={{ width: 24, height: 24 }}><Icon name="Bot" size={13} /></span>
            <b style={{ fontFamily: "var(--font-display)", fontSize: 12 }}>NIA</b>
          </div>
          Ventas de julio: <b>$2.84M</b> (+9.6% vs. junio). Guadalajara lidera con $912k; CDMX crece 14%.
          <MockBars heights={[42, 68, 55, 88]} />
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", display: "flex", gap: 12 }}>
            <span>GDL</span><span>CDMX</span><span>MTY</span><span>Online</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", border: "1.5px solid var(--border-strong)", borderRadius: 999, padding: "8px 14px", fontSize: 13, color: "var(--text-tertiary)" }}>
          Pregunta a tus datos… <span style={{ marginLeft: "auto", animation: "nzBlink 1.2s infinite" }}>|</span>
        </div>
      </div>
    </MockFrame>
  );
}

function TableMock({ label }) {
  const rows = [
    ["2×1 catálogo verano", "Activa", "+18%", "success"],
    ["Envío gratis +$999", "Activa", "+11%", "success"],
    ["Kit bienvenida", "Programada", "—", "info"],
    ["Liquidación T4", "Cerrada", "+6%", "neutral"]
  ];
  return (
    <MockFrame url="app.netzen.mx/promociones">
      <div style={{ padding: 18 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{label}</div>
        <div style={{ display: "grid", gap: 8 }}>
          {rows.map(([name, st, impact, tone], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--nz-chalk)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
              <span style={{ fontWeight: 700, flex: 1 }}>{name}</span>
              <Badge tone={tone}>{st}</Badge>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: impact === "—" ? "var(--text-tertiary)" : "var(--status-success)" }}>{impact}</span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function StoreMock() {
  return (
    <MockFrame url="ana-torres.netzen.store">
      <div style={{ padding: 18, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="bubble" style={{ width: 40, height: 40 }}><Icon name="CircleUser" size={20} /></span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13.5 }}>Tienda de Ana Torres</div>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>Distribuidora independiente · Nivel Oro</div>
          </div>
          <span className="badge badge--success" style={{ marginLeft: "auto" }}>En línea</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {["Red activa|248", "Comisión del mes|$18,420", "Pedidos|56"].map((s) => {
            const [k, v] = s.split("|");
            return (
              <div key={k} style={{ background: "var(--nz-chalk)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{k}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15 }}>{v}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ borderRadius: 10, border: "1px solid var(--border-default)", overflow: "hidden" }}>
              <div style={{ aspectRatio: "1", background: `linear-gradient(135deg, var(--nz-blue-tint), var(--nz-red-tint))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Package" size={18} style={{ color: "var(--nz-blue-500)" }} />
              </div>
              <div style={{ padding: "6px 8px", fontSize: 10.5, color: "var(--text-secondary)" }}>Producto {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function ArchMock() {
  return (
    <MockFrame url="infraestructura.netzen.mx">
      <div style={{ padding: 22, display: "grid", gap: 10, justifyItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["Tienda", "Oficina Virtual", "POS"].map((t) => (
            <span key={t} className="tag" style={{ fontSize: 12 }}>{t}</span>
          ))}
        </div>
        <Icon name="ChevronDown" size={16} style={{ color: "var(--nz-gray-400)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px solid var(--nz-red)", borderRadius: 14, padding: "12px 22px", background: "var(--nz-red-wash)" }}>
          <Icon name="Server" size={18} style={{ color: "var(--nz-red)" }} />
          <b style={{ fontFamily: "var(--font-display)", fontSize: 13.5 }}>Servidor dedicado por cliente</b>
        </div>
        <Icon name="ChevronDown" size={16} style={{ color: "var(--nz-gray-400)" }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {[["Database", "Respaldos"], ["Eye", "Monitoreo"], ["Lock", "Accesos"], ["TrendingUp", "Escalamiento"]].map(([ic, t]) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid var(--border-default)", borderRadius: 999, padding: "7px 14px", fontSize: 12.5, background: "var(--nz-white)" }}>
              <Icon name={ic} size={14} style={{ color: "var(--nz-blue-500)" }} />{t}
            </span>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function CycleMock({ ciclo = [] }) {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>El ciclo de instalación</div>
      <Steps compact items={ciclo.slice(0, 4).map((c) => ({ title: c.title }))} />
      <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--text-tertiary)" }}>…y soporte continuo después del arranque.</div>
    </div>
  );
}

function CardsMock({ catalogo = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {catalogo.map((c, i) => (
        <div key={c.name} className="card card--hover" style={{ padding: 18, animation: `nzFloat 6s ease-in-out ${i * 0.7}s infinite` }}>
          <span className="bubble" style={{ width: 38, height: 38 }}><Icon name={c.icon} size={17} /></span>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginTop: 10 }}>{c.name}</div>
          <div style={{ marginTop: 6 }}><Badge tone={c.tone}>{c.badge}</Badge></div>
        </div>
      ))}
    </div>
  );
}

function ModuleMock({ m }) {
  switch (m.mock) {
    case "chat": return <ChatMock />;
    case "table": return <TableMock label={m.mockLabel} />;
    case "store": return <StoreMock />;
    case "arch": return <ArchMock />;
    case "cycle": return <CycleMock ciclo={m.ciclo} />;
    case "cards": return <CardsMock catalogo={m.catalogo} />;
    default:
      return (
        <MockFrame url="app.netzen.mx">
          <div style={{ padding: 18 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{m.mockLabel}</div>
            <MockBars />
            <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, color: "var(--text-tertiary)" }}>
              <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </MockFrame>
      );
  }
}

function ConexionCard({ conexion }) {
  return (
    <Reveal>
      <div className="card" style={{ borderColor: "var(--nz-red-tint-strong)", background: "var(--nz-white)", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
        <span className="bubble"><Icon name={conexion.icon} size={21} /></span>
        <div style={{ flex: 1, minWidth: "min(260px, 100%)" }}>
          <p style={{ fontSize: 15, lineHeight: 1.65 }}>
            <b style={{ color: "var(--nz-red)" }}>{conexion.text[0]}</b>{conexion.text[1]}
          </p>
          <Link to={conexion.to} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
            {conexion.linkLabel} <Icon name="ArrowRight" size={15} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export default function PlataformaModulo() {
  const { slug } = useParams();
  const m = MODULOS[slug];
  if (!m) return <Navigate to="/plataforma" replace />;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Plataforma", to: "/plataforma" }, { label: m.short }]}
        eyebrow={m.badge}
        title={m.title}
        lead={m.lead}
        actions={<>
          <Button size="lg" to={CTA_PATHS.demo} placement="hero">{LABELS.demo}</Button>
          <Button size="lg" variant="secondary" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
        </>}
        aside={<ModuleMock m={m} />}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Qué resuelve" title="Tres problemas que este módulo elimina" />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {m.resuelve.map((r, i) => (
            <Reveal key={r.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={r.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{r.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{r.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {m.ciclo && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="El ciclo de instalación" title="Del contrato a la operación, acompañado" lead="Un proceso ordenado, no un evento de un día. Las etapas se afinan con el equipo de Netzen." />
          <div className="grid-2" style={{ marginTop: 40, alignItems: "start" }}>
            <Reveal><Steps items={m.ciclo.slice(0, 3)} /></Reveal>
            <Reveal delay={120}><Steps items={m.ciclo.slice(3)} /></Reveal>
          </div>
        </Section>
      )}

      {m.catalogo && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="Catálogo" title="Qué incluye este catálogo de extras" lead="Cada complemento se contrata según lo que tu operación necesita; su etiqueta indica cómo se ofrece." />
          <div className="grid-2" style={{ marginTop: 40 }}>
            {m.catalogo.map((c, i) => (
              <Reveal key={c.name} delay={(i % 2) * 90} className="card card--hover" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span className="bubble"><Icon name={c.icon} size={21} /></span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700 }}>{c.name}</h3>
                    <Badge tone={c.tone}>{c.badge}</Badge>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {m.incluye.length > 0 && (
        <Section bg={m.ciclo ? "page" : "card"} style={{ borderTop: "1px solid var(--border-default)" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <div>
              <SectionHeading eyebrow="Alcance" title="Qué incluye este módulo" />
              <Reveal delay={100} style={{ marginTop: 28, display: "grid", gap: 13 }}>
                {m.incluye.map((x) => <CheckLine key={x}>{x}</CheckLine>)}
              </Reveal>
            </div>
            <Reveal variant="right">
              <ModuleMock m={{ ...m, mock: m.mock === "chat" ? "bars" : m.mock === "bars" ? "table" : "bars", mockLabel: m.mockLabel }} />
            </Reveal>
          </div>
        </Section>
      )}

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Conexión con el ecosistema" />
        <div style={{ marginTop: 30, display: "grid", gap: 16 }}>
          <ConexionCard conexion={m.conexion} />
          {m.conexion2 && <ConexionCard conexion={m.conexion2} />}
        </div>
      </Section>

      <Section bg="page" tight>
        <SectionHeading eyebrow="Sigue explorando" title="Módulos relacionados" />
        <div className="grid-3" style={{ marginTop: 32 }}>
          {m.related.map((slug2, i) => {
            const r = MODULOS[slug2];
            return (
              <Reveal key={slug2} delay={i * 90}>
                <Link to={`/plataforma/${slug2}`} className="card card--hover" style={{ display: "flex", gap: 14, alignItems: "center", color: "inherit" }}>
                  <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={r.icon} size={19} /></span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{r.short}</span>
                  </span>
                  <Icon name="ArrowRight" size={17} style={{ color: "var(--nz-red)" }} />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CTABand
        title={m.ctaTitle}
        description="Demo para prospectos calificados: teaser público + acceso restringido, guiado por un consultor."
        primaryLabel="Solicitar demo"
        primaryTo="/contacto/demo"
        secondaryLabel={LABELS.diagnostico}
        secondaryTo="/contacto"
      />
    </>
  );
}
