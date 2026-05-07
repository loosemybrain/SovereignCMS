"use client"

import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/**
 * Wrapper Accordion für mehrere ColorGroup Items.
 * Ermöglicht: nur ein Item offen, space-y-2 zwischen Items
 */
export function ColorGroupAccordion({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-2"
    >
      {children}
    </Accordion>
  )
}

interface ColorGroupProps {
  /** Group title (e.g., "Grundfarben", "CTA Button", "Badge") */
  title: string
  /** Color fields / children */
  children: React.ReactNode
  /** Optional: first color value for preview badge */
  previewColor?: string
}

/**
 * Einzelne Farbgruppe im Accordion.
 * Standardmäßig collapsed, mit einheitlichem Spacing.
 */
export function ColorGroup({ title, children, previewColor }: ColorGroupProps) {
  return (
    <AccordionItem
      value={title}
      className="rounded-lg border border-border/60 bg-background/70 px-3 shadow-sm"
    >
      <AccordionTrigger
        className="w-full min-h-9 py-2 px-0 text-xs font-medium hover:no-underline hover:bg-muted/50 transition-colors -mx-3"
      >
        <div className="flex items-center gap-2 flex-1 px-3">
          <span>{title}</span>
          {previewColor && (
            <div
              className="w-4 h-4 rounded border border-border/50"
              style={{ backgroundColor: previewColor || "transparent" }}
              title={previewColor}
            />
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-1 pb-4 pt-2 space-y-3">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
