import type { SocialLink } from "@sovereign-cms/core"

export type PublicFooterLink = {
  label: string
  href: string
}

export type PublicFooterViewModel = {
  siteName: string
  tagline: string
  contact: {
    email: string
    phone: string
    address: string
  }
  legalLinks: PublicFooterLink[]
  navigationLinks: PublicFooterLink[]
  socialLinks: SocialLink[]
  year: number
}
