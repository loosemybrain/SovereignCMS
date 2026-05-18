# Phase 59.5: Page Editor Workspace Rebuild

## Overview

This phase rebuilds the **page editor workspace layout** for a Live Preview–first CMS experience. It does not change block runtime, public rendering, server actions, or auth.

## Layout

```
Admin Shell
└─ Page header (title, locale, back link)
   └─ Editor workspace (bounded height, no body scroll trap)
      ├─ Toolbar (save, status, publish workflow)
      └─ Split body
         ├─ Center: Live Preview
         │  ├─ Device width toggle (desktop / tablet / mobile)
         │  ├─ Independent scroll
         │  └─ Clickable blocks + selection chrome + inline toolbar
         └─ Right panel (fixed width on desktop)
            ├─ Tabs: Inspector | Blocks | Presets | Governance
            └─ Independent scroll
```

## Preview interaction

- Clicking a block in the preview **selects** it and switches to the **Inspector** tab.
- Selected blocks use existing selection styling; preview variant adds a subtle **hover outline**.
- Block toolbar (move, delete) remains on the selected card.
- Inspector scrolls to the top anchor when selection changes (smooth, reduced-motion respected by browser).

## Right panel tabs

| Tab | Content |
|-----|---------|
| Inspector | Block fields, page SEO, block governance notes |
| Blocks | Block type list (add empty block) |
| Presets | Curated presets (Phase 53.1 logic) |
| Governance | Page-level `PublishGovernancePanel` + session context |

## Device preview

Visual width only — no iframe, no public renderer changes:

- **Desktop**: full preview column width
- **Tablet**: max ~48rem frame
- **Mobile**: max ~24.375rem frame

## Explicit non-goals

- No copy of legacy Physiotherapie codebase
- No new block types or presets
- No API routes or migrations
- No RuntimeConfig in client components
- No iframe preview
- No new publish blocking or approval workflow

## Phase 59.6 — Flat preview correction (layout only)

Follow-up layout pass (no API / block runtime changes):

- **Flat workspace** (`admin-editor-workspace-flat` + `admin-editor-split`): less nested card chrome, preview uses full column height.
- **Preview canvas** (`admin-editor-preview-canvas`): transparent, no heavy border/shadow (overrides legacy `.admin-editor-canvas` card styling in preview only).
- **Desktop frame**: `max-width: none` in flat mode — full column width.
- **Device bar**: compact, top-right overlay (`admin-editor-device-bar`); tablet/mobile frames unchanged.
- **Right panel**: fixed **320px** (20rem), up to **380px** (23.75rem) on xl breakpoints.
- **Preview blocks** (`EditorBlockCard` `variant="preview"`): toolbar/insert chrome only when selected; hover outline via CSS.

Interactions from 59.5 (tab switch on select, inspector scroll, governance tab) are unchanged.

## Phase 59.7 — Compact editor action bar (layout / UX only)

The tall **Draft & Save** + metadata + governance hints + **Publishing** card above the preview was replaced by a **single compact horizontal action bar** (`admin-editor-action-bar` inside `admin-editor-action-rail`):

- **Left (`admin-editor-action-meta`)**: page status badge (or fallback label), compact dirty/saved/last-saved line, optional short “status after save” when clean.
- **Center (`admin-editor-action-state`)**: governance readiness as a **small pill** (short label + full description in `aria-label` / `title`; detailed checks remain in the **Governance** tab / panel).
- **Right (`admin-editor-action-buttons`)**: **Save** plus the same **status transition** buttons as before (`getAvailableActionsForStatus`, unchanged handlers).

Save errors and status transition errors render as **one compact alert row** under the bar only when present (no permanent empty region). Save, publish, and status transition **logic is unchanged**.

## Key files

- `apps/admin/src/components/page-editor-client.tsx`
- `apps/admin/src/components/editor/editor-toolbar.tsx`
- `apps/admin/src/components/editor/editor-live-preview.tsx`
- `apps/admin/src/components/editor/editor-right-panel.tsx`
- `apps/admin/src/components/editor/editor-device-preview-bar.tsx`
- `apps/admin/src/components/editor/editor-block-card.tsx`
- `apps/admin/src/styles/admin-visual-governance.css`
