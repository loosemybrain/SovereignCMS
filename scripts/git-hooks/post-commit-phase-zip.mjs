/**
 * Post-commit: wenn die letzte Commit-Änderung eine phase-*-result.md betrifft,
 * automatisch npm run sprint:finish für diese Phase (typecheck → lint → build → ZIP).
 *
 * Opt-out: SOVEREIGN_SKIP_PHASE_ZIP=1
 */

import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../..")

const PHASE_RESULT_RE = /^docs\/migration\/phase-(.+)-result\.md$/i

function main() {
  if (process.env.SOVEREIGN_SKIP_PHASE_ZIP === "1") {
    return
  }

  const list = spawnSync("git", ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
  })

  if (list.status !== 0 || !list.stdout) {
    return
  }

  const slugs = new Set()
  for (const line of list.stdout.split(/\r?\n/)) {
    const trimmed = line.trim()
    const match = trimmed.match(PHASE_RESULT_RE)
    if (match) {
      slugs.add(match[1])
    }
  }

  if (slugs.size === 0) {
    return
  }

  if (slugs.size > 1) {
    console.warn(
      "[sovereign:phase-zip] Mehrere phase-*-result.md in einem Commit — übersprungen. Manuell:",
    )
    console.warn("  npm run sprint:finish -- --phase <label>")
    return
  }

  const phase = [...slugs][0]
  console.log(`\n[sovereign:phase-zip] Phase ${phase} erkannt — starte sprint:finish…\n`)

  const result = spawnSync("npm", ["run", "sprint:finish", "--", "--phase", phase], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  if (result.status !== 0) {
    console.error(
      `\n[sovereign:phase-zip] sprint:finish fehlgeschlagen. Beheben und erneut ausführen:\n  npm run sprint:finish -- --phase ${phase}\n`,
    )
    process.exit(result.status ?? 1)
  }
}

main()
