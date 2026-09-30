import React from "react";
import { Icon, MockFrame, MockBars, Badge, Steps } from "../../../components/ui.jsx";

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
              <div style={{ aspectRatio: "1", background: "linear-gradient(135deg, var(--nz-blue-tint), var(--nz-red-tint))", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

export function getAlternateModuleMock(module) {
  return {
    ...module,
    mock: module.mock === "chat" ? "bars" : module.mock === "bars" ? "table" : "bars"
  };
}

export function ModuleMock({ module }) {
  switch (module.mock) {
    case "chat": return <ChatMock />;
    case "table": return <TableMock label={module.mockLabel} />;
    case "store": return <StoreMock />;
    case "arch": return <ArchMock />;
    case "cycle": return <CycleMock ciclo={module.ciclo} />;
    case "cards": return <CardsMock catalogo={module.catalogo} />;
    default:
      return (
        <MockFrame url="app.netzen.mx">
          <div style={{ padding: 18 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{module.mockLabel}</div>
            <MockBars />
            <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, color: "var(--text-tertiary)" }}>
              <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </MockFrame>
      );
  }
}
