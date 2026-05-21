/**
 * Builds sanitized CSS strings from tenant appearance settings.
 * All dynamic values pass through settings-css-sanitizers first.
 */

import type { AllowedThemeTokenKey, TenantAppearanceSettings, TenantCustomFont } from "./settings-appearance"
import { sanitizeTenantAppearanceSettings } from "./settings-appearance"
import {
  sanitizeCssColorToken,
  sanitizeCssLengthToken,
  sanitizeFontFamilyName,
  sanitizeFontStyle,
  sanitizeFontWeight,
  isSafeWoff2DataUrl,
} from "./settings-css-sanitizers"
import { normalizeSpinnerPreset, normalizeSpinnerSpeed } from "./spinner-contract"

const THEME_VAR_BY_KEY: Record<AllowedThemeTokenKey, string> = {
  primary: "--public-primary",
  primaryForeground: "--public-primary-foreground",
  accent: "--public-accent",
  accentForeground: "--public-accent-foreground",
  background: "--public-background",
  foreground: "--public-foreground",
  muted: "--public-muted",
  mutedForeground: "--public-muted-foreground",
  border: "--public-border",
  radius: "--public-radius",
}

function escapeFontFamily(family: string): string {
  return family.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

export function buildThemeTokensCss(
  appearance: TenantAppearanceSettings | unknown,
  selector = ":root",
): string {
  const sanitized = sanitizeTenantAppearanceSettings(appearance)
  const rules: string[] = []
  for (const [key, raw] of Object.entries(sanitized.themeTokens) as [
    AllowedThemeTokenKey,
    string | undefined,
  ][]) {
    const cssVar = THEME_VAR_BY_KEY[key]
    if (!cssVar || raw == null) {
      continue
    }
    const safe = key === "radius" ? sanitizeCssLengthToken(raw) : sanitizeCssColorToken(raw)
    if (safe) {
      rules.push(`${cssVar}:${safe}`)
    }
  }
  if (rules.length === 0) {
    return ""
  }
  return `${selector}{${rules.join(";")}}`
}

export function buildFontFaceCss(
  appearance: TenantAppearanceSettings | unknown,
): string {
  const sanitized = sanitizeTenantAppearanceSettings(appearance)
  const blocks: string[] = []
  for (const font of sanitized.customFonts) {
    const block = buildSingleFontFace(font)
    if (block) {
      blocks.push(block)
    }
  }
  return blocks.join("")
}

function buildSingleFontFace(font: TenantCustomFont): string {
  const family = sanitizeFontFamilyName(font.family)
  const weight = sanitizeFontWeight(font.weight) ?? "400"
  const style = sanitizeFontStyle(font.style) ?? "normal"
  if (!family) {
    return ""
  }
  if (font.woff2DataUrl && isSafeWoff2DataUrl(font.woff2DataUrl)) {
    return `@font-face{font-family:"${escapeFontFamily(family)}";font-style:${style};font-weight:${weight};src:url("${font.woff2DataUrl}") format("woff2");font-display:swap;}`
  }
  return ""
}

const SPINNER_SPEED_DURATION: Record<string, string> = {
  slow: "1.4s",
  normal: "1s",
  fast: "0.65s",
}

export function buildSpinnerScopeCss(
  appearance: TenantAppearanceSettings | unknown,
  selector = ":root",
): string {
  const sanitized = sanitizeTenantAppearanceSettings(appearance)
  const preset = normalizeSpinnerPreset(sanitized.spinner.preset)
  const speed = normalizeSpinnerSpeed(sanitized.spinner.speed)
  const duration = SPINNER_SPEED_DURATION[speed] ?? SPINNER_SPEED_DURATION.normal
  return `${selector}{--sovereign-spinner-preset:${preset};--sovereign-spinner-duration:${duration}}`
}

export function buildPublicAppearanceCss(
  appearance: TenantAppearanceSettings | unknown,
): string {
  return [
    buildThemeTokensCss(appearance),
    buildFontFaceCss(appearance),
    buildSpinnerScopeCss(appearance),
  ]
    .filter((chunk) => chunk.length > 0)
    .join("")
}

export function buildAdminPreviewAppearanceCss(
  appearance: TenantAppearanceSettings | unknown,
): string {
  return [
    buildThemeTokensCss(appearance, ".admin-preview-surface"),
    buildFontFaceCss(appearance),
    buildSpinnerScopeCss(appearance, ".admin-preview-surface"),
  ]
    .filter((chunk) => chunk.length > 0)
    .join("")
}
