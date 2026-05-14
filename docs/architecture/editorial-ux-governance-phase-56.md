# Editorial UX & Visual Governance (Phase 56)

This document defines **visual governance** for the SovereignCMS **admin** UI. It does not replace the existing theme token layer (`globals.css` admin tokens); it complements it with **rules of use** and a dedicated calibration file: `apps/admin/src/styles/admin-visual-governance.css` (imported after `globals.css` in the admin root layout).

## Principles

- **Neutral surfaces first**: most of the UI sits on `admin-surface`, `admin-surface-muted`, and `admin-bg`. Accent is for orientation and action, not decoration everywhere.
- **One accent story per viewport region**: sidebar brand mark and **active** nav may use a controlled gradient; lists, tables, and nested panels should not each introduce a new gradient language.
- **Editorial, not “debug chrome”**: toolbars and rails read like publishing workflows (save, status, workflow). Identifiers and raw JSON remain available but **visually recessed**.

## Accent governance

- **Primary actions**: `AdminButton` `primary` — reserved for the main task in a region (e.g. Save, Publish when it is the dominant transition).
- **Secondary workflow**: `secondary` — non-destructive transitions that are not the primary publish path.
- **Destructive**: `destructive` — isolated from reorder controls; labeled where space allows (e.g. block remove).
- **Quiet metadata**: mono labels, `tabular-nums`, and lower opacity for IDs, sort indices, and timestamps.

## Gradient usage

Gradients are reserved for:

1. **Active navigation** — current route: icon well uses the premium gradient; idle items use neutral wells with accent-tinted icon color only.
2. **Workspace identity** — small brand tile in the sidebar header.
3. **Important primary actions** — primary buttons use solid accent surfaces, not rainbow gradients; gradients are not applied to every card header.

Section headers (`admin-section-card-head`) use a **very flat** accent mix (governance overrides), not competing hero gradients.

## Card density

- Prefer **one elevation owner** per stack (e.g. editor action rail, inspector shell).
- **Inspector field groups** use `default` section cards, not stacked `elevated` + `admin-card-lift` everywhere.
- Nested technical content (block info, compact lists) uses **`admin-gov-nested-surface`** — border + muted fill instead of a full second “card inside card” chrome.
- **Elevated** section cards keep depth via shadow and border, without `admin-card-lift` hover translation to reduce “card tower” fatigue.

## Motion

- Default interaction duration targets **~180ms** with a standard ease curve (`--admin-gov-ease`, `--admin-gov-duration` on `.admin-theme-root`).
- Prefer **opacity, border, shadow, background** over large transforms.
- **Reduced motion**: global admin rules continue to clamp transitions; local utilities must not rely on motion for understanding state.

## Toolbar hierarchy (editor)

- **Sticky primary rail** (`admin-gov-editor-action-rail` + `admin-editor-toolbar-sticky`): title + short guidance, dominant **Save**, compact metadata panel, then **workflow** row (publish / other transitions).
- **Block toolbar**: block type as the headline; position/sort as secondary; reorder controls grouped; delete separated with explicit destructive styling.

## Tables

- Shell: `admin-gov-data-table-shell` — single border/shadow language (no ring + heavy shadow competition).
- **Sticky headers** via `admin-gov-table-scroll` on the scroll container; header cells carry their own background for a clean band.
- Rows: **`admin-row-hover`** — governed hover timing and a **thin** inset accent bar (not a full-width paint).

## Empty states

- Calm typography, generous vertical rhythm, **one** restrained icon treatment (`admin-palette-type-icon` pattern).
- No fabricated onboarding flows; copy explains the **next editorial action** (e.g. add a block from the palette).

## Focus rings

- Continue to use **`admin-focus-ring`** on interactive controls.
- Inspector controls additionally use **`admin-inspector-field`** for calmer `focus-within` surfaces (aligned with governance overrides).

## Future work (out of scope for Phase 56)

- No dynamic layout builders, no new block types, and no new data models — this phase is **presentation and governance only**.
