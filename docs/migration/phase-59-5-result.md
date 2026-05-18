# Phase 59.5 — Page Editor Workspace Rebuild — Result

## Summary

Der Page-Editor wurde auf ein **Live-Preview-zentriertes** Layout mit **rechter Panel-Navigation** (Inspector, Blöcke, Presets, Governance) umgestellt. Device-Toggle, klickbare Vorschau-Blöcke, getrennte Scroll-Bereiche und Inspector-Scroll bei Auswahl sind implementiert.

## Geänderte / neue Dateien

| Bereich | Datei |
|--------|--------|
| Editor | `page-editor-client.tsx` (Layout-Rebuild) |
| Editor | `editor-live-preview.tsx`, `editor-right-panel.tsx`, `editor-device-preview-bar.tsx` |
| Editor | `block-palette-blocks-tab.tsx`, `block-palette-presets-tab.tsx`, `editor-panel-tabs.ts` |
| Editor | `editor-block-card.tsx` (`variant="preview"`, Hover) |
| Editor | `editor-inspector.tsx` (`topAnchorRef`, Preview-Leerzustand) |
| Route | `pages/[slug]/page.tsx` (`admin-page-editor-layout`) |
| Styles | `admin-visual-governance.css` (Workspace v2) |
| i18n | `admin-i18n` types + `en.ts` / `de.ts` (`editor.workspace`) |
| Docs | `docs/architecture/page-editor-workspace-phase-59-5.md` |

## Verhalten

- **Speichern / Veröffentlichen / Block CRUD** unverändert in der Logik.
- **Governance** (Phase 60) im Tab „Governance“, Fokus springt in die Vorschau + Inspector.
- **Block-Palette** (`block-palette.tsx`) bleibt im Repo, UI nutzt die neuen Tab-Komponenten.

## Validierung

| Befehl | Exit | Anmerkung |
|--------|------|-----------|
| `npm run typecheck` | **0** | 15 Pakete (Turbo). |
| `npm run lint` | **0** | 3 bestehende Admin-Warnungen (`admin-avatar`, `create-media-asset-form`, `admin-i18n/index`). |
| `npm run build` | **0** | `apps/web` und `apps/admin` erfolgreich. |

Datum: 2026-05-15.

---

## Phase 59.6 — Flat preview correction

| Bereich | Änderung |
|--------|----------|
| Layout | `admin-editor-workspace-flat`, `admin-editor-split` statt schwerer `admin-editor-workspace-body`-Card |
| Preview | `admin-editor-preview-stage/canvas`, Device-Bar overlay, Desktop volle Breite |
| Blöcke | Preview-Variante ohne Card-Chrome außer bei Selection |
| Styles | `admin-visual-governance.css` Abschnitt 59.6 |
| Docs | Ergänzung in `page-editor-workspace-phase-59-5.md` |

| Befehl | Exit | Anmerkung |
|--------|------|-----------|
| `npm run typecheck` | **0** | 15 Pakete. |
| `npm run lint` | **0** | 3 bestehende Admin-Warnungen. |
| `npm run build` | **0** | web + admin. |

Datum 59.6: 2026-05-15.

---

## Phase 59.7 — Compact editor action bar

| Bereich | Änderung |
|--------|----------|
| Toolbar | `editor-toolbar.tsx`: horizontale Leiste statt großer Rail mit `EditorStatusPanel` und Footer-Card |
| Page editor | `page-editor-client.tsx`: Status-Buttons und Fehler über Toolbar-Props, kein großer Publish-Block mehr |
| Styles | `admin-visual-governance.css`: `.admin-editor-action-bar` / Meta / State / Buttons; Workspace-Margin auf `.admin-editor-action-rail` |
| i18n | `publishGovernance.toolbarReadyShort` / `toolbarReviewShort` (kurze Pillen-Labels) |

Die **Live-Vorschau** beginnt deutlich höher; Speichern, Statuswechsel und Governance-Logik sind unverändert.

| Befehl | Exit | Anmerkung |
|--------|------|-----------|
| `npm run typecheck` | **0** | 15 Pakete. |
| `npm run lint` | **0** | 3 bestehende Admin-Warnungen (keine neuen durch 59.7). |
| `npm run build` | **0** | web + admin. |

Datum 59.7: 2026-05-15.
