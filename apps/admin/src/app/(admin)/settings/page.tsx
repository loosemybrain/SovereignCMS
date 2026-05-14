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
      <AdminPageHeader
        eyebrow="Mandant"
        title="Einstellungen"
        description="Globale Site-Einstellungen für diesen Mandanten — sichtbar in der öffentlichen Site, sobald veröffentlicht."
      />
      <SettingsEditor tenantId={tenant.tenantId} initialSettings={settings} />
    </div>
  )
}
