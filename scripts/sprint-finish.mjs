/**
 * Sprint-Abschluss: Validierung (typecheck, lint, build) + Phasen-ZIPs.
 *
 *   npm run sprint:finish
 *   npm run sprint:finish -- --phase 61
 *   npm run sprint:finish -- --skip-validate
 *
 * Phase ohne --phase: neueste docs/migration/phase-*-result.md (mtime).
 */

import { spawnSync } from "node:child_process"
import path from "node:path"
import { detectSprintPhaseSlug } from "./lib/detect-sprint-phase.mjs"

const ROOT = process.cwd()

function parseArgs(argv) {
  let phaseLabel = process.env.SPRINT_PHASE?.trim() || null
  let skipValidate = false
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--phase" && argv[i + 1]) {
      phaseLabel = argv[++i]
    } else if (argv[i] === "--skip-validate") {
      skipValidate = true
    }
  }
  return { phaseLabel, skipValidate }
}

function runStep(label, command, args) {
  console.log(`\n▶ ${label}…`)
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) {
    console.error(`\n✗ ${label} fehlgeschlagen (Exit ${result.status}). ZIP wird nicht erstellt.`)
    process.exit(result.status ?? 1)
  }
}

async function main() {
  let { phaseLabel, skipValidate } = parseArgs(process.argv)

  if (!phaseLabel) {
    phaseLabel = await detectSprintPhaseSlug(ROOT)
    if (phaseLabel) {
      console.log(`Phase automatisch erkannt: ${phaseLabel}`)
    }
  }

  if (!skipValidate) {
    runStep("typecheck", "npm", ["run", "typecheck"])
    runStep("lint", "npm", ["run", "lint"])
    runStep("build", "npm", ["run", "build"])
  } else {
    console.log("Validierung übersprungen (--skip-validate).")
  }

  const zipArgs = ["scripts/phase-artifacts.mjs"]
  if (phaseLabel) {
    zipArgs.push("--phase", phaseLabel)
  } else {
    zipArgs.push("--auto")
    console.warn("Keine Phase erkannt — ZIP-Dateiname nutzt Zeitstempel.")
  }

  console.log("\n▶ Phasen-ZIPs erstellen…")
  const zip = spawnSync("node", zipArgs, { cwd: ROOT, stdio: "inherit" })
  if (zip.status !== 0) {
    process.exit(zip.status ?? 1)
  }

  console.log("\n✓ Sprint-Abschluss fertig.")
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
