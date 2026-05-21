/**
 * Defensive CSS value sanitizers for tenant appearance settings.
 * Not a CSS parser — rejects injection patterns and arbitrary values.
 */

const CSS_INJECTION_PATTERN = /[;{}]|\burl\s*\(|\bexpression\s*\(|\bvar\s*\(/i

const CSS_FUNCTION_PATTERN = /\b(?:calc|url|var|expression|attr|counter)\s*\(/i

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

/** Conservative length: 0 or signed number + px|rem|em|% only. No calc, vh, or functions. */
const CSS_LENGTH = /^(?:0|-?(?:\d+(?:\.\d+)?)(?:px|rem|em|%))$/

const OKLCH_COLOR =
  /^oklch\(\s*[\d.]+%?\s+[\d.]+%?\s+[\d.]+%?(?:\s*\/\s*[\d.]+%?)?\s*\)$/i

const FONT_FAMILY_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9\s,'"-]{0,120}$/

const FONT_WEIGHT_PATTERN = /^(?:normal|bold|[1-9]00)$/

const FONT_STYLE_PATTERN = /^(?:normal|italic|oblique)$/

/** ~512 KiB encoded — prototype ceiling for in-settings woff2 data URLs. */
export const MAX_WOFF2_DATA_URL_LENGTH = 700_000

/** Client-side file size limit before base64 encoding (prototype). */
export const MAX_WOFF2_FILE_BYTES = 512 * 1024

const WOFF2_DATA_URL_PREFIX = "data:font/woff2;base64,"

function rejectsInjection(value: string): boolean {
  if (CSS_INJECTION_PATTERN.test(value) || CSS_FUNCTION_PATTERN.test(value)) {
    return true
  }
  if (value.includes("/*") || value.includes("*/")) {
    return true
  }
  return false
}

function isValidRgbColor(value: string): boolean {
  const match = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
    value,
  )
  if (!match) {
    return false
  }
  const channels = [match[1], match[2], match[3]].map((n) => Number(n))
  if (channels.some((n) => n > 255)) {
    return false
  }
  if (match[4] !== undefined) {
    const alpha = Number(match[4])
    if (Number.isNaN(alpha) || alpha < 0 || alpha > 1) {
      return false
    }
  }
  return true
}

function isValidHslColor(value: string): boolean {
  const match =
    /^hsla?\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
      value,
    )
  if (!match) {
    return false
  }
  const hue = Number(match[1])
  const sat = Number(match[2])
  const light = Number(match[3])
  if (hue > 360 || sat > 100 || light > 100) {
    return false
  }
  if (match[4] !== undefined) {
    const alpha = Number(match[4])
    if (Number.isNaN(alpha) || alpha < 0 || alpha > 1) {
      return false
    }
  }
  return true
}

function isValidOklchColor(value: string): boolean {
  return OKLCH_COLOR.test(value) && !rejectsInjection(value)
}

export function isValidCssColorToken(value: unknown): boolean {
  return sanitizeCssColorToken(value) !== null
}

export function isValidCssLengthToken(value: unknown): boolean {
  return sanitizeCssLengthToken(value) !== null
}

export function sanitizeCssColorToken(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim()
  if (!trimmed || rejectsInjection(trimmed)) {
    return null
  }
  if (HEX_COLOR.test(trimmed)) {
    return trimmed
  }
  if (isValidRgbColor(trimmed) || isValidHslColor(trimmed) || isValidOklchColor(trimmed)) {
    return trimmed
  }
  return null
}

export function sanitizeFontFamilyName(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim()
  if (!trimmed || rejectsInjection(trimmed) || !FONT_FAMILY_PATTERN.test(trimmed)) {
    return null
  }
  return trimmed
}

export function sanitizeFontWeight(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim().toLowerCase()
  if (!trimmed || !FONT_WEIGHT_PATTERN.test(trimmed)) {
    return null
  }
  return trimmed
}

export function sanitizeFontStyle(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim().toLowerCase()
  if (!trimmed || !FONT_STYLE_PATTERN.test(trimmed)) {
    return null
  }
  return trimmed
}

export function sanitizeCssLengthToken(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim()
  if (!trimmed || rejectsInjection(trimmed) || !CSS_LENGTH.test(trimmed)) {
    return null
  }
  return trimmed
}

export function isSafeWoff2DataUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false
  }
  const trimmed = value.trim()
  if (
    !trimmed.startsWith(WOFF2_DATA_URL_PREFIX) ||
    trimmed.length > MAX_WOFF2_DATA_URL_LENGTH
  ) {
    return false
  }
  const payload = trimmed.slice(WOFF2_DATA_URL_PREFIX.length)
  if (payload.length === 0 || payload.length % 4 !== 0) {
    return false
  }
  return /^[A-Za-z0-9+/]+={0,2}$/.test(payload)
}
