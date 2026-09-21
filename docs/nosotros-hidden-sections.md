# Nosotros, secciones ocultas temporalmente

Fecha: 2026-09-18
Rama: v2.1

## Qué se ocultó

1. **Sección Certificaciones** en `/nosotros/por-que-netzen` (Section completa, con Moprosoft y dos "Estándar por confirmar").
2. **Sección Liderazgo** en `/nosotros/equipo` (las tres cards con "Nombre del líder" y roles hardcodeados).
3. **Card "Certificaciones"** del Hub de `/nosotros` (`Hub.jsx`), que reenviaba a la sección oculta.

## Por qué

Netzen no tiene todavía data real validada para estas secciones:

- Las certificaciones estaban con placeholders ("Estándar por confirmar", "Pendiente de confirmar nivel y vigencia") y un badge "Por verificar".
- El liderazgo mostraba tres cards con el texto literal "Nombre del líder" y "Trayectoria y especialidad por confirmar con dirección".

Publicar contenido explícitamente marcado como pendiente daña la percepción de autoridad (justamente el argumento que ese apartado tiene que sostener). Mientras no haya data real (nombres, cargos, fotos, certificaciones con vigencia confirmada), se ocultan.

Además, se suavizó una línea en `Hub.jsx` que decía "los números finos se validan antes de publicarse" por un copy neutro sin lenguaje pendiente.

## Cómo reactivar

Cuando llegue la data real, editar `src/lib/featureFlags.js`:

```js
export const FEATURES = {
  // ...
  nosotros_certificaciones: true,  // reactiva Section en PorQueNetzen + card en Hub
  nosotros_liderazgo: true,        // reactiva Section en Equipo
};
```

## Archivos tocados

- `src/lib/featureFlags.js`, agregadas dos flags nuevas y helper `isFeatureEnabled(key)`.
- `src/pages/nosotros/PorQueNetzen.jsx`, Section Certificaciones envuelta en flag (JSX intacto como backup).
- `src/pages/nosotros/Equipo.jsx`, Section Liderazgo envuelta en flag (JSX intacto como backup).
- `src/pages/nosotros/Hub.jsx`, card Certificaciones filtrada por flag + copy suavizado en lead de sección Trayectoria.

## Antes de reactivar

- Reemplazar los `desc` de los 3 items de `LIDERES` en `Equipo.jsx` con bios reales.
- Cambiar el `<h3>Nombre del líder</h3>` hardcodeado por el nombre real (falta un campo `name` en la data actual).
- Reemplazar el ícono genérico `CircleUser` por foto real del líder.
- Reemplazar los items de la Section Certificaciones en `PorQueNetzen.jsx` con certificaciones vigentes y confirmadas. Quitar el `<Badge tone="warning">Por verificar</Badge>`.
