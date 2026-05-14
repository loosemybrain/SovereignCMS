import { headers } from "next/headers"
import { AdminAppearanceProvider } from "@/components/admin-appearance-provider"
import { AdminShell } from "@/components/admin-shell"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { pickAdminRuntimeAdapterLabels } from "@/lib/admin-runtime-display"

type Props = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })

  return (
    <AdminAppearanceProvider>
      <AdminShell
        tenant={tenant}
        runtimeAdapterLabels={pickAdminRuntimeAdapterLabels(runtime.config)}
      >
        {children}
      </AdminShell>
    </AdminAppearanceProvider>
  )
}
