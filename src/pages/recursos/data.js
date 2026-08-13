// Contenido del centro de Recursos (fuente: wireframes fase 1.2)
export const CATEGORIAS = ["Todas", "Industria", "Omnicanalidad", "Fidelización", "Regulación", "Crecimiento comercial"];

export const ARTICULOS = [
  {
    cat: "Omnicanalidad", icon: "Globe", destacado: true,
    title: "Omnicanalidad real: integrar venta directa, retail y e-commerce en una sola operación",
    desc: "Qué significa conectar canales y mercados —venta directa, retail, e-commerce, punto de venta y otros— en una operación conectada, y por qué importa para escalar."
  },
  {
    cat: "Crecimiento comercial", icon: "TrendingUp",
    title: "5 señales de que tu operación está lista para escalar y profesionalizar",
    desc: "Cómo reconocer cuándo una empresa establecida necesita dejar las hojas de cálculo y migrar a una plataforma configurable."
  },
  {
    cat: "Fidelización", icon: "HeartHandshake",
    title: "Fidelización de la red de distribuidores: incentivos que retienen sin descapitalizar",
    desc: "Programas de lealtad, reconocimiento y herramientas propias que mantienen activa a la fuerza comercial."
  },
  {
    cat: "Regulación", icon: "Scale",
    title: "Marco regulatorio de la venta directa en LATAM: lo que conviene revisar",
    desc: "Panorama general de cumplimiento por país y por qué separar el cálculo fiscal de la asesoría jurídica."
  },
  {
    cat: "Industria", icon: "Network",
    title: "Genealogía y plan de compensación: por qué el cálculo correcto sostiene el negocio",
    desc: "Si el plan está mal calculado hay dos riesgos: pagar de más quiebra la empresa; pagar de menos descapitaliza a la red."
  },
  {
    cat: "Industria", icon: "LineChart",
    title: "Analítica y predicción: anticipar compras y movilidad de rangos con datos",
    desc: "Cómo los modelos de escenarios ayudan a anticipar el comportamiento de compra y la movilidad de la red."
  }
];

export const GUIAS = [
  { cat: "Omnicanalidad", icon: "Globe", title: "Checklist de omnicanalidad para venta directa", desc: "Conecta venta directa, retail, e-commerce y punto de venta en una operación.", pages: "12 págs." },
  { cat: "Industria", icon: "Scale", title: "Cómo auditar tu plan de compensación", desc: "Plantilla para revisar sostenibilidad e incentivos sin descapitalizar a la red.", pages: "18 págs." },
  { cat: "Fidelización", icon: "HeartHandshake", title: "10 ideas para fidelizar a la red de distribuidores", desc: "Programas de lealtad y herramientas propias que retienen a la fuerza comercial.", pages: "10 págs." },
  { cat: "Crecimiento comercial", icon: "TrendingUp", title: "Señales de que tu operación está lista para escalar", desc: "Diagnóstico rápido para empresas establecidas que buscan profesionalizar.", pages: "8 págs." },
  { cat: "Regulación", icon: "ClipboardCheck", title: "Cumplimiento básico en venta directa en LATAM", desc: "Panorama general; separa el cálculo fiscal de la asesoría jurídica.", pages: "14 págs." },
  { cat: "Industria", icon: "BookMarked", title: "Glosario imprimible de la industria", desc: "Términos clave de venta directa y multinivel en un PDF de referencia.", pages: "6 págs." }
];

export const GUIA_DESTACADA = {
  cat: "Crecimiento comercial", pages: "PDF · 24 págs.",
  title: "Guía: del software propio obsoleto a una operación moderna sin migrar todo",
  desc: "Una hoja de ruta para empresas con tecnología propia que quieren modernizar gradualmente: integraciones, satelitales y analítica sin reemplazar toda la plataforma."
};

export const WEBINARS = [
  { icon: "Globe", title: "Omnicanalidad: vender en todos los canales sin caos", meta: "Próximamente · fecha por confirmar" },
  { icon: "Users", title: "Cómo profesionalizar una red de distribuidores", meta: "Próximamente · fecha por confirmar" },
  { icon: "Scale", title: "Planes de compensación que sí son sostenibles", meta: "Próximamente · fecha por confirmar" }
];

export const GRABACIONES = [
  { cat: "Industria", title: "Tendencias de la venta directa en LATAM", dur: "48 min" },
  { cat: "Tecnología / plataforma", title: "NIA en acción: pregúntale a tus datos", dur: "36 min" },
  { cat: "Academy", title: "Método de ventas para distribuidores independientes", dur: "52 min" },
  { cat: "Consulting", title: "Auditoría de plan de compensación, paso a paso", dur: "44 min" },
  { cat: "Casos", title: "De hojas de cálculo a plataforma: una migración real", dur: "39 min" },
  { cat: "Tecnología / plataforma", title: "Oficina Virtual: la herramienta diaria de la red", dur: "31 min" }
];

export const CASOS = [
  { modelo: "Venta directa", years: "Relación 15 años", icon: "ShoppingCart", title: "Migración de hojas de cálculo a una plataforma configurable", desc: "Cómo una empresa establecida ordenó comisiones, inventario y red en una sola operación." },
  { modelo: "Multinivel", years: "Relación 12 años", icon: "Network", title: "Plan de compensación auditado y motor de comisiones confiable", desc: "Del diseño del plan en Consulting a la configuración del motor en la plataforma." },
  { modelo: "Retail", years: "Relación 10 años", icon: "Store", title: "Omnicanalidad: punto de venta, e-commerce y red conectados", desc: "Integración de canales y mercados en una operación conectada para escalar." }
];

export const GLOSARIO = [
  { letra: "A", term: "Atribución por canal", def: "Registro del origen de un prospecto (campaña, buscador, referido, evento) para medir qué canal generó cada lead en el CRM." },
  { letra: "A", term: "Analítica predictiva", def: "Uso de datos históricos para anticipar comportamientos —compras, movilidad de rangos, escenarios— mediante modelos estadísticos." },
  { letra: "C", term: "Comisiones", def: "Pagos a la fuerza comercial según el plan de compensación. El motor de comisiones del software se configura a partir del plan diseñado." },
  { letra: "C", term: "CRM", def: "Sistema de gestión de relación con prospectos y clientes donde se registran y atribuyen los leads generados por el contenido." },
  { letra: "E", term: "E-commerce", def: "Canal de venta en línea integrado a la operación; uno de los canales que la omnicanalidad conecta con los demás." },
  { letra: "E", term: "Escalar", def: "Crecer la operación de forma ordenada y sostenible. Aplica a empresas establecidas que buscan profesionalizar su operación." },
  { letra: "F", term: "Fidelización", def: "Conjunto de prácticas —incentivos, reconocimiento, herramientas propias— para retener y mantener activa a la red de distribuidores y a los clientes a lo largo del tiempo." },
  { letra: "F", term: "Fuerza comercial", def: "Conjunto de distribuidores independientes que comercializan los productos. Se profesionaliza con formación y herramientas." },
  { letra: "G", term: "Genealogía", def: "Estructura jerárquica de la red de distribuidores que muestra quién patrocina a quién. Es la base para calcular comisiones y analizar la red." },
  { letra: "G", term: "Guía (lead magnet)", def: "Contenido descargable que se entrega a cambio de datos de contacto, generando un lead atribuido al canal de origen." },
  { letra: "M", term: "Multinivel (MLM)", def: "Modelo de venta directa en el que los distribuidores comercializan productos y construyen una red. Uno de los modelos que la plataforma opera." },
  { letra: "M", term: "Movilidad de rangos", def: "Cambio de nivel de los distribuidores dentro del plan de compensación; la analítica permite anticiparla y modelar escenarios." },
  { letra: "O", term: "Omnicanalidad", def: "Integra canales y mercados —venta directa, retail, e-commerce, punto de venta y otros— en una sola operación conectada. No son canales sueltos: comparten catálogo, inventario, precios y datos de la red." },
  { letra: "O", term: "Oficina Virtual", def: "Espacio digital con URL, tienda y herramientas propias por distribuidor: genealogía, comisiones, red y contenidos." },
  { letra: "P", term: "Plan de compensación", def: "Conjunto de reglas que define cómo se pagan comisiones e incentivos. Si el cálculo está mal, pagar de más quiebra la empresa y pagar de menos descapitaliza a la red. Debe ser auditado y simulado." },
  { letra: "P", term: "Punto de venta (POS)", def: "Canal físico de venta integrado a la operación; otro de los canales que conecta la omnicanalidad." },
  { letra: "R", term: "Red de distribuidores", def: "Conjunto de distribuidores independientes que conforman la estructura comercial de la empresa. Se profesionaliza con formación y herramientas propias." },
  { letra: "R", term: "Retail", def: "Venta a través de tiendas y puntos de venta; uno de los modelos y canales que la plataforma opera de forma integrada." },
  { letra: "V", term: "Venta directa", def: "Comercialización de productos directamente del fabricante al consumidor a través de distribuidores, sin intermediarios tradicionales." },
  { letra: "V", term: "Versión configurable", def: "Plataforma habilitada mediante contrato de uso de licencia en modalidad de renta, que se adapta por configuración a cada modelo de negocio. No es software a la medida ni una fábrica de software." }
];
