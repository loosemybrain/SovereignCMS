import type { ContentTemplateDefinition } from "@sovereign-cms/core"
import type { AdminMessages } from "@/lib/admin-i18n/types"

type LocalizedTemplateCopy = {
  label: string
  description: string
}

export function localizeContentTemplate(
  template: ContentTemplateDefinition,
  messages: AdminMessages,
): LocalizedTemplateCopy {
  const localized = messages.contentTemplates[template.id as keyof AdminMessages["contentTemplates"]]
  if (localized) {
    return localized
  }
  return { label: template.label, description: template.description ?? "" }
}
