# Content Template Foundation (Phase 40)

## Ziel

Phase 40 fuehrt eine kontrollierte Starter-Template-Grundlage ein, damit neue Seiten nicht immer bei null beginnen.

## ContentTemplateDefinition

`packages/core/src/content-templates.ts` definiert:

- `id`
- `label`
- optionale `description`
- optionale `category`
- `blocks: CmsBlock[]`

Die Definition bleibt absichtlich statisch und typisiert. Es gibt keine Runtime-Schema-Engine.

## Template Registry

`apps/admin/src/content-templates/template-registry.ts` enthaelt die lokale Liste aller Templates:

- `empty-page-template`
- `basic-page-template`
- `landing-page-template`

Keine dynamische Discovery, keine Datenbank-Persistenz, kein Marketplace.

## Starter Block Sets

Templates liefern initiale Block-Sets mit vorbereiteten Props:

- Empty: keine Blocks
- Basic: Hero + Text
- Landing: Hero + Feature-Text + CTA-Text

## CreatePage Integration

`CreatePageForm` wurde um `templateId` erweitert:

- einfache Select-Auswahl
- Default: `empty-page-template`
- kurzer Hint mit Beschreibung + Starter-Block-Anzahl

Nach erfolgreicher Seitenerstellung werden Template-Blocks defensiv geklont (`createTemplateBlocks`) und ueber den bestehenden Draft-Save-Flow gespeichert.

## Klare Grenzen

Nicht Teil von Phase 40:

- keine Dynamic Content Types
- keine Dynamic Templates
- keine Shared/Re-usable Sections
- keine Template-Inheritance
- keine Runtime-Persistenz fuer Templates
