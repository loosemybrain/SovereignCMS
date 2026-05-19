import { headers } from "next/headers"
import { resolveAdminOperationalReadScope } from "@/lib/resolve-admin-operational-read-scope"
import { AdminPageHeader } from "@/components/admin-ui"
import { PrivacyScannerPanel } from "@/components/privacy-scanner-panel"
import { getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"

export const metadata = {
  title: "Privacy",
}

export default async function PrivacyPage() {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost"
  const { runtime, scope } = resolveAdminOperationalReadScope({
    host,
    operation: "privacy:read",
  })

  const scans = await runtime.privacyScannerPersistence.listPrivacyScans({
    tenantId: scope.tenantId,
  })
  const p = getAdminMessages(await getAdminUiLocale()).privacyPage

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <PrivacyScannerPanel tenantId={scope.tenantId} initialScans={scans} />
    </div>
  )
}
