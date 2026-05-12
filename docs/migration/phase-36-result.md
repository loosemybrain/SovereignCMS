# Phase 36 — Admin Accessibility Foundation — Ergebnis

## Geaenderte Dateien

- `apps/admin/src/lib/a11y.ts` (neu)
- `apps/admin/src/app/globals.css`
- `apps/admin/src/components/admin-ui/admin-button.tsx`
- `apps/admin/src/components/admin-ui/admin-input.tsx`
- `apps/admin/src/components/admin-ui/admin-field.tsx` (neu)
- `apps/admin/src/components/admin-ui/index.ts`
- `apps/admin/src/components/create-page-form.tsx`
- `apps/admin/src/components/create-navigation-item-form.tsx`
- `apps/admin/src/components/create-media-asset-form.tsx`
- `apps/admin/src/components/editor-inspector.tsx`
- `apps/admin/src/components/inspector/inspector-field-renderer.tsx`
- `apps/admin/src/components/media-picker.tsx`
- `apps/admin/src/components/page-editor-client.tsx`
- `apps/admin/src/components/admin-shell.tsx`
- `apps/admin/src/components/admin-appearance-toggle.tsx`
- `docs/architecture/admin-accessibility-foundation.md` (neu)

## Neue Accessibility Utilities

- `getDescribedBy(ids)` fuer robuste `aria-describedby`-Verkettung.
- `createFieldIds(baseId)` fuer konsistente Field-ID-Struktur.
- `AdminField` als wiederverwendbarer Form-Wrapper mit Label/Description/Error + ARIA-Props.

## Gehaertete Komponenten und Flows

- Sichtbarer Focus Ring (`admin-focus-ring`) in zentralen Controls.
- Buttons mit sauberem Default-Verhalten (`type="button"`).
- Formulare (`CreatePage`, `CreateNavigationItem`, `CreateMediaAsset`) mit `AdminField` migriert.
- Success-Status ueber `aria-live`, Errors ueber `role="alert"`.
- MediaPicker keyboard-zugaenglich ueber echte Select-Buttons + `aria-pressed`.
- Editor-Blockkarten per Enter/Space selektierbar.
- Move/Down/Delete-Buttons mit sprechenden `aria-label`s.
- Sidebar mit `aria-label` und `aria-current="page"`.

## Bekannte Grenzen

- Keine vollstaendige BITV-/WCAG-Auditabdeckung.
- Kein globales Hotkey-System.
- Kein Modal Focus Trap System.
- Keine externe Accessibility Library.

## Empfehlung fuer Phase 37

- Gezielter Keyboard-Navigations-Review je Admin-Route.
- Konkrete Screenreader-Testmatrix (NVDA/VoiceOver) fuer Kernflows.
- Optional: kleine Konsistenzrunde fuer verbleibende manuelle Formfelder (z. B. SEO-Subfelder) auf `AdminField`.
