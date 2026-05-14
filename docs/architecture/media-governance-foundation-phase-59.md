# Media Governance Foundation — Phase 59

## Zweck

Kontrollierte **Medien-Semantik** und eine **reine Normalisierungs-Schicht** in `@sovereign-cms/core`, um langfristige Risiken freier `imageUrl`-Felder zu begrenzen — **ohne** vollständige Mediathek, **ohne** Uploads, **ohne** CDN oder Bildtransformation.

## Aktueller Stand

- **`imageUrl` / `imageAlt`** (z. B. Block „Image + Text“) bleiben das Speicherformat; keine Ersetzung, keine Migration.
- **`MediaReference` / `NormalizedMediaReference`** und **`normalizeMediaReference`** beschreiben Zustände und Lesbarkeit für Renderer und Editor-Governance.
- **`mediaAssetId`** (bzw. generisches `assetId` in der Normalisierung) ist die **Richtung** für spätere Asset-Verknüpfung; ohne URL ist der Zustand aktuell **`placeholder`** (nicht öffentlich renderbar).
- Es gibt **keine** neue Datenbank-Migration, **keine** API-Routen und **keine** externen Abhängigkeiten für diese Phase.

## Normalisierung (rein, synchron)

- **Intern:** URL beginnt mit `/`, nicht mit `//` → renderbar, `safeUrl` gesetzt.
- **Extern:** `https://` → renderbar, `isExternal: true`, `safeUrl` gesetzt.
- **Ungültig:** `http://`, `data:`, `javascript:`, `vbscript:`, sonstige nicht zugelassene Formen → nicht renderbar, kurze **`warning`**.
- **Fehlend:** keine URL und kein Asset → **`missing`**.
- **Platzhalter:** Asset-ID ohne URL → **`placeholder`**, nicht renderbar.
- **Keine Netzwerkprüfung**, keine Existenz von Dateien, keine URL-Umschreibung.

## Öffentliche Darstellung

- **Image + Text:** Es wird nur noch ein `<img>` ausgegeben, wenn **`normalized.isRenderable`** und **`safeUrl`** gesetzt sind — gleiche sichere Menge wie zuvor über `isValidImageUrl` (`/` und `https://`), jetzt zentral aus dem Core.
- **Hero** und andere Blöcke wurden in dieser Phase **nicht** breit in der Public-App umgestellt (Scope-Begrenzung).

## Admin / Vorschau

- **Image + Text (Admin):** interne Pfade werden geladen; **HTTPS-Extern** wird als Platzhalter angezeigt (kein Request zu Dritt-Host); ungültig/fehlend/Platzhalter mit klarer UI.
- **Governance** (`content-governance.ts`): nicht blockierende Hinweise zu ungültigen URLs, externen HTTPS-Bildern, fehlendem Alt bei renderbarem Bild, Platzhalter-Asset ohne URL; Hero erhält defensive analoge Prüfung über `mediaUrl` / `mediaAssetId` / `mediaAlt`.

## Inspector

- Freie **Image-URL**-Felder: erweiterte Beschreibungen im Block-Registry (kein neues Feldmodell).
- **Media-Feld** (Hero): ergänzender Hilfetext unter dem bestehenden MediaPicker — kein neues Picker-/Upload-Verhalten.

## Nicht-Ziele (explizit)

- Keine Mediathek, keine Upload-Pipeline, kein CDN, kein generisches Medien-Schema-Framework.
