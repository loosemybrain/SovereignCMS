# Admin Design Kit — Phase 55, 55.1 & 55.2

**Date:** May 11, 2026  
**Scope:** Visual and UX refinement of the SovereignCMS admin app using patterns from `/_design-references/v0-admin/` as **reference only**. **Phase 55.1** converged UI toward v0 and fixed the `RuntimeConfig` client boundary leak. **Phase 55.2** is a stronger v0 visual alignment pass (shell, surfaces, editor, tables) without changing backend or public behavior.

## Principles

- **No architecture import:** The v0 app shell, routes, fake data, `runtimeConfig` client patterns, `@vercel/analytics`, and `tw-animate-css` were not copied or wired in.
- **Presentational kit:** Components under `apps/admin/src/components/admin-ui/` are layout/surface primitives only — no data fetching, server actions, or CMS business rules.
- **Preserved behavior:** Admin route tree, auth/guards, server actions, persistence, and public site rendering are unchanged.
- **Phase 55.1:** Full `RuntimeConfig` is **not** passed into Client Components; only `AdminRuntimeAdapterLabels` (three string fields) crosses the boundary for sidebar display, and the page editor receives a single `databaseAdapterLabel` string for context.
- **Phase 55.2:** Deeper admin-only CSS (layering, topbar/sidebar, alerts, stat cards, editor states, tables, scrollbars); `AdminSectionCard` variants (`default` / `elevated` / `glass`); default icons in `AdminAlert`; dashboard metrics use **real** Lucide icons only (no fabricated analytics).

## Kit inventory

| Component | Role |
|-----------|------|
| `AdminSectionCard` | Bordered section with header strip; optional `headerIcon`; variants `default` \| `elevated` \| `glass` (glass = blurred header strip). |
| `AdminAlert` | Client component: themed callouts + optional icon; default Lucide icon per variant; `role="alert"` only for `destructive`. |
| `AdminDataTable` | Rounded scroll shell + head row / `th` / body / row / cell helpers (`AdminDataTableCell` forwards table cell attributes). |
| `AdminStatusBadge` | Thin wrapper over `AdminBadge` for semantic naming. |
| `AdminStatCard` | Metric tiles (dashboard) with optional `icon`, integrated sparkline container when `sparklineData` is provided. |
| `AdminFeatureCard` / `adminFeatureCardClassNames` | Compact surfaces for presets / tiles; class helper supports `<button>` roots. |
| `AdminConfigGrid` | Responsive 1–4 column grid for config summaries. |
| `AdminTopbar` | Sticky title + actions strip (admin shell main column). |
| `AdminPageHeader` | Page title stack with optional `eyebrow` and gradient title treatment (`admin-page-title-gradient`). |
| `AdminFormField` | Label + control + description stack (optional use alongside `AdminField`). |
| `AdminFieldGroup` | Fieldset-style grouping with legend. |

## CSS tokens

- **`admin-callout-info`:** Added for informational alerts (governance hints, etc.).
- **`admin-row-hover`:** Table/list row hover using theme variables; respects reduced motion for transitions where paired with Tailwind `motion-reduce:*`.
- **`admin-danger`:** Text color from `--admin-danger`.
- **Dark `admin-warning`:** Improved contrast for warning text in dark admin theme.

## Phase 55.1–55.2 layout utilities (admin-only)

- **`admin-topbar`:** Translucent sticky bar with stronger blur/saturation and soft shadow (graceful fallback without blur support).
- **`admin-sidebar` / `admin-sidebar-nav-active` / `admin-sidebar-nav-idle`:** Sidebar gradient, inset edge, and nav row states.
- **`admin-main-scroll`:** Subtle radial accent wash behind main scroll content; scoped scrollbar thumb styling under `.admin-theme-root`.
- **`admin-editor-workspace` / `admin-editor-canvas` / `admin-inspector-shell`:** Layered editor + inspector surfaces (55.2: stronger canvas border/shadow).
- **`admin-insert-target-ring`:** Block insertion affordance when “insert after” targets a card.
- **`admin-section-card-head`:** Gradient header strip on `AdminSectionCard`; **`admin-section-card-elevated`**, **`admin-section-card-glass-head`** for variants.
- **`admin-card-lift`:** Hover lift for premium cards (transform disabled when `prefers-reduced-motion`).
- **`admin-page-title-gradient`:** Clipped gradient text for primary page headings.
- **`admin-alert-shell` / `admin-alert-icon-badge`:** CMS-style alert framing (55.2).
- **`admin-block-card-selected` / `admin-block-card-hover`:** Editor block selection/hover surfaces.
- **`admin-inspector-debug` / `admin-inspector-debug-pre`:** De-emphasized debug/raw JSON blocks in the inspector.

## Integration touchpoints

- **Shell:** `AdminShell` — Lucide nav with per-route gradient icon tiles, left active bar, logo mark, `AdminTopbar` with translucent bar + tenant subtitle + real `tenant.source` badge; runtime footer uses **`AdminRuntimeAdapterLabels`** only (from `pickAdminRuntimeAdapterLabels` in layout).
- **Inspector:** `InspectorSection` uses `AdminSectionCard` with elevated default and dashed **debug** styling when `raw`; field buckets use nested `AdminSectionCard` with **`elevated`**; governance uses **`AdminSectionCard` + `AdminAlert`** (no fake status).
- **Block palette:** Card grid per category with gradient type icons, preset grid, dashed “empty block” action — same add-block APIs.
- **Lists:** Pages, Media, Navigation, Footer tables use `AdminDataTable` + `admin-row-hover` + shared row/cell primitives; section cards use **`elevated` / `glass`** where it clarifies hierarchy.
- **Editor:** `page-editor-client.tsx` — `admin-editor-workspace` wrapper, canvas for blocks/status/toolbar, sticky `admin-inspector-shell` with glass header strip, insertion ring on `EditorBlockCard` when targeted; `databaseAdapterLabel` (string) replaces `RuntimeConfig` in the client tree.
- **Dashboard:** `DashboardCard` delegates to `AdminStatCard` with optional Lucide icons from real metrics only; runtime block uses `AdminSectionCard` + `AdminConfigGrid`.
- **Privacy:** `AdminAlert` for errors, success, disclaimer; tenant-missing state uses `AdminAlert`.
- **Settings:** `settings-editor.tsx` — each settings group is an `AdminSectionCard`; feedback via `AdminAlert`; legal slugs in `AdminConfigGrid` (two columns). Save path and validation unchanged.

## Accessibility

- Focus-visible relies on existing `admin-focus-ring` utilities (55.2: optional outer glow) and strengthened input focus border transitions on `AdminInput` / `AdminTextarea` / `AdminSelect`.
- Active nav: left accent bar, tinted row background, and border (not color-only).
- Governance and privacy notices: `AdminAlert` uses `role="status"` for non-destructive variants and `role="alert"` for `destructive`; default alert icons are `aria-hidden`.
