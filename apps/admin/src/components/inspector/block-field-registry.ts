/**
 * Registry of editable fields for each block type.
 * DEPRECATED: Use getAdminBlockDefinition() from @/block-definitions/registry instead.
 *
 * This file is kept as a compatibility wrapper for the inspector.
 * All field definitions are now in the central block definition registry.
 */

import { getAdminBlockDefinition } from "@/block-definitions/registry"
import type { InspectorFieldDefinition } from "./field-types"

/**
 * Get field definitions for a block type.
 * Returns empty array if block type not in registry.
 */
export function getInspectorFieldsForBlock(blockType: string): InspectorFieldDefinition[] {
  const definition = getAdminBlockDefinition(blockType)
  return definition?.inspectorFields ?? []
}

