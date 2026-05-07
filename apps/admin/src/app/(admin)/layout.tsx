import { headers } from "next/headers"
import { AdminShell } from "@/components/admin-shell"
import { getAdminRuntime } from "@/lib/get-admin-runtime"

type Props = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })

  return <AdminShell runtimeConfig={runtime.config} tenant={tenant}>{children}</AdminShell>
}
