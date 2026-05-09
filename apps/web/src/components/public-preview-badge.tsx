type Props = {
  previewEnabled: boolean
}

export function PublicPreviewBadge({ previewEnabled }: Props) {
  if (!previewEnabled) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-amber-500 text-amber-950 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
        Preview Mode
      </div>
    </div>
  )
}
