# Supabase-Abhängigkeiten (Legacy vs. Produkt)

## Legacy — typische Kopplungen

- **`@supabase/supabase-js`**, **`@supabase/ssr`**: Browser- und Server-Clients.
- **Auth-Callback**, MFA-Routen, Session-Anbindung an Admin-Guards.
- **Storage** für Medien/Fonts; **Row-Level**-Annahmen in Queries.
- **Cookie-Scan-Worker**: Service Role, Polling gegen Supabase-Tabellen.

## SovereignCMS

- **`adapters/supabase`**: vorgesehener einziger Ort für Supabase-spezifische Implementierung der **`DatabaseAdapter`**- und Storage-Schnittstellen (noch Platzhalter).
- **`packages/db`**: nur **repository-basierte** Verträge und In-Memory-Demo — **kein** Supabase-Import.

## Gov / Self-Hosted

- Gleiche App-Oberfläche soll **`adapters/postgres`** + **`adapters/s3`** + **`adapters/keycloak`** nutzen können, ohne Supabase im Build-Pfad zu benötigen.
