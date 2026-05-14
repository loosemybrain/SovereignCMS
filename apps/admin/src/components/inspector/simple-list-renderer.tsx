"use client"

import { useCallback } from "react"
import type { InspectorFieldDefinition, SimpleListItem } from "@/components/inspector/field-types"
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "@/components/admin-ui"

type Props = {
  field: InspectorFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  id?: string
  describedBy?: string
  invalid?: boolean
  error?: string | null
}

/**
 * Safe normalization of items array.
 * Ensures each item has required id and title.
 */
function normalizeItems(value: unknown): SimpleListItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  const items: SimpleListItem[] = []

  for (const item of value) {
    if (typeof item !== "object" || !item) {
      continue
    }

    const itemRecord = item as Record<string, unknown>
    const id = typeof itemRecord.id === "string" && itemRecord.id.trim() ? itemRecord.id : null
    const title = typeof itemRecord.title === "string" && itemRecord.title.trim() ? itemRecord.title : null
    const body = typeof itemRecord.body === "string" ? itemRecord.body : undefined

    // Only keep items with non-empty id and title
    if (id && title) {
      items.push({ id, title, body: body || undefined })
    }
  }

  return items
}

/**
 * Generate a stable ID for a new item.
 * Uses crypto.randomUUID if available, falls back to Date.now() + random.
 */
function generateItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function SimpleListRenderer({
  field,
  value,
  onChange,
  id,
  describedBy,
  invalid,
  error,
}: Props) {
  const fieldId = id ?? `inspector-field-${field.key}`
  const items = normalizeItems(value)
  const minItems = field.minItems ?? 0
  const maxItems = field.maxItems ?? Infinity

  const canAddItem = items.length < maxItems
  const canRemoveItem = items.length > minItems

  const handleAddItem = useCallback(() => {
    if (!canAddItem) return

    const newItem: SimpleListItem = {
      id: generateItemId(),
      title: "New Item",
      body: "",
    }

    onChange([...items, newItem])
  }, [items, canAddItem, onChange])

  const handleUpdateItem = useCallback(
    (index: number, updates: Partial<SimpleListItem>) => {
      const updated = items.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      )
      onChange(updated)
    },
    [items, onChange]
  )

  const handleRemoveItem = useCallback(
    (index: number) => {
      if (!canRemoveItem) return

      const updated = items.filter((_, i) => i !== index)
      onChange(updated)
    },
    [items, canRemoveItem, onChange]
  )

  return (
    <AdminField
      id={fieldId}
      label={field.label}
      description={field.description}
      error={error}
    >
      {(fieldProps) => (
        <div
          aria-describedby={describedBy ?? fieldProps["aria-describedby"]}
          aria-invalid={invalid || fieldProps["aria-invalid"] || undefined}
          className="mt-2 space-y-3"
        >
          {items.length === 0 ? (
            <p className="text-xs italic admin-text-muted">No items yet</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <fieldset
                  key={item.id}
                  className="space-y-2 rounded-lg border admin-border admin-surface-muted p-3 shadow-sm"
                >
                  <legend className="text-xs font-semibold admin-text">Item {index + 1}</legend>

                  <div>
                    <label
                      htmlFor={`${fieldId}-item-${index}-title`}
                      className="block text-xs font-medium admin-text"
                    >
                      Title
                    </label>
                    <AdminInput
                      id={`${fieldId}-item-${index}-title`}
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(index, { title: e.target.value })}
                      placeholder="Item title"
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${fieldId}-item-${index}-body`}
                      className="block text-xs font-medium admin-text"
                    >
                      Description (optional)
                    </label>
                    <AdminTextarea
                      id={`${fieldId}-item-${index}-body`}
                      value={item.body ?? ""}
                      onChange={(e) => handleUpdateItem(index, { body: e.target.value })}
                      placeholder="Item description"
                      rows={2}
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <AdminButton
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveItem(index)}
                      disabled={!canRemoveItem}
                      aria-label={`Remove item ${index + 1}`}
                      className="px-2 py-1 text-xs"
                    >
                      Remove
                    </AdminButton>
                  </div>
                </fieldset>
              ))}
            </div>
          )}

          <AdminButton
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            disabled={!canAddItem}
            aria-label="Add new item"
            className="text-xs"
          >
            + Add Item
          </AdminButton>

          {minItems > 0 && items.length < minItems && (
            <p className="text-xs admin-warning">At least {minItems} item{minItems !== 1 ? "s" : ""} required.</p>
          )}

          {maxItems !== Infinity && items.length >= maxItems && (
            <p className="text-xs admin-warning">
              Maximum {maxItems} item{maxItems !== 1 ? "s" : ""} allowed.
            </p>
          )}
        </div>
      )}
    </AdminField>
  )
}
