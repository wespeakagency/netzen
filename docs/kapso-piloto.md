# Piloto Kapso · Netzen

**Objetivo**: validar la integración de Kapso como motor de conversación de WhatsApp para dos casos de uso críticos, usando el sitio propio de Netzen como piloto antes de ofrecerlo a clientes.

**Duración estimada**: 2 sprints (4 semanas).
**Costo esperado**: USD 0 en Kapso (free tier de 2.000 mensajes/mes alcanza de sobra) más fees de Meta al costo (las primeras 1.000 conversaciones de servicio/mes son gratis en Cloud API).

---

## Contexto técnico actual

Stack del sitio Netzen relevante para el piloto:

- Frontend: React + Vite (SPA, `src/pages/contacto/Contacto.jsx`, `src/pages/soluciones/Recorrido.jsx`, etc.).
- Backend de formularios: Google Apps Script publicado como Web App, endpoint en `VITE_SHEETS_ENDPOINT` (`src/lib/env.js:11`).
- Persistencia: Google Sheets, leído por dashboard interno (`src/dashboard/`).
- WhatsApp actual: solo link saliente `wa.me/...` vía `VITE_WHATSAPP_URL` (`src/lib/env.js:15`). Sin API, sin bot, sin webhooks.
- Feature flags: `src/lib/featureFlags.js` para activar/desactivar por sección.

**Nota arquitectónica clave**: el hecho de que el sitio sea SPA NO afecta la integración. Kapso se llama server-to-server desde Apps Script, nunca desde el navegador. La API key vive en Script Properties, jamás en el bundle de Vite.

---

## Caso A · Auto-respuesta 24/7 al lead que llena el form

### Qué queremos lograr

Cuando un lead completa cualquier formulario del sitio (Contacto, Diagnóstico, Demo, Recorrido), recibe un mensaje inmediato por WhatsApp confirmando la solicitud, con la información de contacto de Netzen y el tiempo estimado de respuesta. Esto pasa 24/7, sin intervención humana, incluso a las 3am de un domingo.

### Flujo técnico

```
[Lead completa form en el sitio SPA]
             │
             ▼
[POST a Apps Script Web App]  ←── ya existe
             │
             ├──► Escribe fila en Google Sheets  ←── ya existe
             │
             └──► POST a api.kapso.ai/meta/whatsapp/{phone_id}/messages
                        Auth: Bearer <KAPSO_API_KEY>
                        Body: template "welcome_lead" con nombre + hora estimada
                              │
                              ▼
                    [Kapso envia mensaje via Cloud API de Meta]
                              │
                              ▼
                    [WhatsApp del lead]
```

### Requisitos previos

1. Alta en Kapso free tier con número pre-verificado.
2. Template `welcome_lead` redactado y aprobado por Meta (48h típico). Ejemplo:

   > Hola {{1}}, gracias por contactar a Netzen. Recibimos tu solicitud y un consultor te va a responder en horario hábil (lunes a viernes, 9:00 a 19:00 CDMX). Si es urgente, respondé a este mensaje.

3. API key de Kapso guardada en Script Properties del Apps Script (nunca en el repo).

### Cambios en código

**Apps Script** (única modificación):

```javascript
function sendKapsoWelcome(lead) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('KAPSO_API_KEY');
  const phoneId = PropertiesService.getScriptProperties().getProperty('KAPSO_PHONE_ID');
  const url = `https://api.kapso.ai/meta/whatsapp/${phoneId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: lead.whatsapp,
    type: 'template',
    template: {
      name: 'welcome_lead',
      language: { code: 'es_MX' },
      components: [{
        type: 'body',
        parameters: [{ type: 'text', text: lead.nombre }]
      }]
    }
  };

  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${apiKey}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
```

**Frontend**: cero cambios. El form ya postea a Apps Script.

**Feature flag** en `src/lib/featureFlags.js`:

```javascript
export const FLAGS = {
  // ...existentes
  kapso_auto_reply: false, // activar cuando piloto esté listo
};
```

Como el disparo pasa server-side, el flag en realidad se implementa como una Script Property booleana (`KAPSO_ENABLED=true|false`) en Apps Script. El flag del frontend queda como documentación.

### Criterios de éxito

- El 100% de los leads que completan form reciben el mensaje de bienvenida en menos de 60 segundos.
- Tasa de opt-out inicial menor al 5% (indicador de que el mensaje se percibe como valor y no spam).
- Cero costos por encima del free tier durante el mes de piloto.

---

## Caso B · Bot conversacional que califica antes del handoff

### Qué queremos lograr

Cuando el lead responde al mensaje de bienvenida (Caso A), en vez de esperar a un humano, un agente LLM lo saluda, le hace 3 a 5 preguntas de calificación (presupuesto, tamaño de empresa, país, vertical, urgencia), guarda las respuestas en el CRM/Sheets, y hace handoff al inbox de Netzen SOLO cuando el lead califica. Los que no califican reciben una respuesta cortés y quedan en un bucket separado.

### Flujo técnico

```
[Lead responde al mensaje de bienvenida]
             │
             ▼
[Webhook entrante en Kapso]  →  dispara Workflow
             │
             ▼
     ┌───────────────────────────────────┐
     │   Workflow Kapso                  │
     │                                   │
     │   Start                           │
     │     ↓                             │
     │   Agent (LLM con prompt Netzen)  │
     │     ↓  (5 preguntas)              │
     │   Set variables (respuestas)      │
     │     ↓                             │
     │   Decide (¿califica?)             │
     │     ├── SI → Handoff a inbox      │
     │     └── NO → Send "gracias" + fin │
     │     ↓                             │
     │   Webhook outbound                │
     └─────────────┬─────────────────────┘
                   ▼
     [POST a Apps Script /kapso-hook]
                   ▼
     [Actualiza fila en Sheets: estado, calificado, respuestas]
                   ▼
     [Dashboard interno muestra estado actualizado]
```

### Requisitos previos

1. Caso A operativo (el bot arranca sobre la conversación que Caso A abrió).
2. Definir los criterios de calificación con Ulises y Brenda. Propuesta inicial:
   - **Presupuesto mensual**: menor a USD 500 descartar, USD 500 a 2.000 nurture, mayor a USD 2.000 handoff inmediato.
   - **Tamaño de equipo comercial**: menos de 3 personas nurture, 3 o más handoff.
   - **País**: México, Colombia, Chile, Argentina, Perú avanzan. Otros a nurture.
   - **Vertical**: retail, servicios financieros, salud, educación son prioridad.
   - **Urgencia**: "esta semana" o "este mes" saltan directo a handoff.
3. Redactar el system prompt del Agent node en tono Netzen (formal cercano, voseo si aplica, sin em-dash).
4. Nuevo endpoint `doPost` en Apps Script que reciba el webhook outbound de Kapso.

### Cambios en código

**Apps Script** (endpoint nuevo):

```javascript
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const event = payload.event; // "handoff_triggered" | "workflow_completed" | etc

  if (event === 'workflow_completed') {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('leads');
    const row = findRowByPhone(sheet, payload.contact.phone);
    if (row) {
      sheet.getRange(row, COL_KAPSO_STATUS).setValue(payload.variables.calificado ? 'calificado' : 'nurture');
      sheet.getRange(row, COL_KAPSO_BUDGET).setValue(payload.variables.presupuesto);
      sheet.getRange(row, COL_KAPSO_URGENCY).setValue(payload.variables.urgencia);
      sheet.getRange(row, COL_KAPSO_UPDATED).setValue(new Date());
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Dashboard** (`src/dashboard/`): agregar columnas `Estado Kapso`, `Calificación`, `Presupuesto declarado`. Sin cambios de arquitectura, solo columnas nuevas en la tabla existente (`src/dashboard/components/LeadsTable.jsx`).

**Kapso**: todo el workflow se arma visualmente en el dashboard de Kapso, no requiere código en el repo.

### Criterios de éxito

- El bot completa las 5 preguntas en el 70% o más de las conversaciones iniciadas.
- El 100% de los leads calificados generan handoff al inbox en menos de 5 minutos desde que el lead terminó de responder.
- El dashboard interno muestra el estado de Kapso actualizado en tiempo real (menos de 30 segundos de delay).
- Zero mensajes "perdidos" (lead responde y no hay respuesta del bot en menos de 30 segundos).

---

## Plan de sprints

### Sprint 1 (semana 1 a 2): setup sin código

**Objetivo**: dejar Kapso operativo y aprobado por Meta, sin tocar el repo todavía.

- [ ] Alta en Kapso free tier.
- [ ] Decisión: número pre-verificado de Kapso o número propio de Netzen (recomendado: pre-verificado para el piloto).
- [ ] Redactar y enviar a aprobación de Meta el template `welcome_lead`.
- [ ] Definir con Ulises y Brenda los 5 criterios de calificación finales del Caso B.
- [ ] Redactar el system prompt del Agent node.
- [ ] Armar el workflow completo en el builder visual de Kapso.
- [ ] Probar el workflow end-to-end usando un número personal.
- [ ] Confirmar con Kapso comercialmente: DPA, CFDI, SLA, ownership del WABA (ver "Preguntas pendientes" abajo).

### Sprint 2 (semana 3 a 4): integración con el stack

**Objetivo**: conectar el sitio real con Kapso, con feature flag para poder apagar todo en un segundo.

- [ ] Modificar Apps Script para agregar `sendKapsoWelcome()` disparado desde el `doPost` actual.
- [ ] Guardar `KAPSO_API_KEY` y `KAPSO_PHONE_ID` en Script Properties.
- [ ] Agregar Script Property `KAPSO_ENABLED` como kill switch.
- [ ] Crear endpoint webhook `doPost` que recibe eventos de Kapso y actualiza Sheets.
- [ ] Configurar el webhook outbound en Kapso apuntando a la nueva URL de Apps Script.
- [ ] Agregar columnas en el dashboard: `Estado Kapso`, `Calificación`, `Presupuesto`, `Urgencia`.
- [ ] Actualizar `docs/lead-attribution.md` con el nuevo flujo.
- [ ] Actualizar aviso de privacidad (`src/pages/legal/content.js`) para sumar Kapso como sub-encargado.
- [ ] QA end-to-end: llenar cada uno de los 6 formularios del sitio y verificar que llegue el mensaje.
- [ ] Activar `KAPSO_ENABLED=true` en producción.

---

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Template no aprobado por Meta | Bloqueante Caso A | Enviar el template en Sprint 1 día 1. Backup: usar template genérico ya aprobado y personalizar el body. |
| Kapso cae o cambia API | Alto | Kill switch `KAPSO_ENABLED=false` en Script Properties. Rollback en 10 segundos. Sheets sigue capturando leads igual. |
| Lead reporta el mensaje como spam a Meta | Medio-Alto | Solo mensajes tras acción explícita del lead (llenar form). Opt-out claro en el mensaje. Monitorear reputación del número. |
| API key filtrada | Crítico | Nunca en el repo, siempre en Script Properties. Rotar cada 90 días. |
| Rate limit de Apps Script (20k/día free) | Bajo | Volumen actual de leads menor a 100/día. Sobra por 200x. |
| Bot responde algo inapropiado | Medio | Prompt con restricciones explícitas ("no prometas precios", "no des SLA"). Log de todas las conversaciones en Kapso para revisión. |

---

## Preguntas pendientes para Kapso (llevar a la junta con ellos)

1. ¿DPA firmable? ¿Cumplimiento LFPDPPP mexicana? ¿Data residency?
2. ¿SLA de uptime en Pro y Platform? ¿Soporte en español, horario LATAM?
3. ¿Emiten CFDI? ¿Facturan USD o MXN?
4. ¿Rate limits de la API de Kapso por segundo?
5. ¿Los tokens del LLM en Agent nodes son bring-your-own-key o incluidos en el precio?
6. ¿Overage del Pro: precio por mensaje sobre los 100k?
7. ¿Ownership del WABA si onboardamos clientes finales?
8. ¿Proceso y downtime si migramos un número desde otro BSP?

---

## Decisiones pendientes internas Netzen

- [ ] ¿Piloto en sitio propio primero o directo con cliente? Recomendación: **piloto propio 2 sprints**.
- [ ] ¿Quién opera el inbox de handoff en horario hábil?
- [ ] ¿Los 5 criterios de calificación finales del Caso B?
- [ ] ¿Tono del bot: voseo rioplatense, tuteo mexicano, o neutro LATAM?
- [ ] ¿Qué pasa con leads fuera de horario hábil una vez calificados? ¿Bot los agenda para llamada al día siguiente o solo confirma que un humano los contactará?

---

## Métricas a reportar semanalmente durante el piloto

- Leads que recibieron mensaje de bienvenida / total leads.
- Tasa de respuesta al mensaje de bienvenida (lead escribe de vuelta).
- Tasa de completitud del bot (lead responde las 5 preguntas).
- Tasa de calificación (calificados / respondieron).
- Tiempo medio bot → handoff.
- Tiempo medio handoff → primera respuesta humana.
- Opt-outs / bloqueos.
- Costo real (Kapso + Meta) vs presupuestado.
