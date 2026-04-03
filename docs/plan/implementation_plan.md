# Implementation Plan: Orbitar UI - Stitch Parity (Modern Archive v2.0)

This plan outlines the systematic refactoring of the Orbitar application to achieve pixel-perfect parity with the "Modern Archive v2.0" design system. We will transition from the current standalone page designs to a unified, institutional archive aesthetic.

## User Review Required

> [!IMPORTANT]
> **Core Palette Shift**: The design system defines **NASA Blue (#0B3D91)** as the Primary color and **Artemis Orange (#FF6D00)** as the Secondary accent. Currently, the app uses Orange as the primary. I will swap these to align with the Stitch "v2.0" spec.

> [!IMPORTANT]
> **Layout Change**: Every page will now feature a persistent **Sidebar (Command Center)** and a **Top Navigation Bar**. This will replace the current navigation patterns to match the institutional "Terminal" look.

## Proposed Changes

### 1. Design System Foundations

#### [MODIFY] [tailwind.config.ts](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/tailwind.config.ts)
- Update `colors` to match the exact hex codes from the provided `code.html` files:
  - `primary`: `#0B3D91` (NASA Blue)
  - `secondary`: `#FF6D00` (Artemis Orange)
  - `surface`: `#080C14` (Deep Space Base)
  - `on-surface`: `#dfe2ee`
  - `surface-container-low/high/highest`: defined for tonal shifts.
- **Typography Alignment**:
  - `headline`: **Space Grotesk**
  - `body`: **Geist** (Note: Need to ensure Geist Sans is imported/available)
  - `label`: **Lexend** (Note: Need to ensure Lexend is imported/available)

### 2. Global Layout Structure

#### [MODIFY] [app.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/app.vue)
- Implement the persistent `Sidebar` and `Top Navigation` structure.
- Wrap `<NuxtPage />` in the main content canvas with correct spacing and backdrop blurs.

### 3. Page Refactoring (Source-of-Truth Alignment)

#### [MODIFY] [index.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/index.vue)
- Refactor the Dashboard to use the **Central Countdown Hero**.
- Implement the **Bento Grid** for Upcoming Deployments and Yearly Logistics.
- Add the "Mission Text Stroke" effect for titles.

#### [NEW] [id].vue(file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/missions/[id].vue) (Replacing `artemis.vue`)
- Implement a dynamic mission detail page that loads data based on the route ID.
- Overhaul with the **Schematic 084-B** (SLS Blueprint) for SLS missions, and adaptable technical layouts for others.
- Implement the **TLI Trajectory Map** and **Systems Telemetry Matrix**.
- Add the "Live Telemetry" status indicators and progress bars using API data (or high-fidelity simulations where API telemetry is sparse).

#### [REPLACE] [settings.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/settings.vue)
- Completely rebuild the settings page from scratch to match the **"Settings Console"** design.
- Implement sections for `Browser Alerts`, `Display Nodes` (Agency subscriptions), `Data Localization` (Metric/Imperial), and `Interface Theme`.

#### [MODIFY] [calendar.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/pages/calendar.vue)
- Standardize the **Month View** grid with specific tonal headers.
- Implement the **Milestone Sidebar** with agency-specific status colors.
- Add the `Launch Site Status` monitoring section.

### 4. Component Refinement

#### [MODIFY] [LaunchCard.vue](file:///Users/f.javierdelcastilloramirez/github/orbitar-app/app/components/LaunchCard.vue)
- Update cards to use the `archival-gradient` and ghost-style buttons.
- strictly enforce the **No-Line Rule** (no 1px borders, only background shifts).

## Open Questions

- **API Data Enrichment**:
  - We will use the [SpaceDevs API](https://ll.thespacedevs.com/docs) as the primary data source.
  - Researching specific endpoints for `Launch`, `Spacecraft`, and `Rocket` to pull technical specs (thrust, mass, crew capacity) for the "Technical Diagram" components.
  - If real-time telemetry (PSI, Temps) is not available via API, we will implement **Logically Simulated Telemetry** based on mission status to maintain the "Modern Archive" high-fidelity aesthetic.
- **Settings Page**: The design folder includes a `Page Settings`. Should I proceed to refactor the current settings page to match this specific "Console" look as well?

## Verification Plan

### Automated Tests
- Run `npm run dev` and navigate through all routes.
- Verify Tailwind utility generation for the new color tokens.

### Visual Audit
- Use `browser_subagent` to take screenshots and compare 1:1 with the `screen.png` files provided in the `docs/desing` subdirectories.
- Check font rendering and backdrop-blur performance.
