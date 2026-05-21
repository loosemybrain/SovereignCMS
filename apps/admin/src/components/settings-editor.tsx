"use client"

import { useMemo, useState } from "react"
import type { SettingsPersistenceMode, TenantSettings } from "@sovereign-cms/core"
import {
  getInvalidThemeTokenFields,
  sanitizeTenantAppearanceSettings,
  validateExternalHref,
} from "@sovereign-cms/core"
import { AdminAlert } from "@/components/admin-ui"
import { AppearanceSettingsTab } from "@/components/settings/appearance-settings-tab"
import { BrandingSettingsTab } from "@/components/settings/branding-settings-tab"
import { LegalGovernanceSettingsTab } from "@/components/settings/legal-governance-settings-tab"
import { NavigationLayoutSettingsTab } from "@/components/settings/navigation-layout-settings-tab"
import { SocialExternalSettingsTab } from "@/components/settings/social-external-settings-tab"
import { SystemRuntimeSettingsTab } from "@/components/settings/system-runtime-settings-tab"
import { SettingsEditorTabList } from "@/components/settings/settings-editor-tab-list"
import { SettingsSaveBar } from "@/components/settings/settings-save-bar"
import type { SettingsDomainTab } from "@/components/settings/settings-domain-tabs"
import { serializeSettingsDirtySnapshot } from "@/components/settings/settings-dirty-snapshot"
import { clientSettingsPersistence } from "@/lib/client-settings-persistence"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type Props = {
  tenantId: string
  initialSettings: TenantSettings
}

export function SettingsEditor({ tenantId, initialSettings }: Props) {
  const { messages } = useAdminI18n()
  const s = messages.settingsForm
  const [activeTab, setActiveTab] = useState<SettingsDomainTab>("branding")
  const [settings, setSettings] = useState<TenantSettings>(initialSettings)
  const [savedBaseline, setSavedBaseline] = useState(() =>
    serializeSettingsDirtySnapshot(initialSettings),
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [themeSanitizedNotice, setThemeSanitizedNotice] = useState<string | null>(null)
  const [persistenceWarning, setPersistenceWarning] = useState<string | null>(null)
  const [lastPersistenceMode, setLastPersistenceMode] = useState<SettingsPersistenceMode | null>(
    null,
  )
  const [lastPersisted, setLastPersisted] = useState<boolean | null>(null)

  const hasUnsavedChanges = useMemo(
    () => serializeSettingsDirtySnapshot(settings) !== savedBaseline,
    [settings, savedBaseline],
  )

  const handleSave = async () => {
    try {
      setError(null)
      setSuccessMessage(null)
      setThemeSanitizedNotice(null)
      setPersistenceWarning(null)
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
        setSavedBaseline(serializeSettingsDirtySnapshot(result.settings))
        setLastPersistenceMode(result.persistenceMode)
        setLastPersisted(result.persisted)
        if (result.persistenceMode === "database" && result.persisted) {
          setSuccessMessage(s.saveSuccessPersisted)
        } else if (result.persistenceMode === "memory") {
          setSuccessMessage(s.saveSuccessInMemory)
        } else {
          setPersistenceWarning(result.warning ?? s.savePersistenceUnavailable)
        }
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
  const runtimeFeedback = {
    persistenceMode: lastPersistenceMode,
    persisted: lastPersisted,
    persistenceWarning,
    successMessage,
    themeSanitizedNotice,
  }

  const panel =
    activeTab === "branding" ? (
      <BrandingSettingsTab {...tabProps} />
    ) : activeTab === "appearance" ? (
      <AppearanceSettingsTab {...tabProps} />
    ) : activeTab === "navigationLayout" ? (
      <NavigationLayoutSettingsTab {...tabProps} />
    ) : activeTab === "socialExternal" ? (
      <SocialExternalSettingsTab {...tabProps} />
    ) : activeTab === "legalGovernance" ? (
      <LegalGovernanceSettingsTab {...tabProps} />
    ) : (
      <SystemRuntimeSettingsTab {...runtimeFeedback} />
    )

  return (
    <div className="relative min-w-0 space-y-4">
      {error ? (
        <AdminAlert variant="destructive" title={s.saveFailed}>
          {error}
        </AdminAlert>
      ) : null}

      {successMessage ? <AdminAlert variant="success">{successMessage}</AdminAlert> : null}

      {persistenceWarning ? (
        <AdminAlert variant="warning" title={s.savePersistenceUnavailable}>
          {persistenceWarning}
        </AdminAlert>
      ) : null}

      {themeSanitizedNotice ? (
        <AdminAlert variant="warning">{themeSanitizedNotice}</AdminAlert>
      ) : null}

      <SettingsEditorTabList activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        role="tabpanel"
        id={`settings-domain-panel-${activeTab}`}
        aria-labelledby={`settings-domain-tab-${activeTab}`}
        className="min-w-0 pt-4 pb-28 sm:pt-5 sm:pb-32"
      >
        {panel}
      </div>

      <SettingsSaveBar
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastPersistenceMode={lastPersistenceMode}
        lastPersisted={lastPersisted}
        onSave={handleSave}
      />
    </div>
  )
}
