// Contenido de los programas de Academy (fuente: wireframes fase 1.2)
export const PROGRAMAS = {
  "alta-direccion": {
    name: "Diplomado en Alta Dirección",
    short: "Alta Dirección",
    icon: "Award",
    badge: "Programa · Academy",
    tone: "accent",
    modelo: "Individual · B2C",
    title: "Diplomado en Alta Dirección",
    lead: "Programa online para empresarios e inversionistas que dirigen o financian una operación de venta directa o multinivel. Formato más personalizado para tomar mejores decisiones de modelo, estructura y crecimiento.",
    heroNote: "Individual / B2C: lo cursa la persona que dirige o invierte.",
    paraQuien: [
      { icon: "Building2", title: "Empresarios", desc: "Fundadores y directivos de empresas de venta directa o multinivel que buscan escalar y profesionalizar su operación." },
      { icon: "CircleDollarSign", title: "Inversionistas", desc: "Quienes financian o evalúan entrar a un proyecto del sector y necesitan entender el modelo a fondo." },
      { icon: "Briefcase", title: "Directivos en transición", desc: "Líderes que llegan desde otra industria y quieren dominar las particularidades de la venta directa." }
    ],
    paraQuienNote: "Formato online y más personalizado que el diplomado de la red: grupos reducidos, acompañamiento cercano y casos aplicados a la realidad de cada empresa.",
    logras: [
      "Decidir el modelo de negocio adecuado y su estructura",
      "Entender el plan de compensación y sus riesgos económicos",
      "Leer la operación con indicadores y analítica",
      "Planear el crecimiento y la expansión multipaís",
      "Alinear tecnología, equipo y red de distribuidores",
      "Aplicar prácticas correctas de la industria"
    ],
    temario: [
      { title: "Módulo 1 · Modelo y estrategia", content: "Modelos de venta directa y multinivel, estructura de negocio y decisiones fundacionales del proyecto." },
      { title: "Módulo 2 · Plan de compensación", content: "Lógica económica del plan: incentivos, riesgos, sostenibilidad y lectura de indicadores clave." },
      { title: "Módulo 3 · Operación y tecnología", content: "Procesos, backoffice, analítica y el papel de la plataforma tecnológica en la operación diaria." },
      { title: "Módulo 4 · Crecimiento y expansión", content: "Escalamiento, omnicanalidad y expansión multipaís con orden y control." }
    ],
    temarioNote: "Estructura de referencia por módulos; el detalle final se confirma con la coordinación académica.",
    formato: [
      { icon: "Video", title: "Modalidad", desc: "100% online, en vivo, con grupos reducidos y acompañamiento personalizado." },
      { icon: "Clock", title: "Duración", desc: "11 semanas (calendario sujeto a confirmación)." },
      { icon: "NotebookPen", title: "Inscripción", desc: "Cupo individual. Te orientamos sobre fechas, requisitos y proceso de admisión." }
    ],
    stats: [
      { value: 11, suffix: " sem", label: "de programa en vivo" },
      { value: 4, label: "módulos de dirección aplicada" },
      { value: 100, suffix: "%", label: "online, grupos reducidos" }
    ],
    conexion: {
      icon: "Compass",
      text: ["Academy → Consulting", " : del aula a la estrategia. Tras el diplomado, la dirección puede aterrizar decisiones con acompañamiento experto en modelo, plan de compensación y expansión."],
      linkLabel: "Ver Consulting",
      to: "/consulting"
    },
    related: [
      { to: "/academy/distribuidor-independiente", icon: "Users", title: "Distribuidor Independiente", desc: "Diplomado para la red de distribuidores." },
      { to: "/academy/talleres", icon: "Presentation", title: "Talleres", desc: "Formación puntual complementaria." },
      { to: "/consulting/estrategia", icon: "Map", title: "Consulting · Estrategia", desc: "Modelo, mercado y expansión." }
    ],
    cta: { title: "Solicita información / inscripción", desc: "Te compartimos fechas, requisitos y proceso de admisión del diplomado.", label: "Solicita información" }
  },

  "distribuidor-independiente": {
    name: "Diplomado para Distribuidor Independiente",
    short: "Distribuidor Independiente",
    icon: "Users",
    badge: "Programa · Academy",
    tone: "info",
    modelo: "Venta B2B · la empresa contrata",
    title: "Diplomado para Distribuidor Independiente",
    lead: "Programa de profesionalización para la red de distribuidores y la fuerza comercial. La empresa contrata la formación para su red: cohortes grandes, contenido aplicado y método de ventas estructurado.",
    heroNote: "Venta B2B: el comprador es la empresa, que contrata el diplomado para profesionalizar a su red. La inscripción no es individual.",
    paraQuien: [
      { icon: "Network", title: "Red de distribuidores", desc: "Distribuidores independientes que operan su negocio y quieren un método de ventas profesional." },
      { icon: "Target", title: "Fuerza comercial", desc: "Líderes y equipos comerciales que necesitan estandarizar prácticas y resultados." },
      { icon: "Building2", title: "Empresas que contratan", desc: "Compañías que quieren formar a su red de distribuidores de manera homogénea y a escala." }
    ],
    logras: [
      "Método de ventas y prospección estructurados",
      "Manejo de la Oficina Virtual y herramientas digitales",
      "Construcción y seguimiento de la red",
      "Atención a cliente y fidelización",
      "Ética comercial y prácticas correctas de la industria",
      "Constancia / reconocimiento al completar el programa"
    ],
    lograsTitle: "Qué incluye",
    stats: [
      { value: 88, suffix: " h", label: "carga horaria del diplomado" },
      { value: 200, prefix: "100–", label: "participantes por cohorte" },
      { value: 0, custom: "B2B", label: "la empresa contrata para su red" }
    ],
    conexion: {
      icon: "MonitorSmartphone",
      text: ["Plataforma · Oficina Virtual", " → este diplomado profesionaliza a la red que opera la Oficina Virtual: URL, tienda y herramientas propias por distribuidor."],
      linkLabel: "Ver Oficina Virtual",
      to: "/plataforma/oficina-virtual"
    },
    related: [
      { to: "/academy/alta-direccion", icon: "Award", title: "Alta Dirección", desc: "Diplomado para empresarios e inversionistas." },
      { to: "/academy/talleres", icon: "Presentation", title: "Talleres", desc: "Formación puntual complementaria." },
      { to: "/soluciones/red-de-distribuidores", icon: "Route", title: "Soluciones · Red", desc: "Ruta para profesionalizar tu red." }
    ],
    cta: { title: "Cotización B2B", desc: "Arma una cohorte para tu red de distribuidores. Te preparamos una propuesta según el número de participantes y calendario.", label: "Cotización B2B" }
  },

  multimarcas: {
    name: "Cohortes multimarcas",
    short: "Cohortes multimarcas",
    icon: "Network",
    badge: "Modalidad · Academy",
    tone: "warning",
    modelo: "Grupo abierto · varias empresas",
    title: "Cohortes multimarcas",
    lead: "Grupos de formación que reúnen distribuidores de varias empresas en una misma cohorte. Es posible y puede enriquecer el aprendizaje, con temario ajustado y un marco ético reforzado.",
    heroNote: "No captación entre redes: la cohorte multimarcas es un espacio de formación, no de reclutamiento.",
    paraQuien: [
      { icon: "Building2", title: "Empresas pequeñas", desc: "Que no alcanzan a llenar una cohorte propia y quieren formar a su red sumándose a un grupo abierto." },
      { icon: "CircleUser", title: "Distribuidores independientes", desc: "Que buscan formación profesional aunque su empresa no abra cohorte en el momento." },
      { icon: "Landmark", title: "Organizadores de evento", desc: "Cámaras o asociaciones que convocan formación para el sector en general." }
    ],
    paraQuienNote: "Útil cuando el volumen de una sola empresa no justifica una cohorte cerrada. El contenido se mantiene neutral respecto a marcas.",
    logras: [
      "Temario común, neutral respecto a cualquier marca",
      "Método de ventas y uso de herramientas digitales",
      "Constancia / reconocimiento al completar",
      "Marco ético reforzado y reglas de convivencia",
      "Sin datos de red ni información sensible de cada empresa",
      "Moderación para evitar prácticas de captación"
    ],
    lograsTitle: "Qué incluye y bajo qué condiciones",
    conexion: {
      icon: "Users",
      text: ["Academy · Distribuidor Independiente", " → cuando la empresa tiene volumen suficiente, conviene la cohorte cerrada por contrato B2B en lugar de la multimarcas."],
      linkLabel: "Ver diplomado DI",
      to: "/academy/distribuidor-independiente"
    },
    related: [
      { to: "/academy/distribuidor-independiente", icon: "Users", title: "Distribuidor Independiente", desc: "Diplomado para la red de distribuidores." },
      { to: "/academy/talleres", icon: "Presentation", title: "Talleres", desc: "Formación puntual complementaria." },
      { to: "/academy/alta-direccion", icon: "Award", title: "Alta Dirección", desc: "Diplomado para empresarios e inversionistas." }
    ],
    cta: { title: "Solicita información / inscripción", desc: "Te explicamos cómo funciona una cohorte multimarcas y qué condiciones aplican.", label: "Solicita información" }
  },

  talleres: {
    name: "Talleres y formación corporativa",
    short: "Talleres",
    icon: "Presentation",
    badge: "Programa · Academy",
    tone: "success",
    modelo: "Sesiones cortas · por tema",
    title: "Talleres y formación corporativa",
    lead: "Formación puntual y complementaria a los diplomados. Sesiones cortas y enfocadas para reforzar un tema específico, sin el compromiso de un programa completo.",
    heroNote: "Los talleres complementan a los diplomados; no los sustituyen.",
    paraQuien: [
      { icon: "Building2", title: "Empresas", desc: "Que quieren reforzar un tema concreto en su equipo o en la red de distribuidores." },
      { icon: "Target", title: "Fuerza comercial", desc: "Distribuidores y equipos comerciales que buscan actualizar una habilidad específica." },
      { icon: "GraduationCap", title: "Egresados de los diplomados", desc: "Quienes ya cursaron un diplomado y quieren seguir formándose por temas." }
    ],
    catalogo: [
      { icon: "Target", title: "Prospección y cierre", desc: "Técnicas de venta y seguimiento para la fuerza comercial." },
      { icon: "MonitorSmartphone", title: "Oficina Virtual a fondo", desc: "Uso avanzado de la tienda y herramientas digitales del distribuidor." },
      { icon: "Users", title: "Liderazgo de red", desc: "Acompañamiento y desarrollo de equipos dentro de la red de distribuidores." },
      { icon: "PlayCircle", title: "Redes sociales y contenido", desc: "Promoción digital responsable para distribuidores." },
      { icon: "HeartHandshake", title: "Atención y fidelización", desc: "Servicio al cliente y retención." },
      { icon: "BadgeCheck", title: "Ética y cumplimiento", desc: "Prácticas correctas de la industria." }
    ],
    catalogoNote: "Temas de referencia; el catálogo final y los contenidos se confirman con la coordinación académica.",
    formato: [
      { icon: "Video", title: "En línea", desc: "Sesiones en vivo a distancia, fáciles de coordinar para cohortes grandes." },
      { icon: "MapPin", title: "Presencial", desc: "Talleres in-company para equipos y eventos de red." },
      { icon: "Puzzle", title: "A medida", desc: "Combinación de temas y formato según la necesidad de la empresa." }
    ],
    conexion: {
      icon: "Compass",
      text: ["Academy → Consulting", " : del aula a la estrategia. Un taller puede ser el primer paso antes de un acompañamiento más profundo de modelo y operación."],
      linkLabel: "Ver Consulting",
      to: "/consulting"
    },
    related: [
      { to: "/academy/alta-direccion", icon: "Award", title: "Alta Dirección", desc: "Diplomado para empresarios e inversionistas." },
      { to: "/academy/distribuidor-independiente", icon: "Users", title: "Distribuidor Independiente", desc: "Diplomado para la red de distribuidores." },
      { to: "/academy/multimarcas", icon: "Network", title: "Cohortes multimarcas", desc: "Grupos con varias empresas." }
    ],
    cta: { title: "Solicita información / inscripción", desc: "Cuéntanos qué habilidad quieres reforzar y armamos el taller o la ruta adecuada.", label: "Solicita información" }
  }
};

export const PROGRAMAS_ORDER = ["alta-direccion", "distribuidor-independiente", "talleres", "multimarcas"];
