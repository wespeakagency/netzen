// Contenido de los 9 módulos de Plataforma (fuente: wireframes fase 1.2)
export const MODULOS = {
  "software-netzen": {
    name: "Software Netzen — core comercial",
    short: "Software Netzen",
    icon: "Store",
    badge: "Módulo core",
    title: "Software Netzen — el core comercial",
    lead: "El motor que opera tu negocio sin importar el modelo: venta directa, multinivel, retail, franquicias, punto de venta y e-commerce, con promociones, lealtad, referidos y comisiones.",
    mock: "bars",
    mockLabel: "Tablero comercial · ventas por canal",
    resuelve: [
      { icon: "Layers", title: "Un modelo, una plataforma", desc: "Opera venta directa, MLM, retail y franquicias desde un mismo lugar, sin sistemas sueltos." },
      { icon: "Scale", title: "Comisiones confiables", desc: "El motor de comisiones se configura desde el plan diseñado en Consulting: cálculo probado y estructurado." },
      { icon: "TrendingUp", title: "Crece sin límites rígidos", desc: "Sin techos de usuarios ni paquetes cerrados; escala con tu operación." }
    ],
    incluye: [
      "Venta directa, multinivel, retail y franquicias",
      "Punto de venta, franquicias digitales y unidades de negocio",
      "E-commerce integrado",
      "Promociones, lealtad y referidos",
      "Motor de comisiones configurable",
      "Catálogos, precios y reglas por canal"
    ],
    conexion: {
      icon: "Scale",
      text: ["Consulting · Planes de compensación", " → el plan diseñado se vuelve la configuración del motor de comisiones de este módulo."],
      linkLabel: "Ver Planes de compensación",
      to: "/consulting/planes-de-compensacion"
    },
    related: ["oficina-virtual", "backoffice", "nia"],
    ctaTitle: "¿Quieres verlo funcionando?"
  },

  "oficina-virtual": {
    name: "Oficina Virtual y tiendas replicadas",
    short: "Oficina Virtual",
    icon: "MonitorSmartphone",
    badge: "Módulo de plataforma",
    title: "Oficina Virtual y tiendas replicadas",
    lead: "Cada distribuidor independiente recibe su propia URL, su tienda replicada y un panel con todo lo que necesita para operar: genealogía de su red, comisiones, contenidos y herramientas de venta, conectados al mismo motor de la plataforma.",
    mock: "store",
    mockLabel: "Panel del distribuidor · tienda replicada",
    resuelve: [
      { icon: "Globe", title: "Presencia propia, sin desarrollar nada", desc: "El distribuidor obtiene URL y tienda replicada al instante, con catálogo, precios y promociones siempre actualizados desde la matriz." },
      { icon: "Network", title: "Red visible y bajo control", desc: "Genealogía, niveles y desempeño de su red en un solo lugar, con la misma información que ve la empresa." },
      { icon: "Wallet", title: "Comisiones transparentes", desc: "Cada quien consulta sus comisiones calculadas por el motor de la plataforma; menos dudas, menos llamadas a soporte." }
    ],
    incluye: [
      "URL personal y tienda replicada por distribuidor",
      "Catálogo, precios y promociones sincronizados con la matriz",
      "Genealogía de la red y vista por niveles",
      "Consulta de comisiones y estados de cuenta",
      "Centro de contenidos y materiales de venta",
      "Herramientas de prospección y seguimiento",
      "Carrito y cobro conectados a las pasarelas de pago",
      "Acceso responsivo (escritorio y móvil)"
    ],
    conexion: {
      icon: "GraduationCap",
      text: ["Academy · Distribuidor Independiente", " → profesionaliza a la red que opera la Oficina Virtual. La empresa contrata la formación para que su fuerza comercial aproveche la herramienta a fondo."],
      linkLabel: "Ver Diplomado para Distribuidor Independiente",
      to: "/academy/distribuidor-independiente"
    },
    related: ["software-netzen", "backoffice", "extras"],
    ctaTitle: "¿Quieres ver la Oficina Virtual funcionando?"
  },

  nia: {
    name: "NIA — Reporteo en lenguaje natural",
    short: "NIA",
    icon: "MessageSquareText",
    badge: "Módulo de plataforma",
    title: "NIA — Reporteo y análisis en lenguaje natural",
    lead: "NIA te deja preguntarle a tus datos en palabras simples y recibir reportes claros: «¿cómo van las ventas de este mes por sucursal?», «¿qué distribuidores subieron de rango?». Análisis de tu información de negocio, integrado en las versiones nuevas de la plataforma.",
    mock: "chat",
    mockLabel: "Consulta a NIA en lenguaje natural",
    resuelve: [
      { icon: "Zap", title: "Reportes sin saber de reportes", desc: "Quien dirige el negocio obtiene respuestas en segundos, sin depender de un analista ni de tableros complejos." },
      { icon: "Database", title: "Una sola fuente de verdad", desc: "NIA lee la misma información operativa de la plataforma; las cifras coinciden con backoffice y comisiones." },
      { icon: "Gauge", title: "Decisiones más rápidas", desc: "Detecta tendencias, comparativos y alertas de la operación sin armar consultas a mano." }
    ],
    incluye: [
      "Consultas en lenguaje natural sobre datos de negocio",
      "Reportes de ventas, red, inventario y comisiones",
      "Comparativos por periodo, sucursal y canal",
      "Resúmenes y hallazgos redactados en texto claro",
      "Integrada en las versiones nuevas de la plataforma",
      "Acceso por perfil y permisos del backoffice",
      "Exportación de reportes para compartir",
      "Disponible en escritorio y móvil"
    ],
    conexion: {
      icon: "TrendingUp",
      text: ["Plataforma · Analítica y predicción", " → NIA presenta en lenguaje natural lo que el motor analítico calcula; juntos cubren el qué pasó y el qué podría pasar."],
      linkLabel: "Ver Analítica y predicción",
      to: "/plataforma/analitica-prediccion"
    },
    related: ["analitica-prediccion", "backoffice", "software-netzen"],
    ctaTitle: "¿Quieres preguntarle a tus datos?"
  },

  "analitica-prediccion": {
    name: "Analítica y predicción",
    short: "Analítica y predicción",
    icon: "TrendingUp",
    badge: "Módulo de plataforma",
    title: "Analítica y predicción",
    lead: "Del qué pasó al qué podría pasar: predicción de compras, movilidad de rangos de la red y simulación de escenarios para decidir con mejor criterio.",
    mock: "bars",
    mockLabel: "Predicción de demanda · próximos periodos",
    resuelve: [
      { icon: "LineChart", title: "Anticipa la demanda", desc: "Estima compras futuras por producto, sucursal y canal para comprar y producir con mejor criterio." },
      { icon: "Network", title: "Lee la movilidad de la red", desc: "Modela la probabilidad de que distribuidores suban o bajen de rango, para enfocar incentivos y acompañamiento." },
      { icon: "Puzzle", title: "Prueba escenarios antes de actuar", desc: "Simula cambios de oferta, precio o reglas y observa el impacto probable antes de aplicarlos." }
    ],
    incluye: [
      "Predicción de compras por producto, sucursal y canal",
      "Movilidad de rangos de la red (modelos tipo cadenas de Markov)",
      "Simulación de escenarios «qué pasaría si»",
      "Estacionalidad y tendencias de demanda",
      "Tableros con proyecciones y rangos de confianza",
      "Alertas de riesgo y oportunidad",
      "Insumo directo para reorden e inventario",
      "Resultados consultables también vía NIA"
    ],
    conexion: {
      icon: "Percent",
      text: ["Plataforma · Promociones e inventario", " → las predicciones de demanda alimentan el reorden y las reglas de promoción para mover el inventario correcto en el momento correcto."],
      linkLabel: "Ver Promociones e inventario",
      to: "/plataforma/promociones-inventario"
    },
    related: ["nia", "promociones-inventario", "software-netzen"],
    ctaTitle: "¿Quieres ver tus escenarios proyectados?"
  },

  "promociones-inventario": {
    name: "Promociones e inventario inteligente",
    short: "Promociones e inventario",
    icon: "Percent",
    badge: "Módulo de plataforma",
    title: "Promociones e inventario inteligente",
    lead: "La promoción que impulsa la venta y el inventario que debe responderla, conectados: reglas claras, impacto medido y reorden automático por sucursal.",
    mock: "table",
    mockLabel: "Constructor de promociones · impacto",
    resuelve: [
      { icon: "Settings", title: "Promociones con reglas claras", desc: "Define descuentos, paquetes, vigencias y condiciones por canal, producto o segmento, sin parches manuales." },
      { icon: "BarChart3", title: "Mide el impacto real", desc: "Analiza qué tanto movió cada promoción las ventas y el margen, para repetir lo que funciona y descartar lo que no." },
      { icon: "Package", title: "Inventario que se cuida solo", desc: "Reorden automático según consumo y predicción, por proveedor y por sucursal; menos faltantes y menos sobrestock." }
    ],
    incluye: [
      "Motor de reglas de promoción por canal, producto y segmento",
      "Vigencias, topes y condiciones configurables",
      "Análisis de impacto antes y después del lanzamiento",
      "Comparativo de ventas y margen por promoción",
      "Reorden automático por proveedor y por sucursal",
      "Puntos de reorden y stock de seguridad",
      "Inventario en tiempo real por ubicación",
      "Alertas de faltantes y sobrestock"
    ],
    conexion: {
      icon: "TrendingUp",
      text: ["Plataforma · Analítica y predicción", " → la predicción de demanda calcula puntos de reorden y prioriza qué reabastecer; las reglas de promoción se ajustan con base en escenarios."],
      linkLabel: "Ver Analítica y predicción",
      to: "/plataforma/analitica-prediccion"
    },
    related: ["analitica-prediccion", "backoffice", "software-netzen"],
    ctaTitle: "¿Quieres ver tus promociones e inventario conectados?"
  },

  backoffice: {
    name: "Backoffice",
    short: "Backoffice",
    icon: "FileSpreadsheet",
    badge: "Módulo de plataforma",
    title: "Backoffice — la administración en un solo lugar",
    lead: "El «detrás de cámaras» que conecta venta, red y finanzas: inventario, facturación, comisiones, crédito, cobranza, impuestos y catálogos en una sola plataforma, no en sistemas sueltos.",
    mock: "table",
    mockLabel: "Facturación y cobranza",
    resuelve: [
      { icon: "Blocks", title: "Administración sin islas", desc: "Inventario, ventas, comisiones y cobranza comparten datos; se acaban las hojas de cálculo paralelas y los descuadres." },
      { icon: "Wallet", title: "Comisiones y pagos confiables", desc: "El motor de comisiones aplica el plan diseñado en Consulting; los cálculos son consistentes y auditables." },
      { icon: "ClipboardCheck", title: "Cumplimiento ordenado", desc: "Facturación e impuestos integrados al flujo de venta, con catálogos y reglas centralizados." }
    ],
    incluye: [
      "Inventario y control de almacén",
      "Facturación integrada al flujo de venta",
      "Motor de comisiones configurable",
      "Crédito y líneas por cliente o distribuidor",
      "Cobranza y estados de cuenta",
      "Cálculo de impuestos según el flujo de venta",
      "Catálogos de productos, precios y reglas",
      "Permisos y perfiles por área"
    ],
    conexion: {
      icon: "Scale",
      text: ["Consulting · Planes de compensación", " → el plan diseñado se vuelve la configuración del motor de comisiones del backoffice: lo que se diseña en estrategia se ejecuta aquí."],
      linkLabel: "Ver Planes de compensación",
      to: "/consulting/planes-de-compensacion"
    },
    related: ["software-netzen", "promociones-inventario", "nia"],
    ctaTitle: "¿Quieres ver tu administración en un solo lugar?"
  },

  infraestructura: {
    name: "Arquitectura, infraestructura y seguridad",
    short: "Infraestructura y seguridad",
    icon: "ShieldCheck",
    badge: "Base técnica",
    title: "Arquitectura, infraestructura y seguridad",
    lead: "Cada cliente opera sobre un servidor dedicado, con respaldos, monitoreo y un esquema que escala con tu operación. La base técnica que sostiene la plataforma para que crezcas con tranquilidad.",
    mock: "arch",
    mockLabel: "Esquema de arquitectura",
    resuelve: [
      { icon: "Server", title: "Recursos propios, no compartidos", desc: "Servidor dedicado por cliente: el desempeño de una operación no depende de las demás." },
      { icon: "ShieldCheck", title: "Continuidad del negocio", desc: "Respaldos y monitoreo para reducir el riesgo de pérdida de información y de interrupciones." },
      { icon: "TrendingUp", title: "Crece sin rehacer todo", desc: "El esquema escala conforme aumentan usuarios, transacciones y mercados, sin paquetes cerrados." }
    ],
    incluye: [
      "Servidor dedicado por cliente",
      "Respaldos periódicos de la información",
      "Monitoreo de disponibilidad y desempeño",
      "Escalamiento según crecimiento de la operación",
      "Controles de acceso y perfiles",
      "Prácticas de seguridad sobre los datos",
      "Soporte técnico de infraestructura",
      "Preparada para operación multipaís"
    ],
    conexion: {
      icon: "Rocket",
      text: ["Plataforma · Implementación", " → el servidor dedicado y su configuración se entregan dentro del ciclo de instalación acompañado, con ejecutivo de cuenta y soporte continuo."],
      linkLabel: "Ver Implementación y soporte",
      to: "/plataforma/implementacion"
    },
    related: ["implementacion", "backoffice", "software-netzen"],
    ctaTitle: "¿Quieres conocer la base técnica?"
  },

  implementacion: {
    name: "Implementación, acompañamiento y soporte",
    short: "Implementación y soporte",
    icon: "Rocket",
    badge: "Servicio incluido",
    title: "Implementación, acompañamiento y soporte",
    lead: "El contrato de uso de la plataforma no llega solo. Cada implementación incluye consultoría, un ejecutivo de cuenta dedicado y soporte continuo, con un ciclo de instalación claro de principio a fin.",
    mock: "cycle",
    mockLabel: "Ciclo de implementación",
    resuelve: [
      { icon: "Map", title: "Arranque sin improvisar", desc: "Un ciclo definido reduce la incertidumbre: cada etapa tiene objetivo, responsables y entregables." },
      { icon: "UserPlus", title: "Un solo interlocutor", desc: "El ejecutivo de cuenta acompaña antes, durante y después; no quedas a la deriva entre áreas." },
      { icon: "HeartHandshake", title: "Continuidad después del «go live»", desc: "Soporte continuo y mejoras; la relación no termina cuando la plataforma entra en operación." }
    ],
    ciclo: [
      { title: "Diagnóstico y alcance", description: "Entendemos el modelo de negocio, la operación actual y los objetivos para definir la configuración." },
      { title: "Consultoría y configuración", description: "Se estructura el plan y se configura la plataforma bajo licencia; la consultoría va incluida en esta etapa." },
      { title: "Migración de datos", description: "Se cargan catálogos, red, inventario e históricos, con validación antes de operar." },
      { title: "Capacitación", description: "Formamos a los equipos y, cuando aplica, profesionalizamos a la red en Academy." },
      { title: "Puesta en marcha", description: "Salida a producción acompañada, con monitoreo del arranque." },
      { title: "Soporte y mejora continua", description: "Ejecutivo de cuenta y soporte permanente; ajustes y nuevos módulos conforme creces." }
    ],
    incluye: [
      "Ciclo de instalación con etapas y entregables claros",
      "Consultoría incluida en la configuración",
      "Ejecutivo de cuenta dedicado",
      "Migración de datos validada",
      "Capacitación a los equipos",
      "Soporte continuo tras el arranque"
    ],
    conexion: {
      icon: "Wrench",
      text: ["Consulting · Consultoría tecnológica", " → va incluida en cada implementación: estructurar el plan y la tecnología es parte del servicio, no un extra opcional."],
      linkLabel: "Ver Consultoría tecnológica",
      to: "/consulting/tecnologia"
    },
    related: ["infraestructura", "software-netzen", "backoffice"],
    ctaTitle: "¿Quieres conocer el plan de implementación?"
  },

  extras: {
    name: "Extras y satelitales",
    short: "Extras y satelitales",
    icon: "Sparkles",
    badge: "Complementos",
    title: "Extras y satelitales",
    lead: "Capacidades adicionales que se suman a la plataforma según lo que cada negocio necesita: Metaverso, Live Shopping, pasarelas de pago y Tiempo Naranja como producto de entrada. Complementos, no parte de la licencia base.",
    mock: "cards",
    mockLabel: "Catálogo de complementos",
    resuelve: [
      { icon: "Puzzle", title: "Suma capacidades a tu medida", desc: "Activas solo los complementos que tu operación necesita, sin cargar a todos con lo que no usan." },
      { icon: "PlayCircle", title: "Nuevos canales de venta", desc: "Experiencias como Live Shopping y Metaverso abren formas distintas de conectar con el cliente." },
      { icon: "CreditCard", title: "Cobro flexible", desc: "Pasarelas de pago integradas para cobrar en línea desde la tienda y la Oficina Virtual." }
    ],
    catalogo: [
      { icon: "Globe", name: "Metaverso", badge: "Extra", tone: "info", desc: "Experiencias inmersivas como complemento de marca y eventos. Se contrata como extra, según el proyecto." },
      { icon: "Video", name: "Live Shopping", badge: "Extra · renta adicional", tone: "warning", desc: "Venta en vivo por transmisión, integrada al catálogo y al carrito. No forma parte de la licencia base; implica una renta adicional." },
      { icon: "CreditCard", name: "Pasarelas de pago", badge: "Disponible", tone: "success", desc: "Integración de cobros en línea para tienda y Oficina Virtual, según los proveedores habilitados." },
      { icon: "Clock", name: "Tiempo Naranja", badge: "Producto de entrada", tone: "accent", desc: "Producto de entrada validado para iniciar de forma más ligera. Se recomienda después del diagnóstico, cuando aplica; no es el primer paso." }
    ],
    incluye: [],
    conexion: {
      icon: "Sprout",
      text: ["Soluciones · Apenas empiezo", " → Tiempo Naranja aparece en el recorrido después del diagnóstico como producto de entrada validado, no como primer paso."],
      linkLabel: "Ver ruta «Apenas empiezo»",
      to: "/soluciones/empezar"
    },
    conexion2: {
      icon: "MonitorSmartphone",
      text: ["Plataforma · Oficina Virtual", " → las pasarelas de pago habilitan el cobro en las tiendas replicadas de cada distribuidor independiente."],
      linkLabel: "Ver Oficina Virtual",
      to: "/plataforma/oficina-virtual"
    },
    related: ["software-netzen", "oficina-virtual", "implementacion"],
    ctaTitle: "¿Quieres saber qué extras te convienen?"
  }
};

export const MODULOS_ORDER = [
  "software-netzen", "oficina-virtual", "nia", "analitica-prediccion",
  "promociones-inventario", "backoffice", "infraestructura", "implementacion", "extras"
];
