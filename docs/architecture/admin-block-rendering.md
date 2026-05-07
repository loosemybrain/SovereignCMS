# Admin Block Rendering

## Abgrenzung zum Public Renderer

Die Admin-Oberfläche nutzt **eigene** Renderer-Komponenten unter `apps/admin/src/components/block-renderers/`. Sie sind bewusst getrennt vom Website-Rendering (`apps/web`): dort gelten andere Layout-, SEO- und Performance-Anforderungen; im Admin geht es um ein lesbares **Read-Model** und später um Bearbeitung.

## Registry und `renderAdminBlock(block)`

Die zentrale Einstiegspunktsfunktion ist `renderAdminBlock` in `apps/admin/src/components/admin-block-renderer-registry.tsx`. Sie bildet den Block-Typ (`block.type`) auf eine registrierte Renderer-Funktion ab; fehlt ein Eintrag, wird der Fallback verwendet.

Damit ist das Pattern **Registry + Dispatcher**: neue Blocktypen werden ergänzt, indem eine Renderer-Funktion implementiert und im `registry`-Objekt eingetragen wird.

## Defensive Prop-Verarbeitung

Block-`props` sind zur Laufzeit strukturiert, aber nicht garantiert typisiert je nach Datenquelle. Hero- und Text-Renderer lesen Felder über kleine Hilfen (z. B. Prüfung auf `object`, sichere Strings mit Fallback). Es gibt keine unsicheren Blind-Casts auf konkrete Form-Typen ohne Prüfung.

## Fallback für unbekannte Blocktypen

Wenn `block.type` nicht im Registry-Mapping vorkommt, rendert `FallbackAdminRenderer`: Anzeige von `type`, `id` und ein Hinweis, dass kein Admin-Renderer registriert ist. So bleiben unbekannte oder noch nicht unterstützte Typen im Admin sichtbar und debugbar, ohne die Seite zu brechen.

## Vorbereitung für einen späteren Editor

- Renderer sind als **reine Funktionen** `(block: CmsBlock) => …` über den Typ `AdminBlockRenderer` beschrieben; die gleiche Registry kann später um Bearbeitungs-UI oder Inspector-Panels erweitert werden, ohne die öffentliche Website zu vermischen.
- Die Trennung Admin vs. Public erlaubt, Editor-spezifische Komponenten schrittweise neben den Read-Renderern einzuführen.
