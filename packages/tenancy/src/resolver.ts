/** Hostname ? Mandant (nutzt `createDatabaseTenantResolver` mit einem `DatabaseAdapter`). */
export type DomainMapping = {
  hostname: string
  tenantId: string
}