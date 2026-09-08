// NETZEN · contenido legal (Aviso de Privacidad y Términos y Condiciones)
// Estructura: intro (párrafos iniciales) + sections numeradas con bloques.
// Tipos de bloque: { type: 'p', text } | { type: 'ul', items } | { type: 'kv', items: [{k, v}] }

export const LAST_UPDATED = "04/09/2026";

export const PRIVACY = {
  title: "Aviso de Privacidad",
  intro: [
    'NETZEN ("NETZEN", "nosotros" o "la Empresa") reconoce la importancia de proteger los datos personales de visitantes, prospectos, clientes, representantes, usuarios, distribuidores, participantes de programas formativos, proveedores, aliados, candidatos y demás personas con quienes interactúa. Este Aviso de Privacidad explica cómo recopilamos, usamos, conservamos, compartimos y protegemos datos personales a través de https://netzen.global/, formularios, canales digitales, redes sociales, correo electrónico, mensajería, llamadas, reuniones, propuestas, contratos, servicios de tecnología, formación, consultoría y soluciones relacionadas.',
    "Este Aviso está diseñado como marco internacional base, considerando principios de la legislación mexicana de protección de datos personales, el Reglamento General de Protección de Datos de la Unión Europea (GDPR/RGPD), la California Consumer Privacy Act modificada por la CPRA (CCPA/CPRA), la Lei Geral de Proteção de Dados de Brasil (LGPD) y otras regulaciones extranjeras que puedan resultar aplicables. La aplicación concreta de cada régimen dependerá del lugar de residencia de la persona titular, la entidad responsable, el tipo de tratamiento, los umbrales legales y la relación con NETZEN.",
    "Este Aviso es una base general y debe validarse con asesoría legal antes de publicarse."
  ],
  sections: [
    {
      slug: "identidad",
      title: "Identidad y domicilio del responsable",
      blocks: [
        { type: "p", text: "El responsable del tratamiento de los datos personales es:" },
        {
          type: "kv",
          items: [
            { k: "Nombre comercial", v: "NETZEN" },
            { k: "Razón social", v: "NETZEN, S.A. de C.V." },
            { k: "RFC o identificador fiscal", v: "NET041026TY8" },
            { k: "Domicilio", v: "Almanalco No. 82 Bis, Col. Vergel de Coyoacán, Tlalpan, Ciudad de México, C.P. 14340, México" },
            { k: "Correo de privacidad", v: "contacto@netzen.com.mx" },
            { k: "Correo legal", v: "contacto@netzen.com.mx" },
            { k: "Sitio web", v: "https://netzen.global/" }
          ]
        },
        { type: "p", text: "Cuando el tratamiento sea realizado por una afiliada, socio autorizado, entidad extranjera o contraparte identificada en una propuesta, contrato o documento equivalente, dicha entidad podrá actuar como responsable, corresponsable, controlador, encargado, procesador u operador, según corresponda." }
      ]
    },
    {
      slug: "alcance",
      title: "Alcance",
      blocks: [
        { type: "p", text: "Este Aviso aplica a los datos personales que NETZEN trata en su propio nombre para fines comerciales, operativos, contractuales, administrativos, legales, de marketing, seguridad y mejora de servicios." },
        { type: "p", text: "Cuando NETZEN trate datos personales por cuenta de un cliente, por ejemplo dentro de un CRM, campaña, flujo de WhatsApp, email, SMS, plataforma, integración, analítica, automatización o asistencia digital del cliente, NETZEN podrá actuar como encargado, procesador u operador, siguiendo instrucciones del cliente y el contrato aplicable. En esos casos, el cliente será responsable de informar a sus usuarios finales, contar con bases legales y atender derechos de titulares, salvo pacto distinto." }
      ]
    },
    {
      slug: "datos-recopilados",
      title: "Datos personales que podemos recopilar",
      blocks: [
        { type: "p", text: "Podemos recopilar las siguientes categorías de datos personales, según la relación y finalidad:" },
        {
          type: "kv",
          items: [
            { k: "Identificación", v: "nombre, apellidos, cargo, empresa, firma, identificadores profesionales e identificación oficial cuando sea necesaria." },
            { k: "Contacto", v: "correo electrónico, teléfono, domicilio, país, ciudad, perfiles profesionales y canales de mensajería." },
            { k: "Datos profesionales o comerciales", v: "empresa, industria, puesto, necesidades de negocio, proyecto, presupuesto, historial de interacciones, propuestas, contratos, órdenes, facturación, preferencias y seguimiento comercial." },
            { k: "Datos de participantes", v: "inscripciones, asistencia, avances, evaluaciones, constancias, participación en programas de Academy, diagnósticos, herramientas, indicadores y seguimiento formativo." },
            { k: "Datos fiscales y de pago", v: "razón social, RFC o identificador fiscal, domicilio fiscal, datos de facturación, comprobantes, referencias de pago y datos transaccionales." },
            { k: "Datos de uso digital", v: "dirección IP, identificadores de dispositivo, navegador, sistema operativo, páginas visitadas, fecha y hora, origen de tráfico, eventos de analítica, cookies, píxeles, etiquetas, interacciones con formularios y registros técnicos." },
            { k: "Comunicaciones", v: "mensajes por formularios, correo, WhatsApp, chat, redes sociales, llamadas, reuniones, tickets, grabaciones o transcripciones cuando se informe o sea permitido." },
            { k: "Datos de marketing", v: "preferencias, respuestas a campañas, aperturas, clics, bajas, consentimiento u oposición." },
            { k: "Datos de candidatos", v: "CV, experiencia, educación, portafolio, referencias, expectativas, entrevistas y datos necesarios para procesos de selección." },
            { k: "Datos de proveedores y aliados", v: "información de contacto, contractual, fiscal, bancaria, cumplimiento, seguridad y operación." },
            { k: "Datos derivados o inferidos", v: "segmentaciones, perfiles de negocio, scoring comercial, intereses, clasificaciones, diagnósticos, análisis de comportamiento profesional o de interacción con servicios." }
          ]
        },
        { type: "p", text: "NETZEN no busca recopilar datos personales sensibles salvo que sean estrictamente necesarios y exista base legal o consentimiento expreso cuando corresponda. Son datos sensibles, entre otros, aquellos que revelen origen racial o étnico, salud, biometría, genética, religión, opiniones políticas, afiliación sindical, orientación sexual o información similar protegida por ley." }
      ]
    },
    {
      slug: "fuentes",
      title: "Fuentes de datos",
      blocks: [
        { type: "p", text: "Podemos obtener datos directamente de la persona titular, de su empresa, representantes, formularios, reuniones, eventos, llamadas, correos, redes sociales, plataformas de mensajería, herramientas de agenda, CRMs, proveedores, aliados, fuentes públicas, directorios profesionales, bases comerciales permitidas, cookies, tecnologías similares y servicios contratados por NETZEN o por el cliente." },
        { type: "p", text: "El Usuario no debe proporcionar datos personales de terceros si no cuenta con autorización, base legal o facultades suficientes." }
      ]
    },
    {
      slug: "finalidades-primarias",
      title: "Finalidades primarias",
      blocks: [
        { type: "p", text: "Tratamos datos personales para finalidades necesarias o directamente relacionadas con la relación con NETZEN:" },
        {
          type: "ul",
          items: [
            "Identificar y contactar a visitantes, prospectos, clientes, participantes, proveedores, aliados y representantes.",
            "Responder solicitudes de información, formularios, mensajes, cotizaciones, diagnósticos, reuniones y soporte.",
            "Preparar, negociar, celebrar, administrar y cumplir propuestas, contratos, órdenes de servicio y relaciones comerciales.",
            "Prestar servicios de tecnología, consultoría, formación, automatización, CRM, mensajería, marketing, analítica, integraciones, asistencia digital, trazabilidad, estrategia y soporte.",
            "Crear, configurar, operar, monitorear, mantener, mejorar y documentar proyectos, herramientas, campañas, flujos, reportes, entregables y programas formativos.",
            "Administrar inscripciones, participación, evaluación, acompañamiento, indicadores, constancias y seguimiento en programas de NETZEN Academy.",
            "Procesar pagos, facturación, cobranza, contabilidad, auditorías, administración y obligaciones fiscales.",
            "Gestionar cuentas, accesos, permisos, seguridad, autenticación, prevención de fraude, investigación de incidentes y continuidad operativa.",
            "Cumplir obligaciones legales, regulatorias, contractuales, fiscales, contables, de privacidad, seguridad, comercio electrónico, consumidor, anticorrupción, sanciones y requerimientos de autoridad.",
            "Defender derechos, atender reclamaciones, resolver controversias, conservar evidencia, ejecutar contratos y prevenir usos indebidos.",
            "Administrar relaciones con proveedores, aliados, contratistas y talento."
          ]
        }
      ]
    },
    {
      slug: "finalidades-secundarias",
      title: "Finalidades secundarias",
      blocks: [
        { type: "p", text: "También podemos tratar datos para finalidades no indispensables:" },
        {
          type: "ul",
          items: [
            "Enviar newsletters, invitaciones, contenidos, actualizaciones, eventos, promociones, estudios, casos de éxito o información comercial.",
            "Realizar prospección, segmentación comercial, encuestas, análisis de satisfacción, investigación de mercado y mejora de experiencia.",
            "Elaborar estadísticas, benchmarks, materiales internos, analítica agregada, aprendizaje operativo y mejoras de servicios.",
            "Publicar referencias comerciales, casos de éxito o testimonios sólo cuando exista autorización o no se revele información confidencial."
          ]
        },
        { type: "p", text: "La persona titular puede oponerse a estas finalidades secundarias en cualquier momento escribiendo a contacto@netzen.com.mx o usando los mecanismos de baja disponibles. La negativa no afectará los servicios contratados." }
      ]
    },
    {
      slug: "bases-legales",
      title: "Bases legales del tratamiento",
      blocks: [
        { type: "p", text: "Según la jurisdicción aplicable, NETZEN podrá tratar datos personales con base en:" },
        {
          type: "ul",
          items: [
            "Consentimiento.",
            "Ejecución de contrato o medidas precontractuales.",
            "Cumplimiento de obligaciones legales.",
            "Interés legítimo de NETZEN o de terceros, siempre que no prevalezcan derechos y libertades de la persona titular.",
            "Protección de intereses vitales, cuando sea aplicable.",
            "Ejercicio, defensa o reclamación de derechos.",
            "Instrucciones del cliente cuando NETZEN actúe como encargado, procesador u operador."
          ]
        },
        { type: "p", text: "Para tratamientos que requieran consentimiento expreso, NETZEN procurará obtenerlo mediante mecanismos claros, verificables y específicos." }
      ]
    },
    {
      slug: "cookies",
      title: "Cookies y tecnologías similares",
      blocks: [
        { type: "p", text: "El sitio puede usar cookies, píxeles, etiquetas, SDKs, almacenamiento local, identificadores, herramientas de analítica, publicidad, medición, seguridad, personalización y funcionalidades de terceros." },
        { type: "p", text: "Estas tecnologías pueden servir para operar funciones esenciales, recordar preferencias, medir tráfico, entender interacciones, mejorar servicios, prevenir fraude, proteger seguridad y realizar marketing o remarketing cuando sea permitido." },
        { type: "p", text: "El Usuario puede administrar cookies desde su navegador o desde el panel de consentimiento que NETZEN habilite. Algunas cookies técnicas son necesarias. Para usuarios de jurisdicciones que lo requieran, NETZEN deberá implementar un banner o centro de preferencias que permita aceptar, rechazar o configurar cookies no esenciales." }
      ]
    },
    {
      slug: "transferencias",
      title: "Transferencias y comunicaciones de datos",
      blocks: [
        { type: "p", text: "NETZEN podrá compartir datos personales con:" },
        {
          type: "ul",
          items: [
            "Afiliadas, sociedades relacionadas, representantes, empleados, contratistas y colaboradores autorizados.",
            "Proveedores de hosting, nube, correo, CRM, mensajería, automatización, analítica, inteligencia artificial, seguridad, soporte, facturación, pagos, contabilidad, almacenamiento, documentación, videollamadas, gestión de proyectos y herramientas operativas.",
            "Plataformas de terceros como WhatsApp Business Platform, Meta, Google, proveedores de email, CRMs, redes sociales, pasarelas de pago, herramientas de automatización, analítica o soporte.",
            "Asesores legales, fiscales, financieros, auditores, aseguradoras y consultores.",
            "Autoridades, tribunales, reguladores o terceros cuando exista obligación legal, requerimiento válido, defensa de derechos, investigación de fraude, seguridad o cumplimiento.",
            "Compradores, inversionistas, sucesores o asesores en caso de fusión, adquisición, financiamiento, reestructura, venta de activos, cesión o transacción corporativa."
          ]
        },
        { type: "p", text: "Cuando la ley exija consentimiento para transferencias innecesarias, NETZEN lo solicitará. Las remisiones a encargados, procesadores u operadores se realizarán conforme a instrucciones, medidas contractuales y fines permitidos." }
      ]
    },
    {
      slug: "transferencias-internacionales",
      title: "Transferencias internacionales",
      blocks: [
        { type: "p", text: "NETZEN opera o puede operar con clientes, proveedores, herramientas, infraestructura, talento y plataformas en distintos países. Por ello, los datos pueden ser tratados, almacenados o transferidos fuera del país de residencia de la persona titular." },
        { type: "p", text: "Cuando resulte aplicable, NETZEN procurará implementar mecanismos adecuados para transferencias internacionales, como cláusulas contractuales tipo o equivalentes, acuerdos de tratamiento de datos, decisiones de adecuación, evaluaciones de riesgo de transferencia, medidas técnicas y organizativas adicionales, consentimiento u otras bases legales permitidas." }
      ]
    },
    {
      slug: "conservacion",
      title: "Conservación",
      blocks: [
        { type: "p", text: "NETZEN conservará datos personales durante el tiempo necesario para cumplir las finalidades descritas, prestar servicios, mantener la relación comercial, atender solicitudes, cumplir obligaciones legales, resolver controversias, conservar evidencia, prevenir fraude, administrar contabilidad, ejecutar contratos y proteger derechos." },
        { type: "p", text: "Los plazos dependen de la categoría de datos, finalidad, relación con NETZEN, obligaciones legales, prescripción de acciones, instrucciones del cliente y necesidades operativas. Cuando los datos ya no sean necesarios, NETZEN procurará eliminarlos, anonimizarlos, bloquearlos o conservarlos de forma restringida cuando exista obligación o interés legítimo." }
      ]
    },
    {
      slug: "seguridad",
      title: "Seguridad",
      blocks: [
        { type: "p", text: "NETZEN aplica medidas administrativas, técnicas y organizativas razonables para proteger datos personales contra destrucción, pérdida, alteración, acceso, divulgación o uso no autorizado. Estas medidas pueden incluir controles de acceso, autenticación, gestión de permisos, respaldos, cifrado cuando sea viable, monitoreo, confidencialidad contractual, revisión de proveedores y prácticas de seguridad." },
        { type: "p", text: "Ningún sistema es completamente seguro. Si NETZEN identifica un incidente de seguridad que pueda afectar significativamente derechos de titulares, actuará conforme a la ley aplicable, incluyendo notificaciones a clientes, titulares o autoridades cuando corresponda." }
      ]
    },
    {
      slug: "derechos",
      title: "Derechos de las personas titulares",
      blocks: [
        { type: "p", text: "Según la ley aplicable, la persona titular puede tener derecho a:" },
        {
          type: "ul",
          items: [
            "Acceder a sus datos personales.",
            "Rectificar datos incompletos, incorrectos o desactualizados.",
            "Cancelar, suprimir o solicitar eliminación de datos cuando proceda.",
            "Oponerse a ciertos tratamientos.",
            "Limitar el uso o divulgación de datos.",
            "Revocar consentimiento.",
            "Solicitar portabilidad.",
            "Solicitar información sobre finalidades, categorías, fuentes, destinatarios, transferencias, conservación y bases legales.",
            "No ser objeto de decisiones automatizadas con efectos jurídicos o significativamente similares, cuando aplique.",
            "Presentar una queja ante la autoridad competente.",
            "Optar por no recibir marketing directo."
          ]
        },
        { type: "p", text: "En México, estos derechos incluyen los derechos ARCO. En la Unión Europea y Reino Unido pueden incluir derechos bajo GDPR/RGPD. En California pueden incluir derechos de conocimiento, acceso, corrección, eliminación, limitación de uso de información sensible, oposición a venta o compartición y no discriminación, cuando CCPA/CPRA sea aplicable. En Brasil pueden incluir derechos previstos por LGPD." }
      ]
    },
    {
      slug: "ejercer-derechos",
      title: "Cómo ejercer derechos",
      blocks: [
        { type: "p", text: "La persona titular o su representante puede enviar una solicitud a:" },
        {
          type: "kv",
          items: [
            { k: "Correo de privacidad", v: "contacto@netzen.com.mx" },
            { k: "Domicilio", v: "Almanalco No. 82 Bis, Col. Vergel de Coyoacán, Tlalpan, Ciudad de México, C.P. 14340, México" },
            { k: "Asunto sugerido", v: '"Solicitud de derechos de datos personales"' }
          ]
        },
        { type: "p", text: "La solicitud deberá incluir nombre de la persona titular, medio para responder, derecho que desea ejercer, descripción clara de los datos o tratamiento, documento o información razonable para verificar identidad y, en caso de representante, documento que acredite representación." },
        { type: "p", text: "NETZEN responderá dentro de los plazos previstos por la ley aplicable. Si la solicitud es incompleta, excesiva, infundada, imposible de atender, afecta derechos de terceros, se refiere a datos tratados por cuenta de un cliente o existe excepción legal, NETZEN podrá pedir información adicional, rechazar total o parcialmente la solicitud o canalizar al responsable correspondiente." }
      ]
    },
    {
      slug: "ccpa",
      title: "California, venta o compartición de información personal",
      blocks: [
        { type: "p", text: 'Cuando CCPA/CPRA resulte aplicable, NETZEN evaluará y respetará los derechos de residentes de California conforme a la ley vigente. NETZEN no vende datos personales en el sentido tradicional de intercambio por dinero.' },
        { type: "p", text: 'Sin embargo, ciertas tecnologías de publicidad, analítica o remarketing podrían considerarse "sharing" o "venta" bajo definiciones amplias de algunas leyes si se usan para publicidad comportamental entre contextos. Si NETZEN usa dichas tecnologías, deberá habilitar un enlace o mecanismo visible de "No vender ni compartir mi información personal" o equivalente, así como respetar señales de preferencia global cuando la ley lo exija.' }
      ]
    },
    {
      slug: "marketing",
      title: "Marketing directo y baja",
      blocks: [
        { type: "p", text: "NETZEN puede enviar comunicaciones comerciales cuando exista consentimiento, relación previa, interés legítimo u otra base legal permitida. La persona titular puede darse de baja mediante los enlaces incluidos en los mensajes o escribiendo a contacto@netzen.com.mx." },
        { type: "p", text: "La baja de marketing no impide comunicaciones transaccionales, legales, operativas, de seguridad, soporte, facturación o relacionadas con servicios vigentes." }
      ]
    },
    {
      slug: "menores",
      title: "Datos de menores",
      blocks: [
        { type: "p", text: "El sitio y los servicios de NETZEN no están dirigidos a menores de edad. NETZEN no recopila deliberadamente datos de menores sin autorización verificable cuando sea requerida. Si NETZEN detecta que recopiló datos de menores sin base legal suficiente, tomará medidas razonables para eliminarlos o restringir su tratamiento." }
      ]
    },
    {
      slug: "automatizadas",
      title: "Decisiones automatizadas, perfilamiento e inteligencia artificial",
      blocks: [
        { type: "p", text: "NETZEN puede usar analítica, automatización o inteligencia artificial para apoyar segmentación comercial, diagnósticos, asistencia digital, soporte, recomendaciones, análisis, clasificación, generación de contenidos, mejora de procesos, detección de fraude o seguridad." },
        { type: "p", text: "Cuando un tratamiento automatizado produzca efectos jurídicos o afecte significativamente a una persona, NETZEN aplicará salvaguardas exigidas por la ley aplicable, incluyendo información, intervención humana, mecanismos de impugnación u oposición cuando corresponda." }
      ]
    },
    {
      slug: "clientes-empresariales",
      title: "Relación con clientes empresariales y usuarios finales",
      blocks: [
        { type: "p", text: "Si una persona recibe comunicaciones, mensajes, campañas, automatizaciones o servicios ejecutados por NETZEN en nombre de un cliente, es posible que el cliente sea el responsable o controlador principal de sus datos. En tal caso, la persona titular deberá consultar el aviso de privacidad del cliente y dirigir sus solicitudes al cliente, sin perjuicio de que NETZEN pueda apoyar como encargado, procesador u operador." },
        { type: "p", text: "NETZEN no es responsable por la legalidad de bases de datos, audiencias, consentimientos, claims, promociones, listas, instrucciones o contenidos proporcionados por clientes, salvo en la medida en que la ley disponga lo contrario o exista incumplimiento directamente imputable a NETZEN." }
      ]
    },
    {
      slug: "cambios",
      title: "Cambios al Aviso",
      blocks: [
        { type: "p", text: "NETZEN podrá actualizar este Aviso para reflejar cambios legales, operativos, tecnológicos, comerciales, de seguridad o de servicios. Las modificaciones se publicarán en el sitio indicando la fecha de última actualización. Cuando la ley lo exija, NETZEN solicitará consentimiento o notificará cambios materiales por medios razonables." }
      ]
    },
    {
      slug: "contacto",
      title: "Contacto y quejas",
      blocks: [
        { type: "p", text: "Para preguntas, solicitudes o quejas sobre privacidad:" },
        {
          type: "kv",
          items: [
            { k: "Área responsable", v: "Área de atención a clientes y privacidad" },
            { k: "Correo de privacidad", v: "contacto@netzen.com.mx" },
            { k: "Correo legal", v: "contacto@netzen.com.mx" },
            { k: "Domicilio", v: "Almanalco No. 82 Bis, Col. Vergel de Coyoacán, Tlalpan, Ciudad de México, C.P. 14340, México" },
            { k: "Teléfono", v: "+52 (55) 5684 9096" }
          ]
        },
        { type: "p", text: "La persona titular también puede acudir ante la autoridad de protección de datos competente en su jurisdicción si considera que sus derechos no han sido atendidos conforme a la ley aplicable." }
      ]
    },
    {
      slug: "simplificado",
      title: "Aviso de Privacidad Simplificado",
      blocks: [
        { type: "p", text: "NETZEN, con domicilio en Almanalco No. 82 Bis, Col. Vergel de Coyoacán, Tlalpan, Ciudad de México, C.P. 14340, México, tratará sus datos personales para identificarte, contactar, responder solicitudes, preparar propuestas, prestar servicios, administrar la relación comercial, facturar, cobrar, operar proyectos, cumplir obligaciones legales, proteger seguridad y defender derechos. De manera secundaria, podremos usar sus datos para enviar comunicaciones comerciales, contenidos, invitaciones, encuestas, analítica y mejora de servicios. Podremos compartir datos con proveedores, afiliadas, plataformas tecnológicas, autoridades y terceros necesarios para cumplir las finalidades indicadas, incluso en otros países. Usted puede ejercer derechos de acceso, rectificación, cancelación, oposición, limitación, revocación, portabilidad y demás derechos aplicables escribiendo a contacto@netzen.com.mx. Consulte el Aviso de Privacidad Integral en https://netzen.global/aviso-de-privacidad/." }
      ]
    }
  ]
};

export const TERMS = {
  title: "Términos y Condiciones",
  intro: [
    'Estos Términos y Condiciones regulan el acceso y uso del sitio web, contenidos, formularios, materiales comerciales, presentaciones, diagnósticos, propuestas, servicios profesionales, formación, consultoría, tecnología, automatizaciones, plataformas, integraciones y demás soluciones ofrecidas por NETZEN ("NETZEN", "nosotros" o "la Empresa") a través de https://netzen.global/ y de otros canales digitales relacionados.',
    'Al acceder al sitio, solicitar información, agendar una sesión, aceptar una propuesta, contratar servicios, usar materiales de NETZEN o interactuar con la Empresa por medios digitales, la persona usuaria, visitante, prospecto, cliente o representante del cliente ("Usuario" o "Cliente") acepta estos Términos. Si no está de acuerdo, debe abstenerse de usar el sitio o contratar los servicios.',
    "Estos Términos son una base contractual general. No sustituyen contratos, anexos, propuestas, órdenes de servicio ni asesoría legal aplicable a cada jurisdicción."
  ],
  sections: [
    {
      slug: "identidad-proveedor",
      title: "Identidad del proveedor",
      blocks: [
        { type: "p", text: "El titular del sitio y proveedor de los servicios es:" },
        {
          type: "kv",
          items: [
            { k: "Nombre comercial", v: "NETZEN" },
            { k: "Razón social", v: "NETZEN, S.A. de C.V." },
            { k: "RFC o identificador fiscal", v: "NET041026TY8" },
            { k: "Domicilio", v: "Almanalco No. 82 Bis, Col. Vergel de Coyoacán, Tlalpan, Ciudad de México, C.P. 14340, México" },
            { k: "Correo general", v: "contacto@netzen.com.mx" },
            { k: "Correo legal", v: "contacto@netzen.com.mx" },
            { k: "Sitio web", v: "https://netzen.global/" }
          ]
        },
        { type: "p", text: "Cuando una propuesta, contrato, factura, anexo u orden de servicio identifique a otra entidad, afiliada, socio autorizado o contraparte, dicha entidad será la responsable contractual del servicio correspondiente." }
      ]
    },
    {
      slug: "naturaleza",
      title: "Naturaleza de NETZEN",
      blocks: [
        { type: "p", text: "NETZEN es un ecosistema de crecimiento empresarial consciente que combina tecnología, formación y consultoría estratégica, con las personas y el bien común en el centro. Sus líneas pueden incluir, entre otras, NETZEN Platform, NETZEN Academy, NETZEN Consulting, diagnósticos operativos, asistencia digital, trazabilidad, automatización, CRM, integraciones, programas formativos, venta directa, profesionalización de redes comerciales, modernización operativa, escalamiento empresarial y acompañamiento estratégico." },
        { type: "p", text: "NETZEN no actúa como despacho jurídico, asesor fiscal, entidad financiera, aseguradora, autoridad regulatoria, proveedor médico, fiduciario ni garante de resultados comerciales, financieros, tecnológicos o regulatorios, salvo pacto escrito expreso." }
      ]
    },
    {
      slug: "alcance-servicios",
      title: "Alcance de los servicios",
      blocks: [
        { type: "p", text: "Los servicios concretos se definirán en la propuesta, cotización, contrato, statement of work, orden de compra, anexo, correo de aceptación o documento equivalente. Dichos documentos podrán incluir alcance, precio, moneda, impuestos, cronograma, entregables, criterios de aceptación, responsabilidades del Cliente, dependencias, licencias, costos de terceros, soporte, renovaciones, restricciones y condiciones particulares." },
        { type: "p", text: "En caso de contradicción entre documentos, salvo pacto escrito distinto, prevalecerá el siguiente orden:" },
        {
          type: "ol",
          items: [
            "Contrato firmado por las partes.",
            "Anexos, órdenes de servicio o statements of work.",
            "Propuesta o cotización aceptada.",
            "Estos Términos.",
            "Información general publicada en el sitio."
          ]
        },
        { type: "p", text: "La información publicada en el sitio y en presentaciones comerciales es orientativa. No constituye oferta vinculante, garantía de resultado, recomendación legal ni promesa definitiva de precio, plazo o desempeño." }
      ]
    },
    {
      slug: "elegibilidad",
      title: "Elegibilidad y representación",
      blocks: [
        { type: "p", text: "El sitio y los servicios están dirigidos a personas mayores de edad, empresas, instituciones, directivos, empresarios, inversionistas, distribuidores independientes, redes comerciales y profesionales con capacidad legal suficiente para obligarse." },
        { type: "p", text: "Si una persona usa el sitio o contrata servicios en nombre de una empresa u organización, declara que cuenta con facultades suficientes para representarla y obligarla." },
        { type: "p", text: "NETZEN no dirige sus servicios a menores de edad. Cualquier acceso por menores deberá realizarse con autorización y supervisión de su madre, padre, tutor o representante legal." }
      ]
    },
    {
      slug: "uso-permitido",
      title: "Uso permitido del sitio",
      blocks: [
        { type: "p", text: "El Usuario debe usar el sitio de forma lícita, diligente y conforme a estos Términos. Queda prohibido:" },
        {
          type: "ul",
          items: [
            "Usar el sitio con fines ilegales, fraudulentos, abusivos, discriminatorios, difamatorios o contrarios a derechos de terceros.",
            "Intentar acceder sin autorización a sistemas, cuentas, bases de datos, código, infraestructura, APIs, redes o paneles de NETZEN o terceros.",
            "Interferir con la seguridad, disponibilidad, integridad o funcionamiento del sitio.",
            "Introducir malware, bots, scraping abusivo, cargas excesivas, ataques, scripts maliciosos o mecanismos de extracción automatizada no autorizados.",
            "Copiar, revender, sublicenciar, modificar, explotar o distribuir contenidos, metodologías, materiales, plantillas, diagnósticos, presentaciones, código, diseños o entregables de NETZEN sin autorización escrita.",
            "Usar los servicios para spam, phishing, suplantación, mensajes masivos sin base legal, scraping indebido, fraude, acoso, discriminación, prácticas engañosas o violación de políticas de plataformas de terceros."
          ]
        },
        { type: "p", text: "NETZEN podrá limitar, suspender o cancelar el acceso al sitio o a los servicios cuando exista uso indebido, riesgo de seguridad, incumplimiento, falta de pago, requerimiento de autoridad, violación de políticas de terceros o riesgo legal o reputacional." }
      ]
    },
    {
      slug: "obligaciones-cliente",
      title: "Obligaciones del Cliente",
      blocks: [
        { type: "p", text: "El Cliente se obliga a:" },
        {
          type: "ul",
          items: [
            "Proporcionar información veraz, completa, actualizada y lícita.",
            "Contar con derechos, autorizaciones, licencias, bases legales y consentimientos suficientes para compartir datos, marcas, materiales, bases, audiencias, accesos, credenciales, contenidos e instrucciones con NETZEN.",
            "Revisar y aprobar textos, claims, ofertas, promociones, condiciones comerciales, garantías, precios, mensajes, contenidos regulados y publicaciones realizadas en su nombre.",
            "Cumplir leyes de protección de datos, consumidor, publicidad, propiedad intelectual, telecomunicaciones, comercio electrónico, marketing directo, competencia económica, anticorrupción, sanciones económicas, control de exportaciones y demás normativa aplicable.",
            "Proteger sus accesos, credenciales, cuentas, dominios, CRMs, plataformas, canales, APIs, usuarios y dispositivos.",
            "No usar servicios de NETZEN para actividades ilícitas, abusivas, engañosas o contrarias a políticas de terceros."
          ]
        },
        { type: "p", text: "El Cliente será responsable por la legalidad, exactitud y autorización de los materiales, datos, audiencias, listas, instrucciones y decisiones que entregue a NETZEN." }
      ]
    },
    {
      slug: "terceros",
      title: "Plataformas y proveedores de terceros",
      blocks: [
        { type: "p", text: "Los servicios pueden depender de plataformas, APIs, CRMs, herramientas de mensajería, WhatsApp Business Platform, Meta, Google, servicios de correo electrónico, redes sociales, hosting, nube, pasarelas de pago, herramientas de analítica, inteligencia artificial, automatización, gestión de proyectos u otros terceros." },
        { type: "p", text: "NETZEN no controla ni garantiza la disponibilidad, políticas, precios, aprobaciones, tiempos de revisión, cambios técnicos, límites, suspensiones, bloqueos, caídas, errores, reputación de cuenta, entregabilidad, clasificación de mensajes, decisión de algoritmos, moderación, actualizaciones o actos de dichos terceros." },
        { type: "p", text: "El Cliente acepta cumplir los términos y políticas de cada proveedor tercero aplicable. NETZEN no será responsable por daños, costos, retrasos, suspensiones o pérdidas derivados de actos, omisiones, cambios o decisiones de terceros, salvo responsabilidad que no pueda limitarse por ley." }
      ]
    },
    {
      slug: "mensajeria",
      title: "Mensajería, marketing y comunicaciones comerciales",
      blocks: [
        { type: "p", text: "Cuando los servicios involucren WhatsApp, correo electrónico, SMS, llamadas, anuncios, CRM, automatizaciones, chatbots, redes sociales o comunicaciones comerciales, el Cliente declara que cuenta con consentimientos, bases legales, opt-ins, avisos, registros, mecanismos de baja y pruebas suficientes para contactar a las personas destinatarias." },
        { type: "p", text: "NETZEN podrá rechazar, pausar o modificar campañas, plantillas, mensajes, audiencias o flujos cuando detecte riesgo legal, técnico, de privacidad, de entregabilidad, de reputación, de spam, de bloqueo de cuenta o de violación de políticas de terceros." }
      ]
    },
    {
      slug: "ia",
      title: "Inteligencia artificial, automatización y analítica",
      blocks: [
        { type: "p", text: "NETZEN puede utilizar herramientas de automatización, analítica, inteligencia artificial, modelos generativos o sistemas de apoyo para diagnósticos, contenidos, clasificación, asistencia digital, seguimiento, reportes, mejoras operativas, soporte y prestación de servicios." },
        { type: "p", text: "Salvo pacto escrito distinto:" },
        {
          type: "ul",
          items: [
            "Los resultados automatizados son auxiliares y deben ser revisados antes de tomar decisiones materiales.",
            "El Cliente es responsable del uso final de recomendaciones, contenidos, reportes, datos, predicciones, diagnósticos y entregables.",
            "NETZEN no garantiza que los sistemas automatizados sean exactos, completos, libres de errores, sesgos o interrupciones.",
            "Las decisiones legales, fiscales, financieras, laborales, regulatorias, médicas o de alto impacto deben validarse con especialistas competentes."
          ]
        }
      ]
    },
    {
      slug: "precios",
      title: "Precios, impuestos y pagos",
      blocks: [
        { type: "p", text: "Los precios publicados o comunicados de forma general son referenciales, salvo que expresamente se indiquen como oferta vinculante. Los precios finales, moneda, impuestos, condiciones de pago, renovaciones, gastos de terceros, licencias, pauta, hosting, mensajes, APIs, costos de instalación, soporte y cargos recurrentes se establecerán en la propuesta o contrato aplicable." },
        { type: "p", text: "Salvo pacto escrito distinto:" },
        {
          type: "ul",
          items: [
            "Los precios no incluyen impuestos, retenciones, comisiones bancarias, cargos por tipo de cambio, costos de terceros ni gastos extraordinarios.",
            "Los pagos deben realizarse en las fechas acordadas.",
            "La falta de pago puede generar suspensión de servicios, intereses, gastos de cobranza y terminación del proyecto.",
            "Las tarifas de terceros pueden cambiar sin previo aviso y podrán trasladarse al Cliente cuando formen parte del servicio contratado.",
            "Los pagos por servicios ya iniciados, horas invertidas, licencias activadas, costos de terceros, configuraciones, diagnósticos, contenidos, entregables parciales o recursos reservados no serán reembolsables, salvo pacto escrito o disposición legal aplicable."
          ]
        }
      ]
    },
    {
      slug: "cancelaciones",
      title: "Cancelaciones, cambios y devoluciones",
      blocks: [
        { type: "p", text: "Las cancelaciones, cambios de alcance, reprogramaciones, devoluciones, garantías, bonificaciones o compensaciones se regirán por la propuesta o contrato aplicable." },
        { type: "p", text: "Salvo pacto escrito distinto:" },
        {
          type: "ul",
          items: [
            "Las solicitudes de cancelación o cambio deben realizarse por escrito.",
            "NETZEN podrá cobrar trabajo realizado, recursos asignados, costos incurridos, horas reservadas, compromisos con terceros y entregables producidos.",
            "Cambios de alcance, urgencias, dependencias adicionales, revisiones extraordinarias, nuevas funcionalidades o integraciones no previstas podrán generar costos y plazos adicionales.",
            "Licencias, consumos, dominios, software, hosting, pauta, mensajes, APIs, suscripciones y costos de terceros se sujetarán a las políticas del proveedor correspondiente."
          ]
        },
        { type: "p", text: "Cuando aplique una norma imperativa de protección al consumidor, NETZEN respetará los derechos irrenunciables del consumidor conforme a la ley vigente." }
      ]
    },
    {
      slug: "propiedad-intelectual",
      title: "Propiedad intelectual",
      blocks: [
        { type: "p", text: "NETZEN conserva todos los derechos sobre su marca, nombre comercial, logotipos, identidad, metodologías, know-how, frameworks, plantillas, procesos, código preexistente, herramientas, modelos, prompts, sistemas, bibliotecas, documentación, materiales internos, conceptos, estructuras, aprendizajes y propiedad intelectual desarrollada antes o fuera del proyecto." },
        { type: "p", text: "Salvo pacto escrito distinto y sujeto al pago completo de los servicios, el Cliente recibirá una licencia de uso sobre los entregables finales específicamente desarrollados para el Cliente, en el alcance, plazo, territorio y medios establecidos en la propuesta o contrato. Borradores, archivos fuente, versiones internas, prompts, materiales descartados, herramientas de trabajo y componentes reutilizables no se consideran entregables finales salvo acuerdo expreso." },
        { type: "p", text: "El Cliente concede a NETZEN una licencia limitada para usar marcas, materiales, datos, contenidos, accesos, instrucciones y activos proporcionados por el Cliente únicamente para prestar los servicios, preparar propuestas, ejecutar entregables, operar campañas, documentar avances y cumplir obligaciones legales o contractuales." }
      ]
    },
    {
      slug: "confidencialidad",
      title: "Confidencialidad",
      blocks: [
        { type: "p", text: "Las partes deberán proteger la información confidencial recibida de la otra parte con un nivel de cuidado razonable. La información confidencial solo podrá usarse para fines de la relación comercial." },
        { type: "p", text: "No será confidencial la información pública sin incumplimiento, conocida legítimamente, recibida de un tercero sin deber de confidencialidad, desarrollada independientemente o requerida por autoridad competente. Esta obligación sobrevivirá la terminación de la relación." }
      ]
    },
    {
      slug: "datos-personales",
      title: "Protección de datos personales",
      blocks: [
        { type: "p", text: "El tratamiento de datos personales se regirá por el Aviso de Privacidad de NETZEN, los contratos aplicables y las leyes vigentes en cada jurisdicción." },
        { type: "p", text: "Cuando NETZEN trate datos por cuenta de un Cliente, las partes podrán firmar un anexo de tratamiento de datos, data processing agreement, cláusulas contractuales tipo, instrucciones de tratamiento, reglas de transferencia internacional y medidas de seguridad. En ese caso, el Cliente será responsable de definir finalidades, contar con bases legales, informar a titulares y atender derechos cuando actúe como responsable o controlador." }
      ]
    },
    {
      slug: "seguridad-terms",
      title: "Seguridad",
      blocks: [
        { type: "p", text: "NETZEN aplicará medidas administrativas, técnicas y organizativas razonables para proteger la información bajo su control. Ningún sistema, transmisión por internet, nube, proveedor externo, API o plataforma digital es absolutamente seguro." },
        { type: "p", text: "El Cliente debe proteger sus accesos, usuarios, contraseñas, autenticación multifactor, dispositivos, cuentas, dominios y configuraciones. NETZEN no será responsable por incidentes derivados de credenciales comprometidas, accesos compartidos indebidamente, configuraciones externas, negligencia del Cliente, malware, phishing, actos de terceros o fallas ajenas a su control razonable." }
      ]
    },
    {
      slug: "garantias",
      title: "Garantías y exclusiones",
      blocks: [
        { type: "p", text: 'Salvo pacto escrito expreso, el sitio y los servicios se proporcionan "tal cual" y "según disponibilidad", con un nivel de cuidado profesional razonable.' },
        { type: "p", text: "NETZEN no garantiza:" },
        {
          type: "ul",
          items: [
            "Ventas, leads, conversiones, retorno de inversión, posicionamiento, aprobaciones de terceros, entregabilidad, escalamiento, valoración, financiamiento, rentabilidad o permanencia de resultados.",
            "Disponibilidad ininterrumpida, ausencia absoluta de errores, compatibilidad total o continuidad de plataformas de terceros.",
            "Que recomendaciones, benchmarks, diagnósticos, proyecciones o estimaciones permanezcan vigentes frente a cambios de mercado, precios, políticas o regulaciones."
          ]
        },
        { type: "p", text: "Nada en estos Términos limita derechos, garantías o responsabilidades que no puedan excluirse por ley." }
      ]
    },
    {
      slug: "limitacion",
      title: "Limitación de responsabilidad",
      blocks: [
        { type: "p", text: "En la máxima medida permitida por la ley aplicable, NETZEN no será responsable por daños indirectos, incidentales, especiales, punitivos, consecuenciales, pérdida de ingresos, pérdida de utilidades, pérdida de datos, daño reputacional, interrupción de negocio, pérdida de oportunidades, multas derivadas de instrucciones o incumplimientos del Cliente, ni daños causados por terceros." },
        { type: "p", text: "Salvo dolo, culpa grave o responsabilidad no limitable por ley, la responsabilidad total acumulada de NETZEN por cualquier reclamación relacionada con el sitio o los servicios se limitará al monto efectivamente pagado por el Cliente a NETZEN por el servicio específico que dio origen a la reclamación durante los tres meses anteriores al evento reclamado, o al límite establecido en el contrato aplicable." }
      ]
    },
    {
      slug: "indemnidad",
      title: "Indemnidad",
      blocks: [
        { type: "p", text: "El Cliente se obliga a defender, indemnizar y sacar en paz y a salvo a NETZEN, sus afiliadas, socios, directivos, empleados, contratistas y representantes frente a reclamaciones, daños, sanciones, multas, costos, gastos y honorarios derivados de:" },
        {
          type: "ul",
          items: [
            "Uso indebido del sitio o servicios.",
            "Incumplimiento de estos Términos, contratos, leyes o políticas de terceros.",
            "Datos, materiales, contenidos, instrucciones, audiencias, bases, claims, promociones o activos proporcionados por el Cliente.",
            "Falta de consentimiento, base legal o autorización para comunicaciones, tratamiento de datos o uso de propiedad intelectual.",
            "Productos, servicios, ofertas, garantías, relaciones con usuarios finales o decisiones comerciales del Cliente."
          ]
        }
      ]
    },
    {
      slug: "referencias",
      title: "Casos de éxito y referencias comerciales",
      blocks: [
        { type: "p", text: "Salvo que el Cliente lo prohíba por escrito o exista acuerdo de confidencialidad que lo impida, NETZEN podrá mencionar de forma razonable el nombre comercial, logotipo, industria y descripción general del proyecto como referencia comercial, portafolio o caso de experiencia, sin revelar información confidencial, datos sensibles, métricas privadas o detalles estratégicos no autorizados." }
      ]
    },
    {
      slug: "cumplimiento-internacional",
      title: "Cumplimiento internacional",
      blocks: [
        { type: "p", text: "El Cliente declara que no utilizará el sitio o los servicios para fines prohibidos por leyes de sanciones económicas, anticorrupción, lavado de dinero, financiamiento al terrorismo, control de exportaciones, privacidad, consumo, publicidad, telecomunicaciones o comercio internacional." },
        { type: "p", text: "NETZEN podrá rechazar, suspender o terminar servicios cuando detecte riesgo de incumplimiento legal, sanciones, fraude, corrupción, actividad ilícita o afectación reputacional significativa." }
      ]
    },
    {
      slug: "terminacion",
      title: "Terminación",
      blocks: [
        { type: "p", text: "NETZEN podrá suspender o terminar el acceso al sitio o servicios cuando exista incumplimiento de pago, incumplimiento contractual, uso indebido, riesgo legal o de seguridad, requerimiento de autoridad, imposibilidad técnica, violación de políticas de terceros, insolvencia o cualquier causa prevista en la propuesta o contrato." },
        { type: "p", text: "La terminación no afectará pagos devengados, obligaciones de confidencialidad, propiedad intelectual, protección de datos, limitación de responsabilidad, indemnidad, ley aplicable y demás disposiciones que por su naturaleza deban sobrevivir." }
      ]
    },
    {
      slug: "fuerza-mayor",
      title: "Fuerza mayor",
      blocks: [
        { type: "p", text: "NETZEN no será responsable por retrasos, interrupciones o incumplimientos causados por eventos fuera de su control razonable, incluyendo fallas de internet, energía, nube, plataformas, APIs, pasarelas, ataques, pandemias, desastres, actos de autoridad, cambios regulatorios, conflictos laborales, guerras, sanciones, bloqueos o eventos similares." }
      ]
    },
    {
      slug: "ley-aplicable",
      title: "Ley aplicable y controversias",
      blocks: [
        { type: "p", text: "Salvo pacto escrito distinto, estos Términos se regirán por las leyes de Ciudad de México, México, sin perjuicio de derechos irrenunciables que correspondan a consumidores en su lugar de residencia cuando sean aplicables." },
        { type: "p", text: "Las partes procurarán resolver controversias mediante negociación de buena fe. Si no se alcanza solución, se someten a los tribunales competentes de Ciudad de México, México, renunciando a cualquier otro fuero que pudiera corresponderles, salvo disposición imperativa aplicable." },
        { type: "p", text: "Para operaciones internacionales, las partes podrán pactar arbitraje, jurisdicción, idioma contractual, ley aplicable, reglas de transferencia internacional de datos y mecanismos alternativos de solución de controversias en el contrato correspondiente." }
      ]
    },
    {
      slug: "cambios-terms",
      title: "Cambios a estos Términos",
      blocks: [
        { type: "p", text: "NETZEN podrá actualizar estos Términos para reflejar cambios legales, operativos, tecnológicos, comerciales o de seguridad. La versión vigente se publicará en el sitio con fecha de actualización. El uso continuado del sitio o servicios después de la publicación de cambios implica aceptación de la versión actualizada, salvo que la ley exija consentimiento expreso." }
      ]
    },
    {
      slug: "contacto-terms",
      title: "Contacto",
      blocks: [
        { type: "p", text: "Para dudas, aclaraciones, reclamaciones o solicitudes relacionadas con estos Términos:" },
        {
          type: "kv",
          items: [
            { k: "Correo legal", v: "contacto@netzen.com.mx" },
            { k: "Domicilio", v: "Almanalco No. 82 Bis, Col. Vergel de Coyoacán, Tlalpan, Ciudad de México, C.P. 14340, México" },
            { k: "Teléfono", v: "+52 (55) 5684 9096" }
          ]
        }
      ]
    }
  ]
};
