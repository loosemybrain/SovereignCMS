/**
 * Injects sanitized tenant appearance CSS (theme tokens, prototype fonts, spinner vars).
 * Values are sanitized in @sovereign-cms/core before reaching this component.
 */
export function PublicTenantAppearanceStyles({ css }: { css: string }) {
  if (!css) {
    return null
  }
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
