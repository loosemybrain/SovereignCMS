/**
 * Tenant appearance settings (theme tokens, prototype fonts, spinner).
 * Sanitized at save and again before CSS emission — not a theme DSL or engine.
 */

import {
  isSafeWoff2DataUrl,
  sanitizeCssColorToken,
  sanitizeCssLengthToken,
  sanitizeFontFamilyName,
  sanitizeFontStyle,
  sanitizeFontWeight,
} from "./settings-css-sanitizers"
import {
  DEFAULT_SPINNER_PRESET,
  DEFAULT_SPINNER_SPEED,
  normalizeSpinnerPreset,
  normalizeSpinnerSpeed,
  type SpinnerPresetKey,
  type SpinnerSpeedKey,
} from "./spinner-contract"

/** Keys allowed in persisted theme token maps (subset of public surface tokens). */
export const ALLOWED_THEME_TOKEN_KEYS = [
  "primary",
  "primaryForeground",
  "accent",
  "accentForeground",
  "background",
  "foreground",
  "muted",
  "mutedForeground",
  "border",
  "radius",
] as const

export type AllowedThemeTokenKey = (typeof ALLOWED_THEME_TOKEN_KEYS)[number]

export type TenantCustomFont = {
  id: string
  family: string
  weight: string
  style: string
  /** Prototype only — production should use media/storage asset references. */
  woff2DataUrl?: string
}

export type TenantSpinnerSettings = {
  preset: SpinnerPresetKey
  speed: SpinnerSpeedKey
}

export type TenantAppearanceSettings = {
  themeTokens: Partial<Record<AllowedThemeTokenKey, string>>
  customFonts: TenantCustomFont[]
  spinner: TenantSpinnerSettings
}

export function createDefaultTenantAppearanceSettings(): TenantAppearanceSettings {
  return {
    themeTokens: {},
    customFonts: [],
    spinner: {
      preset: DEFAULT_SPINNER_PRESET,
      speed: DEFAULT_SPINNER_SPEED,
    },
  }
}

function isAllowedThemeTokenKey(key: string): key is AllowedThemeTokenKey {
  return (ALLOWED_THEME_TOKEN_KEYS as readonly string[]).includes(key)
}

export function sanitizeThemeTokens(
  tokens: unknown,
): Partial<Record<AllowedThemeTokenKey, string>> {
  if (typeof tokens !== "object" || tokens === null || Array.isArray(tokens)) {
    return {}
  }
  const out: Partial<Record<AllowedThemeTokenKey, string>> = {}
  for (const [rawKey, rawValue] of Object.entries(tokens)) {
    if (!isAllowedThemeTokenKey(rawKey)) {
      continue
    }
    const sanitized =
      rawKey === "radius"
        ? sanitizeCssLengthToken(rawValue)
        : sanitizeCssColorToken(rawValue)
    if (sanitized) {
      out[rawKey] = sanitized
    }
  }
  return out
}

export function sanitizeCustomFonts(value: unknown): TenantCustomFont[] {
  if (!Array.isArray(value)) {
    return []
  }
  const fonts: TenantCustomFont[] = []
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      continue
    }
    const rec = entry as Record<string, unknown>
    const id = typeof rec.id === "string" ? rec.id.trim() : ""
    const family = sanitizeFontFamilyName(rec.family)
    const weight = sanitizeFontWeight(rec.weight) ?? "400"
    const style = sanitizeFontStyle(rec.style) ?? "normal"
    if (!id || !family) {
      continue
    }
    const font: TenantCustomFont = { id, family, weight, style }
    if (typeof rec.woff2DataUrl === "string" && isSafeWoff2DataUrl(rec.woff2DataUrl)) {
      font.woff2DataUrl = rec.woff2DataUrl.trim()
    }
    fonts.push(font)
  }
  return fonts
}

export function sanitizeTenantSpinnerSettings(value: unknown): TenantSpinnerSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return createDefaultTenantAppearanceSettings().spinner
  }
  const rec = value as Record<string, unknown>
  return {
    preset: normalizeSpinnerPreset(rec.preset),
    speed: normalizeSpinnerSpeed(rec.speed),
  }
}

/** Non-empty theme token values that fail color/length sanitization (admin UI hints). */
export function getInvalidThemeTokenFields(
  tokens: Partial<Record<AllowedThemeTokenKey, string | undefined>> | undefined,
): AllowedThemeTokenKey[] {
  if (!tokens) {
    return []
  }
  const invalid: AllowedThemeTokenKey[] = []
  for (const key of ALLOWED_THEME_TOKEN_KEYS) {
    const raw = tokens[key]
    if (raw == null || raw.trim() === "") {
      continue
    }
    const ok =
      key === "radius"
        ? sanitizeCssLengthToken(raw) !== null
        : sanitizeCssColorToken(raw) !== null
    if (!ok) {
      invalid.push(key)
    }
  }
  return invalid
}

export function sanitizeTenantAppearanceSettings(
  value: unknown,
): TenantAppearanceSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return createDefaultTenantAppearanceSettings()
  }
  const rec = value as Record<string, unknown>
  return {
    themeTokens: sanitizeThemeTokens(rec.themeTokens),
    customFonts: sanitizeCustomFonts(rec.customFonts),
    spinner: sanitizeTenantSpinnerSettings(rec.spinner),
  }
}
