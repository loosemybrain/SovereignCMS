export type PublicHeaderNavigationLink = {
  label: string
  href: string
  active: boolean
}

export type PublicHeaderLocaleLink = {
  locale: string
  href: string
  active: boolean
}

export type PublicHeaderViewModel = {
  siteName: string
  tagline: string

  logoUrl?: string

  navigationLinks: PublicHeaderNavigationLink[]

  localeLinks: PublicHeaderLocaleLink[]
}
