// Contenido de los recorridos de Soluciones (fuente: wireframes fase 1.2)
export const RECORRIDOS = {
  empezar: {
    letter: "A",
    badge: "Ruta A · Apenas empiezo",
    name: "Apenas empiezo",
    icon: "Sprout",
    title: "Apenas empiezo o estoy explorando el modelo",
    lead: "Quieres entender bien de qué se trata y arrancar con bases firmes, sin invertir a ciegas. Te acompañamos paso a paso: primero entiendes, luego diagnosticamos tu caso y solo entonces diseñamos un plan a tu medida.",
    heroActions: [
      { label: "Agenda tu diagnóstico", to: "/contacto" },
      { label: "Conoce Consulting", to: "/consulting", variant: "secondary" }
    ],
    paraTi: [
      { icon: "Search", title: "Estás explorando", desc: "Te interesa la venta directa o el multinivel, pero todavía no sabes si es para ti ni por dónde empezar." },
      { icon: "Flag", title: "Quieres arrancar bien", desc: "Prefieres entender el modelo y validar tu idea antes de invertir, en lugar de improvisar." },
      { icon: "HeartHandshake", title: "Buscas acompañamiento", desc: "Quieres a alguien con experiencia que te oriente en cada paso, sin tecnicismos innecesarios." }
    ],
    caminoTitle: "Tu camino paso a paso",
    caminoEyebrow: "Recorrido recomendado · combina los tres núcleos",
    camino: [
      { title: "Descubre", core: "Consulting", desc: "Entiende qué es Netzen, cómo funciona el modelo y qué prácticas correctas de la industria conviene seguir." },
      { title: "Diagnóstico", core: "Consulting", desc: "Revisamos tu caso real: idea, recursos y objetivos. Definimos alcance y necesidad, sin precio todavía." },
      { title: "Plan recomendado", core: "Consulting", desc: "Con base en el diagnóstico te proponemos el recorrido más sensato para tu etapa." },
      { title: "Tiempo Naranja — si aplica", core: "Plataforma", tag: "Si aplica", desc: "Producto de entrada validado para empezar con menor fricción. Se recomienda solo cuando el diagnóstico indica que encaja con tu caso." },
      { title: "Software", core: "Plataforma", desc: "Activas la plataforma configurable mediante contrato de uso de licencia en modalidad de renta para operar tu negocio desde un solo lugar." },
      { title: "Academy", core: "Academy", desc: "Te formas como empresario para dirigir con criterio, no solo para usar un sistema." },
      { title: "Opera", core: "Plataforma", desc: "Arrancas operaciones con soporte continuo y métricas para crecer con confianza." }
    ],
    conexiones: [
      { icon: "Award", text: "Este recorrido conecta Consulting (descubre, diagnóstico y plan) → Plataforma (software y operación) → Academy · Alta Dirección (formación del empresario).", linkLabel: "Ver Alta Dirección", to: "/academy/alta-direccion" }
    ],
    form: {
      eyebrow: "Empieza por tu diagnóstico",
      title: "Déjanos tus datos y te contactamos para entender tu caso",
      note: "Sin compromiso y sin precio en este primer paso.",
      fields: [
        { label: "Nombre completo", placeholder: "María González", required: true },
        { label: "Correo electrónico", placeholder: "nombre@empresa.com", type: "email", required: true },
        { label: "Teléfono / WhatsApp", placeholder: "+52 33 1234 5678", type: "tel" },
        { label: "¿Qué te gustaría lograr?", placeholder: "Cuéntanos brevemente tu idea o tu duda", textarea: true }
      ],
      submit: "Agenda tu diagnóstico"
    },
    cta: { title: "¿Listo para arrancar bien?", desc: "La conversación empieza por entender tu caso, no por venderte un sistema.", primary: "Agenda tu diagnóstico", secondary: "Ver otros recorridos", secondaryTo: "/soluciones" }
  },

  "empresa-establecida": {
    letter: "B",
    badge: "Ruta B · Empresa establecida",
    name: "Empresa establecida",
    icon: "Building2",
    title: "Empresa establecida que busca escalar su operación",
    lead: "Tu negocio ya factura y crece, pero la operación empieza a apretar: sistemas que no conversan, procesos manuales y planes de expansión que necesitan tecnología a la altura. Te ayudamos a migrar, escalar y profesionalizar con una sola plataforma conectada.",
    heroActions: [
      { label: "Solicita un demo protegido", to: "/contacto/demo" },
      { label: "Agenda tu diagnóstico", to: "/contacto", variant: "secondary" }
    ],
    paraTi: [
      { icon: "Gauge", title: "Tu operación ya no escala", desc: "Tienes volumen, pero tus sistemas actuales frenan el crecimiento o exigen demasiado trabajo manual." },
      { icon: "Globe", title: "Quieres vender en más canales", desc: "Necesitas integrar venta directa, retail, e-commerce y punto de venta en una sola operación conectada." },
      { icon: "Map", title: "Piensas en multipaís", desc: "Quieres abrir nuevos mercados con catálogos, impuestos y reglas que se adapten a cada país." }
    ],
    beneficiosTitle: "Lo que resolvemos para empresas establecidas",
    beneficios: [
      "Migración ordenada desde tus sistemas actuales, sin frenar la operación",
      "Escalamiento sin techos rígidos de usuarios ni paquetes cerrados",
      "Operación multipaís con catálogos, impuestos y reglas por mercado",
      "Omnicanalidad real entre tus canales y mercados",
      "Analítica y predicción para decidir con datos, no por intuición",
      "Profesionalización de la red de distribuidores que opera el negocio"
    ],
    nota: { icon: "Globe", text: "Omnicanalidad = integra canales y mercados —venta directa, retail, e-commerce, punto de venta y otros— en una sola operación conectada. No es solo «vender en varios lugares», sino operarlos como un solo negocio." },
    caminoTitle: "Tu camino para escalar",
    caminoEyebrow: "Recorrido recomendado · combina los tres núcleos",
    camino: [
      { title: "Demo protegido + Consulting", core: "Consulting", desc: "Ves la plataforma funcionando y diagnosticamos tu operación actual: qué migrar, qué integrar y cómo escalar." },
      { title: "Migra a la Plataforma", core: "Plataforma", desc: "Trasladamos tu operación a una plataforma configurable mediante contrato de uso de licencia en modalidad de renta, con consultoría incluida en la implementación." },
      { title: "Academy · Distribuidor Independiente", core: "Academy", desc: "Profesionalizas a la red de distribuidores y la fuerza comercial que sostiene el crecimiento (venta B2B)." },
      { title: "Escala", core: "Plataforma", desc: "Activas omnicanalidad, multipaís, analítica y predicción para crecer con datos y soporte continuo." }
    ],
    conexiones: [
      { icon: "Users", text: "Recorrido entre núcleos: Consulting (demo + diagnóstico) → Plataforma (migración y escalamiento) → Academy · Distribuidor Independiente (profesionaliza la red).", linkLabel: "Ver Distribuidor Independiente", to: "/academy/distribuidor-independiente" },
      { icon: "Map", text: "Para abrir mercados nuevos, conecta con Consulting · Estrategia y expansión.", linkLabel: "Ver Estrategia", to: "/consulting/estrategia" }
    ],
    form: {
      eyebrow: "Agenda tu demo protegido",
      title: "Cuéntanos sobre tu operación actual",
      note: "Te mostramos cómo escalar sin frenar el negocio.",
      fields: [
        { label: "Nombre y cargo", placeholder: "Nombre · Dirección / Operaciones", required: true },
        { label: "Empresa", placeholder: "Razón social o marca", required: true },
        { label: "Correo corporativo", placeholder: "nombre@empresa.com", type: "email", required: true },
        { label: "¿Qué sistemas usas hoy y qué quieres escalar?", placeholder: "Migración, omnicanalidad, multipaís, analítica…", textarea: true }
      ],
      submit: "Solicita un demo protegido"
    },
    cta: { title: "Es momento de escalar tu operación", desc: "Empezamos por entender tu negocio y mostrarte la plataforma; el precio llega después del diagnóstico.", primary: "Solicita un demo protegido", primaryTo: "/contacto/demo", secondary: "Agenda tu diagnóstico", secondaryTo: "/contacto" }
  },

  "red-de-distribuidores": {
    letter: "C",
    badge: "Ruta C · Profesionalizar la red",
    name: "Profesionaliza tu red",
    icon: "Users",
    title: "Profesionaliza y fideliza la red de distribuidores con la que trabajas",
    lead: "Tu negocio depende de la red de distribuidores y la fuerza comercial que lo mueve. Cuando esa red está bien formada, vende mejor, se queda más tiempo y representa mejor a tu marca. Te ayudamos a profesionalizarla con un programa diseñado para distribuidores independientes.",
    heroActions: [
      { label: "Ver Academy · Distribuidor Independiente", to: "/academy/distribuidor-independiente" },
      { label: "Cotización B2B", to: "/contacto", variant: "secondary" }
    ],
    paraTi: [
      { icon: "Network", title: "Trabajas con una red", desc: "Tu empresa comercializa a través de una red de distribuidores independientes y una fuerza comercial." },
      { icon: "Target", title: "Quieres profesionalizar su operación", desc: "Buscas que tu red venda con método, conozca el producto y opere con prácticas correctas." },
      { icon: "HeartHandshake", title: "Te importa la fidelización", desc: "Quieres reducir rotación y que tus distribuidores crezcan contigo a largo plazo." }
    ],
    beneficiosTitle: "Qué logra una red profesionalizada",
    beneficios: [
      "Distribuidores que conocen el producto y el modelo a fondo",
      "Método de venta y prácticas correctas de la industria",
      "Mejor representación de tu marca frente al cliente final",
      "Mayor permanencia y menor rotación de la red",
      "Formación a escala para cohortes grandes (100–200 personas)",
      "Un mismo estándar de formación para toda la fuerza comercial"
    ],
    caminoTitle: "Tu camino para profesionalizar la red",
    caminoEyebrow: "Recorrido recomendado · ruta directa a Academy",
    camino: [
      { title: "Diagnóstico de la red", core: "Consulting", desc: "Revisamos el tamaño, el nivel y las necesidades de formación de tu red de distribuidores." },
      { title: "Academy · Distribuidor Independiente", core: "Academy", desc: "Programa de 88 horas para la red de distribuidores y la fuerza comercial, en cohortes grandes. La empresa lo contrata para su red (venta B2B)." },
      { title: "Fideliza y opera", core: "Plataforma", desc: "La red formada opera mejor con la Oficina Virtual: tienda, herramientas propias y seguimiento por distribuidor." }
    ],
    conexiones: [
      { icon: "GraduationCap", text: "Ruta directa a Academy · Distribuidor Independiente (88 horas, cohortes de 100–200, venta B2B).", linkLabel: "Ver programa", to: "/academy/distribuidor-independiente" },
      { icon: "MonitorSmartphone", text: "La red formada potencia Plataforma · Oficina Virtual: la herramienta que cada distribuidor opera día a día.", linkLabel: "Ver Oficina Virtual", to: "/plataforma/oficina-virtual" }
    ],
    form: {
      eyebrow: "Solicita tu cotización B2B",
      title: "Cuéntanos sobre tu red",
      note: "Te preparamos una propuesta de formación a la medida del tamaño de tu fuerza comercial.",
      fields: [
        { label: "Nombre y cargo", placeholder: "Nombre · Dirección comercial", required: true },
        { label: "Empresa", placeholder: "Razón social o marca", required: true },
        { label: "Tamaño aproximado de la red", placeholder: "N.º de distribuidores" },
        { label: "¿Qué quieres lograr con tu red?", placeholder: "Formación, fidelización, método de venta…", textarea: true }
      ],
      submit: "Cotización B2B"
    },
    cta: { title: "Una red profesionalizada vende y permanece más", desc: "La empresa contrata la formación para su red de distribuidores. Pide tu cotización B2B y dimensionamos el programa contigo.", primary: "Cotización B2B", secondary: "Ver programa", secondaryTo: "/academy/distribuidor-independiente" }
  },

  modernizar: {
    letter: "D",
    badge: "Ruta D · Modernizar",
    isNew: true,
    name: "Modernizar sin migrar todo",
    icon: "RefreshCw",
    title: "Ya tengo software propio y quiero modernizar sin migrar todo",
    lead: "Tu empresa opera con tecnología propia que en parte ya quedó obsoleta, pero migrar toda la plataforma no es una opción hoy. No tienes que reemplazarlo todo: puedes conectarte a herramientas ágiles de Netzen y modernizar de forma gradual, sin detener tu operación.",
    heroActions: [
      { label: "Agenda tu diagnóstico", to: "/contacto" },
      { label: "Ver integraciones", to: "/plataforma/extras", variant: "secondary" }
    ],
    paraTi: [
      { icon: "Server", title: "Tienes software propio", desc: "Desarrollaste o adquiriste tu propia plataforma y representa años de inversión y procesos." },
      { icon: "Clock", title: "Parte ya quedó obsoleta", desc: "Algunas piezas de tu tecnología te frenan, pero el núcleo todavía sostiene tu operación." },
      { icon: "Puzzle", title: "No migrarías todo (aún)", desc: "Reemplazar toda la plataforma es inviable hoy, pero sí buscas modernizar por partes y ganar agilidad." }
    ],
    beneficiosTitle: "Cómo modernizas sin migrar todo",
    beneficios: [
      "Integraciones que conectan tu sistema actual con módulos ágiles de Netzen",
      "Herramientas satelitales que suman capacidades sin tocar tu núcleo",
      "Automatización de procesos que hoy son manuales",
      "Analítica y predicción sobre tus propios datos",
      "NIA: reporteo y análisis en lenguaje natural",
      "Consultoría tecnológica para definir qué modernizar primero"
    ],
    nota: { icon: "RefreshCw", text: "Empiezas por donde más duele y avanzas por etapas: cada módulo se conecta a tu plataforma actual, no la sustituye. La modernización es gradual y reversible por bloques." },
    caminoTitle: "Tu camino para modernizar por etapas",
    caminoEyebrow: "Recorrido de modernización gradual",
    camino: [
      { title: "Integraciones + satelitales", core: "Plataforma", desc: "Conectamos tu software propio con herramientas ágiles y satelitales de Netzen. Sumas capacidades sin reemplazar tu núcleo." },
      { title: "Analítica · NIA", core: "Plataforma", desc: "Activas analítica, predicción y NIA (reporteo en lenguaje natural) sobre tus datos para decidir mejor desde ya." },
      { title: "Diagnóstico", core: "Consulting", desc: "Con la operación ya conectada, definimos el plan de modernización por etapas: qué automatizar después y cómo crecer." }
    ],
    conexiones: [
      { icon: "Cpu", text: "Plataforma aporta lo técnico: integraciones, satelitales, automatización, analítica y NIA.", linkLabel: "Ver NIA", to: "/plataforma/nia" },
      { icon: "Wrench", text: "Consulting · Consultoría tecnológica define qué modernizar primero y acompaña la integración.", linkLabel: "Ver Consultoría tecnológica", to: "/consulting/tecnologia" }
    ],
    form: {
      eyebrow: "Diagnostica tu modernización",
      title: "Cuéntanos qué tienes hoy y dónde te frena",
      note: "Te proponemos por dónde empezar a modernizar, sin migrar todo.",
      fields: [
        { label: "Nombre y cargo", placeholder: "Nombre · TI / Dirección", required: true },
        { label: "Empresa", placeholder: "Razón social o marca", required: true },
        { label: "Correo corporativo", placeholder: "nombre@empresa.com", type: "email", required: true },
        { label: "¿Qué software propio usas y qué te gustaría modernizar?", placeholder: "Sistema actual, integraciones deseadas, procesos manuales…", textarea: true }
      ],
      submit: "Agenda tu diagnóstico"
    },
    cta: { title: "Moderniza sin migrar todo", desc: "Conecta tu sistema actual a herramientas ágiles y avanza por etapas. La conversación empieza por entender tu tecnología, no por reemplazarla.", primary: "Agenda tu diagnóstico", secondary: "Ver integraciones", secondaryTo: "/plataforma/extras" }
  },

  "cliente-actual": {
    letter: "E",
    badge: "Ruta E · Cliente actual",
    name: "Cliente actual / expansión",
    icon: "Handshake",
    title: "Ya operas con Netzen: crezcamos juntos",
    lead: "Esta ruta es para clientes actuales que quieren sacar más valor de la plataforma: actualizar su versión, activar módulos y extras, capacitar a su red de distribuidores y revisar su plan con Consulting.",
    heroActions: [
      { label: "Habla con tu ejecutivo de cuenta", to: "/contacto" },
      { label: "Entrar a Oficina Virtual", to: "/plataforma/oficina-virtual", variant: "secondary" }
    ],
    paraTi: [
      { icon: "Cpu", title: "Ya usas la plataforma", desc: "Operas con Software Netzen y quieres aprovechar módulos que aún no activas." },
      { icon: "TrendingUp", title: "Quieres crecer", desc: "Buscas escalar a más países, canales o a un modelo omnicanal con tu operación actual." },
      { icon: "Users", title: "Tu red necesita método", desc: "Quieres capacitar a tu red de distribuidores y profesionalizar su operación con Academy." }
    ],
    caminoTitle: "Cómo funciona la expansión",
    caminoEyebrow: "Recorrido recomendado",
    camino: [
      { title: "Revisión de cuenta (QBR)", core: "Cuenta", desc: "Tu ejecutivo de cuenta revisa uso, módulos activos, tickets y oportunidades." },
      { title: "Actualización y módulos", core: "Plataforma", desc: "Actualizas versión y activas módulos o extras (analítica, NIA, satelitales)." },
      { title: "Capacitación de la red", core: "Academy", desc: "Cohortes y talleres para tu red de distribuidores." },
      { title: "Revisión de plan", core: "Consulting", desc: "Auditoría y ajuste del plan de compensación si cambió tu operación." },
      { title: "Referidos y casos", core: "Comunidad", desc: "Programa de referidos y posibilidad de caso de éxito (con tu permiso)." }
    ],
    oportunidades: [
      { icon: "Sparkles", title: "Módulos y extras", desc: "Live Shopping, metaverso, pasarelas y satelitales que aún no usas.", to: "/plataforma/extras" },
      { icon: "TrendingUp", title: "Analítica y NIA", desc: "Predicción, escenarios y reporteo en lenguaje natural sobre tu operación.", to: "/plataforma/analitica-prediccion" },
      { icon: "GraduationCap", title: "Capacitación de la red", desc: "Profesionaliza a la red que ya opera tu plataforma.", to: "/academy" },
      { icon: "Scale", title: "Revisión de plan", desc: "Audita y ajusta tu plan de compensación.", to: "/consulting/planes-de-compensacion" },
      { icon: "Globe", title: "Escalar a más países", desc: "Omnicanalidad y multipaís sobre tu operación actual.", to: "/consulting/estrategia" },
      { icon: "HeartHandshake", title: "Soporte y acompañamiento", desc: "Ejecutivo de cuenta y soporte continuo.", to: "/plataforma/implementacion" }
    ],
    conexiones: [],
    form: {
      eyebrow: "Solicitud de expansión",
      title: "Cuéntanos qué quieres lograr",
      note: "Comparte tu operación actual y tu ejecutivo de cuenta preparará una propuesta de actualización o expansión.",
      fields: [
        { label: "Empresa", placeholder: "Razón social o marca", required: true },
        { label: "Versión / módulos activos", placeholder: "Lo que operas hoy" },
        { label: "Correo de contacto", placeholder: "nombre@empresa.com", type: "email", required: true },
        { label: "¿Qué quieres lograr?", placeholder: "Actualización, extras, capacitación, revisión de plan…", textarea: true }
      ],
      submit: "Enviar solicitud"
    },
    cta: { title: "Crezcamos juntos", desc: "Actualización, módulos, capacitación y revisión de plan: tu ejecutivo de cuenta arma la ruta contigo.", primary: "Hablar con mi ejecutivo", secondary: "Ver extras", secondaryTo: "/plataforma/extras" }
  }
};

export const RECORRIDOS_ORDER = ["empezar", "empresa-establecida", "red-de-distribuidores", "modernizar"];

// Landings por modelo de negocio
export const MODELOS_NEGOCIO = {
  "venta-directa": {
    name: "Venta directa", icon: "ShoppingCart",
    tagline: "Catálogos, comisiones y fuerza comercial en una sola operación.",
    hero: "Opera catálogos, promociones, lealtad y comisiones de tu fuerza comercial desde una sola plataforma conectada, sin sistemas sueltos.",
    opera: [
      { icon: "Store", title: "Operación central", desc: "Catálogos, precios, pedidos e inventario de campaña en un mismo motor comercial." },
      { icon: "Scale", title: "Comisiones y reglas", desc: "Comisiones por campaña, lealtad y referidos configurados sobre tu plan real." },
      { icon: "TrendingUp", title: "Crecimiento", desc: "Suma e-commerce y punto de venta a la operación de catálogo sin duplicar sistemas." }
    ],
    capacidades: ["Catálogos y campañas con vigencias", "Comisiones de fuerza comercial por periodo", "Promociones, lealtad y referidos", "Pedidos consolidados y logística de reparto", "Reportes de venta por campaña y zona", "Soporte y acompañamiento continuo"]
  },
  multinivel: {
    name: "Multinivel", icon: "Network",
    tagline: "Genealogía, planes de compensación y motor de comisiones probado.",
    hero: "Genealogía completa, plan de compensación auditado y un motor de comisiones que calcula y paga exactamente lo que el plan promete.",
    opera: [
      { icon: "Network", title: "Operación central", desc: "Genealogía, rangos y calificaciones de la red de distribuidores en tiempo real." },
      { icon: "Scale", title: "Comisiones y reglas", desc: "El plan diseñado en Consulting se vuelve la configuración del motor de comisiones." },
      { icon: "TrendingUp", title: "Crecimiento", desc: "Oficina Virtual por distribuidor, analítica de movilidad de rangos y multipaís." }
    ],
    capacidades: ["Genealogía y vista por niveles", "Motor de comisiones configurable y auditable", "Oficina Virtual y tiendas replicadas", "Movilidad de rangos con analítica predictiva", "Eventos de calificación y bonos", "Soporte y acompañamiento continuo"]
  },
  retail: {
    name: "Retail", icon: "Store",
    tagline: "Inventario por sucursal, promociones y backoffice integrado.",
    hero: "Inventario por sucursal, promociones con reglas claras y un backoffice que concentra facturación, costos y reportes de toda la cadena.",
    opera: [
      { icon: "Package", title: "Operación central", desc: "Inventario en tiempo real por ubicación, con reorden automático por sucursal." },
      { icon: "Percent", title: "Comisiones y reglas", desc: "Promociones por tienda, producto o segmento con vigencias y topes configurables." },
      { icon: "TrendingUp", title: "Crecimiento", desc: "Abre sucursales y canales digitales sobre el mismo backoffice, sin sistemas paralelos." }
    ],
    capacidades: ["Inventario multialmacén en tiempo real", "Reorden automático por sucursal", "Promociones por tienda y segmento", "Facturación e impuestos integrados", "Comparativos de venta por sucursal", "Soporte y acompañamiento continuo"]
  },
  franquicias: {
    name: "Franquicias", icon: "Building2",
    tagline: "Unidades de negocio, control de marca y reglas por punto.",
    hero: "Cada franquicia opera con autonomía dentro de las reglas de la marca: catálogos, precios y promociones controlados desde la matriz.",
    opera: [
      { icon: "Building2", title: "Operación central", desc: "Unidades de negocio con catálogos y reglas sincronizados desde la matriz." },
      { icon: "Scale", title: "Comisiones y reglas", desc: "Regalías, precios y promociones por punto, con control de marca centralizado." },
      { icon: "TrendingUp", title: "Crecimiento", desc: "Suma unidades sin perder control: reportes consolidados y por franquicia." }
    ],
    capacidades: ["Unidades de negocio con reglas propias", "Catálogos y precios controlados por matriz", "Regalías y liquidaciones por punto", "Reportes consolidados y por unidad", "Franquicias digitales", "Soporte y acompañamiento continuo"]
  },
  ecommerce: {
    name: "E-commerce", icon: "ShoppingCart",
    tagline: "Tienda integrada, pasarelas de pago y catálogos por canal.",
    hero: "Tu tienda en línea conectada al mismo inventario, promociones y comisiones del resto de la operación — un solo negocio, no un canal aparte.",
    opera: [
      { icon: "ShoppingCart", title: "Operación central", desc: "Tienda integrada al inventario y catálogos del backoffice, sin recapturas." },
      { icon: "CreditCard", title: "Comisiones y reglas", desc: "Pasarelas de pago, promociones por canal y comisiones que reconocen la venta digital." },
      { icon: "TrendingUp", title: "Crecimiento", desc: "Tiendas replicadas por distribuidor y venta omnicanal conectada." }
    ],
    capacidades: ["Tienda en línea integrada al backoffice", "Pasarelas de pago habilitadas", "Catálogos y precios por canal", "Carrito conectado a comisiones", "Tiendas replicadas por distribuidor", "Soporte y acompañamiento continuo"]
  },
  "punto-de-venta": {
    name: "Punto de venta", icon: "CreditCard",
    tagline: "POS conectado al inventario, comisiones y reportes en tiempo real.",
    hero: "Un punto de venta que no vive aislado: cada ticket descuenta inventario, calcula comisiones y alimenta los reportes al instante.",
    opera: [
      { icon: "CreditCard", title: "Operación central", desc: "POS conectado al inventario y catálogos: cada venta actualiza todo el sistema." },
      { icon: "Scale", title: "Comisiones y reglas", desc: "Comisiones y promociones aplicadas en mostrador con las mismas reglas del negocio." },
      { icon: "TrendingUp", title: "Crecimiento", desc: "Abre cajas y sucursales con reportes en tiempo real por punto de venta." }
    ],
    capacidades: ["POS conectado a inventario en tiempo real", "Promociones aplicadas en mostrador", "Comisiones por vendedor y sucursal", "Cortes de caja y auditoría", "Reportes por punto de venta", "Soporte y acompañamiento continuo"]
  }
};

export const MODELOS_ORDER = ["venta-directa", "multinivel", "retail", "franquicias", "ecommerce", "punto-de-venta"];
