# Deployment

- **Standardpfad:** beliebige Node-/Container-Umgebung; keine Pflicht zu Vercel oder Supabase.
- **SaaS/KMU:** optional `adapters/supabase` + Hosting nach Wahl (z. B. Vercel über `adapters/vercel` als reine Hilfs-Metadaten).
- **Gov/Self-Hosted:** `adapters/postgres`, `adapters/s3` (MinIO), `adapters/keycloak` — eigene Build-Pipelines und Geheimnisverwaltung.

Cookie-Scan-Worker der Legacy-App: `docker-compose.yml` (Build-Kontext unter `legacy/physio-source/cookie-scan-worker`).
