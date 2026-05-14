"use client"

import { createContext, useContext, useMemo, useState } from "react"
import type { AdminAppearance } from "@/lib/admin-appearance"
import { DEFAULT_ADMIN_APPEARANCE } from "@/lib/admin-appearance"

type AdminAppearanceContextValue = {
  appearance: AdminAppearance
  setAppearance: (appearance: AdminAppearance) => void
  toggleAppearance: () => void
}

const AdminAppearanceContext = createContext<AdminAppearanceContextValue | null>(null)

export function AdminAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<AdminAppearance>(DEFAULT_ADMIN_APPEARANCE)

  const value = useMemo<AdminAppearanceContextValue>(
    () => ({
      appearance,
      setAppearance,
      toggleAppearance: () => setAppearance((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [appearance],
  )

  return (
    <AdminAppearanceContext.Provider value={value}>
      <div data-theme={appearance} className="admin-theme-root h-screen overflow-hidden">
        {children}
      </div>
    </AdminAppearanceContext.Provider>
  )
}

export function useAdminAppearance(): AdminAppearanceContextValue {
  const context = useContext(AdminAppearanceContext)
  if (!context) {
    throw new Error("useAdminAppearance must be used inside AdminAppearanceProvider")
  }
  return context
}
