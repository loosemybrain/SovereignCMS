import type { ReactNode } from "react"
import { InspectorSection } from "./inspector-section"

type FieldGroupPanelProps = {
  title: string
  description?: string
  children: ReactNode
}

export function FieldGroupPanel({ title, description, children }: FieldGroupPanelProps) {
  return (
    <InspectorSection title={title} description={description}>
      {children}
    </InspectorSection>
  )
}
