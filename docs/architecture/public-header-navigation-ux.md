# Public Header & Navigation UX

## Überblick

Die öffentliche Site nutzt ein **`PublicHeaderViewModel`**, das serverseitig aus **TenantSettings**, der aufgelösten Navigation (`label` / `href`) und der Runtime-Konfiguration (**unterstützte Locales**) gebaut wird. Es gibt **kein Mega-Menü**, **keine Such-UX**, **keine Auth-UX** und **keine Animations-Bibliothek**.

## ViewModel

- **Site Identity**: `siteName`, `tagline`, optionales `logoUrl`
- **navigationLinks**: je Eintrag `label`, `href`, **`active`** (Pfadvergleich)
- **localeLinks**: je Eintrag `locale`, `href` (Pfad mit ausgetauschter Locale), **`active`**

Alle Daten sind serialisierbar; es werden keine Runtime-Instanzen an Client Components übergeben.

## Locale-aware Navigation

Navigations-`href`-Werte kommen aus der bestehenden Public-Navigation-Auflösung (`/${locale}/${slug}` für Seiten). Der **kanonische aktuelle Pfad** wird im Loader aus Locale und Slug-Segmenten gebildet und für den Active-State sowie für den Locale-Switcher verwendet.

## Active State

Aktiv ist ein Link, wenn der kanonische Pfad dem `href` entspricht oder (bei Unterpfaden) mit `href + "/"` beginnt. Root `/` wird abgesichert behandelt. Externe URLs (`http…`) sind nie aktiv.

Darstellung: nicht nur Farbe — u. a. **Unterstreichung**, **Inset-Rahmen/Schatten** am aktiven Eintrag; **`aria-current="page"`** für die Hauptnavigation.

## Locale Switcher

Für jede konfigurierte `SupportedLocale` wird ein Link erzeugt, der **dieselbe Pfadstruktur** mit **ersetztem Locale-Segment** verwendet. Die aktuelle Locale ist als aktiv erkennbar (`aria-current="true"`). Es gibt **keine** automatische Browser-Locale-Erkennung.

## Mobile Navigation

**Client-seitig**: ein Bool für geöffnet/geschlossen; ein Button mit **`aria-expanded`** und **`aria-controls`** verweist auf den aufklappbaren Bereich. **Kein** dediziertes Drawer-Framework, **kein** Body-Scroll-Lock, **kein** Gestik-System.

## Header / Footer Composition

`PublicLayoutShell` gruppiert **PublicHeader**, ein **`main`**-Wrapper für den Seiteninhalt und **PublicFooter**, konsistent mit dem Footer-Stil (zinc-Dunkel, Ränder). Die **Preview-Badge** bleibt außerhalb der Shell oberhalb des Headers.

## Grenzen (bewusst)

- Keine Middleware- oder URL-Engine-Erweiterung in dieser Phase.
- Keine separaten „Footer-only“-Menüs; Header nutzt dieselbe Navigationsliste wie zuvor die reine Nav-Leiste.
