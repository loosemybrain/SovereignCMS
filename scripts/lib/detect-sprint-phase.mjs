import { promises as fs } from "node:fs"
import path from "node:path"

const PHASE_RESULT_RE = /^phase-(.+)-result\.md$/i

/**
 * Neueste Phase aus docs/migration/phase-*-result.md (mtime).
 * @param {string} repoRoot
 * @returns {Promise<string | null>}
 */
export async function detectSprintPhaseSlug(repoRoot) {
  const migrationDir = path.join(repoRoot, "docs", "migration")
  let entries
  try {
    entries = await fs.readdir(migrationDir, { withFileTypes: true })
  } catch {
    return null
  }

  const candidates = []
  for (const ent of entries) {
    if (!ent.isFile()) continue
    const match = ent.name.match(PHASE_RESULT_RE)
    if (!match) continue
    const fullPath = path.join(migrationDir, ent.name)
    const stat = await fs.stat(fullPath)
    candidates.push({ slug: match[1], mtime: stat.mtimeMs })
  }

  if (candidates.length === 0) return null
  candidates.sort((a, b) => b.mtime - a.mtime)
  return candidates[0].slug
}
