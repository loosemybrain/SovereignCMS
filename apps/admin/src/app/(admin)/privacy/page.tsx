import { headers } from "next/headers"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { AdminPageHeader } from "@/components/admin-ui/admin-page-header"
import { PrivacyScannerPanel } from "@/components/privacy-scanner-panel"

export const metadata = {
  title: "Privacy",
}

export default async function PrivacyPage() {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost"
  const { runtime, tenant } = getAdminRuntime({ host })

  if (!tenant) {
    return <div className="p-6 text-red-600">Tenant not found</div>
  }

  const scans = await runtime.privacyScannerPersistence.listPrivacyScans({
    tenantId: tenant.tenantId,
  })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Privacy"
        description="Privacy scan jobs and manual review"
      />

      <PrivacyScannerPanel tenantId={tenant.tenantId} initialScans={scans} />
    </div>
  )
}
