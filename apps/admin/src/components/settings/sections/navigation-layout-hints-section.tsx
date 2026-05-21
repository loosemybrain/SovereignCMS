"use client"

import Link from "next/link"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { SettingsSectionCard } from "@/components/settings/settings-ux-primitives"

export function NavigationLayoutHintsSection() {
  const d = useAdminI18n().messages.settingsDomains

  return (
    <SettingsSectionCard title={d.navigationMenusTitle} description={d.navigationMenusDescription}>
      <p className="text-sm leading-relaxed admin-text-muted">{d.navigationMenusNote}</p>
      <ul className="mt-4 space-y-2 text-sm">
        <li>
          <Link href="/navigation" className="font-medium underline admin-accent">
            {d.navigationMainLink}
          </Link>
        </li>
        <li>
          <Link href="/footer-navigation" className="font-medium underline admin-accent">
            {d.navigationFooterLink}
          </Link>
        </li>
      </ul>
    </SettingsSectionCard>
  )
}
