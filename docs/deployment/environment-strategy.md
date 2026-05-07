# Umgebungsvariablen — Strategie

## Prinzip

- **Apps** lesen nur noch **neutrale** Präfixe (`SOVEREIGN_*` oder pro-App `.env`), sobald die Produktreife es verlangt.
- **Legacy** nutzt weiterhin die in `.env.example` dokumentierten `NEXT_PUBLIC_SUPABASE_*`- und Kontaktvariablen — getrennt betreiben (`legacy/physio-source` eigenes `npm install`).

## SovereignCMS (Web / Admin)

- **Phase 2.1**: `apps/web` benötigt **keine** Secrets für den In-Memory-Pfad; Host kommt aus **`headers`**.
- **Später**: Adapter wählen per Env (`DATABASE_ADAPTER=postgres|supabase`), Connection-Strings nur serverseitig, niemals `NEXT_PUBLIC_*` für Secrets.

## Deployment-Schichten

- **SaaS**: optional Vercel + Supabase — Env im Hosting-UI.
- **Gov/Self-Hosted**: Kubernetes/VM, Secrets aus Vault/K8s-Secrets, keine Abhängigkeit von Vercel.

## Checkliste

1. Keine Service-Keys im Client-Bundle.
2. `.env*` ignorieren, `!.env.example` und dokumentierte Ausnahmen (z. B. Worker-Beispiel) committen.
3. Pro Umgebung (`dev` / `staging` / `prod`) getrennte Mandanten- und DNS-Konfiguration — nicht nur andere API-Keys.
