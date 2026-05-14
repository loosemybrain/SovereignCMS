import { CMSLayout } from "@/components/cms/cms-layout"
import { NavigationContent } from "@/components/cms/navigation-content"

export default function NavigationPage() {
  return (
    <CMSLayout tenant="demo">
      <NavigationContent />
    </CMSLayout>
  )
}
