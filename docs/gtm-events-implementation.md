# GTM · Implementación de eventos custom de Netzen

Guía para configurar en Google Tag Manager (contenedor `GTM-N4BFLQTQ`) el reenvío de los eventos custom del sitio hacia GA4 y Meta Pixel.

**Prerrequisito:** el tag base de GA4 (Configuration Tag con Measurement ID) ya está publicado. Este documento cubre solo los eventos de negocio pendientes.

---

## 1. Inventario de eventos que el sitio ya envía al dataLayer

Todos los eventos tienen prefijo `netzen_` (lo agrega `src/lib/analytics.js`) e incluyen `page_path` como parámetro base.

| Evento (dataLayer) | Cuándo se dispara | Parámetros extra | Prioridad |
|---|---|---|---|
| `netzen_page_view` | Cada cambio de ruta | `page_path` | Baja (redundante con Enhanced Measurement) |
| `netzen_form_submit` | Envío de cualquier formulario | `form_type` (contact, newsletter, webinar, guia_destacada, solucion), `route` | **ALTA** |
| `netzen_cta_click` | Click en cualquier `<Button>` | `label`, `destination`, `placement` | **ALTA** |
| `netzen_whatsapp_click` | Click en botones de WhatsApp | `placement` (contact_card, floating) | **ALTA** |
| `netzen_blog_post_click` | Click en post del carousel de Blog | `title`, `link` | Media |
| `netzen_blog_substack_click` | Click a Substack desde Blog | `source` (empty_state, error_state, subscribe_card, view_all) | Baja |
| `netzen_not_found` | Usuario cae en 404 | `attempted_path` | Media |
| `netzen_language_menu_open` | Abre selector de idioma | `language` | Baja |
| `netzen_consent_update` | Usuario acepta/rechaza banner | `consent_status`, `consent_source` | Media (compliance) |

---

## 2. Fase A · Variables del dataLayer

En GTM: **Variables > Nueva > Variable de capa de datos**. Crear una por cada parámetro. El "Nombre de variable de capa de datos" debe coincidir exactamente con el nombre del parámetro.

- `dlv - form_type`
- `dlv - label`
- `dlv - destination`
- `dlv - placement`
- `dlv - page_path`
- `dlv - source`
- `dlv - title`
- `dlv - link`
- `dlv - attempted_path`
- `dlv - language`
- `dlv - route`
- `dlv - consent_status`
- `dlv - consent_source`

---

## 3. Fase B · Triggers (eventos personalizados)

En GTM: **Activadores > Nuevo > Evento personalizado**. Uno por cada evento.

Configuración base:
- Nombre del evento: nombre exacto del dataLayer (ej. `netzen_form_submit`)
- Se activa en: Todos los eventos personalizados

Triggers a crear:
- `CE - netzen_form_submit`
- `CE - netzen_cta_click`
- `CE - netzen_whatsapp_click`
- `CE - netzen_blog_post_click`
- `CE - netzen_blog_substack_click`
- `CE - netzen_not_found`
- `CE - netzen_language_menu_open`
- `CE - netzen_consent_update`

**Alternativa rápida:** un solo trigger con regex `^netzen_.*` (marcar "Usar coincidencia de expresión regular"). Ahorra tiempo pero pierde granularidad.

---

## 4. Fase C · Tags de GA4 Event

En GTM: **Etiquetas > Nueva > Google Analytics: evento de GA4**. Uno por cada evento prioritario.

### Tag 1: form_submit
- Etiqueta de configuración: la existente (GA4 Configuration)
- Nombre del evento: `form_submit`
- Parámetros del evento:
  - `form_type` = `{{dlv - form_type}}`
  - `route` = `{{dlv - route}}`
  - `page_path` = `{{dlv - page_path}}`
- Activador: `CE - netzen_form_submit`

### Tag 2: cta_click
- Nombre del evento: `cta_click`
- Parámetros:
  - `label` = `{{dlv - label}}`
  - `destination` = `{{dlv - destination}}`
  - `placement` = `{{dlv - placement}}`
  - `page_path` = `{{dlv - page_path}}`
- Activador: `CE - netzen_cta_click`

### Tag 3: whatsapp_click
- Nombre del evento: `whatsapp_click`
- Parámetros:
  - `placement` = `{{dlv - placement}}`
  - `page_path` = `{{dlv - page_path}}`
- Activador: `CE - netzen_whatsapp_click`

### Tag 4: blog_post_click (opcional, prioridad Media)
- Nombre del evento: `blog_post_click`
- Parámetros: `title`, `link`, `page_path`
- Activador: `CE - netzen_blog_post_click`

### Tag 5: not_found (opcional, prioridad Media)
- Nombre del evento: `page_not_found`
- Parámetros: `attempted_path`, `page_path`
- Activador: `CE - netzen_not_found`

---

## 5. Fase D · Meta Pixel

En GTM: **Etiquetas > Nueva > buscar "Meta Pixel"** en galería comunitaria (plantilla oficial de Facebook). Si no aparece, usar HTML personalizado con el snippet oficial.

### Tag base (PageView)
- Meta Pixel ID: (el que ya se tiene asignado)
- Evento: PageView
- Activador: All Pages
- **Configuración avanzada:** marcar "Requiere consentimiento adicional" y agregar `ad_storage`

### Tag conversión: Lead
- Evento: Lead
- Activador: `CE - netzen_form_submit`
- Requiere consentimiento: `ad_storage`

### Tag conversión: Contact
- Evento: Contact
- Activador: `CE - netzen_whatsapp_click`
- Requiere consentimiento: `ad_storage`

---

## 6. Fase E · Eventos Clave (conversiones) en GA4

Esto va en GA4, no en GTM.

**GA4 > Admin > Eventos** → marcar como "Evento clave":
- `form_submit`
- `whatsapp_click`

Con esto GA4 empieza a reportar conversiones reales, no solo tráfico.

---

## 7. Fase F · Dimensiones personalizadas en GA4 (opcional pero recomendado)

Para que los parámetros custom aparezcan como dimensiones filtrables en los reportes.

**GA4 > Admin > Definiciones personalizadas > Crear dimensión personalizada**:

| Nombre de dimensión | Ámbito | Parámetro del evento |
|---|---|---|
| Form Type | Evento | `form_type` |
| CTA Label | Evento | `label` |
| CTA Destination | Evento | `destination` |
| CTA Placement | Evento | `placement` |
| Route | Evento | `route` |
| WhatsApp Placement | Evento | `placement` |

Nota: la data histórica antes de crear la dimensión no se retropobla. Crear cuanto antes.

---

## 8. Fase G · Publicación y verificación

1. En GTM: **Vista previa (Preview Mode)** con la URL del sitio
2. Navegar el sitio, enviar un formulario de prueba, hacer click en CTA y WhatsApp
3. En el panel de Preview verificar que cada tag se dispara con los parámetros correctos
4. En **GA4 > Informes > Tiempo real** confirmar que los eventos custom llegan
5. Si todo OK, en GTM: **Enviar > Publicar**
6. Nombre de versión sugerido: `v2 - Custom events Netzen + Meta Pixel`

---

## 9. Deploy incremental recomendado

**No configurar los 9 eventos de una.** Orden sugerido:

1. **Semana 1:** Fase A (variables) + los 3 tags de prioridad ALTA (form_submit, cta_click, whatsapp_click) + Meta Pixel base y Lead + Eventos Clave. Publicar y monitorear 48 horas.
2. **Semana 2:** Meta Pixel Contact + tags Media (blog_post_click, not_found). Publicar.
3. **Semana 3:** Tags Baja + dimensiones personalizadas. Publicar.

Esto evita debuggear muchos tags al mismo tiempo si algo sale mal.

---

## 10. Checklist rápido

- [ ] Fase A: 13 variables dataLayer creadas
- [ ] Fase B: triggers de eventos personalizados creados
- [ ] Fase C: tags GA4 Event para form_submit, cta_click, whatsapp_click
- [ ] Fase D: Meta Pixel base + Lead + Contact con Consent Mode
- [ ] Fase E: form_submit y whatsapp_click marcados como Evento Clave en GA4
- [ ] Fase F: dimensiones personalizadas en GA4
- [ ] Fase G: verificado en Preview + publicado + confirmado en GA4 Realtime

---

## Referencias

- Contenedor GTM: `GTM-N4BFLQTQ`
- Property GA4: Netzen Global
- Consent Mode: implementado en `src/lib/consent.js` (Consent Mode v2, default denied)
- Emisor de eventos: `src/lib/analytics.js`
- Doc previa relacionada: `docs/gtm-meta-pixel-setup.md`
