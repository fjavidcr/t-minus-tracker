# Implementation Plan: Orbitar UI - Modern Archive (v2.0)

This plan outlines the refactoring of the Orbitar application to align with the "Modern Archive" design system (v2.0). We will fix the incorrect color palette, apply the specific three-font typography system, and rebuild the sub-pages to match the high-fidelity mockups while preserving the user-approved Index page layout.

## User Review Required

> [!IMPORTANT]
> **Paleta de Colores**: Cambiaremos el color **Primary** de Naranja a **NASA Blue (#0B3D91)** y el **Secondary** a **Artemis Orange (#Fc3d21)**, según especifica el `DESIGN.md`. La aplicación actual usa Naranja como primario.
>
> **Tipografía**: Implementaremos el sistema de tres fuentes:
> - **Space Grotesk** para titulares.
> - **Geist Sans** para el cuerpo de texto.
> - **Lexend** para etiquetas y metadatos.
> Esto afectará a todas las páginas, incluyendo la Index, para asegurar coherencia visual.

> [!WARNING]
> **Reconstrucción de Páginas**: Las páginas de `Calendar` y `Settings` serán reconstruidas casi por completo para eliminar el "ruido visual" actual y adoptar el estilo de "Archivo Institucional" de los mockups.

## Proposed Changes

### 1. Foundations & Tokens

#### [MODIFY] [tailwind.config.ts](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/tailwind.config.ts)
- Actualizar `colors`:
  - `primary`: `#0B3D91`
  - `secondary`: `#Fc3d21`
  - `surface`: `#0f131c` (Navy profundo)
  - `on-surface`: `#dfe2ee`
- Configurar `fontFamily`:
  - `headline`: `['Space Grotesk', 'sans-serif']`
  - `body`: `['Geist Sans', 'sans-serif']`
  - `label`: `['Lexend', 'sans-serif']`
  - `sans`: `['Geist Sans', 'sans-serif']` (Default body font)

#### [MODIFY] [app/app.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/app.vue)
- Importar **Geist** y **Lexend** desde Google Fonts (o localmente si están disponibles).
- Eliminar hardcoded `font-family: 'Space Grotesk'` en el scope global y dejar que Tailwind lo gestione.
- Ajustar el color del sidebar y header para usar los nuevos tokens de `surface-container-low`.

### 2. UI Components

#### [MODIFY] [LaunchCard.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/components/LaunchCard.vue)
- Actualizar gradientes y bordes para usar NASA Blue como base.
- Aplicar `font-label` (Lexend) a los metadatos y `font-body` (Geist) a la descripción.

### 3. Page Refactoring

#### [MODIFY] [calendar.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/calendar.vue)
- Reconstruir siguiendo el layout de `docs/desing/Page Calendar/code.html`.
- Implementar la cuadrícula de calendario "Archival" con bordes tenues (`outline-variant/10`).
- Usar el sidebar de hitos (Milestones) con el nuevo esquema de colores.

#### [MODIFY] [settings.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/settings.vue)
- Reconstruir siguiendo el layout de `docs/desing/Page Settings/code.html`.
- Implementar las secciones de "Browser Alerts" y "Data Localization" con el estilo de consola técnica.

#### [NEW] [id].vue (file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/missions/[id].vue)
- Crear la página de detalles de misión basada en `docs/desing/Page Detalles/code.html`.
- Incluir la sección de "Schematic 084-B" y el mapa de trayectoria.

#### [MODIFY] [index.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/index.vue)
- **Mantener layout intacto**.
- Reemplazar el naranja (`primary`) por el azul en los botones y acentos (o usar el nuevo `secondary` naranja donde se desee mantener el color).
- Asegurar que los titulares usen `font-headline` y el texto use `font-body`.

## Verification Plan

### Automated Tests
- Ejecutar `npm run dev` y navegar por todas las rutas.
- Verificar en la consola de desarrollador que las fuentes se están cargando correctamente.

### Visual Audit (Manual)
- Comparar las páginas reconstruidas con los archivos `screen.png` en `docs/desing`.
- Verificar que el "No-Line Rule" se respete (márgenes definidos por cambios de color de fondo, no por bordes de 1px negros).
- Confirmar que la página Index sigue funcionando igual pero con los colores y fuentes actualizados.
