# Slug normalization fix (Admin Create Page)

## Ziel

Slug-Vorschlag aus dem Seitentitel nutzt klassische Web-Slugs: **lowercase**, **kebab-case**, defensiv normalisiert (kein camelCase mehr).

## Implementierung

- `apps/admin/src/lib/normalize-slug.ts` — `normalizeSlug(value)`
- `apps/admin/src/components/create-page-form.tsx` — automatischer Slug aus Titel via `normalizeSlug` / `slugFromTitle`; manuelle Slug-Eingabe wird nicht überschrieben, solange der Nutzer das Feld bearbeitet hat.

## Verhalten

- Leerzeichen → `-`
- Sonderzeichen entfernen (nach NFKD / Akzent-Stripping)
- `&` → ` und ` (Wortform)
- Doppelte `-` bereinigen
- Entnormalisiert leer bei nur-Sonderzeichen-Titel: Fallback `"page"` für die Übermittlung; Hinweis in der UI möglich

## Grenzen

- Keine Änderung an Runtime, Routing, DB oder Validierungsregeln im Core-Paket.
- Keine externe Slug-Library.
