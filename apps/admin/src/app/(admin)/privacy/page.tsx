import { headers } from "next/headers"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { AdminAlert, AdminPageHeader } from "@/components/admin-ui"
import { PrivacyScannerPanel } from "@/components/privacy-scanner-panel"

export const metadata = {
  title: "Privacy",
}

export default async function PrivacyPage() {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost"
  const { runtime, tenant } = getAdminRuntime({ host })

  if (!tenant) {
    return (
      <div className="space-y-6">
        <AdminAlert variant="destructive" title="Tenant not found">
          Der Tenant konnte fuer diese Anfrage nicht aufgeloest werden.
        </AdminAlert>
      </div>
    )
  }

  const scans = await runtime.privacyScannerPersistence.listPrivacyScans({
    tenantId: tenant.tenantId,
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Privacy"
        description="Privacy scan jobs and manual review"
      />

      <PrivacyScannerPanel tenantId={tenant.tenantId} initialScans={scans} />
    </div>
  )
}
