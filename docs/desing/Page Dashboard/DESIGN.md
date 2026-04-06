# Design System Strategy: The Modern Archive (v2.0)

## 1. Overview & Creative North Star
**Creative North Star: "The Technical Curator"**

This design system moves away from the aggressive, high-contrast "hacker" aesthetic of traditional space interfaces. Instead, it embraces an editorial, archival approach. We are not just showing data; we are documenting the history of human expansion.

The "Modern Archive" style uses the sophisticated depth of a deep space vacuum (the new `#0f131c` navy base) rather than absolute black. It breaks the "template" look through **intentional asymmetry**—pairing heavy typographic displays with expansive negative space. Elements should feel like high-precision instruments laid out on a velvet curator's table: organized, spaced with mathematical precision, and layered with tonal sophistication.

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in the deep navy of the cosmos, utilizing NASA Blue (`#0B3D91`) and Artemis Orange (`#Fc3d21`) as high-precision beacons.

*   **The "No-Line" Rule:** To achieve a premium, editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For instance, a flight telemetry module (`surface_container_low`) should sit on the main `surface` without a stroke, using only the color value change to define its footprint.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. Use the hierarchy below to stack information:
    *   **Base Layer:** `surface` (#0f131c)
    *   **Sectioning:** `surface_container_low` (#181c24)
    *   **Interactive Cards:** `surface_container` (#1c2028)
    *   **Floating Modals/Overlays:** `surface_container_highest` (#31353e)
*   **The "Glass & Gradient" Rule:** For floating HUD elements (like a launch countdown timer), use `surface_variant` with a 60% opacity and a `backdrop-blur` of 12px.
*   **Signature Textures:** For primary call-to-actions, apply a subtle linear gradient from `primary` (#b1c5ff) to `primary_container` (#0b3d91) at a 135-degree angle to give buttons a "machined metal" depth.

## 3. Typography: The Geist Protocol
We use **Space Grotesk** for headlines, **Geist** for body text, and **Lexend** for labels—typefaces that evoke a sense of institutional authority and "Modern Archive" clarity.

*   **Display (lg/md):** Reserved for mission names or countdown T-minus clocks. Use `display-lg` (3.5rem) with `-0.02em` letter spacing to create a dense, authoritative "masthead" feel.
*   **Headlines:** Use `headline-sm` for section headers. Always pair these with a `label-md` "Classification" tag above it to reinforce the archival theme.
*   **Body:** `body-md` is our workhorse for telemetry data. Ensure a line height of at least 1.5 to maintain readability against the dark navy background.
*   **Labels:** `label-sm` (0.6875rem) should be used for metadata (e.g., "Lat/Long", "Orbital Velocity"). Use `on_surface_variant` (#c4c6d3) for these to create a clear visual hierarchy between "Data" and "Label."

## 4. Elevation & Depth: Tonal Layering
In a space-themed interface, "shadows" are rarely used. Depth is achieved through light and atmospheric layering.

*   **The Layering Principle:** Instead of shadows, use "Negative Lifting." To make a card feel closer to the user, shift the background color from `surface` to `surface_container_high`.
*   **Ambient Shadows:** If a component *must* float (e.g., a critical abort notification), use a shadow with a blur of `40px` and an opacity of `8%`, tinted with `primary` (#b1c5ff) to simulate the glow of a cockpit screen.
*   **The "Ghost Border" Fallback:** For accessibility in complex data tables, use a "Ghost Border": the `outline_variant` token at 15% opacity. Never use 100% opaque lines; they "trap" the data and ruin the archival flow.

## 5. Components: Precision Instruments

### Buttons
*   **Primary:** High-gloss gradient (Primary to Primary Container). `2` (moderate) roundedness.
*   **Secondary:** Ghost style. No fill, `outline_variant` at 20% opacity. Text in `primary_fixed`.
*   **States:** On hover, primary buttons should increase their `surface_tint` intensity; they do not get "darker," they "glow" brighter.

### Cards & Data Modules
*   **Forbid Dividers:** Do not use lines to separate "Launch Date" from "Rocket Type." Use `24` (6rem) of vertical whitespace or a subtle background shift to `surface_container_lowest`.
*   **Telemetry Chips:** Use `secondary_container` (#fd6c00) for "Live" or "Critical" status. The high-contrast Artemis Orange against the navy background ensures immediate eye-tracking.

### Input Fields
*   **Style:** Underline only or filled (`surface_container_highest`). Avoid the four-sided box. This mimics technical logbooks.
*   **Focus:** When active, the underline transitions to `secondary` (#ffb692) to provide a warm, technical glow.

### Specialized Components
*   **The Progress Orbit:** A custom circular loader using `primary` for the track and `secondary` for the "active" mission progress.
*   **Mission Timeline:** A vertical track using `surface_container_highest` for the line, with `on_surface` dots. No borders on the timeline containers.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Place a large `display-lg` mission title on the far left and keep the right 40% of the screen empty to allow the navy background to "breathe."
*   **Do** use `secondary_fixed_dim` for warning text; it is softer on the eyes than pure red while maintaining urgency.
*   **Do** treat every screen as if it were a high-end printed technical manual.

### Don't:
*   **Don't** use pure white (#FFFFFF). Always use `on_surface` (#dfe2ee) for text to prevent eye strain.
*   **Don't** use standard 1px dividers. They create "visual noise" that contradicts the clean, archival aesthetic.
*   **Don't** use "Drop Shadows" that are black. If a shadow is needed, it must be tinted with the deep navy `surface` color.