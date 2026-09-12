// NETZEN · capa global del sitio: header, footer, CTA band, flotantes, breadcrumbs, navegador de prototipo
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV, ROUTES, WHATSAPP_URL, HAS_WHATSAPP } from "../lib/nav.js";
import { isRouteEnabled } from "../lib/featureFlags.js";
import { Icon, Button, Container } from "./ui.jsx";
import { trackEvent } from "../lib/analytics.js";
import { openConsentBanner } from "./ConsentBanner.jsx";
import isotipo from "../assets/netzen-isotipo-red.png";
import logoVerticalWhite from "../assets/netzen-vertical-white.png";

/* ---------- logo ---------- */
export function Logo({ height = 30, white }) {
  return (
    <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: Math.round(height * 0.34), textDecoration: "none" }} aria-label="Netzen — inicio">
      <img src={isotipo} alt="" style={{ height, display: "block", filter: white ? "brightness(0) invert(1)" : undefined }} />
      <span style={{
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: Math.round(height * 0.5),
        letterSpacing: "var(--tracking-wordmark)", marginRight: "calc(-1 * var(--tracking-wordmark))",
        color: white ? "#F5F5F5" : "var(--nz-red)", lineHeight: 1, whiteSpace: "nowrap"
      }}>NETZEN</span>
    </Link>
  );
}

const LANGUAGES = [
  { code: "es", label: "Español", active: true },
  { code: "en", label: "English", active: false },
  { code: "pt", label: "Português", active: false },
  { code: "fr", label: "Français", active: false },
  { code: "tr", label: "Türkçe", active: false }
];

function LanguageStatus({ mobile = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`language-status ${mobile ? "language-status--mobile" : ""}`}>
      <button
        type="button"
        className="language-status__trigger"
        aria-label="ES · Español"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) trackEvent("language_menu_open", { language: "es" });
        }}
      >
        <Icon name="Globe" size={14} />
        <span className="language-status__code">ES</span>
        <Icon name="ChevronDown" size={13} />
      </button>
      {open && (
        <div className="language-status__panel" role="dialog" aria-label="Disponibilidad de idiomas">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${lang.active ? "is-active" : "is-disabled"}`}
              aria-disabled={!lang.active}
            >
              <span>{lang.label}</span>
              <strong>{lang.active ? "Disponible" : "Próximamente"}</strong>
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
}

/* ---------- header ---------- */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <header className={`hdr ${scrolled ? "is-scrolled" : ""}`}>
        <div className="hdr__in">
          <Logo height={30} />
          <nav className="hdr__nav" aria-label="Principal">
            {NAV.map((item) => (
              <div className="navitem" key={item.label}>
                <NavLink to={item.path} className={({ isActive }) => (isActive || location.pathname.startsWith(item.path) ? "is-active" : "")}>
                  {item.label}
                  <span className="chev" style={{ display: "inline-flex" }}><Icon name="ChevronDown" size={14} /></span>
                </NavLink>
                <div className={`dropdown ${item.children.length > 5 ? "dropdown--wide" : ""}`} role="menu">
                  <div className={item.children.length > 5 ? "dropdown__grid" : ""}>
                    {item.children.map((c) => (
                      <Link to={c.path} className="dd-item" key={c.path} role="menuitem">
                        <span className="dd-ic"><Icon name={c.icon} size={17} /></span>
                        <span>
                          <span className="dd-item__title">{c.label}</span>
                          <span className="dd-item__desc" style={{ display: "block" }}>{c.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="dropdown__footer">
                    <Link to={item.path} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      Ver {item.label} <Icon name="ArrowRight" size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </nav>
          <div className="hdr__cta" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <LanguageStatus />
            <Button size="sm" to="/contacto">Agenda tu diagnóstico</Button>
          </div>
          <button className="hdr__burger" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
            <Icon name="Menu" size={24} />
          </button>
        </div>
      </header>
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </div>
  );
}

function MobileNav({ onClose }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="mobilenav" role="dialog" aria-label="Menú">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Logo height={26} />
        <button className="hdr__burger" style={{ display: "inline-flex" }} aria-label="Cerrar menú" onClick={onClose}>
          <Icon name="X" size={24} />
        </button>
      </div>
      {NAV.map((g, i) => (
        <div className="mobilenav__group" key={g.label}>
          <button className="mobilenav__label" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            {g.label}
            <Icon name="ChevronDown" size={18} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 220ms" }} />
          </button>
          {open === i && (
            <div className="mobilenav__links">
              <Link to={g.path} style={{ fontWeight: 700, color: "var(--nz-red)" }}>Ver {g.label} →</Link>
              {g.children.map((c) => <Link to={c.path} key={c.path}>{c.label}</Link>)}
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <Button to="/contacto" block>Agenda tu diagnóstico</Button>
        <Button to="/contacto/demo" variant="secondary" block>Solicita un demo protegido</Button>
        <LanguageStatus mobile />
      </div>
    </div>
  );
}

/* ---------- breadcrumbs ---------- */
export function Breadcrumbs({ items }) {
  return (
    <Container>
      <nav className="crumbs" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <span className="sep">/</span>
            {it.to ? <Link to={it.to}>{it.label}</Link> : <span style={{ color: "var(--text-body)" }}>{it.label}</span>}
          </React.Fragment>
        ))}
      </nav>
    </Container>
  );
}

/* ---------- hero interior con anillos de marca ---------- */
export function PageHero({ eyebrow, badge, title, lead, actions, aside, crumbs }) {
  return (
    <div className="phero nz-grain">
      <div className="phero__ring" style={{ width: 520, height: 520, right: -180, top: -220, opacity: 0.7 }} />
      <div className="phero__ring" style={{ width: 320, height: 320, right: -60, top: -120 }} />
      {crumbs && <Breadcrumbs items={crumbs} />}
      <Container>
        <div className="phero__grid" style={!aside ? { gridTemplateColumns: "1fr" } : undefined}>
          <div className="anim-fade-up">
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {badge}
            </div>
            <h1 style={{ marginTop: eyebrow ? 16 : 0 }}>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
            {actions && <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>{actions}</div>}
          </div>
          {aside && <div className="anim-fade-up" style={{ animationDelay: "140ms" }}>{aside}</div>}
        </div>
      </Container>
    </div>
  );
}

/* ---------- banda CTA de cierre ---------- */
export function CTABand({
  title = "¿Listo para empezar?",
  description = "La conversación empieza por valor y alcance, no por precio. Agenda tu diagnóstico y recibe un recorrido a la medida de tu operación.",
  primaryLabel = "Agenda tu diagnóstico",
  primaryTo = "/contacto",
  secondaryLabel = "Solicita un demo protegido",
  secondaryTo = "/contacto/demo"
}) {
  return (
    <section className="section--tight bg-page cta-band">
      <Container>
        <div className="reveal reveal--scale cta-band__panel">
          <span className="cta-band__accent" aria-hidden />
          <img src={isotipo} alt="" aria-hidden className="cta-band__mark" />
          <div className="cta-band__copy">
            <span className="eyebrow">Siguiente paso</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="cta-band__actions">
            <Button size="lg" to={primaryTo}>{primaryLabel}</Button>
            {secondaryLabel && <Button size="lg" variant="secondary" to={secondaryTo}>{secondaryLabel}</Button>}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- footer ---------- */
const FOOTER_COLS = [
  {
    title: "Soluciones",
    links: [
      { label: "Plataforma", to: "/plataforma" },
      { label: "Academy", to: "/academy" },
      { label: "Consulting", to: "/consulting" },
      { label: "Por modelo de negocio", to: "/soluciones/por-modelo" }
    ]
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", to: "/nosotros" },
      { label: "Recursos", to: "/recursos" },
      ...(isRouteEnabled("/nosotros/eventos") ? [{ label: "Eventos", to: "/nosotros/eventos" }] : []),
      { label: "Contacto", to: "/contacto" }
    ]
  },
  {
    title: "Contacto",
    links: [
      { label: "Agenda tu diagnóstico", to: "/contacto" },
      ...(HAS_WHATSAPP ? [{ label: "WhatsApp", href: WHATSAPP_URL }] : []),
      { label: "Acceso clientes", href: "#" }
    ]
  }
];

const SUPPORT_URL = "https://netzen.guru/LoginSalesForce.php";

export function SiteFooter() {
  return (
    <footer className="footer nz-grain">
      <img src={isotipo} alt="" aria-hidden style={{ position: "absolute", left: -140, bottom: -180, width: 440, opacity: 0.07, pointerEvents: "none" }} />
      <Container style={{ position: "relative" }}>
        <div className="footer__cols">
          <div>
            <img src={logoVerticalWhite} alt="Netzen" style={{ height: 104, display: "block" }} />
            <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.6, color: "var(--text-inverse-muted)", maxWidth: 300 }}>
              Tecnología, formación y consultoría estratégica para un crecimiento empresarial consciente.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="footer__title">{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {col.links.map((l) =>
                  l.to
                    ? <Link to={l.to} key={l.label}>{l.label}</Link>
                    : <a href={l.href} key={l.label} target={l.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" onClick={l.href === "#" ? (e) => e.preventDefault() : undefined}>{l.label}</a>
                )}
                {col.title === "Contacto" && (
                  <Button
                    href={SUPPORT_URL}
                    size="sm"
                    trackLabel="Soporte a clientes"
                    style={{ marginTop: 14, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, color: "#fff" }}
                  >
                    Soporte
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="footer__legal">
          <span>© Netzen 2026 · NETZEN S.A. de C.V.</span>
          <Link to="/legal/privacidad" style={{ fontSize: 12.5, lineHeight: "inherit" }}>Aviso de privacidad</Link>
          <Link to="/legal/terminos" style={{ fontSize: 12.5, lineHeight: "inherit" }}>Términos y condiciones</Link>
          <button
            type="button"
            onClick={openConsentBanner}
            style={{
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              color: "inherit", font: "inherit", fontSize: 12.5, lineHeight: "inherit",
              textDecoration: "underline"
            }}
          >
            Cookies
          </button>
          <Link to="/mapa" style={{ fontSize: 12.5, lineHeight: "inherit" }}>Mapa del sitio</Link>
          <span style={{ marginLeft: "auto" }}>Hecho en México · desde 1996</span>
        </div>
      </Container>
    </footer>
  );
}

/* ---------- acciones flotantes ---------- */
export function FloatingActions() {
  return (
    <div className="floats">
      {HAS_WHATSAPP && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="float-wa"
          aria-label="WhatsApp"
          title="WhatsApp"
          onClick={() => trackEvent("whatsapp_click", { placement: "floating" })}
        >
          <Icon name="MessageCircle" size={26} />
        </a>
      )}
      <Link
        to="/contacto"
        className="float-cta"
        onClick={() => trackEvent("cta_click", { label: "Agenda tu diagnóstico", destination: "/contacto", placement: "floating" })}
      >
        <Icon name="CalendarCheck" size={17} />Agenda tu diagnóstico
      </Link>
    </div>
  );
}

/* ---------- navegador de prototipo (revisión interna) ---------- */
export function PrototypeNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);
  const groups = ROUTES.reduce((acc, r) => {
    const g = r.group || "General";
    (acc[g] = acc[g] || []).push(r);
    return acc;
  }, {});
  return (
    <>
      {open && (
        <div className="protonav" role="dialog" aria-label="Índice de páginas del prototipo">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 6px" }}>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 14 }}>Prototipo · {ROUTES.length} páginas</strong>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }} aria-label="Cerrar">
              <Icon name="X" size={17} />
            </button>
          </div>
          {Object.entries(groups).map(([g, rs]) => (
            <div key={g}>
              <h4>{g}</h4>
              {rs.map((r) => (
                <Link to={r.path} key={r.path} className={location.pathname === r.path ? "is-here" : ""}>
                  <span>{r.label}</span><code>{r.path}</code>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
      <button className="protonav-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Icon name="LayoutGrid" size={15} /> Prototipo
      </button>
    </>
  );
}

/* ---------- scroll to top en cambio de ruta ---------- */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
