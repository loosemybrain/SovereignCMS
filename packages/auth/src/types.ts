export type RoleId = string
export type PermissionId = string

export type AuthUser = {
  id: string
  email?: string
  roles: readonly RoleId[]
  /** Optional: direkte Berechtigungen neben Rollen */
  permissions?: readonly PermissionId[]
}
