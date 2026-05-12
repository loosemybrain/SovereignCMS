export function getDescribedBy(
  ids: Array<string | undefined | null | false>,
): string | undefined {
  const value = ids.filter(Boolean).join(" ")
  return value.length > 0 ? value : undefined
}

export function createFieldIds(baseId: string) {
  return {
    inputId: baseId,
    descriptionId: `${baseId}-description`,
    errorId: `${baseId}-error`,
  }
}
