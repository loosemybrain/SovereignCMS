# Media Foundation

## MediaAsset-Modell

`MediaAsset` (in `@sovereign-cms/core`) beschreibt CMS-Medien als strukturierte Metadaten inkl. `tenantId`, `type`, `title`, optional `alt`, `url`, optionale technische Felder (`mimeType`, `size`, `width`, `height`) und `status` (`ContentStatus`). Assets sind **tenant-aware** und **locale-neutral**: Es gibt keine Locale-Spalte; Mehrsprachigkeit erfolgt später über Verweise oder Duplikate, nicht in dieser Phase.

## URL-basierte Platzhalter-Assets

Die aktuelle Implementierung erzeugt und listet nur **URL-basierte** Einträge (HTTP(S) oder absolute Pfade wie `/placeholder.svg`). Es gibt **keinen Datei-Upload**, keine Binärpersistenz und keine echte Storage-Anbindung.

## Persistenz-Grenze

`createMediaAsset` liefert `persisted: false`. Der InMemory-Adapter hält Daten nur im Prozess; Server Actions erzeugen pro Aufruf eine neue Runtime — neu erstellte Assets sind in derselben Server-Component-Antwort der Liste **nicht** automatisch sichtbar, bis die Seite neu geladen wird und dieselbe Runtime-Instanz den Store sieht (in Dev kann das je nach Prozess variieren). Für echte Persistenz wäre Phase 31+ (DB-Adapter, Storage-Adapter) vorgesehen.

## Architektur-Schichten

- **Core**: Typen und Validatoren (`validateMediaTitle`, `validateMediaUrl`).
- **DB**: `MediaRepository` mit `listByTenant` und `create`; `DatabaseAdapter.media`.
- **Runtime**: `createMediaPersistence({ db })` mit `listMediaAssets` / `createMediaAsset`.
- **Admin**: Server Actions als Boundary; Client nutzt `clientMediaPersistence` ohne Runtime-Objekte.

## Vorbereitung für später

- **Media Picker**: Kann dieselben Repository- und Persistence-Contracts nutzen.
- **Storage-Adapter** (S3, Supabase Storage, Vercel Blob): Ersetzt oder ergänzt URL-Erfassung durch Upload-Flows — bewusst **nicht** in dieser Phase angebunden.
