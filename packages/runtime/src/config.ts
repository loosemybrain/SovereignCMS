export type DatabaseAdapterKind = "memory" | "supabase" | "postgres"
export type StorageAdapterKind = "memory" | "supabase" | "s3"
export type AuthAdapterKind = "none" | "supabase" | "keycloak"

export type RuntimeConfig = {
  appEnv: "local" | "development" | "staging" | "production"
  databaseAdapter: DatabaseAdapterKind
  storageAdapter: StorageAdapterKind
  authAdapter: AuthAdapterKind
  defaultLocale: string
  supportedLocales: string[]
}

function readEnum<TValue extends string>(
  env: NodeJS.ProcessEnv,
  key: string,
  fallback: TValue,
  allowed: readonly TValue[],
): TValue {
  const raw = env[key]
  if (!raw) return fallback
  if ((allowed as readonly string[]).includes(raw)) {
    return raw as TValue
  }
  throw new Error(`Invalid runtime config value for ${key}: ${raw}`)
}

function readCommaSeparatedList(env: NodeJS.ProcessEnv, key: string, fallback: string): string[] {
  const raw = env[key] ?? fallback
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const supportedLocales = readCommaSeparatedList(env, "SUPPORTED_LOCALES", "de")
  const defaultLocale = env.DEFAULT_LOCALE ?? "de"

  // Validate: defaultLocale must be in supportedLocales
  if (!supportedLocales.includes(defaultLocale)) {
    throw new Error(
      `Invalid runtime config: DEFAULT_LOCALE "${defaultLocale}" not in SUPPORTED_LOCALES "${supportedLocales.join(",")}"`,
    )
  }

  return {
    appEnv: readEnum(env, "APP_ENV", "local", ["local", "development", "staging", "production"]),
    databaseAdapter: readEnum(env, "DATABASE_ADAPTER", "memory", [
      "memory",
      "supabase",
      "postgres",
    ]),
    storageAdapter: readEnum(env, "STORAGE_ADAPTER", "memory", [
      "memory",
      "supabase",
      "s3",
    ]),
    authAdapter: readEnum(env, "AUTH_ADAPTER", "none", ["none", "supabase", "keycloak"]),
    defaultLocale,
    supportedLocales,
  }
}
