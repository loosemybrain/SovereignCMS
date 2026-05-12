# Content Modeling Foundation (Phase 38)

## Ziel

Diese Phase fuehrt eine erste strukturierte Content-Modeling-Schicht fuer Block-Inspector-Felder ein, ohne ein vollstaendiges Schema- oder Runtime-Validation-System aufzubauen.

## Neue Core-Typen

**Datei**: `packages/core/src/content-modeling.ts`

- `FieldGroupDefinition`
  - strukturiert Felder in logische Gruppen (z. B. Content, Media)
- `ValidationRule`
  - einfache lokale Regeln:
    - `required`
    - `minLength`
    - `maxLength`
- `StructuredInspectorFieldDefinition`
  - standardisierte Feldmetadaten:
    - `groupId`
    - `description`
    - `placeholder`
    - `validations`

## Block Definitions

`AdminBlockDefinition` wurde erweitert um optionale `fieldGroups`.

Der Hero-Block nutzt nun strukturierte Gruppen:

- `content`
- `media`
- `appearance`

Und enthaelt erste Validation-Regeln:

- `headline`: required + minLength(3)

## Lokale Validation

**Datei**: `apps/admin/src/lib/field-validation.ts`

- `validateFieldValue(value, rules)`
- liefert `ValidationResult` mit `valid` und `errors`
- rein lokal, synchron, nur UI-Hilfe
- **kein Save-Blocker**

## Inspector Rendering

Der Inspector rendert Felder nun gruppiert:

- Gruppen-Sections mit Heading und optionaler Beschreibung
- ungruppierte Felder in eigener Sektion
- pro Feld lokale Fehleranzeige
- `aria-invalid` wird gesetzt, wenn Regel verletzt

Die `Raw Props Preview` bleibt bewusst erhalten fuer Debugbarkeit und Transparenz.

## Grenzen (bewusst)

- keine Runtime Validation Engine
- kein JSON Schema
- kein Zod/Yup/Form-Framework
- keine DB-Migrationen
- keine dynamischen Content-Types

Phase 38 liefert nur die Foundation fuer spaetere Modellierungsstufen.
