# Phase 61: Editorial Orientation & Context UX

## Orientation philosophy

The page editor is **preview-first**, but editorial work is sequential: select → adjust → verify → move on. Orientation UX answers **where am I on this page?** and **what am I editing right now?** without adding structural systems (trees, minimaps, command palettes).

## Contextual editing philosophy

- **Context travels with selection**: block type, position, and a human excerpt appear in the inspector header.
- **Inspector follows preview**: selecting in the live preview opens the inspector tab and scrolls both regions toward the active block.
- **Governance is editorial**: notes are grouped by “this block”, page-wide, and other blocks — not by severity badges alone.

## Selection continuity rules

1. One selected block at a time in the preview.
2. Selection announces block type and position (`Block 4 of 12`).
3. Arrow Up/Down moves selection when focus is not inside a form control.
4. Inspector sticky context header remains visible while scrolling fields.

## Preview / inspector cohesion rules

- Shared accent: left rail on context header + inspector active region + preview outline.
- Selected preview blocks use `admin-editor-block-linked` — calmer outline, no heavy glow.
- Inactive blocks stay visually quiet; hover is subtle.

## Section awareness & scroll

- Preview blocks are separated by consistent vertical gap (Phase 59.6+).
- Sticky inspector context header preserves “what block” during long field lists.
- Preview scroll-into-view on selection reduces lost-in-page feeling.

## Editorial focus hierarchy

1. Live preview content
2. Selected block chrome (toolbar when selected)
3. Inspector context header + fields
4. Compact action bar (save / publish)
5. Right panel tabs (blocks, presets, governance)

## Long-session ergonomics

- Reduce badge noise in governance; prefer inline counts and editorial lists.
- Empty states explain the **next action** (select a block, add a block, review notes).
- Field groups use clearer vertical rhythm and focus-within outlines.

## Contextual guidance philosophy

Guidance is **inline and calm** — not onboarding tours or AI suggestions. Hints explain what to do next in the current panel state.

## Key files

- `apps/admin/src/lib/editor-block-context.ts`
- `apps/admin/src/components/editor/editor-selected-block-context.tsx`
- `apps/admin/src/components/editor-inspector.tsx`
- `apps/admin/src/components/admin-ui/publish-governance-panel.tsx`
- `apps/admin/src/styles/admin-visual-governance.css` (Phase 61 section)

## Explicit non-goals

- No page outline / minimap / tree navigator
- No realtime collaboration or presence
- No command palette or plugin framework
- No approval or blocking publish workflows
- No API, migration, or public rendering changes
