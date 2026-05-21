/**
 * Shared spinner preset contract (settings hardening).
 * Admin preview and public loader must use the same preset semantics — not a navigation engine.
 */

export const SPINNER_PRESET_KEYS = [
  "modern",
  "minimal",
  "wave",
  "yin-yang",
  "progress",
  "orbital",
] as const

export type SpinnerPresetKey = (typeof SPINNER_PRESET_KEYS)[number]

export const SPINNER_SPEED_KEYS = ["slow", "normal", "fast"] as const

export type SpinnerSpeedKey = (typeof SPINNER_SPEED_KEYS)[number]

export const DEFAULT_SPINNER_PRESET: SpinnerPresetKey = "modern"
export const DEFAULT_SPINNER_SPEED: SpinnerSpeedKey = "normal"

export function isSpinnerPresetKey(value: unknown): value is SpinnerPresetKey {
  return typeof value === "string" && (SPINNER_PRESET_KEYS as readonly string[]).includes(value)
}

export function isSpinnerSpeedKey(value: unknown): value is SpinnerSpeedKey {
  return typeof value === "string" && (SPINNER_SPEED_KEYS as readonly string[]).includes(value)
}

export function normalizeSpinnerPreset(value: unknown): SpinnerPresetKey {
  return isSpinnerPresetKey(value) ? value : DEFAULT_SPINNER_PRESET
}

export function normalizeSpinnerSpeed(value: unknown): SpinnerSpeedKey {
  return isSpinnerSpeedKey(value) ? value : DEFAULT_SPINNER_SPEED
}
