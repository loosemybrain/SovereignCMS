import type { AuthUser, PermissionId } from "./types"

export type RbacPolicy = {
  userHasPermission: (user: AuthUser, permission: PermissionId) => boolean
}

export type AuthProvider = {
  getSession: () => Promise<AuthUser | null>
  signOut: () => Promise<void>
}
