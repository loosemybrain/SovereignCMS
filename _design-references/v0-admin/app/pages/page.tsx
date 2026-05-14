import { CMSLayout } from "@/components/cms/cms-layout"
import { PagesContent } from "@/components/cms/pages-content"

export default function PagesPage() {
  return (
    <CMSLayout tenant="demo">
      <PagesContent />
    </CMSLayout>
  )
}
