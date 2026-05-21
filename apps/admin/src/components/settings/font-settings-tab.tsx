"use client"

import { useState } from "react"
import { Type } from "lucide-react"
import { MAX_WOFF2_FILE_BYTES } from "@sovereign-cms/core"
import { AdminButton, AdminEmptyState, AdminField, AdminInput } from "@/components/admin-ui"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import type { SettingsTabProps } from "@/components/settings/settings-tab-types"
import {
  SettingsInlineHint,
  SettingsNestedItemCard,
  SettingsSectionCard,
} from "@/components/settings/settings-ux-primitives"

function newFontId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID()
  }
  return `font-${Date.now()}`
}

export function FontSettingsTab({ settings, setSettings, isSaving }: SettingsTabProps) {
  const s = useAdminI18n().messages.settingsForm
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  const addFont = () => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        customFonts: [
          ...prev.appearance.customFonts,
          { id: newFontId(), family: "", weight: "400", style: "normal" },
        ],
      },
    }))
  }

  const onWoff2File = (fontId: string, file: File | null) => {
    if (!file) {
      return
    }
    const isWoff2 =
      file.name.toLowerCase().endsWith(".woff2") ||
      file.type === "font/woff2" ||
      file.type === "application/font-woff2"
    if (!isWoff2) {
      setUploadErrors((prev) => ({ ...prev, [fontId]: s.fontUploadWrongType }))
      return
    }
    if (file.size > MAX_WOFF2_FILE_BYTES) {
      setUploadErrors((prev) => ({ ...prev, [fontId]: s.fontUploadTooLarge }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      if (!result.startsWith("data:font/woff2;base64,")) {
        setUploadErrors((prev) => ({ ...prev, [fontId]: s.fontUploadWrongType }))
        return
      }
      setUploadErrors((prev) => {
        const next = { ...prev }
        delete next[fontId]
        return next
      })
      setSettings((prev) => ({
        ...prev,
        appearance: {
          ...prev.appearance,
          customFonts: prev.appearance.customFonts.map((font) =>
            font.id === fontId ? { ...font, woff2DataUrl: result } : font,
          ),
        },
      }))
    }
    reader.onerror = () => {
      setUploadErrors((prev) => ({ ...prev, [fontId]: s.fontUploadFailed }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <SettingsSectionCard title={s.fontTitle} description={s.fontDescription}>
      <SettingsInlineHint>{s.fontPrototypeHint}</SettingsInlineHint>
      <div className="mt-4 space-y-4">
        {settings.appearance.customFonts.length === 0 ? (
          <AdminEmptyState
            title={s.fontEmpty}
            description={s.fontEmptyDescription}
            icon={<Type className="h-7 w-7" strokeWidth={1.75} aria-hidden />}
            className="py-10"
          >
            <AdminButton type="button" variant="secondary" disabled={isSaving} onClick={addFont}>
              {s.addFont}
            </AdminButton>
          </AdminEmptyState>
        ) : (
          settings.appearance.customFonts.map((font) => (
            <SettingsNestedItemCard key={font.id}>
              <div className="flex justify-end">
                <AdminButton
                  type="button"
                  variant="secondary"
                  disabled={isSaving}
                  onClick={() => {
                    setUploadErrors((prev) => {
                      const next = { ...prev }
                      delete next[font.id]
                      return next
                    })
                    setSettings((prev) => ({
                      ...prev,
                      appearance: {
                        ...prev.appearance,
                        customFonts: prev.appearance.customFonts.filter((f) => f.id !== font.id),
                      },
                    }))
                  }}
                >
                  {s.remove}
                </AdminButton>
              </div>
              <AdminField id={`font-family-${font.id}`} label={s.fontFamily}>
                {(fp) => (
                  <AdminInput
                    {...fp}
                    value={font.family}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          customFonts: prev.appearance.customFonts.map((f) =>
                            f.id === font.id ? { ...f, family: e.target.value } : f,
                          ),
                        },
                      }))
                    }
                    disabled={isSaving}
                  />
                )}
              </AdminField>
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id={`font-weight-${font.id}`} label={s.fontWeight}>
                  {(fp) => (
                    <AdminInput
                      {...fp}
                      value={font.weight}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          appearance: {
                            ...prev.appearance,
                            customFonts: prev.appearance.customFonts.map((f) =>
                              f.id === font.id ? { ...f, weight: e.target.value } : f,
                            ),
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  )}
                </AdminField>
                <AdminField id={`font-style-${font.id}`} label={s.fontStyle}>
                  {(fp) => (
                    <AdminInput
                      {...fp}
                      value={font.style}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          appearance: {
                            ...prev.appearance,
                            customFonts: prev.appearance.customFonts.map((f) =>
                              f.id === font.id ? { ...f, style: e.target.value } : f,
                            ),
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  )}
                </AdminField>
              </div>
              <AdminField id={`font-file-${font.id}`} label={s.fontWoff2File}>
                {(fp) => (
                  <div className="space-y-1">
                    <input
                      {...fp}
                      type="file"
                      accept=".woff2,font/woff2"
                      disabled={isSaving}
                      className="block w-full max-w-full text-sm admin-text"
                      onChange={(e) => onWoff2File(font.id, e.target.files?.[0] ?? null)}
                    />
                    {uploadErrors[font.id] ? (
                      <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                        {uploadErrors[font.id]}
                      </p>
                    ) : null}
                    {font.woff2DataUrl ? (
                      <p className="text-xs admin-text-muted">{s.fontUploadSuccess}</p>
                    ) : null}
                  </div>
                )}
              </AdminField>
            </SettingsNestedItemCard>
          ))
        )}
        {settings.appearance.customFonts.length > 0 ? (
          <AdminButton type="button" variant="secondary" disabled={isSaving} onClick={addFont}>
            {s.addFont}
          </AdminButton>
        ) : null}
      </div>
    </SettingsSectionCard>
  )
}
