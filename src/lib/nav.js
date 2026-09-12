// Arquitectura de información del sitio — única fuente de verdad para
// header, footer, mapa del sitio y navegador de prototipo.

import { isRouteEnabled } from "./featureFlags.js";

const RAW_NAV = [
  {
    label: "Plataforma",
    path: "/plataforma",
    desc: "Núcleo 01 · Tecnología",
    icon: "Cpu",
    children: [
      { label: "Software Netzen — core comercial", path: "/plataforma/software-netzen", icon: "Store", desc: "Venta directa, MLM, retail, franquicias, POS y e-commerce." },
      { label: "Oficina Virtual", path: "/plataforma/oficina-virtual", icon: "MonitorSmartphone", desc: "URL, tienda replicada y panel por distribuidor." },
      { label: "NIA — lenguaje natural", path: "/plataforma/nia", icon: "MessageSquareText", desc: "Pregúntale a tus datos y recibe reportes claros." },
      { label: "Analítica y predicción", path: "/plataforma/analitica-prediccion", icon: "TrendingUp", desc: "Predicción de compras, rangos y escenarios." },
      { label: "Promociones e inventario", path: "/plataforma/promociones-inventario", icon: "Percent", desc: "Reglas de promoción y reorden inteligente." },
      { label: "Backoffice", path: "/plataforma/backoffice", icon: "FileSpreadsheet", desc: "Facturación, comisiones, crédito y cobranza." },
      { label: "Infraestructura y seguridad", path: "/plataforma/infraestructura", icon: "ShieldCheck", desc: "Servidor dedicado, backups y monitoreo." },
      { label: "Implementación y soporte", path: "/plataforma/implementacion", icon: "Rocket", desc: "Del contrato a la operación, acompañado." },
      { label: "Extras y satelitales", path: "/plataforma/extras", icon: "Sparkles", desc: "Live Shopping, pasarelas, Tiempo Naranja." }
    ]
  },
  {
    label: "Academy",
    path: "/academy",
    desc: "Núcleo 02 · Educación",
    icon: "GraduationCap",
    children: [
      { label: "Diplomado Alta Dirección", path: "/academy/alta-direccion", icon: "Award", desc: "Para empresarios y líderes del negocio." },
      { label: "Diplomado Distribuidor Independiente", path: "/academy/distribuidor-independiente", icon: "Users", desc: "Profesionaliza tu red — 88 horas, B2B." },
      { label: "Cohortes multimarcas", path: "/academy/multimarcas", icon: "Network", desc: "Grupos que mezclan varias empresas." },
      { label: "Talleres y formación corporativa", path: "/academy/talleres", icon: "Presentation", desc: "Programas a la medida de tu equipo." }
    ]
  },
  {
    label: "Consulting",
    path: "/consulting",
    desc: "Núcleo 03 · Estrategia",
    icon: "Compass",
    children: [
      { label: "Estrategia y expansión", path: "/consulting/estrategia", icon: "Map", desc: "Crecimiento, omnicanalidad y multipaís." },
      { label: "Planes de compensación", path: "/consulting/planes-de-compensacion", icon: "Scale", desc: "Diseño, auditoría, simulación y corrección." },
      { label: "Escuela MLM", path: "/consulting/escuela-mlm", icon: "School", desc: "Arranca bien desde el día uno." },
      { label: "Consultoría tecnológica", path: "/consulting/tecnologia", icon: "Wrench", desc: "Incluida en cada implementación." }
    ]
  },
  {
    label: "Soluciones",
    path: "/soluciones",
    desc: "Recorridos por situación",
    icon: "Route",
    children: [
      { label: "Apenas empiezo", path: "/soluciones/empezar", icon: "Sprout", desc: "Arranca bien desde el día uno." },
      { label: "Empresa establecida", path: "/soluciones/empresa-establecida", icon: "Building2", desc: "Migrar, escalar, omnicanal, multipaís." },
      { label: "Profesionaliza tu red", path: "/soluciones/red-de-distribuidores", icon: "Users", desc: "Formación para ti y tu red." },
      { label: "Modernizar sin migrar todo", path: "/soluciones/modernizar", icon: "RefreshCw", desc: "Suma capacidades sobre tu software." },
      { label: "Cliente actual / expansión", path: "/soluciones/cliente-actual", icon: "Handshake", desc: "Crece con lo que ya tienes." },
      { label: "Por modelo de negocio", path: "/soluciones/por-modelo", icon: "LayoutGrid", desc: "Venta directa, MLM, retail y más." }
    ]
  },
  {
    label: "Recursos",
    path: "/recursos",
    desc: "Contenido que educa al mercado",
    icon: "BookOpen",
    children: [
      { label: "Blog", path: "/recursos/blog", icon: "Newspaper", desc: "Artículos de industria y producto." },
      { label: "Casos de éxito", path: "/recursos/casos", icon: "Trophy", desc: "Resultados reales de clientes." },
      { label: "Guías y plantillas", path: "/recursos/guias", icon: "FileText", desc: "Material descargable accionable." },
      { label: "Webinars y eventos", path: "/recursos/webinars", icon: "Video", desc: "Sesiones en vivo y bajo demanda." },
      { label: "Glosario", path: "/recursos/glosario", icon: "BookMarked", desc: "El lenguaje de la industria, claro." }
    ]
  },
  {
    label: "Nosotros",
    path: "/nosotros",
    desc: "30 años de industria",
    icon: "CircleUser",
    children: [
      { label: "Historia", path: "/nosotros/historia", icon: "History", desc: "Desde 1996, hitos y evolución." },
      { label: "Liderazgo y equipo", path: "/nosotros/equipo", icon: "Users", desc: "Las personas detrás de Netzen." },
      { label: "Misión, visión y valores", path: "/nosotros/mision-vision-valores", icon: "Target", desc: "Lo que nos mueve." },
      { label: "Por qué Netzen", path: "/nosotros/por-que-netzen", icon: "BadgeCheck", desc: "Diferenciales frente a alternativas." },
      { label: "Eventos de industria", path: "/nosotros/eventos", icon: "CalendarDays", desc: "Dónde encontrarnos." }
    ]
  }
];

export const NAV = RAW_NAV.map((group) => ({
  ...group,
  children: (group.children || []).filter((child) => isRouteEnabled(child.path))
}));

// Registro completo de rutas para el mapa del sitio.
export const ROUTES = [
  { path: "/", label: "Home" },
  ...NAV.flatMap((g) => [{ path: g.path, label: g.label + " (hub)" }, ...g.children.map((c) => ({ path: c.path, label: c.label, group: g.label }))]),
  { path: "/contacto", label: "Contacto · Agenda tu diagnóstico" },
  { path: "/contacto/demo", label: "Demo protegido" },
  { path: "/legal/privacidad", label: "Aviso de privacidad", group: "Legal" },
  { path: "/legal/terminos", label: "Términos y condiciones", group: "Legal" },
  { path: "/mapa", label: "Mapa del sitio" }
];

// Reexport para compatibilidad con imports existentes. La fuente real está en env.js.
export { WHATSAPP_URL, HAS_WHATSAPP } from "./env.js";
