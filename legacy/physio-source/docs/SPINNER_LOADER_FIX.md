# Spinner / GlobalPageLoader Fix

**Datei:** `src/components/layout/GlobalPageLoader.tsx`

## Problem
Der Spinner wurde ausgeblendet, bevor kritische UI-Komponenten (Header, Footer) vollständig geladen und gerendert waren. Dies führte zu visuellen "Popping"-Effekten beim Laden neuer Seiten.

## Lösung
Die `waitForInitialPageReady()` Funktion wurde angepasst, um auf Custom Events zu warten, die von `HeaderWrapper` und `FooterWrapper` signalisieren:

- **Event:** `pk:header-ready` – signalisiert, dass die Navigation Daten geladen hat
- **Event:** `pk:footer-ready` – signalisiert, dass Footer Daten geladen hat
- **HTML Attribute:** `data-header-ready="1"` und `data-footer-ready="1"` auf `document.documentElement`

## Wie es funktioniert

1. **GlobalPageLoader** startet beim Seiten-Wechsel den Spinner
2. **GlobalPageLoader** wartet auf beide Events (`pk:header-ready` und `pk:footer-ready`)
3. **HeaderWrapper** (`src/components/navigation/HeaderWrapper.tsx`):
   - Lädt Navigation Konfigurationen
   - Setzt `data-header-ready="1"` und dispatcht `pk:header-ready`
4. **FooterWrapper** (`src/components/layout/FooterWrapper.tsx`):
   - Lädt Footer Konfigurationen
   - Setzt `data-footer-ready="1"` und dispatcht `pk:footer-ready`
5. **GlobalPageLoader** blendet Spinner aus, nachdem beide Signale empfangen wurden

## Einschränkungen
- Der Fix garantiert, dass Header/Footer gerendert sind
- Bilder, Assets und vollständige Block-Laden werden **nicht** abgewartet
- Falls eine Komponente crasht oder Events nicht sendet, greift ein Fallback nach `FIRST_VISIT_MAX_WAIT_MS` (12 Sekunden)

## Weitere Tuning-Möglichkeiten
- `MIN_VISIBLE_MS` (420ms): Minimale Spinner-Dauer
- `FIRST_VISIT_SETTLE_MS` (450ms): Pause nach Event-Empfang vor dem Verstecken
- `FIRST_VISIT_MAX_WAIT_MS` (12000ms): Maximale Wartezeit, bevor Spinner erzwungen ausgeblendet wird
- `CRITICAL_UI_WAIT_MS` (2500ms): Wartezeit für einzelne Events
