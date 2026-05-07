# Runtime Composition

## Zweck von `packages/runtime`

`packages/runtime` kapselt die zentrale Laufzeit-Komposition fuer SovereignCMS. Apps erzeugen keine Infrastruktur-Adapter mehr direkt, sondern arbeiten gegen eine einheitliche Runtime-Instanz.

## Warum Apps keine Adapter direkt erzeugen

- Entkopplung von App-Schichten und Infrastrukturentscheidungen
- Einheitliche Adapterauswahl fuer `web` und spaeter `admin`
- Einfachere Tests, da die App nur gegen `runtime.db`, `runtime.tenantResolver`, `runtime.storage`, `runtime.auth` arbeitet
- Klare Stelle fuer ENV-gesteuerte Auswahl und Defaults

## ENV-basierte Adapter-Auswahl

`loadRuntimeConfig()` liest die folgenden Variablen:

- `APP_ENV`
- `DATABASE_ADAPTER`
- `STORAGE_ADAPTER`
- `AUTH_ADAPTER`

Zulaessige Werte werden validiert. Bei ungueltigen Werten wird ein klarer Fehler mit Variablennamen geworfen.

## Local Default

Wenn Variablen fehlen, gelten Defaults:

- `databaseAdapter = memory`
- `storageAdapter = memory`
- `authAdapter = none`

Damit kann lokal ohne externe Infrastruktur gestartet werden.

## SaaS-Zielbild (optional)

- Supabase fuer DB/Auth/Storage als optionale Adapterwahl
- Vercel als optionales Deployment-Ziel
- Resend/SMTP fuer Mailversand als austauschbare Infrastruktur

## Gov-Zielbild (optional)

- Postgres fuer Datenhaltung
- Keycloak fuer Auth/OIDC
- S3/MinIO fuer Storage
- SMTP fuer Mailversand

Keine dieser Optionen soll in Apps hart verdrahtet sein.

## Status

Aktuell ist nur die Memory-Variante lauffaehig implementiert. Nicht implementierte Adapter werfen bewusst einen klaren Fehler (`Adapter not implemented yet: ...`).