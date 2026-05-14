import { CMSLayout } from "@/components/cms/cms-layout"
import { MediaContent } from "@/components/cms/media-content"

export default function MediaPage() {
  return (
    <CMSLayout tenant="demo">
      <MediaContent />
    </CMSLayout>
  )
}
