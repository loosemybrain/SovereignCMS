import type { BlockInstance } from "@sovereign-cms/core"

export function PublicBlockRenderer({ block }: { block: BlockInstance }) {
  switch (block.type) {
    case "hero": {
      const headline = String(block.props.headline ?? "")
      const subline =
        block.props.subline !== undefined && block.props.subline !== null
          ? String(block.props.subline)
          : undefined
      return (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{headline}</h1>
          {subline ? <p className="mt-2 text-gray-600">{subline}</p> : null}
        </section>
      )
    }
    case "text": {
      const body = String(block.props.body ?? "")
      return <p className="text-base leading-relaxed text-gray-700">{body}</p>
    }
    default:
      return null
  }
}
