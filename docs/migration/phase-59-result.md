# Phase 59 — Media Governance Foundation — Result

## Summary

Einführung von **`MediaSourceType`**, **`MediaReference`**, **`NormalizedMediaReference`** und der reinen Hilfsfunktion **`normalizeMediaReference`** in `packages/core/src/media.ts` (Export über `packages/core/src/index.ts`). **Image + Text** nutzt die Normalisierung in **Admin-Vorschau** und **Public-Renderer**; **Governance** nutzt dieselbe Logik für Image + Text und defensiv für **Hero**. Keine Migrationen, keine neuen API-Routen, keine neuen Dependencies, keine Uploads.

## Geänderte / neue Dateien

| Bereich | Datei |
|--------|--------|
| Core | `packages/core/src/media.ts` (Typen + `normalizeMediaReference`) |
| Core | `packages/core/src/index.ts` (Exports) |
| Admin | `apps/admin/src/components/block-renderers/image-text-renderer.tsx` |
| Admin | `apps/admin/src/lib/content-governance.ts` |
| Admin | `apps/admin/src/block-definitions/registry.ts` (Image-URL/Alt + Hero-Media-Hilfetext) |
| Admin | `apps/admin/src/components/inspector/fields/media-field.tsx` (Hilfetext) |
| Web | `apps/web/src/components/public/PublicBlockRenderer.tsx` (nur `image-text`) |
| Docs | `docs/architecture/media-governance-foundation-phase-59.md` |
| Docs | `docs/migration/phase-59-result.md` |

## Normalisierungs-Verhalten (Kurz)

- `/…` (nicht `//…`) → `internal`, renderbar, `safeUrl`.
- `https://…` → `external`, renderbar, `isExternal: true`, `safeUrl`.
- `http://`, `data:`, `javascript:`, `vbscript:` → `invalid`, nicht renderbar, `warning`.
- Leer ohne Asset-ID → `missing`.
- Asset-ID ohne URL → `placeholder`, nicht renderbar.
- `requiresAlt === true` bei renderbarem Bild; kein Netzwerk-I/O.

## Renderer

- **Public `image-text`:** Bild nur bei `isRenderable` + `safeUrl` (rückwärtskompatibel für gültige `/` und `https://`).
- **Admin `image-text`:** nur interne URLs als `<img>`; externe/ungültige/fehlende/Platzhalter mit Platzhalter-UI.

## Governance

- Image + Text: Warnung bei **invalid**; Info bei **external**, fehlendem **Alt** bei renderbarem Medium, **placeholder**.
- Hero: analog über `mediaUrl` / `mediaAssetId` / `mediaAlt`.

## Einschränkungen

- Kein Ersatz für `imageUrl`-Speicherung; kein generischer Scanner aller Blöcke.
- Public-**Hero** unverändert (kein breiter Eingriff in Public Rendering).

## Validierung

| Befehl | Exit | Anmerkung |
|--------|------|------------|
| `npm run typecheck` | **0** | 15 Pakete (Turbo). |
| `npm run lint` | **0** | Weiterhin 2 Admin-Warnungen (`admin-avatar`, `create-media-asset-form`). |
| `npm run build` | **0** | `apps/web` und `apps/admin` erfolgreich. |

Datum: 2026-05-11.
