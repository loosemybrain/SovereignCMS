import { CMSLayout } from "@/components/cms/cms-layout"
import { SettingsContent } from "@/components/cms/settings-content"

export default function SettingsPage() {
  return (
    <CMSLayout tenant="demo">
      <SettingsContent />
    </CMSLayout>
  )
}
