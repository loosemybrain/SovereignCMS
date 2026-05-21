"use client"

import { useState } from "react"
import type { TenantSettings } from "@sovereign-cms/core"
import {
  getInvalidThemeTokenFields,
  sanitizeTenantAppearanceSettings,
  validateExternalHref,
} from "@sovereign-cms/core"
import { AdminAlert } from "@/components/admin-ui"
import { GeneralSettingsTab } from "@/components/settings/general-settings-tab"
import { LegalSettingsTab } from "@/components/settings/legal-settings-tab"
import { SocialSettingsTab } from "@/components/settings/social-settings-tab"
import { ThemeSettingsTab } from "@/components/settings/theme-settings-tab"
import { FontSettingsTab } from "@/components/settings/font-settings-tab"
import { SpinnerSettingsTab } from "@/components/settings/spinner-settings-tab"
import { SettingsSaveBar } from "@/components/settings/settings-save-bar"
import { clientSettingsPersistence } from "@/lib/client-settings-persistence"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type Props = {
  tenantId: string
  initialSettings: TenantSettings
}

export function SettingsEditor({ tenantId, initialSettings }: Props) {
  const { messages } = useAdminI18n()
  const s = messages.settingsForm
  const [settings, setSettings] = useState<TenantSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [themeSanitizedNotice, setThemeSanitizedNotice] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setError(null)
      setSuccessMessage(null)
      setThemeSanitizedNotice(null)
      setIsSaving(true)

      for (const link of settings.socialLinks) {
        const labelOk = link.label.trim().length > 0
        const hrefOk = validateExternalHref(link.href.trim())
        if (!labelOk || !hrefOk) {
          setError(s.socialValidationError)
          setIsSaving(false)
          return
        }
      }

      const invalidThemeKeys = getInvalidThemeTokenFields(settings.appearance.themeTokens)
      const appearance = sanitizeTenantAppearanceSettings(settings.appearance)

      const result = await clientSettingsPersistence.updateTenantSettings({
        tenantId,
        settings: {
          siteIdentity: settings.siteIdentity,
          contact: settings.contact,
          business: settings.business,
          legal: settings.legal,
          socialLinks: settings.socialLinks,
          appearance,
        },
      })

      if (result.success) {
        setSettings(result.settings)
        setSuccessMessage(result.persisted ? s.saveSuccessPersisted : s.saveSuccessInMemory)
        if (invalidThemeKeys.length > 0) {
          setThemeSanitizedNotice(s.themeTokensSanitizedOnSave)
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : s.saveErrorGeneric
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const tabProps = { settings, setSettings, isSaving }

  return (
    <div className="space-y-6">
      {error ? (
        <AdminAlert variant="destructive" title={s.saveFailed}>
          {error}
        </AdminAlert>
      ) : null}

      {successMessage ? <AdminAlert variant="success">{successMessage}</AdminAlert> : null}

      {themeSanitizedNotice ? (
        <AdminAlert variant="warning">{themeSanitizedNotice}</AdminAlert>
      ) : null}

      <GeneralSettingsTab {...tabProps} />
      <ThemeSettingsTab {...tabProps} />
      <FontSettingsTab {...tabProps} />
      <SpinnerSettingsTab {...tabProps} />
      <LegalSettingsTab {...tabProps} />
      <SocialSettingsTab {...tabProps} />

      <SettingsSaveBar isSaving={isSaving} onSave={handleSave} />
    </div>
  )
}
