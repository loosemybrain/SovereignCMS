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
    fieldGroups: [
      {
        id: "content",
        label: "Content",
      },
      {
        id: "media",
        label: "Media",
      },
      {
        id: "appearance",
        label: "Appearance",
        description: "Optional appearance settings and helper fields.",
      },
    ],
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
        groupId: "content",
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
        groupId: "content",
        description: "Secondary text below the headline.",
        placeholder: "Enter subline",
      },
      {
        key: "mediaAssetId",
        label: "Hero Image",
        type: "media",
        groupId: "media",
        description: "Select an image asset for the hero block.",
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
        placeholder: "Enter text content",
      },
    ],
    adminRenderer: TextAdminRenderer,
  },

  "contact-form": {
    type: "contact-form",
    label: "Contact Form",
    category: "Forms",
    fieldGroups: [
      {
        id: "content",
        label: "Content",
      },
      {
        id: "behavior",
        label: "Behavior",
      },
      {
        id: "privacy",
        label: "Privacy & Consent",
        description: "Consent and privacy-related settings.",
      },
    ],
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
        groupId: "content",
        description: "Form title displayed to the user.",
        placeholder: "Get in Touch",
      },
      {
        key: "intro",
        label: "Intro Text",
        type: "textarea",
        groupId: "content",
        description: "Introductory text above the form.",
        placeholder: "Send us a message.",
      },
      {
        key: "submitLabel",
        label: "Submit Button Label",
        type: "text",
        groupId: "behavior",
        description: "Text displayed on the submit button.",
        placeholder: "Send Message",
      },
      {
        key: "successMessage",
        label: "Success Message",
        type: "textarea",
        groupId: "behavior",
        description: "Message shown after successful submission.",
        placeholder: "Thank you for your message.",
      },
      {
        key: "consentLabel",
        label: "Consent Text",
        type: "textarea",
        groupId: "privacy",
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
        key: "recipientEmail",
        label: "Recipient Email",
        type: "text",
        groupId: "behavior",
        description: "Optional. If blank, uses tenant contact email from settings.",
        placeholder: "leave blank to use tenant settings",
      },
    ],
    adminRenderer: ContactFormAdminRenderer,
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
