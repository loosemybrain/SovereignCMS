import { CMSLayout } from "@/components/cms/cms-layout"
import { PrivacyContent } from "@/components/cms/privacy-content"

export default function PrivacyPage() {
  return (
    <CMSLayout tenant="demo">
      <PrivacyContent />
    </CMSLayout>
  )
}
