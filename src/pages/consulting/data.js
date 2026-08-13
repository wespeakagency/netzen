// Contenido de los servicios de Consulting (fuente: wireframes fase 1.2)
export const SERVICIOS = {
  estrategia: {
    name: "Estrategia y expansión",
    icon: "Map",
    badge: "Servicio de consultoría",
    title: "Estrategia y expansión",
    lead: "Estrategia de negocio para crecer con orden: definimos el modelo, leemos el mercado, ordenamos la operación y profesionalizamos la empresa, siempre con las prácticas correctas de la industria de la venta directa y el mercadeo en red.",
    resuelve: [
      { icon: "TrendingUp", title: "Crecer sin desordenar", desc: "Para empresas que venden bien pero cuya operación no está lista para escalar a más mercados o canales." },
      { icon: "BadgeCheck", title: "Decidir con criterio de industria", desc: "Aplicamos las prácticas correctas del sector para evitar errores comunes que frenan o exponen al negocio." },
      { icon: "Settings", title: "Profesionalizar la empresa", desc: "Pasar de una operación que depende de personas a procesos claros, roles definidos y decisiones documentadas." }
    ],
    incluye: [
      "Modelo de negocio: cómo se vende y cómo se gana",
      "Lectura de mercado y definición de mercados objetivo",
      "Plan de expansión y apertura de nuevos canales",
      "Diseño y orden de la operación",
      "Profesionalización: procesos, roles y métricas",
      "Prácticas correctas de la industria como marco de trabajo"
    ],
    entregables: [
      "Documento de estrategia de negocio y expansión",
      "Definición del modelo y de los mercados objetivo",
      "Hoja de ruta de crecimiento por etapas",
      "Recomendaciones de profesionalización de la operación",
      "Mapa de procesos y roles prioritarios",
      "Acompañamiento en la ejecución"
    ],
    conexiones: [
      { icon: "Scale", text: ["Consulting · Planes de compensación", " → la estrategia define el modelo; el plan de compensación lo traduce en la fórmula de pago de la red de distribuidores."], linkLabel: "Ver Planes de compensación", to: "/consulting/planes-de-compensacion" },
      { icon: "Cpu", text: ["Plataforma", " → una vez definida la estrategia, la operación se ejecuta mediante contrato de uso de licencia en modalidad de renta."], linkLabel: "Ver Plataforma", to: "/plataforma" }
    ],
    ctaDesc: "Empezamos por entender dónde está hoy tu negocio y hacia dónde puede crecer con orden."
  },

  "planes-de-compensacion": {
    name: "Planes de compensación",
    icon: "Scale",
    badge: "Servicio de consultoría",
    title: "Planes de compensación",
    lead: "Diseñamos, auditamos, simulamos y corregimos el plan de compensación de tu negocio: la fórmula que define cómo se reparten las comisiones entre la red de distribuidores. El objetivo es un plan sostenible para la empresa y motivador para la red.",
    resuelve: [
      { icon: "Wallet", title: "Sostenibilidad financiera", desc: "Que el plan sea pagable mes a mes sin comprometer la operación: los porcentajes cuadran con el margen real del negocio." },
      { icon: "Target", title: "Incentivos correctos", desc: "Que premie las conductas que hacen crecer la red —venta real y construcción de equipo— y no el puro reclutamiento." },
      { icon: "ClipboardCheck", title: "Certeza matemática", desc: "Que el cálculo esté auditado y simulado contra escenarios reales antes de salir a producción." }
    ],
    proceso: [
      { title: "Diseño", description: "Definimos estructura, rangos, bonos y reglas de calificación según el modelo de negocio y los objetivos comerciales." },
      { title: "Auditoría", description: "Revisión matemática del plan: verificamos que los porcentajes cierran, que no hay fugas de margen ni topes mal calculados." },
      { title: "Simulación", description: "Probamos el plan contra escenarios de crecimiento y composición de la red para ver qué se paga en cada caso." },
      { title: "Corrección", description: "Ajustamos parámetros donde la simulación detecta riesgo, hasta dejar un plan sostenible y validado." }
    ],
    riesgos: [
      { icon: "TrendingUp", title: "Si pagas de más", desc: "El plan promete comisiones que el margen no soporta. Con el tiempo, los pagos superan los ingresos y la empresa quiebra." },
      { icon: "Users", title: "Si pagas de menos", desc: "El plan no compensa el esfuerzo de la red. Los distribuidores dejan de vender o se van, y se descapitaliza la red." }
    ],
    entregables: [
      "Documento del plan de compensación diseñado y auditado",
      "Reporte de simulación con escenarios de crecimiento de la red",
      "Reglas de calificación, rangos y bonos definidos",
      "Recomendaciones de corrección y parámetros de ajuste",
      "Configuración lista para cargar en el motor de comisiones",
      "Acompañamiento en la puesta en operación"
    ],
    conexiones: [
      { icon: "Store", text: ["Plataforma · Software Netzen", " → el plan que aquí se diseña se vuelve la configuración del motor de comisiones del software: lo que se aprueba en consultoría es lo que el sistema calcula y paga."], linkLabel: "Ver Software Netzen", to: "/plataforma/software-netzen" }
    ],
    ctaDesc: "Revisamos tu plan actual o diseñamos uno nuevo sobre los números reales de tu negocio."
  },

  "escuela-mlm": {
    name: "Escuela MLM",
    icon: "School",
    badge: "Servicio de consultoría",
    title: "Escuela MLM",
    lead: "Acompañamiento experto para estructurar y operar el modelo de mercadeo en red correctamente. Te guiamos desde las bases —cómo se arma, cómo se sostiene y cómo se gestiona el día a día— con criterio de industria.",
    heroNote: "Acompañamiento experto, no un curso: aquí se estructura el modelo del negocio; en Academy se forma a las personas.",
    resuelve: [
      { icon: "Sprout", title: "Arrancar con bases firmes", desc: "Para empresas que entran al mercadeo en red y necesitan estructurar el modelo correctamente desde el inicio." },
      { icon: "Wrench", title: "Corregir lo que no funciona", desc: "Para operaciones ya en marcha que arrastran problemas de estructura, reglas o gestión de la red de distribuidores." },
      { icon: "Compass", title: "Operar con criterio", desc: "Acompañamos las decisiones del día a día para que la operación se mantenga sana y sostenible." }
    ],
    incluye: [
      "Estructuración del modelo de mercadeo en red",
      "Definición de reglas de operación de la red de distribuidores",
      "Prácticas correctas de la industria como marco",
      "Acompañamiento experto en la operación cotidiana",
      "Revisión de la gestión de la red y sus incentivos",
      "Apoyo en la toma de decisiones del negocio"
    ],
    entregables: [
      "Modelo de mercadeo en red estructurado y documentado",
      "Reglas de operación de la red de distribuidores",
      "Plan de acompañamiento por etapas",
      "Recomendaciones de corrección sobre la operación actual",
      "Criterios de la industria aplicados a tu caso",
      "Soporte experto continuo durante la implementación"
    ],
    conexiones: [
      { icon: "GraduationCap", text: ["Academy", " → la Escuela MLM estructura el modelo; Academy forma a la red de distribuidores y a la alta dirección que lo operan."], linkLabel: "Ver Academy", to: "/academy" },
      { icon: "Scale", text: ["Consulting · Planes de compensación", " → un modelo bien estructurado necesita un plan de compensación auditado para ser sostenible."], linkLabel: "Ver Planes de compensación", to: "/consulting/planes-de-compensacion" }
    ],
    ctaDesc: "Revisamos tu modelo de mercadeo en red y definimos cómo estructurarlo y operarlo correctamente."
  },

  tecnologia: {
    name: "Consultoría tecnológica incluida",
    icon: "Wrench",
    badge: "Servicio de consultoría",
    title: "Consultoría tecnológica incluida",
    lead: "El contrato de uso de la plataforma en modalidad de renta incluye consultoría crítica para estructurar el plan. Antes de configurar el software, definimos contigo cómo debe operar tu negocio para que la tecnología trabaje a favor.",
    heroNote: "No se cobra aparte: es parte de contratar la plataforma. El detalle del ciclo de instalación vive en Plataforma · Implementación.",
    resuelve: [
      { icon: "Puzzle", title: "Evita configurar sobre el vacío", desc: "Sin una estrategia clara, cualquier plataforma se configura mal. La consultoría asegura que el software refleje un modelo bien pensado." },
      { icon: "Plug", title: "Traduce negocio a sistema", desc: "Convertimos las reglas del negocio —plan, canales, promociones— en la configuración correcta de la plataforma." },
      { icon: "Rocket", title: "Acelera la puesta en marcha", desc: "Llegar a la instalación con las definiciones listas reduce errores y tiempos en la implementación." }
    ],
    incluye: [
      "Estructuración del plan antes de configurar el software",
      "Definición de reglas de operación, canales y comisiones",
      "Traducción de la estrategia a parámetros del sistema",
      "Acompañamiento crítico durante la configuración",
      "Revisión de que la plataforma refleje el modelo definido",
      "Continuidad con el equipo de implementación"
    ],
    entregables: [
      "Plan estructurado, listo para configurar en la plataforma",
      "Definición de reglas de negocio y de comisiones",
      "Mapa de la configuración recomendada del software",
      "Acompañamiento experto durante la instalación",
      "Enlace directo con el ejecutivo de cuenta",
      "Base sólida para escalar la operación"
    ],
    conexiones: [
      { icon: "Rocket", text: ["Plataforma · Implementación", " → esta consultoría va incluida en cada instalación de la plataforma: el ciclo de implementación arranca con el acompañamiento estratégico, no después."], linkLabel: "Ver Implementación", to: "/plataforma/implementacion" },
      { icon: "Scale", text: ["Consulting · Planes de compensación", " → el plan que se estructura aquí se vuelve la configuración del motor de comisiones del software."], linkLabel: "Ver Planes de compensación", to: "/consulting/planes-de-compensacion" }
    ],
    ctaDesc: "Te mostramos cómo la consultoría incluida estructura tu plan antes de configurar la plataforma."
  }
};

export const SERVICIOS_ORDER = ["planes-de-compensacion", "estrategia", "escuela-mlm", "tecnologia"];
