# Phase 92 — Controlled Settings UX Refactor

**Phase label:** `92`  
**Date:** 2026-05-19

## Summary

Refactored admin settings into six editorial domain tabs with explicit tab UI, reused section components, and a System & Runtime panel for persistence feedback. No changes to persistence adapters or core settings contracts.

## New files

| Path | Role |
|------|------|
| `apps/admin/src/components/settings/settings-domain-tabs.ts` | Tab id union |
| `apps/admin/src/components/settings/settings-editor-tab-list.tsx` | Tab strip |
| `apps/admin/src/components/settings/branding-settings-tab.tsx` | Domain: branding |
| `apps/admin/src/components/settings/appearance-settings-tab.tsx` | Domain: appearance |
| `apps/admin/src/components/settings/navigation-layout-settings-tab.tsx` | Domain: navigation/layout |
| `apps/admin/src/components/settings/social-external-settings-tab.tsx` | Domain: social |
| `apps/admin/src/components/settings/legal-governance-settings-tab.tsx` | Domain: legal |
| `apps/admin/src/components/settings/system-runtime-settings-tab.tsx` | Persistence & runtime |
| `apps/admin/src/components/settings/sections/*` | Reusable sections |
| `docs/architecture/controlled-settings-ux-refactor-phase-92.md` | Architecture |

## Changed files

| Path | Change |
|------|--------|
| `apps/admin/src/components/settings-editor.tsx` | Domain tabs + last-save persistence state |
| `apps/admin/src/components/settings/general-settings-tab.tsx` | Section composition |
| `apps/admin/src/components/settings/theme-settings-tab.tsx` | Section wrapper |
| `apps/admin/src/components/settings/spinner-settings-tab.tsx` | Section wrapper |
| `apps/admin/src/lib/admin-i18n/types.ts` | `settingsDomains` messages |
| `apps/admin/src/lib/admin-i18n/messages/catalog-en.ts` | EN copy |
| `apps/admin/src/lib/admin-i18n/messages/catalog-de.ts` | DE copy |

## Reused logic

- Font upload validation, theme token invalid hints, social validation, save/sanitize flow unchanged
- `FontSettingsTab`, `SocialSettingsTab`, `LegalSettingsTab` embedded in domain tabs

## Not implemented (by design)

- Automated theme preset picker / preset engine
- Light/dark mode toggle (no product field yet)
- Locale-scoped `site_settings` UI
- JSON settings editor

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass (15/15) |
| `npm run lint` | Pass (0 errors; 3 pre-existing admin warnings) |
| `npm run build` | Pass (admin + web) |

## Open follow-ups

- Wire real theme presets when product defines preset storage
- Optional: move top-level alerts only into System tab (currently global + tab)
