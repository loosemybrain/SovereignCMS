/**
 * Re-exports core CSS sanitizers for admin settings (settings hardening).
 */
export {
  sanitizeCssColorToken,
  sanitizeFontFamilyName,
  sanitizeFontWeight,
  sanitizeFontStyle,
  sanitizeCssLengthToken,
  isSafeWoff2DataUrl,
  MAX_WOFF2_DATA_URL_LENGTH,
  MAX_WOFF2_FILE_BYTES,
  isValidCssColorToken,
  isValidCssLengthToken,
} from "@sovereign-cms/core"
