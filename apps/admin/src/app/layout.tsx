import "./globals.css"

export const metadata = {
  title: "SovereignCMS Admin",
  description: "Modular multi-tenant CMS foundation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
