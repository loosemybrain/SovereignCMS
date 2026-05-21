/**
 * Installiert optionalen post-commit Hook für automatische Phasen-ZIPs.
 *
 *   npm run hooks:install
 *   npm run hooks:uninstall
 */

import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const HOOKS_DIR = path.join(ROOT, ".git", "hooks")
const MARKER = "# sovereign-cms-phase-zip-hook"

const POST_COMMIT_BODY = `#!/bin/sh
${MARKER}
node "scripts/git-hooks/post-commit-phase-zip.mjs"
`

async function install() {
  await fs.mkdir(HOOKS_DIR, { recursive: true })
  const hookPath = path.join(HOOKS_DIR, "post-commit")

  let existing = ""
  try {
    existing = await fs.readFile(hookPath, "utf8")
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code !== "ENOENT") {
      throw err
    }
  }

  if (existing.includes(MARKER)) {
    console.log("Hook bereits installiert:", hookPath)
    return
  }

  const merged = existing.trim().length > 0 ? `${existing.trimEnd()}\n\n${POST_COMMIT_BODY}` : POST_COMMIT_BODY
  await fs.writeFile(hookPath, merged, { mode: 0o755 })
  console.log("post-commit Hook installiert:", hookPath)
  console.log("Nach Commit mit docs/migration/phase-<label>-result.md → sprint:finish + ZIP")
  console.log("Opt-out einmalig: SOVEREIGN_SKIP_PHASE_ZIP=1 git commit ...")
}

async function uninstall() {
  const hookPath = path.join(HOOKS_DIR, "post-commit")
  let existing = ""
  try {
    existing = await fs.readFile(hookPath, "utf8")
  } catch {
    console.log("Kein post-commit Hook vorhanden.")
    return
  }

  if (!existing.includes(MARKER)) {
    console.log("Kein SovereignCMS Phase-ZIP Hook in post-commit gefunden.")
    return
  }

  const cleaned = existing
    .split("\n")
    .filter((line) => !line.includes(MARKER) && line.trim() !== 'node "scripts/git-hooks/post-commit-phase-zip.mjs"')
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()

  if (cleaned.length === 0) {
    await fs.unlink(hookPath)
    console.log("post-commit Hook entfernt.")
  } else {
    await fs.writeFile(hookPath, `${cleaned}\n`, { mode: 0o755 })
    console.log("SovereignCMS-Anteil aus post-commit entfernt.")
  }
}

const cmd = process.argv[2] === "uninstall" ? uninstall : install
cmd().catch((err) => {
  console.error(err)
  process.exit(1)
})
