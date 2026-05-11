import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ConsentProvider } from "@/components/consent-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "SovereignCMS — Website",
  description: "Öffentlicher Renderer (Phase 1)",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ConsentProvider>{children}</ConsentProvider>
      </body>
    </html>
  )
}
