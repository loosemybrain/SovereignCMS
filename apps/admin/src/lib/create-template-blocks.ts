import type { CmsBlock, ContentTemplateDefinition } from "@sovereign-cms/core"

function cloneProps(input: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(input)) as Record<string, unknown>
}

function generateBlockId(index: number): string {
  const random = Math.random().toString(36).slice(2, 9)
  return `template-block-${Date.now()}-${index + 1}-${random}`
}

export function createTemplateBlocks(template: ContentTemplateDefinition): CmsBlock[] {
  return template.blocks
    .map((block, index) => {
      const now = new Date().toISOString()
      return {
        ...block,
        id: generateBlockId(index),
        sortOrder: index + 1,
        props: cloneProps(block.props),
        createdAt: now,
        updatedAt: now,
      }
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((block, index) => ({
      ...block,
      sortOrder: index + 1,
    }))
}
