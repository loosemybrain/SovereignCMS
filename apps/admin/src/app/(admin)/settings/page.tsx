import { headers } from "next/headers"
import { AdminPageHeader } from "@/components/admin-ui"
import { SettingsEditor } from "@/components/settings-editor"
import { getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"
import { resolveAdminOperationalReadScope } from "@/lib/resolve-admin-operational-read-scope"

export default async function SettingsPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, scope } = resolveAdminOperationalReadScope({
    host,
    operation: "settings:read",
  })
  const settings = await runtime.settingsPersistence.getTenantSettings({
    tenantId: scope.tenantId,
  })
  const t = getAdminMessages(await getAdminUiLocale()).settings

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <SettingsEditor tenantId={scope.tenantId} initialSettings={settings} />
    </div>
  )
}
