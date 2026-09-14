// NETZEN · primitivas de UI (basadas en el design system del standalone)
import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/analytics.js";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Award, BadgeCheck, BarChart3, Blocks, BookMarked,
  BookOpen, Bot, Briefcase, Building2, CalendarCheck, CalendarDays, Check, ChevronDown, ChevronRight,
  CircleDollarSign, CircleUser, ClipboardCheck, Clock, Compass, Cpu, CreditCard, Database,
  Download, Eye, FileSpreadsheet, FileText, Filter, Flag, Gauge, Globe, GraduationCap,
  Handshake, HeartHandshake, History, Landmark, Layers, LayoutGrid, LifeBuoy, Lightbulb, LineChart,
  Link2, Lock, Mail, Map, MapPin, Menu, MessageCircle, MessageSquareText, Milestone,
  MonitorSmartphone, Network, Newspaper, NotebookPen, Package, Percent, Phone, PieChart,
  PlayCircle, Plug, Presentation, Puzzle, Quote, RefreshCw, Rocket, Route, Scale, School,
  Search, Server, Settings, ShieldCheck, ShoppingCart, Sparkles, Sprout, Star, Store,
  Target, TrendingUp, Trophy, Truck, UserPlus, Users, Video, Wallet, Wrench, X, Zap
} from "lucide-react";

const ICONS = {
  ArrowLeft, ArrowRight, ArrowUpRight, Award, BadgeCheck, BarChart3, Blocks, BookMarked,
  BookOpen, Bot, Briefcase, Building2, CalendarCheck, CalendarDays, Check, ChevronDown, ChevronRight,
  CircleDollarSign, CircleUser, ClipboardCheck, Clock, Compass, Cpu, CreditCard, Database,
  Download, Eye, FileSpreadsheet, FileText, Filter, Flag, Gauge, Globe, GraduationCap,
  Handshake, HeartHandshake, History, Landmark, Layers, LayoutGrid, LifeBuoy, Lightbulb, LineChart,
  Link2, Lock, Mail, Map, MapPin, Menu, MessageCircle, MessageSquareText, Milestone,
  MonitorSmartphone, Network, Newspaper, NotebookPen, Package, Percent, Phone, PieChart,
  PlayCircle, Plug, Presentation, Puzzle, Quote, RefreshCw, Rocket, Route, Scale, School,
  Search, Server, Settings, ShieldCheck, ShoppingCart, Sparkles, Sprout, Star, Store,
  Target, TrendingUp, Trophy, Truck, UserPlus, Users, Video, Wallet, Wrench, X, Zap
};

/* ---------- a11y: preferencia de movimiento reducido ---------- */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Icon({ name, size = 20, strokeWidth = 2, style, className }) {
  const C = ICONS[name] || Sparkles;
  return <C size={size} strokeWidth={strokeWidth} style={style} className={className} aria-hidden="true" />;
}

/* ---------- layout ---------- */
export const Container = ({ children, style, className = "" }) => (
  <div className={`container ${className}`} style={style}>{children}</div>
);

export function Section({ bg = "page", tight, children, style, id, className = "" }) {
  const bgClass = { page: "bg-page", card: "bg-card", dark: "bg-dark", wash: "bg-wash" }[bg] || "bg-page";
  return (
    <section id={id} className={`section ${tight ? "section--tight" : ""} ${bgClass} ${className}`} style={style}>
      <Container>{children}</Container>
    </section>
  );
}

/* ---------- botón (Link interno / <a> externo / button) ---------- */
export function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  onClick,
  children,
  block,
  style,
  className = "",
  trackLabel,
  trackType = "cta_click",
  placement,
  ...rest
}) {
  const cls = `btn btn--${variant} ${size !== "md" ? `btn--${size}` : ""} ${block ? "btn--block" : ""} ${className}`.trim();
  const label = trackLabel || (typeof children === "string" ? children : undefined);
  const handleClick = (event) => {
    trackEvent(trackType, {
      label: label || "acción",
      destination: to || href || "acción_local",
      ...(placement ? { placement } : {})
    });
    onClick?.(event);
  };
  if (to) return <Link to={to} className={cls} style={style} onClick={handleClick} {...rest}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style} onClick={handleClick} {...rest}>{children}</a>;
  return <button className={cls} style={style} onClick={handleClick} {...rest}>{children}</button>;
}

/* ---------- encabezado de sección ---------- */
export function SectionHeading({ eyebrow, title, lead, on = "light", align = "left", level = 2, maxWidth = 760, style }) {
  const dark = on === "dark";
  const H = `h${level}`;
  return (
    <div className={align === "center" ? "reveal" : "reveal"} style={{ textAlign: align, maxWidth, margin: align === "center" ? "0 auto" : undefined, ...style }}>
      {eyebrow && <div className={`eyebrow ${dark ? "eyebrow--dark" : ""}`} style={{ marginBottom: 14 }}>{eyebrow}</div>}
      <H style={{
        fontSize: level === 1 ? "clamp(34px,4.2vw,48px)" : "clamp(26px,3vw,32px)",
        fontWeight: level === 1 ? 800 : 700,
        lineHeight: level === 1 ? 1.08 : 1.2,
        color: dark ? "var(--text-inverse)" : "var(--text-heading)",
        textWrap: "balance"
      }}>{title}</H>
      {lead && <p className="lead" style={{ marginTop: 16, color: dark ? "var(--text-inverse-muted)" : undefined, textWrap: "pretty" }}>{lead}</p>}
    </div>
  );
}

/* ---------- reveal on scroll (aplica .is-in a los .reveal internos) ---------- */
export function useRevealObserver(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function Reveal({ as: As = "div", delay = 0, variant = "", children, style, className = "", ...rest }) {
  return (
    <As className={`reveal ${variant ? `reveal--${variant}` : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </As>
  );
}

/* ---------- contador animado ---------- */
export function CountUp({ value, prefix = "", suffix = "", duration = 1400, dark }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !started.current) {
          started.current = true;
          if (prefersReducedMotion()) {           // sin animación: valor final directo
            setDisplay(value);
            io.disconnect();
            return;
          }
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return (
    <span ref={ref} className={`stat__value ${dark ? "stat__value--dark" : ""}`}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function Stat({ value, prefix, suffix, label, dark }) {
  return (
    <div>
      <CountUp value={value} prefix={prefix} suffix={suffix} dark={dark} />
      <div className={`stat__label ${dark ? "stat__label--dark" : ""}`}>{label}</div>
    </div>
  );
}

/* ---------- tags & badges ---------- */
export function TagChip({ children, active, onClick, to, icon }) {
  const cls = `tag ${onClick || to ? "tag--click" : ""} ${active ? "tag--active" : ""}`;
  const inner = <>{icon && <Icon name={icon} size={14} />}{children}</>;
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (onClick) return <button className={cls} onClick={onClick} style={{ background: active ? "var(--nz-red)" : "var(--nz-white)" }}>{inner}</button>;
  return <span className={cls}>{inner}</span>;
}

export const Badge = ({ tone = "accent", children }) => <span className={`badge badge--${tone}`}>{children}</span>;

/* ---------- steps (recorridos) ---------- */
export function Steps({ items = [], compact }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: last ? 0 : compact ? 16 : 22 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span style={{
                width: 30, height: 30, borderRadius: "50%", background: "var(--nz-white)", color: "var(--nz-red)",
                border: "1.5px solid var(--nz-red)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13.5
              }}>{i + 1}</span>
              {!last && <span aria-hidden style={{ flex: 1, width: 1.5, minHeight: 16, background: "var(--nz-red-tint-strong)", marginTop: 8 }} />}
            </div>
            <div style={{ paddingTop: 3 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--text-heading)", lineHeight: 1.3 }}>{it.title}</div>
              {it.description && <div style={{ marginTop: 4, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{it.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- accordion ---------- */
export function Accordion({ items, single = true }) {
  const [open, setOpen] = useState(() => new Set([0]));
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(single ? [] : prev);
      if (!prev.has(i)) next.add(i);
      else if (!single) next.delete(i);
      return next;
    });
  };
  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={`acc ${isOpen ? "is-open" : ""}`}>
            <button className="acc__head" onClick={() => toggle(i)} aria-expanded={isOpen}>
              {it.icon && <span className="bubble bubble--sm"><Icon name={it.icon} size={16} /></span>}
              <span>{it.title}</span>
              {it.meta && <span className="badge badge--neutral" style={{ marginLeft: 8 }}>{it.meta}</span>}
              <span className="acc__chev"><Icon name="ChevronDown" size={18} /></span>
            </button>
            <div className="acc__body"><div><div className="acc__content">{it.content}</div></div></div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- checklist ---------- */
export const CheckLine = ({ children }) => (
  <div className="checkline"><span className="ic"><Icon name="Check" size={16} strokeWidth={2.6} /></span><span>{children}</span></div>
);

export function ConsentLine({ compact = false, style }) {
  const id = useId();
  return (
    <div className={`consent-line ${compact ? "consent-line--compact" : ""}`} style={style}>
      <input id={id} type="checkbox" required />
      <label htmlFor={id}>
        Acepto el tratamiento de mis datos conforme al <Link to="/legal/privacidad">aviso de privacidad</Link> y los{" "}
        <Link to="/legal/terminos">términos y condiciones</Link>.
      </label>
    </div>
  );
}

/* ---------- tarjeta-enlace con flecha ---------- */
export function LinkCard({ to, icon, title, desc, meta, style }) {
  return (
    <Link to={to} className="card card--hover" style={{ display: "flex", gap: 16, alignItems: "flex-start", color: "inherit", ...style }}>
      {icon && <span className="bubble"><Icon name={icon} size={21} /></span>}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-heading)" }}>{title}</span>
          {meta}
        </span>
        {desc && <span style={{ display: "block", marginTop: 5, fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{desc}</span>}
      </span>
      <span style={{ color: "var(--nz-red)", flexShrink: 0, marginTop: 2 }}><Icon name="ArrowRight" size={18} /></span>
    </Link>
  );
}

/* ---------- mock de interfaz (reemplaza placeholders de captura) ---------- */
export function MockFrame({ url = "app.netzen.mx", children, style }) {
  return (
    <div className="mockframe" style={style}>
      <div className="mockframe__bar">
        <span className="mockframe__dot" /><span className="mockframe__dot" /><span className="mockframe__dot" />
        <span className="mockframe__url">{url}</span>
      </div>
      {children}
    </div>
  );
}

/* barras decorativas para mocks de dashboards */
export function MockBars({ heights = [38, 62, 46, 78, 58, 90, 70], color = "var(--nz-red)" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, padding: "8px 4px 0" }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${h}%`, borderRadius: "6px 6px 2px 2px",
          background: i === heights.length - 2 ? color : "var(--nz-blue-tint)",
          transition: "height 600ms var(--ease-out)"
        }} />
      ))}
    </div>
  );
}
