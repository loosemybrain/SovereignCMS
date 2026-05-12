"use client"

import { useState } from "react"

export function useEditorAnnouncements() {
  const [message, setMessage] = useState<string | null>(null)

  const announce = (nextMessage: string) => {
    setMessage(nextMessage)
  }

  const clear = () => {
    setMessage(null)
  }

  return {
    message,
    announce,
    clear,
  }
}
