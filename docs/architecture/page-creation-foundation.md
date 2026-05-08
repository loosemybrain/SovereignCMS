# Page Creation Foundation

## Überblick

Die Seitenerstellung laeuft in SovereignCMS ueber eine klare Server-Boundary:

- Client (`CreatePageForm`) sammelt Eingaben
- Client-Adapter delegiert an Server Action
- Server Action erzeugt Runtime serverseitig
- Runtime delegiert an Repository (`pages.create`)
- InMemory-Adapter erstellt den neuen Page-Record

Es gibt bewusst keine externe Persistenz in dieser Phase (`persisted: false`).

## Eingabe und Scope

`CreatePageInput` enthaelt:

- `tenantId`
- `locale`
- `slug`
- `title`

Die Erstellung ist damit:

- tenant-aware
- locale-aware
- slug-validiert

## Slug-Normalisierung und Validierung

Vor dem Speichern wird der Slug normalisiert:

- trim
- fuehrende/trailing `/` entfernen
- Whitespace zu `-`
- lowercase

Gueltige Beispiele:

- `home`
- `leistungen/manuelle-therapie`

Ungueltig:

- `/home`
- `home/`
- `..`

## Repository-Regeln

`pages.create` erzwingt:

- Duplikat-Schutz auf `(tenantId, locale, slug)`
- Initialer `status: "draft"`
- `createdAt` und `updatedAt` gesetzt
- keine initialen Blocks

## UI-Integration

Primärer Ort fuer Seitenerstellung ist die Pages-Ansicht:

- `CreatePageForm` ist in `/pages` sichtbar integriert
- nutzt aktive Locale (`activeLocale`) und Tenant (`tenantId`)

Dashboard bleibt absichtlich schlank:

- kein grosses Formular
- optionaler Link zur Pages-Ansicht

## UX-Hinweis zur InMemory-Grenze

Nach erfolgreicher Erstellung zeigt das Formular explizit:

- Seite wurde erstellt
- InMemory-Daten sind aktuell nicht dauerhaft persistiert

Damit wird nicht suggeriert, dass die Seite nach Reload sicher erhalten bleibt.

## Kein Auto-Navigation/Refresh in dieser Phase

Bewusst **nicht** enthalten:

- `router.push`
- `router.refresh`
- automatische Listen-Synchronisierung

Die Success-Meldung reicht fuer diesen Foundation-Schritt.
