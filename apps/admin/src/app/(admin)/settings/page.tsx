import { headers } from "next/headers"
import { AdminPageHeader } from "@/components/admin-ui"
import { SettingsEditor } from "@/components/settings-editor"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

export default async function SettingsPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })
  const settings = await runtime.settingsPersistence.getTenantSettings({
    tenantId: tenant.tenantId,
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" description="Tenant-wide site settings" />
      <SettingsEditor tenantId={tenant.tenantId} initialSettings={settings} />
    </div>
  )
}
