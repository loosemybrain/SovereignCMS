"use client"

import type { SettingsPersistenceMode } from "@sovereign-cms/core"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsRuntimeFeedback } from "@/components/settings/settings-tab-types"
import {
  SettingsInlineHint,
  SettingsSectionCard,
  SettingsTabPanel,
} from "@/components/settings/settings-ux-primitives"

type SystemRuntimeSettingsTabProps = SettingsRuntimeFeedback

function persistenceModeLabel(
  mode: SettingsPersistenceMode | null,
  labels: {
    memory: string
    database: string
    unavailable: string
    unknown: string
  },
): string {
  if (mode === "memory") return labels.memory
  if (mode === "database") return labels.database
  if (mode === "unavailable") return labels.unavailable
  return labels.unknown
}

export function SystemRuntimeSettingsTab({
  persistenceMode,
  persisted,
  persistenceWarning,
  successMessage,
  themeSanitizedNotice,
}: SystemRuntimeSettingsTabProps) {
  const d = useAdminI18n().messages.settingsDomains
  const s = useAdminI18n().messages.settingsForm

  const modeText = persistenceModeLabel(persistenceMode, {
    memory: d.persistenceMemory,
    database: d.persistenceDatabase,
    unavailable: d.persistenceUnavailable,
    unknown: d.persistenceUnknown,
  })

  const persistedText =
    persisted === true
      ? d.persistedYes
      : persisted === false
        ? d.persistedNo
        : d.persistedUnknown

  return (
    <SettingsTabPanel>
      <SettingsSectionCard title={d.persistenceStatusTitle} description={d.persistenceStatusDescription}>
        <SettingsInlineHint>{s.persistenceStatusGuidance}</SettingsInlineHint>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div className="min-w-0 rounded-lg border admin-border px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-wide admin-text-muted">
              {d.persistenceModeLabel}
            </dt>
            <dd className="mt-1 font-medium admin-text">{modeText}</dd>
          </div>
          <div className="min-w-0 rounded-lg border admin-border px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-wide admin-text-muted">
              {d.persistedLabel}
            </dt>
            <dd className="mt-1 font-medium admin-text">{persistedText}</dd>
          </div>
        </dl>
        {persistenceWarning ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-200" role="status">
            {persistenceWarning}
          </p>
        ) : null}
        {successMessage ? (
          <p className="mt-4 text-sm text-green-800 dark:text-green-200" role="status">
            {successMessage}
          </p>
        ) : null}
        {themeSanitizedNotice ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-200" role="status">
            {themeSanitizedNotice}
          </p>
        ) : null}
      </SettingsSectionCard>

      <SettingsSectionCard title={d.fontPrototypeTitle} description={d.fontPrototypeDescription}>
        <SettingsInlineHint>{s.fontPrototypeHint}</SettingsInlineHint>
      </SettingsSectionCard>

      <SettingsSectionCard title={d.runtimeNotesTitle} description={d.runtimeNotesDescription}>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed admin-text-muted">
          <li>{d.runtimeNoteTenantScope}</li>
          <li>{d.runtimeNoteSanitizer}</li>
          <li>{d.runtimeNoteNoLowLevel}</li>
        </ul>
      </SettingsSectionCard>
    </SettingsTabPanel>
  )
}
