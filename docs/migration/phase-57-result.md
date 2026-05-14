# Phase 57 — Admin Surface Systemization — Result

## Summary

Phase 57 **systemizes the admin surface layer**: a dedicated **`admin-surface-system.css`** defines semantic CSS variables and a small set of reusable classes. Core UI primitives (`AdminSectionCard`, `AdminDataTable`, `AdminStatCard`, `AdminAlert`, `AdminBadge`, `AdminEmptyState`, `AdminFieldGroup`, editor toolbars, block cards, simple-list shells, `AdminCard`) were aligned to these patterns. **No CMS features**, server actions, auth, public app, migrations, API routes, or new npm dependencies were introduced.

## Surface tokens & import order

- Added `apps/admin/src/styles/admin-surface-system.css` (motion, surfaces, edges, radius, shadows, density, badge tokens).
- `apps/admin/src/app/layout.tsx` now loads: `globals.css` → **`admin-surface-system.css`** → `admin-visual-governance.css`.
- `admin-visual-governance.css` **aliases** `--admin-gov-*` to `--admin-motion-*` (defined in the surface file) so a single motion source exists.

## Section card variants

- `AdminSectionCard` supports **`default` | `elevated` | `muted` | `accent` | `inset` | `glass`** (fixed union; `glass` = muted body + frosted header).
- Root/body use **`admin-surface-section`** + modifiers and **`admin-surface-section-body`** / **`-dense`** for padding from tokens.

## Tables

- Shell: **`admin-surface-table-wrap`** + **`admin-gov-table-scroll`** (sticky header unchanged).
- Cells: **`admin-surface-table-th`** / **`admin-surface-table-td`** use `--admin-table-cell-*` padding.
- Governance applies light/dark **box-shadow** on `.admin-surface-table-wrap` (replacing the old `admin-gov-data-table-shell` selector).

## Toolbars & editor

- Block toolbar: **`admin-surface-toolbar`** / **`admin-surface-toolbar-well`** + toolbar padding tokens.
- Editor toolbar: sticky row and footer use toolbar padding variables; footer uses **`admin-surface-editor-rail-footer`**.
- Block cards: unselected state uses **`admin-surface-block-card`**; legacy **`admin-block-card-hover`** rules were removed from `globals.css` as duplicate logic.

## Badges & empty states

- `AdminBadge`: base **`admin-badge`** class; density from `--admin-badge-*`.
- `AdminEmptyState`: root **`admin-surface-empty`** (drops redundant `AdminCard` wrapper for fewer conflicting borders).

## Inspector / forms

- `AdminFieldGroup` + **simple-list** fieldsets: **`admin-surface-fieldset`** instead of long Tailwind border/ring/shadow strings.
- `AdminFormField` / `AdminField`: slightly increased vertical rhythm where edited (`space-y-2`).

## Responsive

- Page editor: grid gap **`lg:gap-6` / `xl:gap-8`**; workflow row **`min-[1024px]:`** breakpoint; inspector scroll **viewport-capped** height.

## Duplicate logic removed

- `globals.css`: removed obsolete **`.admin-block-card-hover`** block (superseded by `.admin-surface-block-card`).

## Explicit non-goals

- No architecture changes, no RuntimeConfig on clients, no fake data, no `tw-animate-css`, no `@vercel/analytics`.

## Validation

Commands from repo root on 2026-05-11:

| Command | Exit | Notes |
|---------|------|--------|
| `npm run typecheck` | **0** | All 15 packages succeeded. |
| `npm run lint` | **0** | Pre-existing admin **warnings** only (`admin-avatar.tsx` `no-img-element`, `create-media-asset-form.tsx` `no-unused-vars`). No new errors from Phase 57. |
| `npm run build` | **0** | `apps/web` and `apps/admin` production builds succeeded. |
