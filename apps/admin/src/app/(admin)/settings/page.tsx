import { headers } from "next/headers"
import { AdminPageHeader } from "@/components/admin-ui"
import { SettingsEditor } from "@/components/settings-editor"
import { getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

export default async function SettingsPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })
  const settings = await runtime.settingsPersistence.getTenantSettings({
    tenantId: tenant.tenantId,
  })
  const t = getAdminMessages(await getAdminUiLocale()).settings

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <SettingsEditor tenantId={tenant.tenantId} initialSettings={settings} />
    </div>
  )
}
