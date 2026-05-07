import type { AuthProvider } from "@sovereign-cms/auth"

/** OIDC/Keycloak-Anbindung — später: Token-Refresh, Rollen-Mapping. */
export function createKeycloakAuthProviderPlaceholder(): AuthProvider {
  return {
    async getSession() {
      return null
    },
    async signOut() {
      /* noop */
    },
  }
}
