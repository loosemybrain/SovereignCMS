import { CMSLayout } from "@/components/cms/cms-layout"
import { NavigationContent } from "@/components/cms/navigation-content"
import { Topbar, PageHeader } from "@/components/cms/topbar"

export default function FooterNavigationPage() {
  return (
    <CMSLayout tenant="demo">
      <Topbar title="Footer Navigation" />
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6 px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title="Footer Navigation"
            description="Manage footer navigation items by locale"
          />
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            <p>Footer navigation uses the same structure as header navigation.</p>
            <p className="text-sm mt-2">Configure items with scope: footer</p>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}
