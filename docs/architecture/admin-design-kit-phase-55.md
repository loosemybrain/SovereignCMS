# Admin Design Kit — Phase 55

**Date:** May 11, 2026  
**Scope:** Visual and UX refinement of the SovereignCMS admin app using patterns from `/_design-references/v0-admin/` as **reference only**.

## Principles

- **No architecture import:** The v0 app shell, routes, fake data, `runtimeConfig` client patterns, `@vercel/analytics`, and `tw-animate-css` were not copied or wired in.
- **Presentational kit:** Components under `apps/admin/src/components/admin-ui/` are layout/surface primitives only — no data fetching, server actions, or CMS business rules.
- **Preserved behavior:** Admin route tree, auth/guards, server actions, persistence, and public site rendering are unchanged.

## Kit inventory

| Component | Role |
|-----------|------|
| `AdminSectionCard` | Bordered section with header strip (inspector, settings-style blocks). |
| `AdminAlert` | Themed callouts (`info`, `warning`, `success`, `destructive`) via `admin-callout-*` CSS. |
| `AdminDataTable` | Rounded scroll shell + head row / `th` helpers. |
| `AdminStatusBadge` | Thin wrapper over `AdminBadge` for semantic naming. |
| `AdminStatCard` | Metric tiles (dashboard). |
| `AdminFeatureCard` / `adminFeatureCardClassNames` | Compact surfaces for presets / tiles; class helper supports `<button>` roots. |
| `AdminConfigGrid` | Responsive 1–4 column grid for config summaries. |
| `AdminTopbar` | Sticky title + actions strip (admin shell main column). |
| `AdminFormField` | Label + control + description stack (optional use alongside `AdminField`). |
| `AdminFieldGroup` | Fieldset-style grouping with legend. |

## CSS tokens

- **`admin-callout-info`:** Added for informational alerts (governance hints, etc.).
- **`admin-row-hover`:** Table/list row hover using theme variables; respects reduced motion for transitions where paired with Tailwind `motion-reduce:*`.
- **`admin-danger`:** Text color from `--admin-danger`.
- **Dark `admin-warning`:** Improved contrast for warning text in dark admin theme.

## Integration touchpoints

- **Shell:** `AdminShell` — sidebar rhythm, active/hover/focus states, `AdminTopbar` for the main header; runtime footer remains factual (existing `runtimeConfig` display).
- **Inspector:** `InspectorSection` uses `AdminSectionCard`; block field buckets use nested `AdminSectionCard`; governance uses `AdminAlert` + icons.
- **Block palette:** `AdminSectionCard` + `adminFeatureCardClassNames` on preset and empty-block buttons.
- **Lists:** Pages, Media, Navigation, Footer tables use `AdminDataTable` + `admin-row-hover`.
- **Dashboard:** `DashboardCard` delegates to `AdminStatCard`; runtime block uses `AdminSectionCard` + `AdminConfigGrid`.
- **Privacy:** `AdminAlert` for errors, success, disclaimer; tenant-missing state uses `AdminAlert`.
- **Settings:** `settings-editor.tsx` — each settings group is an `AdminSectionCard`; feedback via `AdminAlert`; legal slugs in `AdminConfigGrid` (two columns). Save path and validation unchanged.

## Accessibility

- Focus-visible relies on existing `admin-focus-ring` utilities and strengthened input focus border transitions on `AdminInput` / `AdminTextarea` / `AdminSelect`.
- Active nav: accent background, border, and a visible dot marker (not color-only).
- Governance and privacy notices use `role="status"` on `AdminAlert` where appropriate; decorative icons are `aria-hidden` on the SVG wrapper in `AdminAlert` usage.
