# Settings Small UX Polish (Phase 93)

## Goal

Improve clarity, visual guidance, and consistency of the admin settings surface **without** changing persistence, sanitizers, tenant scope, or tab/section architecture from Phase 92.

## Scope boundary

In scope:

- Tab strip readability, active state, horizontal scroll on narrow widths
- Active-tab intro line under the tab strip
- Unified `SettingsSectionCard` (`variant="muted"`) and `SettingsTabPanel` spacing
- `SettingsPreviewFrame` mock chrome for theme/spinner previews
- `AdminEmptyState` for fonts, social links, theme presets
- `SettingsInlineHint` for tokens, spinner, fonts, persistence, external links
- Sticky save bar with dirty/persisted/memory/unavailable status text

Out of scope:

- Settings engine, schema registry, dynamic forms
- Theme DSL, preset automation, iframe/live sandbox previews
- Persistence adapter or runtime changes
- Toast/notification framework

## Section structure

Shared primitives live in `apps/admin/src/components/settings/settings-ux-primitives.tsx`:

| Primitive | Role |
|-----------|------|
| `SettingsSectionCard` | Muted `AdminSectionCard` for all domains |
| `SettingsTabPanel` | `space-y-5` vertical rhythm |
| `SettingsInlineHint` | Short info notes with icon |
| `SettingsNestedItemCard` | Font/social list rows |
| `SettingsPreviewFrame` | Static browser-chrome mock for previews |

## Save UX

`settings-save-bar.tsx` derives status from:

- `hasUnsavedChanges` (JSON snapshot vs last successful save baseline)
- `isSaving`
- `lastPersistenceMode` / `lastPersisted` after save

No new notification layer — status text only.

## Dirty detection

`settings-dirty-snapshot.ts` serializes editor-relevant fields for comparison. Baseline updates only on successful save.

## Anti-patterns

- Settings runtime engine or generated UI from schema
- Theme DSL or dynamic settings registry
- Overengineered preview sandbox (iframe, live site mirror)
- Mass animation layers or UI plugin system
- Bypassing CSS sanitizer or tenant write scope
