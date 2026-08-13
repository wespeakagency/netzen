# Netzen Web V2

Versión ajustada del sitio Netzen a partir del registro de Frameback, el checkpoint
NETZEN del 21 de julio de 2026 y los textos de misión, visión y valores compartidos
por Liz.

## Cómo abrirla

- Entregable directo: `entregable/NETZEN-sitio-web.html`.
- Sitio compilado: servir la carpeta `dist/` con un servidor estático.
- Desarrollo:

```bash
npm ci
npm run dev
npm run build
npm run entregable
```

## Cambios principales

- Hero editorial con una propuesta de valor centrada en empresa humana y crecimiento consciente.
- Misión y visión ejecutivas en Home; versiones completas y cinco valores en la página dedicada.
- Contrato de uso de licencia en modalidad de renta, sin lenguaje que sugiera venta de licencia.
- WhatsApp colocado encima del CTA flotante de diagnóstico.
- Jerarquía cromática más clara: rojo institucional dominante y azul como acento.
- Bandas de cierre más ligeras, con espacio negativo y mejor contraste de botones.
- Recorridos sin repetición inmediata entre resumen y detalle.
- Selector de idioma visible y honesto: español activo; traducciones pendientes.
- Consentimiento, aviso de privacidad y términos integrados como borradores para revisión legal.
- Medición preparada mediante `dataLayer` y eventos `netzen:analytics`, sin enviar datos personales.
- Navegador interno de prototipo retirado de la entrega pública.

## Pendientes de producción

- Sustituir el número placeholder de WhatsApp en `src/lib/nav.js`.
- Conectar las URL oficiales de Oficina Virtual y Soporte; por ahora están desactivadas.
- Conectar formularios, newsletter, webinars y descargas al CRM/backend real.
- Reemplazar los borradores legales con las versiones aprobadas por Netzen.
- Publicar traducciones solo después de su revisión.

Nota técnica: el build está actualizado a Vite 8. `npm audit` conserva una alerta de
React Router asociada al modo RSC/acciones de servidor; esta entrega es un HashRouter
estático y no usa RSC ni acciones de servidor. Debe reevaluarse si la arquitectura cambia.

El detalle de decisiones y fuentes está en `CAMBIOS_WEB_V2.md`.
