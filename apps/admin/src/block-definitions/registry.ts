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
    },
    inspectorFields: [
      {
        key: "headline",
        label: "Headline",
        type: "text",
        placeholder: "Enter headline",
      },
      {
        key: "subline",
        label: "Subline",
        type: "text",
        placeholder: "Enter subline",
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
