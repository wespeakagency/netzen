# Clasificación de Leads (P1 · P2 · P3 · P4 · PENDIENTE · NO_SCORABLE)

Guía operativa para el equipo comercial (Irving y quien tome leads del dashboard).

**Fuente:** Arquitectura de Formularios, Scoring y CRM de Netzen, spec v1.0 (Isaac), sección 12.
**Origen:** junta "Checkpoint Comercial Netzen".
**Seguimiento:** @Arostegui Maranto.
**Motor actual:** `heur_v1` en Apps Script (versión heurística, motor definitivo llega en Fase 2A).

---

## Cómo se calcula la categoría (resumen para no técnicos)

Cada lead que entra por un formulario del sitio se evalúa por **tres ejes**:

1. **Alineación** (¿Netzen puede resolver bien este caso ahora?). Pesa **50%**.
2. **Potencial** (¿qué valor comercial tiene?). Pesa **35%**.
3. **Intención** (¿qué tan fuerte fue la acción que hizo?). Pesa **15%**.

El sistema arma un número de **prioridad de 0 a 100** con esa fórmula. Después mira la **confianza**, que es simplemente cuántos campos respondió el lead sobre los que aplicaban. Con esos dos números (prioridad + confianza) se asigna la categoría.

La categoría **NO** se muestra al lead. Es interna. El lead nunca ve "sos P3".

---

## Las categorías

### P1 · Atención prioritaria

**Regla del sistema:** prioridad ≥ 80, confianza ≥ 70, sin hard stop.

**Traducción comercial:** lead altamente alineado con lo que Netzen ofrece, con potencial claro (presupuesto, escala, autoridad de decisión, timing), datos completos y sin banderas rojas (privacidad rechazada, dominio bloqueado, competidor, etc.).

**Ejemplos típicos:**
- Contacto Diagnóstico completado con rol de decisor, presupuesto asignado, ventana de tiempo corta y recursos de implementación.
- Contacto Demo con red grande (miles de distribuidores) y situación B o C.

**Acción:** validar y contactar en **menos de 4 horas hábiles**. Personalizado. Agendar reunión o call en la primera conversación.

---

### P2 · MQL (Marketing Qualified Lead)

**Regla del sistema:** prioridad 60-79, confianza ≥ 60, sin hard stop.

**Traducción comercial:** buen fit, potencial razonable, pero falta alguna pieza para ser P1. Puede ser autoridad de decisión intermedia, timing más largo, presupuesto por confirmar, o algún campo clave sin responder.

**Ejemplos típicos:**
- Contacto Demo con red mediana y decisor influenciador (no final).
- Diagnóstico donde el timing es a 3-6 meses.

**Acción:** revisar y contactar en **menos de 24 horas hábiles**. Nutrir con contenido relevante, agendar seguimiento con fecha concreta.

---

### P3 · Nurture guiado

**Regla del sistema:** prioridad 40-59, o fit todavía inmaduro (aunque tenga datos).

**Traducción comercial:** hay interés pero el encaje no está claro todavía. Puede ser una empresa muy chica o muy grande respecto al ICP, un rol junior, una industria adyacente, o un caso donde Netzen podría ayudar pero requiere más discovery.

**Ejemplos típicos:**
- Contacto general con preguntas exploratorias.
- Demo pedido por perfil junior sin visibilidad al decisor.
- Situación A (apenas empiezo) sin señales fuertes de escala.

**Acción:** nurture guiado. Pedir el dato que falta o mandar contenido específico por ruta. Reevaluar en 30 días.

---

### P4 · Nurture largo

**Regla del sistema:** prioridad menor a 40, **con datos suficientes** (confianza ≥ 60).

**Traducción comercial:** el lead completó datos, pero el fit y potencial son bajos. No es basura ni spam, simplemente no hay match comercial hoy. Puede madurar en meses o años.

**Ejemplos típicos:**
- Empresa fuera del tamaño objetivo con curiosidad genuina.
- Prospecto en país no priorizado sin señales de expansión.
- Contacto sin dolor claro que Netzen resuelva.

**Acción:** nurture largo, no saturar al equipo comercial. Contenido educativo, no ventas.

---

### PENDIENTE · Falta información

**Regla del sistema:** confianza menor a 60 (respondió pocos campos aplicables).

**Traducción comercial:** no se puede clasificar todavía porque hay muy poca data. **No es un "lead malo"**, es un lead sin calificar. La regla del spec es explícita: *nunca llamarlo "lead bajo"*.

**Ejemplos típicos:**
- Formularios cortos donde el lead solo dio nombre, email y mensaje.
- Recorrido de Soluciones sin completar campos de calificación.

**Acción:** pedir la información que falta o calificar humanamente antes de asignar categoría. Puede terminar siendo P1 tanto como P4, no está definido.

---

### NO_SCORABLE · Evento no comercial

**Regla del sistema:** el lead viene de newsletter, descarga de guía, artículo, webinar o inscripción a evento.

**Traducción comercial:** es una interacción de contenido, no una intención de compra. El sistema **no lo puede convertir en SQL (Sales Qualified Lead)** sin una captura comercial posterior. Se registra la actividad y se suma a la ficha del contacto, pero no dispara alerta comercial.

**Ejemplos típicos:**
- Suscripción al Substack de Netzen.
- Descarga del PDF de guía.
- Registro a un webinar.

**Acción:** nurture automatizado. Si esa misma persona después pide una demo o diagnóstico, ahí sí se califica.

---

## Regla de oro para Irving

**Orden de contacto diario:**

1. **P1** (SLA menor a 4h hábiles). No hay excepciones.
2. **P2** (SLA menor a 24h hábiles). Vencidos primero, después nuevos.
3. **P3** (nurture guiado). Enfocarse en calificar, no en cerrar.
4. **PENDIENTE**. Completar data para poder categorizar.
5. **P4** (nurture largo). No hace falta contacto activo, se trabaja con contenido.
6. **NO_SCORABLE**. Solo mirar si hay señal de conversión posterior.

Si hay un P1 sin contactar, **ningún P2 o P3 se toca antes**. La prioridad manda.

---

## Cosas importantes que la gente confunde

**"El score que ve el lead."**
El lead nunca ve su categoría ni su score. Ni en el "gracias", ni en un email, ni en ningún lado. El backend es el único que sabe. Si alguna vez ves que el score se filtra al frontend, es un bug, reportalo.

**"P4 = lead malo, tirarlo."**
Falso. P4 es fit bajo hoy, no basura. Se trabaja con nurture largo. La "basura" son leads con `hard_stop` (privacidad rechazada, dominio bloqueado, spam confirmado) y esos ni siquiera entran al pipeline con categoría, van a ERRORS_REVIEW.

**"Un PENDIENTE es peor que un P4."**
Falso. PENDIENTE es "todavía no sé". Puede terminar como P1. El spec lo dice literal: *nunca llamarlo lead bajo*.

**"Si un P3 me dice que quiere comprar, ¿lo dejo como P3?"**
No. La categoría es dinámica. Se recalcula cuando aparece data nueva. Si un P3 pide demo con fecha concreta y menciona presupuesto, sube a P1 automáticamente en el próximo scoring.

**"¿Puedo cambiar la categoría a mano si tengo una corazonada?"**
El sistema es la fuente de verdad. Si querés subir un lead, se hace **completando o corrigiendo la data en el CRM**, no editando la categoría directamente. Así el motor recalcula y queda auditado.

---

## Convivencia con el Netzen Fit legacy

Netzen ya venía usando un scoring anterior de **21 puntos** (7 criterios de 0 a 3 cada uno) con bandas HIGH / MEDIUM / LOW_NURTURE. Ese scoring **no se tira**, sigue guardándose en paralelo como `netzen_fit_21` y `fit_band_legacy` para poder comparar registros históricos y auditar la transición.

Si en el dashboard ves ambos números, no te confundas: **la categoría P1-P4 manda para operar**. El fit de 21 es de continuidad histórica.

---

## Preguntas frecuentes

**¿Qué es un "hard stop"?**
Bandera técnica que descalifica al lead sin importar el score: privacidad no aceptada, dominio bloqueado, spam, competidor identificado. Nunca llega al dashboard como categoría comercial.

**¿Qué pasa si el lead completa un form dos veces?**
El sistema deduplica por identidad canónica (email principal). La segunda submission suma actividad pero no crea contacto nuevo. El score se recalcula con la data agregada.

**¿Un P1 puede bajar de categoría?**
Sí, si aparece información que reduce el fit (por ejemplo confirma que no es decisor, o que el timing es a 12+ meses). El scoring se recalcula ante nueva data.

**¿Por qué a veces un lead tiene número de score pero categoría PENDIENTE?**
Porque la confianza es baja (respondió pocos campos). Aunque el score dé alto, si la confianza es menor a 60 se marca PENDIENTE para forzar calificación humana antes de operar.

**¿Los pesos de cada eje son iguales para todos los formularios?**
No. Cada **ruta (A, B, C, D)** tiene sus propios pesos en `SCORE_WEIGHTS`. Ruta A pesa más "encaje de solución" y "capacidad de decisión". Ruta B pesa más "severidad del dolor" y "presupuesto". Está documentado en el spec sección 12.2.

---

## Referencias

- Spec oficial: `Arquitectura_Formularios_Scoring_CRM_Netzen_v1_0.docx`, secciones 12 (scoring), 13 (Netzen Fit legacy), 14 (compuertas).
- Doc técnico de trazabilidad: `docs/lead-attribution.md`.
- Doc técnico de analytics: `docs/gtm-events-implementation.md`.
- Notas internas: `Netzen-Fase-1-Scoring-Definicion`, `Netzen-CRM-Ligero-Plan-Accion`.
