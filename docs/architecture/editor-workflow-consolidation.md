# Editor Workflow Consolidation (Phase 37)

## Ziel

Der Admin-Editor wird fuer den taeglichen CMS-Workflow klarer strukturiert, ohne neue Infrastruktur wie Drag-and-Drop, Autosave oder Undo/Redo.

## Neue UI-Bausteine

- `editor/editor-toolbar.tsx`
  - zeigt Save-Status, Dirty-State, letzte Speicherung und Seitenstatus
  - kapselt reine Darstellung, keine Save-Business-Logik
- `editor/block-toolbar.tsx`
  - standardisierte Block-Aktionen (Move up/down, Delete)
  - klare ARIA-Labels und disabled-Zustaende
- `editor/editor-block-card.tsx`
  - einheitliche selektierbare Block-Karte mit Keyboard-Interaktion
  - nutzt `BlockToolbar`
  - enthaelt zusaetzlich Aktion `Insert after`
- `editor/block-palette.tsx`
  - strukturierte Add-Block-Oberflaeche mit Insert-Position-Hinweis

## Insert Positioning

Der Editor verwaltet lokal:

- `insertAfterBlockId: string | null`

Verhalten:

- `null` => neuer Block wird ans Ende angehaengt
- gesetzt => neuer Block wird direkt nach dem referenzierten Block eingefuegt
- nach dem Einfuegen:
  - Reihenfolge wird normalisiert (`normalizeBlockOrder`)
  - neuer Block wird selektiert
  - Insert-Position wird zurueckgesetzt

## Empty State

Bei leerer Blockliste wird ein handlungsorientierter Empty State gerendert:

- Titel: `No blocks yet`
- Beschreibung: `Add your first block from the block palette.`

Die Block-Palette bleibt sichtbar, sodass der naechste Schritt eindeutig ist.

## Accessibility

Phase-36-Basis bleibt erhalten:

- Keyboard-Selektion fuer Blockkarten
- ARIA-Labels auf Aktionsbuttons
- Live-Region-Announcements bleiben aktiv
- semantische Regionen und Listenstrukturen bleiben bestehen

## Ausdruecklich nicht Teil dieser Phase

- kein Drag & Drop
- kein Autosave
- kein Undo/Redo
- keine Collaboration
- keine Upload-Pipeline
