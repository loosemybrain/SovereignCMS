"use client"

import { cn } from "@sovereign-cms/ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import {
  SETTINGS_DOMAIN_TABS,
  type SettingsDomainTab,
} from "@/components/settings/settings-domain-tabs"
import { SETTINGS_DOMAIN_TAB_ICONS } from "@/components/settings/settings-domain-tab-icons"

type SettingsEditorTabListProps = {
  activeTab: SettingsDomainTab
  onTabChange: (tab: SettingsDomainTab) => void
}

export function SettingsEditorTabList({ activeTab, onTabChange }: SettingsEditorTabListProps) {
  const d = useAdminI18n().messages.settingsDomains

  const labels: Record<SettingsDomainTab, string> = {
    branding: d.tabBranding,
    appearance: d.tabAppearance,
    navigationLayout: d.tabNavigationLayout,
    socialExternal: d.tabSocialExternal,
    legalGovernance: d.tabLegalGovernance,
    systemRuntime: d.tabSystemRuntime,
  }

  const intros: Record<SettingsDomainTab, string> = {
    branding: d.brandingIntro,
    appearance: d.appearanceIntro,
    navigationLayout: d.navigationLayoutIntro,
    socialExternal: d.socialExternalIntro,
    legalGovernance: d.legalGovernanceIntro,
    systemRuntime: d.systemRuntimeIntro,
  }

  return (
    <div className="min-w-0">
      <div
        className="flex gap-0.5 overflow-x-auto overscroll-x-contain border-b admin-border px-1 pt-1 [-webkit-overflow-scrolling:touch]"
        role="tablist"
        aria-label={d.tabsAriaLabel}
      >
        {SETTINGS_DOMAIN_TABS.map((tab) => {
          const selected = activeTab === tab
          const Icon = SETTINGS_DOMAIN_TAB_ICONS[tab]
          const label = labels[tab]
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`settings-domain-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`settings-domain-panel-${tab}`}
              title={label}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex h-11 min-h-11 shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-2.5 py-2 text-xs font-semibold transition-[color,border-color,background-color] sm:px-3",
                selected
                  ? "border-(--admin-accent) admin-text bg-[color-mix(in_oklab,var(--admin-surface-muted)_35%,var(--admin-surface))]"
                  : "border-transparent admin-text-muted hover:border-[color-mix(in_oklab,var(--admin-border)_70%,var(--admin-accent))] hover:admin-text",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-[color,background-color,border-color] duration-200 sm:h-7 sm:w-7",
                  selected
                    ? "bg-linear-to-br from-sky-500 via-indigo-600 to-violet-700 text-white shadow-sm ring-1 ring-white/10"
                    : "admin-border bg-[color-mix(in_oklab,var(--admin-surface-muted)_82%,var(--admin-surface))] text-[color-mix(in_oklab,var(--admin-accent)_50%,var(--admin-text-muted))]",
                )}
                aria-hidden
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="max-w-[9.5rem] truncate whitespace-nowrap sm:max-w-none">{label}</span>
            </button>
          )
        })}
      </div>
      <p
        className="border-b admin-border px-3 py-2.5 text-xs leading-relaxed admin-text-muted"
        id={`settings-domain-tab-desc-${activeTab}`}
        role="doc-subtitle"
      >
        {intros[activeTab]}
      </p>
    </div>
  )
}
