/**
 * Type definitions for the centralized block definition registry.
 * Combines metadata, inspector fields, and admin renderer for each block type.
 */

import type { InspectorFieldDefinition } from "@/components/inspector/field-types"
import type { AdminBlockRenderer } from "@/components/block-renderers/types"
import type { FieldGroupDefinition } from "@sovereign-cms/core"

/**
 * Comprehensive definition for a block type.
 * Consolidates:
 * - type identifier
 * - human-readable label
 * - category for grouping
 * - default props for new blocks
 * - inspector field definitions
 * - admin preview renderer
 */
export type AdminBlockDefinition = {
  /** Block type identifier (must match block.type) */
  type: string
  /** Human-readable label for UI */
  label: string
  /** Category for grouping in future UI */
  category: string
  /** Default props for new instances of this block */
  defaultProps: Record<string, unknown>
  /** Optional field groups for inspector structure */
  fieldGroups?: FieldGroupDefinition[]
  /** Inspector fields for editing this block type */
  inspectorFields: InspectorFieldDefinition[]
  /** Function to render this block in admin preview */
  adminRenderer: AdminBlockRenderer
}

/**
 * Registry mapping block types to their definitions.
 * Single source of truth for block metadata.
 */
export type AdminBlockRegistry = Record<string, AdminBlockDefinition>
