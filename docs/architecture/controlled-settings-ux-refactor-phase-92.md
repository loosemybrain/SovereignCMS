# Controlled Settings UX Refactor (Phase 92)

## Goal

Move the admin settings surface from **technical tabs** (theme, font, spinner, general) to **editorial domains** (branding, appearance, navigation, legal, system) without changing persistence, sanitizers, or save semantics.

## Tab structure

| Domain tab | Content (reused sections) |
|------------|---------------------------|
| Branding | Site identity, custom fonts, spinner + preview |
| Erscheinungsbild | Theme preset note, color/radius tokens, theme preview |
| Navigation & Layout | Menu links to `/navigation` & `/footer-navigation`, contact, business notes |
| Social & Externe Links | Social links list |
| Rechtliches & Governance | Consent hint, legal slugs |
| System & Runtime | Persistence status, font prototype boundary, runtime notes |

Tabs are **explicitly listed** in `settings-domain-tabs.ts` and `settings-editor-tab-list.tsx` — no dynamic mapping from settings schema.

## Technical tabs retained

Legacy components remain as thin wrappers for reuse:

- `general-settings-tab.tsx` → site identity + contact + business sections
- `theme-settings-tab.tsx` → `ThemeTokenSettingsSection`
- `spinner-settings-tab.tsx` → spinner section + preview
- `font-settings-tab.tsx`, `social-settings-tab.tsx`, `legal-settings-tab.tsx` unchanged

## Sections

Shared UI lives under `apps/admin/src/components/settings/sections/`:

- `site-identity-settings-section.tsx`
- `contact-settings-section.tsx`
- `business-settings-section.tsx`
- `theme-token-settings-section.tsx`
- `theme-preset-settings-section.tsx` (static note — no preset engine)
- `theme-appearance-preview.tsx`
- `spinner-settings-section.tsx`
- `navigation-layout-hints-section.tsx`

## Persistence & validation (unchanged)

- Save still uses `clientSettingsPersistence` + `sanitizeTenantAppearanceSettings`
- Invalid theme tokens: inline hints + post-save warning
- `SystemRuntimeSettingsTab` shows `persistenceMode`, `persisted`, warnings after save
- No raw JSON, no adapter SDK in UI

## Custom font prototype

Prototype hint remains in **Branding** (font section) and **System & Runtime** (dedicated card). Not positioned as production storage.

## Anti-patterns

- Settings schema registry or JSON-driven forms
- Dynamic tab generation from `TenantSettings` shape
- Theme DSL or runtime theme engine
- New persistence layer
- Supabase SDK in admin components
- Bypassing CSS sanitizers
