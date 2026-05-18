import type { PublicFooterViewModel, PublicHeaderViewModel } from "@sovereign-cms/runtime"
import type { ReactNode } from "react"

import { PublicFooter } from "@/components/public-footer"
import { PublicHeader } from "@/components/public-header"

type Props = {
  header: PublicHeaderViewModel
  footer: PublicFooterViewModel
  previewEnabled?: boolean
  children: ReactNode
}

export function PublicLayoutShell({ header, footer, previewEnabled, children }: Props) {
  return (
    <>
      <PublicHeader header={header} previewEnabled={previewEnabled} />
      <main className="pub-main">{children}</main>
      <PublicFooter footer={footer} previewEnabled={previewEnabled} />
    </>
  )
}
