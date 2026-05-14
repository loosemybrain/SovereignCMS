# Admin surface system (Phase 57)

This document is the **reference for the admin-only surface layer** introduced in Phase 57. It complements Phase 56 editorial governance (`editorial-ux-governance-phase-56.md`) and the existing theme tokens in `apps/admin/src/app/globals.css`.

## Source of truth

| Layer | File | Role |
|--------|------|------|
| Theme tokens | `globals.css` | `--admin-bg`, `--admin-surface`, `--admin-border`, `--admin-accent`, … |
| Surface system | `apps/admin/src/styles/admin-surface-system.css` | Semantic aliases, elevation, density, motion aliases, reusable surface classes |
| Editorial calibration | `apps/admin/src/styles/admin-visual-governance.css` | Intensity tuning; **aliases** `--admin-gov-*` → `--admin-motion-*` (defined in surface system) |

Import order in `apps/admin/src/app/layout.tsx`: `globals.css` → `admin-surface-system.css` → `admin-visual-governance.css`.

**Public app (`apps/web`)** does not import these files.

## Surface hierarchy

1. **App** (`--admin-surface-app` / `--admin-bg`): page background and main scroll wash.
2. **Raised** (`--admin-surface-raised` / `--admin-surface`): cards, tables, primary panels.
3. **Sunken** (`--admin-surface-sunken`): toolbars, wells, grouped controls.
4. **Inset** (`--admin-surface-inset`): recessed panels, optional section variant.
5. **Muted mix**: section variants `muted` / `glass` (body) use a controlled mix of muted + surface — not a separate token tree.

## Controlled section variants (`AdminSectionCard`)

Variants are **fixed enums** only (no arbitrary strings):

| Variant | Use |
|---------|-----|
| `default` | Standard section; light elevation + hover. |
| `elevated` | Stronger elevation; keeps `admin-section-card-elevated` for governance alignment. |
| `muted` | Softer body; pairs with optional frosted header when `glass`. |
| `accent` | Subtle accent wash for emphasis (rare). |
| `inset` | Recessed body (settings-style dense blocks). |
| `glass` | Same body as `muted` + **frosted header** strip (`admin-section-card-glass-head`). |

Body padding uses **`admin-surface-section-body`** / **`admin-surface-section-body-dense`** (token-driven).

## Elevation & borders

- **Shadow scale**: `--admin-shadow-xs` … `--admin-shadow-lg` (used by section defaults, table wrap, stat tiles).
- **Edges**: `--admin-edge-subtle`, `--admin-edge-default`, `--admin-edge-accent-soft` for borders and hover borders without one-off mixes everywhere.
- **Table shell**: `.admin-surface-table-wrap` + `.admin-gov-table-scroll` (sticky header rules remain in governance).

## Motion & hover

- **Timing**: `--admin-motion-duration` (180ms), `--admin-motion-duration-fast` (140ms), `--admin-motion-ease`.
- **Class**: `.admin-surface-interactive` — shared `transition-property` for surfaces that respond to hover/focus visuals.
- **Lift**: `.admin-surface-hover-lift` where a 1px translate is intentional; block cards use `.admin-surface-block-card` (hover + lift in one place).
- **Reduced motion**: surface utilities and globals clamp cooperate; do not rely on motion for state.

## Badges & meta pills

- **Badges** (`AdminBadge`): base class **`admin-badge`** — padding, font size, radius from `--admin-badge-*` tokens; variant classes keep **semantic color only**.
- **Meta pills** (e.g. block visibility): **`.admin-surface-meta-pill`** — uppercase, tight tracking, neutral fill.

## Toolbar rhythm

- Padding from **`--admin-toolbar-pad-x`** / **`--admin-toolbar-pad-y`** on editor primary rail and **block toolbar** (`.admin-surface-toolbar`, `.admin-surface-toolbar-well`).
- Editor workflow row breakpoints align to **`min-width: 1024px`** with the sticky header for calmer tablet portrait.

## Inspector & forms

- **Field groups**: `.admin-surface-fieldset` (replaces ad-hoc border + ring + shadow combos).
- **Simple list items**: same fieldset surface for list item shells.
- **AdminField / AdminFormField**: unchanged field model; slightly relaxed vertical rhythm where touched (`space-y-2` pattern).

## Gradient governance

Gradients remain governed by Phase 56 rules (nav active, brand mark, premium highlights). The surface system does **not** add new gradient surfaces; section headers still use `admin-section-card-head` / `glass` header as before.

## Responsive editorial rules

- Editor grid: **`lg:gap-6`**, **`xl:gap-8`** to avoid density spikes between 1024px and 1280px.
- Inspector scroll: **`max-h`** scales with viewport (`68vh` / `72vh` caps) to preserve usable height on shorter viewports.

## Extension rules

- Prefer **new tokens or a new semantic class** in `admin-surface-system.css` over copying long `color-mix` / shadow strings into components.
- Do not add a theme builder, dynamic variant registry, or non–admin-scoped overrides.
