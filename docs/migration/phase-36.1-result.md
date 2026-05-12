# Phase 36.1 — Admin Accessibility Hardening — Ergebnis

## Geaenderte Dateien

- `apps/admin/src/lib/use-editor-announcements.ts` (neu)
- `apps/admin/src/components/editor-live-region.tsx` (neu)
- `apps/admin/src/components/page-editor-client.tsx`
- `apps/admin/src/components/media-picker.tsx`
- `apps/admin/src/components/editor-inspector.tsx`
- `apps/admin/src/components/admin-ui/admin-field.tsx`
- `docs/architecture/admin-accessibility-hardening.md` (neu)

## Announcements

Der Editor besitzt jetzt eine dedizierte Live-Region, die Aktionen fuer Screenreader meldet:

- Block selected
- Block added
- Block moved up / down
- Block deleted
- Save success / save failed

## Semantische Regionen

- Preview und Inspector sind als benannte Regionen ausgezeichnet.
- Blockliste ist als Liste markiert.
- Blockeintraege sind als List-Items markiert und keyboard-selektierbar.

## MediaPicker Verbesserungen

- Ausgewaehlter Zustand wird ueber Text + ARIA kommuniziert.
- Auswahl ueber echte Buttons mit `aria-pressed`.
- Loading, Error, Empty bleiben klar semantisch gekennzeichnet.

## Bekannte Grenzen

- Kein Focus Trap
- Keine komplexe Arrow-Key-Navigation
- Kein Modal- oder Command-System
- Kein vollstaendiger BITV-Audit

## Empfehlung fuer Phase 37

- Gezielte Screenreader-Tests (NVDA/VoiceOver) fuer Editor-Flow.
- Optional: konsistentes Announcement-Muster fuer weitere Admin-Aktionen (Page Create, Navigation Create, Media Create).
