/**
 * Central registry of all block type definitions.
 * Combines metadata, inspector fields, and renderers for each block type.
 *
 * To add a new block type:
 * 1. Create adminRenderer component in block-renderers/
 * 2. Define inspectorFields
 * 3. Add entry to adminBlockDefinitions
 */

import type { AdminBlockDefinition, AdminBlockRegistry } from "./types"
import { HeroAdminRenderer } from "@/components/block-renderers/hero-renderer"
import { TextAdminRenderer } from "@/components/block-renderers/text-renderer"
import { ContactFormAdminRenderer } from "@/components/block-renderers/contact-form-renderer"
import { ExternalEmbedAdminRenderer } from "@/components/block-renderers/external-embed-renderer"
import { CtaAdminRenderer } from "@/components/block-renderers/cta-renderer"
import { FeatureGridAdminRenderer } from "@/components/block-renderers/feature-grid-renderer"
import { ImageTextAdminRenderer } from "@/components/block-renderers/image-text-renderer"

/**
 * Centralized registry of all block type definitions.
 * Each entry contains:
 * - type, label, category
 * - defaultProps for new blocks
 * - inspectorFields for editing
 * - adminRenderer for preview
 */
export const adminBlockDefinitions: AdminBlockRegistry = {
  hero: {
    type: "hero",
    label: "Hero",
    category: "Content",
    defaultProps: {
      headline: "New Headline",
      subline: "New Subline",
      mediaAssetId: null,
      mediaUrl: "",
      mediaAlt: "",
    },
    inspectorFields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        section: "content",
        description: "Main heading shown in the hero block.",
        placeholder: "Enter headline",
        validations: [
          {
            type: "required",
            message: "Headline is required.",
          },
          {
            type: "minLength",
            value: 3,
            message: "Headline must be at least 3 characters.",
          },
        ],
      },
      {
        key: "subline",
        label: "Subline",
        type: "text",
        section: "content",
        description: "Secondary text below the headline.",
        placeholder: "Enter subline",
      },
      {
        key: "mediaAssetId",
        label: "Hero Image",
        type: "media",
        section: "media",
        description:
          "Medien-Asset für den Hero wählen. URL und Alt werden aus dem Eintrag übernommen; öffentliche Ausgabe nutzt nur sichere, normalisierte Bild-URLs (siehe Governance-Dokumentation).",
        mediaType: "image",
      },
    ],
    adminRenderer: HeroAdminRenderer,
  },

  text: {
    type: "text",
    label: "Text",
    category: "Content",
    defaultProps: {
      body: "New Text",
    },
    inspectorFields: [
      {
        key: "body",
        label: "Body",
        type: "textarea",
        section: "content",
        placeholder: "Enter text content",
      },
    ],
    adminRenderer: TextAdminRenderer,
  },

  "contact-form": {
    type: "contact-form",
    label: "Contact Form",
    category: "Forms",
    defaultProps: {
      headline: "Get in Touch",
      intro: "Send us a message.",
      submitLabel: "Send Message",
      successMessage: "Thank you for your message. We'll get back to you soon.",
      consentLabel: "I consent to processing my information to handle my inquiry.",
      recipientEmail: "",
    },
    inspectorFields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        section: "content",
        description: "Form title displayed to the user.",
        placeholder: "Get in Touch",
      },
      {
        key: "intro",
        label: "Intro Text",
        type: "textarea",
        section: "content",
        description: "Introductory text above the form.",
        placeholder: "Send us a message.",
      },
      {
        key: "consentLabel",
        label: "Consent Text",
        type: "textarea",
        section: "content",
        description: "Consent checkbox label (required by law).",
        placeholder: "I consent to processing my information...",
        validations: [
          {
            type: "required",
            message: "Consent text is required.",
          },
        ],
      },
      {
        key: "successMessage",
        label: "Success Message",
        type: "textarea",
        section: "content",
        description: "Message shown after successful submission.",
        placeholder: "Thank you for your message.",
      },
      {
        key: "submitLabel",
        label: "Submit Button Label",
        type: "text",
        section: "actions",
        description: "Text displayed on the submit button.",
        placeholder: "Send Message",
      },
      {
        key: "recipientEmail",
        label: "Recipient Email",
        type: "text",
        section: "advanced",
        description: "Optional. If blank, uses tenant contact email from settings.",
        placeholder: "leave blank to use tenant settings",
      },
    ],
    adminRenderer: ContactFormAdminRenderer,
  },

  "external-embed": {
    type: "external-embed",
    label: "External Embed",
    category: "External Media",
    defaultProps: {
      provider: "google-maps",
      title: "Google Maps",
      embedUrl: "",
      consentText: "Zum Anzeigen dieser externen Karte ist Ihre Zustimmung erforderlich.",
      buttonLabel: "Externe Karte laden",
    },
    inspectorFields: [
      {
        key: "provider",
        label: "Provider",
        type: "text",
        section: "content",
        description: "External media provider (google-maps or generic).",
        placeholder: "google-maps",
        validations: [
          {
            type: "required",
            message: "Provider is required.",
          },
        ],
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        section: "content",
        description: "Display title for the embedded content.",
        placeholder: "Google Maps",
        validations: [
          {
            type: "required",
            message: "Title is required.",
          },
        ],
      },
      {
        key: "consentText",
        label: "Consent Message",
        type: "textarea",
        section: "content",
        description: "Text explaining why consent is needed.",
        placeholder: "Zum Anzeigen dieser externen Karte ist Ihre Zustimmung erforderlich.",
      },
      {
        key: "embedUrl",
        label: "Embed URL",
        type: "text",
        section: "media",
        description: "Full HTTPS URL to the embedded content (e.g., Google Maps iframe src).",
        placeholder: "https://www.google.com/maps/embed?pb=...",
        validations: [
          {
            type: "required",
            message: "Embed URL is required.",
          },
        ],
      },
      {
        key: "buttonLabel",
        label: "Button Label",
        type: "text",
        section: "actions",
        description: "Text displayed on the consent button.",
        placeholder: "Externe Karte laden",
      },
    ],
    adminRenderer: ExternalEmbedAdminRenderer,
  },

  cta: {
    type: "cta",
    label: "CTA",
    category: "Content",
    defaultProps: {
      eyebrow: "Next Step",
      headline: "Ready to move forward?",
      body: "Add a clear call to action for this section.",
      primaryLabel: "Get started",
      primaryHref: "#",
      secondaryLabel: "",
      secondaryHref: "",
      align: "center",
    },
    inspectorFields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        section: "content",
        description: "Small text above the headline.",
        placeholder: "Next Step",
      },
      {
        key: "headline",
        label: "Headline",
        type: "text",
        section: "content",
        description: "Main heading for the CTA section.",
        placeholder: "Ready to move forward?",
        validations: [
          {
            type: "required",
            message: "Headline is required.",
          },
        ],
      },
      {
        key: "body",
        label: "Body",
        type: "textarea",
        section: "content",
        description: "Supporting text for the CTA.",
        placeholder: "Add a clear call to action for this section.",
      },
      {
        key: "primaryLabel",
        label: "Primary Button Label",
        type: "text",
        section: "actions",
        description: "Text for the primary action button.",
        placeholder: "Get started",
      },
      {
        key: "primaryHref",
        label: "Primary Button URL",
        type: "text",
        section: "actions",
        description: "Link target for the primary button.",
        placeholder: "#",
      },
      {
        key: "secondaryLabel",
        label: "Secondary Button Label",
        type: "text",
        section: "actions",
        description: "Text for the secondary action button (optional).",
        placeholder: "",
      },
      {
        key: "secondaryHref",
        label: "Secondary Button URL",
        type: "text",
        section: "actions",
        description: "Link target for the secondary button.",
        placeholder: "",
      },
      {
        key: "align",
        label: "Alignment",
        type: "select",
        section: "layout",
        description: "Horizontal alignment of content.",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
    ],
    adminRenderer: CtaAdminRenderer,
  },

  "feature-grid": {
    type: "feature-grid",
    label: "Feature Grid",
    category: "Content",
    defaultProps: {
      headline: "Feature Grid",
      intro: "Highlight important benefits or content areas.",
      columns: "3",
      items: [
        { id: "feature-1", title: "Feature one", body: "Describe the first feature." },
        { id: "feature-2", title: "Feature two", body: "Describe the second feature." },
        { id: "feature-3", title: "Feature three", body: "Describe the third feature." },
      ],
    },
    inspectorFields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        section: "content",
        description: "Main heading for the grid.",
        placeholder: "Feature Grid",
      },
      {
        key: "intro",
        label: "Intro Text",
        type: "textarea",
        section: "content",
        description: "Introductory text above the features.",
        placeholder: "Highlight important benefits or content areas.",
      },
      {
        key: "items",
        label: "Items",
        type: "simple-list",
        section: "content",
        description: "Add, edit, or remove grid items.",
        minItems: 0,
        maxItems: 20,
      },
      {
        key: "columns",
        label: "Number of Columns",
        type: "select",
        section: "layout",
        description: "How many columns to display.",
        options: [
          { label: "2 Columns", value: "2" },
          { label: "3 Columns", value: "3" },
          { label: "4 Columns", value: "4" },
        ],
      },
    ],
    adminRenderer: FeatureGridAdminRenderer,
  },

  "image-text": {
    type: "image-text",
    label: "Image + Text",
    category: "Content",
    defaultProps: {
      headline: "Image and Text",
      body: "Combine a visual with supporting content.",
      imageUrl: "",
      imageAlt: "",
      imagePosition: "right",
      ctaLabel: "",
      ctaHref: "",
    },
    inspectorFields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        section: "content",
        description: "Heading for the section.",
        placeholder: "Image and Text",
      },
      {
        key: "body",
        label: "Body Text",
        type: "textarea",
        section: "content",
        description: "Supporting text content.",
        placeholder: "Combine a visual with supporting content.",
      },
      {
        key: "imageUrl",
        label: "Image URL",
        type: "text",
        section: "media",
        description:
          "Erlaubt: interner Pfad ab / (z. B. /images/foto.jpg) oder externe https://-URL. Nicht erlaubt: http://, data:, javascript:, vbscript:. Später: Verknüpfung über Medien-Assets (mediaAssetId) — noch ohne Upload-Pipeline.",
        placeholder: "/images/beispiel.jpg oder https://…",
      },
      {
        key: "imageAlt",
        label: "Image Alt Text",
        type: "text",
        section: "media",
        description:
          "Kurzer Alternativtext für barrierefreie Darstellung — bei darstellbarem Bild empfohlen bzw. in der Prüfung hervorgehoben.",
        placeholder: "Beschreibender Alternativtext",
      },
      {
        key: "ctaLabel",
        label: "CTA Button Label",
        type: "text",
        section: "actions",
        description: "Text for the call-to-action button (optional).",
        placeholder: "",
      },
      {
        key: "ctaHref",
        label: "CTA Button URL",
        type: "text",
        section: "actions",
        description: "Link target for the CTA button.",
        placeholder: "",
      },
      {
        key: "imagePosition",
        label: "Image Position",
        type: "select",
        section: "layout",
        description: "Where the image appears relative to text.",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
    ],
    adminRenderer: ImageTextAdminRenderer,
  },
}

/**
 * Get definition for a specific block type.
 * Returns null if block type not found in registry.
 */
export function getAdminBlockDefinition(type: string): AdminBlockDefinition | null {
  return adminBlockDefinitions[type] ?? null
}

/**
 * Get all block definitions.
 * Useful for listing available block types, metadata, etc.
 */
export function listAdminBlockDefinitions(): AdminBlockDefinition[] {
  return Object.values(adminBlockDefinitions)
}
