# Navigation Foundation

## Ziel

Phase 27 fuehrt ein eigenstaendiges, tenant- und locale-aware Navigationsmodell ein, ohne Public-Rendering-Integration und ohne verschachtelte Navigation.

## Modell

`NavigationItem` ist ein eigener Content-Typ mit:

- `tenantId`
- `locale`
- `label`
- `type` (`page` | `external`)
- `pageId` (bei `type=page`)
- `href` (bei `type=external`)
- `sortOrder`
- `status`
- `createdAt`, `updatedAt`

## Regeln

- `type=page` erfordert `pageId`
- `type=external` erfordert gueltige `href` (`https://`, `http://` oder `/...`)
- Initialer Status fuer neue Eintraege: `draft`
- `sortOrder` wird repository-seitig vergeben
- Duplicate Label pro `(tenantId, locale)` werden verhindert
- `type=page` setzt voraus, dass fuer die aktive Locale ueberhaupt Pages vorhanden sind

## Repository-Vertrag

Navigation wird im DB-Adapter als eigener Repository-Bereich gefuehrt:

- `navigation.listByTenant({ tenantId, locale? })`
- `navigation.create(input)`

Damit bleibt Navigation klar getrennt von Pages und Blocks.

## Runtime Boundary

Die Runtime bietet `navigationPersistence`:

- `listNavigationItems(...)`
- `createNavigationItem(...)`

Rueckgaben bleiben in dieser Phase bewusst `persisted: false`, da InMemory genutzt wird.

## Server Actions

Fuer den Admin-Flow sind zwei Server-Actions eingefuehrt:

- `createNavigationItemAction`
- `loadNavigationItemsAction`

Beide erzeugen Runtime serverseitig und geben nur serialisierbare Daten an den Client zurueck.

## Admin UI

Neue Admin-Route:

- `/navigation`

Inhalte:

- Locale Switcher
- Create-Form fuer Navigation-Items
- Liste der Navigation-Items (label, type, target, status, sortOrder)
- Klarer Empty State: Hinweis auf Erstellung ueber das Formular
- Klarer InMemory-Hinweis nach erfolgreichem Create (inkl. moeglich spaeterer Listenaktualisierung erst nach Reload)

Die Sidebar enthaelt einen neuen Eintrag `Navigation`.

## Bewusste Grenzen

Nicht Teil von Phase 27:

- Nested Navigation
- Drag & Drop Reordering
- Reorder-Funktionalitaet
- Mega Menu
- Public-Web-Integration
- Externe Persistenz

Diese Phase schafft nur die stabile Grundlage fuer spaetere Navigation-Builder-Funktionen.
