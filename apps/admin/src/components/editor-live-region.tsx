type EditorLiveRegionProps = {
  message: string | null
}

export function EditorLiveRegion({ message }: EditorLiveRegionProps) {
  return (
    <div className="admin-sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}
