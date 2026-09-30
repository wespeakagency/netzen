# Tracking automático de leads por apertura de email

Cómo funciona el sistema que avanza automáticamente el estado de un lead de "Nuevo" a "Contactado" cuando el equipo comercial abre el email de notificación.

## Qué hace

Cada vez que entra un lead nuevo desde el sitio, el sistema:

1. Guarda el lead en la hoja `01_LEADS` con `lifecycle_stage = "nuevo"`
2. Envía un email de notificación al equipo comercial (destino configurado en la hoja `06_CONFIG`)
3. El email incluye un **tracking pixel invisible** (una imagen 1x1 que no se ve) al principio del cuerpo del mensaje
4. Cuando el destinatario **abre el email** en Gmail, el cliente carga automáticamente el pixel
5. Al cargarlo, se dispara un endpoint del Apps Script que:
   - Actualiza `lifecycle_stage` del lead a `"contactado"` (solo si estaba en `"nuevo"`)
   - Registra el evento en la hoja `02_TOUCH_EVENTS` con timestamp y metadata
6. El dashboard interno refleja el cambio automáticamente en el próximo refresh (cada 60 segundos o al recargar)

Es la misma técnica que usan HubSpot, Mailchimp, Stripe y demás sistemas transaccionales para trackear apertura de emails.

## Reglas de negocio implementadas

### El avance es idempotente

El código solo mueve el estado si actualmente está en `"nuevo"` o vacío. Si el lead ya está en `"contactado"`, `"calificado"`, `"propuesta"`, `"cerrado_ganado"`, `"cerrado_perdido"` o `"nurture"`, **no se toca**.

Esto significa que un lead nunca "retrocede" en el pipeline por accidente aunque el pixel se dispare múltiples veces.

### La edición manual desde el dashboard tiene prioridad

Cualquier estado puede editarse desde el dropdown de la sección **Seguimiento** del drawer del dashboard. El sistema respeta ese cambio.

Vocabulario disponible:

- Nuevo
- Contactado
- Calificado
- Propuesta
- Cerrado, ganado
- Cerrado, perdido
- Interés futuro

### Caso especial: retroceder de "Contactado" a "Nuevo"

Si alguien mueve manualmente un lead de vuelta a `"nuevo"` desde el dashboard (por ejemplo, si Irving se dio cuenta de que abrió el email pero no llegó a contactar realmente), el sistema **volvería a marcarlo como `"contactado"`** la próxima vez que se cargue el pixel del email.

**Importante**: en la práctica esto casi nunca sucede porque Gmail cachea las imágenes agresivamente. La primera vez que se abre el email, el pixel se dispara y se marca el touch event. Los siguientes abrir del mismo email suelen servir la imagen desde el cache local de Gmail (no vuelven a pegar al servidor). Por lo tanto:

- Si volvés a abrir el mismo email → probablemente NO re-dispara el pixel
- Si se cambia de dispositivo, se limpia el cache o pasan varios días → puede que sí re-dispare

Si querés que el retroceso a `"nuevo"` sea permanente, mejor **archivá o borrá el email** una vez cambiado el estado manualmente. Así te asegurás que ninguna re-apertura futura re-triggerea el pixel.

## Cómo verificar que funcionó

### En la hoja `02_TOUCH_EVENTS`

Cada disparo del pixel escribe una fila con estas columnas:

| Columna | Descripción |
|---|---|
| `event_id` | UUID único del evento |
| `event_at` | Timestamp exacto del disparo |
| `lead_id` | Referencia al lead en `01_LEADS` |
| `channel` | Siempre `"email_opened"` para el pixel |
| `source` | `"email_pixel"` cuando fue el pixel (vs. legacy `"email_notification"` de click-tracking viejo) |
| `previous_stage` | Estado del lead ANTES del disparo |
| `stage_advanced` | `TRUE` si el sistema movió el estado, `FALSE` si no |
| `user_agent` | User-agent del cliente (generalmente vacío porque Gmail proxea) |

### En la hoja `01_LEADS`

Buscá el lead por `lead_id` (columna A) y mirá la columna `lifecycle_stage`. Debería decir `"contactado"` después de que se abra el email.

### En el dashboard

Abrí el drawer del lead haciendo click en su fila. El pill de estado en el header y el dropdown de "Seguimiento" deberían mostrar "Contactado".

## Limitaciones conocidas

### Gmail bloquea imágenes por defecto para remitentes desconocidos

Si el equipo comercial tiene la configuración de Gmail que **no carga imágenes automáticamente**, el pixel no se dispara. En ese caso el estado se queda en `"nuevo"` y hay que moverlo manualmente desde el dashboard.

**Fix**: en Gmail → Configuración → General → "Mostrar siempre imágenes externas". O agregar el remitente del sistema como contacto de confianza.

### Threading de Gmail puede recortar el email

Gmail agrupa emails con asuntos idénticos en un mismo thread y "recorta" el contenido repetido. Cuando esto pasa, el pixel queda en la parte oculta y no se carga hasta que se haga click en "Ver todo el mensaje".

**Fix implementado**: cada email tiene un asunto único con el prefijo `#XXXXXX` (primeros 6 chars del `lead_id`), formato: `"Nuevo lead #b45f43 · [empresa] · [nombre]"`. Esto evita que Gmail los agrupe.

### Cache del proxy de Gmail

Gmail proxea todas las imágenes por su CDN (`googleusercontent.com`). El proxy cachea la respuesta. Si el mismo email se abre múltiples veces, después de la primera vez Gmail sirve la imagen desde el cache y no vuelve a llamar al Apps Script.

Esto es **bueno** porque evita duplicar touch events por la misma apertura. Pero también significa que **la ventana para trackear una apertura es esencialmente la primera vez**.

### Precisión del "quién abrió el email"

Como Gmail proxea las imágenes, el request al Apps Script llega desde IPs de Google, no del usuario. Por lo tanto no podemos saber quién específicamente abrió el email (nombre de usuario, ubicación, dispositivo). Solo sabemos que "alguien con acceso a este email lo abrió".

Para el flow interno de Netzen esto es suficiente: solo Irving y el equipo comercial tienen acceso a esa casilla.

## Arquitectura técnica

```
Form web (Contacto.jsx)
   ↓
Apps Script doPost
   ├─ Guarda lead en 01_LEADS con lifecycle_stage="nuevo"
   └─ Envía email de notificación con:
        - Asunto único: "Nuevo lead #XXXXXX · [empresa] · [nombre]"
        - Botón WhatsApp directo (wa.me)
        - Botón Email directo (mailto)
        - Pixel invisible al inicio del body (buildTrackingPixelUrl_)

Equipo abre el email
   ↓
Gmail carga la imagen del pixel
   ↓
Request GET al Apps Script:
   /exec?action=trackContact&lead_id=XXX&channel=email_opened&t=YYY
   ↓
handleTrackContact_ valida HMAC (TRACKING_SECRET)
   ↓
Toma LockService para evitar race conditions
   ├─ Lee lifecycle_stage actual
   ├─ Si es "nuevo" o vacío → escribe "contactado"
   └─ Registra evento en 02_TOUCH_EVENTS

Dashboard hace auto-refresh cada 60s
   ↓
Refleja el nuevo estado
```

## Seguridad

El endpoint del tracker es público (cualquiera con la URL podría llamarlo). Para evitar abuso está protegido con **HMAC-SHA256**:

- El servidor tiene una property `TRACKING_SECRET` (Script Properties de Apps Script)
- Cada pixel URL incluye un token calculado como `HMAC(lead_id + "|" + channel, TRACKING_SECRET)`
- El tracker valida el token antes de hacer cualquier cambio

Si alguien intenta llamar el endpoint con un `lead_id` real pero sin el token correcto, se rechaza. El impacto de un abuso es bajo (a lo sumo alguien marca leads como "contactado" antes de tiempo), pero el HMAC lo previene igualmente.

## Configuración del sistema

### Requisitos en Apps Script

1. **Script Property `TRACKING_SECRET`**: string random de 20+ caracteres. Si no existe, el pixel no se genera (fallback silencioso, el email se manda sin tracking).
2. **Script Property `DASHBOARD_API_TOKEN`**: string random usado para autorizar las mutaciones desde el dashboard (edición manual del estado).
3. **Deployment**: el Apps Script debe estar deployado como Web App con "Ejecutar como: Yo" y "Quién tiene acceso: Cualquier usuario".

### Hoja `02_TOUCH_EVENTS`

Se crea automáticamente la primera vez que se dispara un touch event. No hace falta crearla a mano.

### Template del email

El template `emailLead.html` (dentro del proyecto de Apps Script) debe incluir el pixel al **inicio del body**, no al final. Ejemplo:

```html
<body>
  <? if (trackingPixelUrl) { ?>
    <img src="<?= trackingPixelUrl ?>" width="1" height="1" alt="" style="display:none;border:0;height:1px;width:1px;overflow:hidden" />
  <? } ?>
  <!-- resto del contenido -->
</body>
```

Poner el pixel al principio evita que quede en secciones "recortadas" por el trimming de Gmail.

## Próximas mejoras posibles

- **Distinción de canales de contacto**: además del email opened, trackear si Irving realmente clickeó WhatsApp vs. Email (requeriría un servidor externo para hacer redirect real, ya que Apps Script no puede hacer 302 sin la ventana intermedia fea).
- **Métricas derivadas**: aprovechar `02_TOUCH_EVENTS` para calcular tiempo promedio de primer contacto, ratio de leads sin abrir email vs. abiertos, etc.
- **Fallback manual desde el email**: agregar un botón "Marcar como contactado" en el email para clientes que no cargan imágenes, que apunte a una URL simple que el usuario tenga que clickear conscientemente.
