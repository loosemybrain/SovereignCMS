import { CMSLayout } from "@/components/cms/cms-layout"
import { DashboardContent } from "@/components/cms/dashboard-content"

export default function DashboardPage() {
  return (
    <CMSLayout tenant="demo">
      <DashboardContent
        tenant="demo"
        stats={{
          pagesCurrentLocale: 1,
          pageVariants: 2,
          logicalPages: 1,
          blocks: 2,
          database: "memory",
        }}
        config={{
          dbAdapter: "memory",
          storage: "memory",
          auth: "none",
          environment: "local",
          defaultLocale: "de",
          supportedLocales: "de",
        }}
      />
    </CMSLayout>
  )
}
