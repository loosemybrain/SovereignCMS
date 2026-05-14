"use client"

import * as React from "react"
import { 
  Plus, Trash2, Building2, Mail, MapPin, Clock, Scale, Share2, 
  Save, Globe, Palette, Phone, ChevronRight
} from "lucide-react"
import { Topbar, PageHeader } from "@/components/cms/topbar"
import { SectionCard, FieldGroup, FormField } from "@/components/cms/section-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface SocialLink {
  id: string
  platform: string
  url: string
}

// Quick nav for settings sections
function SettingsNav({ 
  sections, 
  activeSection 
}: { 
  sections: { id: string; label: string; icon: React.ElementType }[]
  activeSection: string
}) {
  return (
    <nav className="sticky top-0 flex flex-wrap gap-2 pb-4 mb-4 border-b bg-background/80 backdrop-blur-sm z-10">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary",
            activeSection === section.id 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground"
          )}
        >
          <section.icon className="h-4 w-4" />
          {section.label}
        </a>
      ))}
    </nav>
  )
}

// Social link row with animation
function SocialLinkRow({ 
  link, 
  onRemove,
  onChange
}: { 
  link: SocialLink
  onRemove: () => void
  onChange: (field: "platform" | "url", value: string) => void
}) {
  return (
    <div className="group flex gap-3 items-center p-3 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-all duration-200 animate-slide-up">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Share2 className="h-4 w-4" />
      </div>
      <Input
        placeholder="Platform (e.g. Twitter)"
        className="flex-1"
        value={link.platform}
        onChange={(e) => onChange("platform", e.target.value)}
      />
      <Input 
        placeholder="URL" 
        className="flex-1"
        value={link.url}
        onChange={(e) => onChange("url", e.target.value)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function SettingsContent() {
  const [siteName, setSiteName] = React.useState("SovereignCMS Demo")
  const [tagline, setTagline] = React.useState("Modular CMS Foundation")
  const [logoUrl, setLogoUrl] = React.useState("")

  const [email, setEmail] = React.useState("info@example.com")
  const [phone, setPhone] = React.useState("")
  const [address1, setAddress1] = React.useState("")
  const [address2, setAddress2] = React.useState("")
  const [postalCode, setPostalCode] = React.useState("")
  const [city, setCity] = React.useState("Templin")
  const [country, setCountry] = React.useState("Deutschland")

  const [openingHours, setOpeningHours] = React.useState("")
  const [appointmentNote, setAppointmentNote] = React.useState("")

  const [responsibleName, setResponsibleName] = React.useState("")
  const [imprintSlug, setImprintSlug] = React.useState("impressum")
  const [privacySlug, setPrivacySlug] = React.useState("datenschutz")
  const [cookieSlug, setCookieSlug] = React.useState("cookies")

  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([])
  const [hasChanges, setHasChanges] = React.useState(false)

  const sections = [
    { id: "identity", label: "Identity", icon: Building2 },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "business", label: "Business", icon: Clock },
    { id: "legal", label: "Legal", icon: Scale },
    { id: "social", label: "Social", icon: Share2 },
  ]

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      { id: crypto.randomUUID(), platform: "", url: "" },
    ])
    setHasChanges(true)
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id))
    setHasChanges(true)
  }

  const updateSocialLink = (id: string, field: "platform" | "url", value: string) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
    setHasChanges(true)
  }

  return (
    <>
      <Topbar title="Settings" />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          <PageHeader
            title="Settings"
            description="Tenant-wide site configuration"
          />

          {/* Quick Nav */}
          <SettingsNav sections={sections} activeSection="identity" />

          {/* Site Identity */}
          <div id="identity">
            <SectionCard
              title="Site Identity"
              description="Public-facing name and branding"
              headerIcon={<Building2 className="h-5 w-5" />}
              variant="elevated"
            >
              <FieldGroup columns={1}>
                <FormField label="Site name" required>
                  <Input
                    value={siteName}
                    onChange={(e) => { setSiteName(e.target.value); setHasChanges(true) }}
                    className="text-lg font-medium"
                  />
                </FormField>

                <FormField label="Tagline" description="A short description of your site">
                  <Input
                    value={tagline}
                    onChange={(e) => { setTagline(e.target.value); setHasChanges(true) }}
                  />
                </FormField>

                <FormField label="Logo URL" description="URL to your logo image">
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://..."
                      value={logoUrl}
                      onChange={(e) => { setLogoUrl(e.target.value); setHasChanges(true) }}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                </FormField>
              </FieldGroup>
            </SectionCard>
          </div>

          {/* Contact */}
          <div id="contact">
            <SectionCard
              title="Contact Information"
              description="How visitors can reach this tenant"
              headerIcon={<Mail className="h-5 w-5" />}
              variant="elevated"
            >
              <FieldGroup columns={2}>
                <FormField label="Email" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setHasChanges(true) }}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label="Phone">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setHasChanges(true) }}
                      className="pl-10"
                    />
                  </div>
                </FormField>
              </FieldGroup>

              <div className="my-6 border-t" />

              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-4">
                  <FieldGroup columns={1}>
                    <FormField label="Address line 1">
                      <Input
                        value={address1}
                        onChange={(e) => { setAddress1(e.target.value); setHasChanges(true) }}
                      />
                    </FormField>

                    <FormField label="Address line 2">
                      <Input
                        value={address2}
                        onChange={(e) => { setAddress2(e.target.value); setHasChanges(true) }}
                      />
                    </FormField>
                  </FieldGroup>

                  <FieldGroup columns={3}>
                    <FormField label="Postal code">
                      <Input
                        value={postalCode}
                        onChange={(e) => { setPostalCode(e.target.value); setHasChanges(true) }}
                      />
                    </FormField>

                    <FormField label="City">
                      <Input
                        value={city}
                        onChange={(e) => { setCity(e.target.value); setHasChanges(true) }}
                      />
                    </FormField>

                    <FormField label="Country">
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={country}
                          onChange={(e) => { setCountry(e.target.value); setHasChanges(true) }}
                          className="pl-10"
                        />
                      </div>
                    </FormField>
                  </FieldGroup>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Business */}
          <div id="business">
            <SectionCard
              title="Business Information"
              description="Optional details for visitors"
              headerIcon={<Clock className="h-5 w-5" />}
              variant="elevated"
            >
              <FieldGroup columns={1}>
                <FormField label="Opening hours" description="Display format for your opening hours">
                  <Textarea
                    rows={3}
                    placeholder="e.g. Mon-Fri: 9:00 - 17:00"
                    value={openingHours}
                    onChange={(e) => { setOpeningHours(e.target.value); setHasChanges(true) }}
                    className="resize-none"
                  />
                </FormField>

                <FormField label="Appointment note" description="Instructions for booking appointments">
                  <Textarea
                    rows={3}
                    placeholder="e.g. Please book appointments via phone or email"
                    value={appointmentNote}
                    onChange={(e) => { setAppointmentNote(e.target.value); setHasChanges(true) }}
                    className="resize-none"
                  />
                </FormField>
              </FieldGroup>
            </SectionCard>
          </div>

          {/* Legal */}
          <div id="legal">
            <SectionCard
              title="Legal Pages"
              description="Slug references for legal page links"
              headerIcon={<Scale className="h-5 w-5" />}
              variant="elevated"
            >
              <FieldGroup columns={2}>
                <FormField label="Responsible name" description="Legal entity name">
                  <Input
                    value={responsibleName}
                    onChange={(e) => { setResponsibleName(e.target.value); setHasChanges(true) }}
                  />
                </FormField>

                <FormField
                  label="Imprint slug"
                  description="Page slug for imprint/legal notice"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/</span>
                    <Input
                      value={imprintSlug}
                      onChange={(e) => { setImprintSlug(e.target.value); setHasChanges(true) }}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Privacy slug"
                  description="Page slug for privacy policy"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/</span>
                    <Input
                      value={privacySlug}
                      onChange={(e) => { setPrivacySlug(e.target.value); setHasChanges(true) }}
                    />
                  </div>
                </FormField>

                <FormField label="Cookie slug" description="Page slug for cookie policy">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/</span>
                    <Input
                      value={cookieSlug}
                      onChange={(e) => { setCookieSlug(e.target.value); setHasChanges(true) }}
                    />
                  </div>
                </FormField>
              </FieldGroup>
            </SectionCard>
          </div>

          {/* Social Links */}
          <div id="social">
            <SectionCard
              title="Social Links"
              description="Links displayed in the public footer"
              headerIcon={<Share2 className="h-5 w-5" />}
              variant="elevated"
            >
              <div className="space-y-4">
                {socialLinks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                      <Share2 className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      No social links configured yet
                    </p>
                    <Button variant="outline" size="sm" onClick={addSocialLink} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add your first social link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialLinks.map((link) => (
                      <SocialLinkRow
                        key={link.id}
                        link={link}
                        onRemove={() => removeSocialLink(link.id)}
                        onChange={(field, value) => updateSocialLink(link.id, field, value)}
                      />
                    ))}
                    <Button variant="outline" size="sm" onClick={addSocialLink} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add another link
                    </Button>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Save Button - Sticky */}
          <div className={cn(
            "sticky bottom-6 flex justify-end pt-4 transition-all duration-300",
            hasChanges ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}>
            <Button size="lg" className="gap-2 shadow-lg" onClick={() => setHasChanges(false)}>
              <Save className="h-4 w-4" />
              Save settings
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
