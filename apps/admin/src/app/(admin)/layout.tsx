import { headers } from "next/headers"
import { AdminAppearanceProvider } from "@/components/admin-appearance-provider"
import { AdminI18nProvider } from "@/components/admin-i18n-provider"
import { AdminShell } from "@/components/admin-shell"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { pickAdminRuntimeAdapterLabels } from "@/lib/admin-runtime-display"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"

type Props = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })
  const uiLocale = await getAdminUiLocale()

  return (
    <AdminAppearanceProvider>
      <AdminI18nProvider locale={uiLocale}>
        <AdminShell
          tenant={tenant}
          runtimeAdapterLabels={pickAdminRuntimeAdapterLabels(runtime.config)}
        >
          {children}
        </AdminShell>
      </AdminI18nProvider>
    </AdminAppearanceProvider>
  )
}
