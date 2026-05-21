# Phase 93 — Small Settings UX Polish

**Phase label:** `93`  
**Date:** 2026-05-19

## Summary

Polished admin settings UX: unified section cards, improved tab strip and active-tab intro, preview frames, empty states, inline guidance, sticky save bar with persistence messaging, and narrow-width stability. No persistence/runtime/core changes.

## New files

| Path | Role |
|------|------|
| `apps/admin/src/components/settings/settings-ux-primitives.tsx` | Section/preview/hint primitives |
| `apps/admin/src/components/settings/settings-dirty-snapshot.ts` | Unsaved-change snapshot |
| `docs/architecture/settings-small-ux-polish-phase-93.md` | Architecture note |

## Changed files

| Path | Change |
|------|--------|
| `settings-editor.tsx` | Dirty tracking, save bar props, layout |
| `settings-editor-tab-list.tsx` | Tab UX, active intro, scroll |
| `settings-save-bar.tsx` | Sticky bar + status semantics |
| Domain tabs + sections + font/social/legal | Cards, empty states, hints |
| `spinner-preview.tsx`, `theme-appearance-preview.tsx` | Preview frame |
| `admin-i18n/types.ts`, `catalog-de.ts`, `catalog-en.ts` | New copy |
| `settings/page.tsx` | `min-w-0` container |

## UX improvements

- Tab strip: fixed height, truncate + horizontal scroll, intro under active tab
- Sections: consistent muted cards and spacing
- Previews: mock window chrome, calmer hierarchy
- Empty states: fonts, social, theme preset default message
- Save bar: unsaved / saving / persisted / memory / unavailable labels
- Inline hints: CSS tokens, spinner, fonts, social, persistence

## Not implemented (by design)

- Theme preset picker engine
- Toast notifications
- iframe/live preview sandbox
- Full mobile app layout pass
- Global admin palette changes

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass (15/15) |
| `npm run lint` | Pass (0 errors; 3 pre-existing admin warnings) |
| `npm run build` | Pass (admin + web) |
