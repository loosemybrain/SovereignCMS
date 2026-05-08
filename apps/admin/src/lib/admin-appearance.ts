export type AdminAppearance = "dark" | "light"

export const DEFAULT_ADMIN_APPEARANCE: AdminAppearance = "dark"

export function isAdminAppearance(value: unknown): value is AdminAppearance {
  return value === "dark" || value === "light"
}
