/**
 * Nach einem Phasenschritt: zwei ZIP-Artefakte erzeugen
 * 1) Nur geänderte Dateien (gegenüber HEAD, inkl. staged + untracked laut .gitignore)
 * 2) „Slim“-Snapshot des Repos: ohne node_modules, .next, .turbo, dist; inkl. .git
 *
 * Aufruf aus dem Repo-Root:
 *   npm run phase:zip -- --phase 53.1
 *   npm run sprint:zip                    # Phase aus neuester phase-*-result.md
 *   npm run sprint:finish                 # typecheck + lint + build + ZIPs
 *
 * Umgebungsvariablen:
 *   SOVEREIGN_PHASE_ZIP_DIR — Zielverzeichnis (Default: <Repo>/artifacts/phase-zips)
 *   SPRINT_PHASE — Phasenlabel (z. B. 61), wenn --phase fehlt
 */

import { spawnSync } from "node:child_process"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { detectSprintPhaseSlug } from "./lib/detect-sprint-phase.mjs"

const ROOT = process.cwd()

/** Verzeichnisse, die im Slim-Vollarchiv nicht vorkommen (Build/Deps). */
const SLIM_ARCHIVE_EXCLUDES = ["node_modules", ".next", ".turbo", "dist"]

function parseArgs(argv) {
  let phaseLabel = process.env.SPRINT_PHASE?.trim() || null
  let autoDetect = false
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--phase" && argv[i + 1]) {
      phaseLabel = argv[++i]
    } else if (argv[i] === "--auto") {
      autoDetect = true
    }
  }
  return { phaseLabel, autoDetect }
}

function gitOutput(args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" })
  if (r.error) {
    throw new Error(`git konnte nicht gestartet werden: ${r.error.message}`)
  }
  if (r.status !== 0) {
    throw new Error(`git ${args.join(" ")} fehlgeschlagen:\n${r.stderr || r.stdout}`)
  }
  return r.stdout
}

function collectChangedPaths() {
  const chunks = [
    gitOutput(["diff", "--name-only", "HEAD"]),
    gitOutput(["diff", "--name-only", "--cached", "HEAD"]),
    gitOutput(["ls-files", "--others", "--exclude-standard"]),
  ]
  const set = new Set()
  for (const block of chunks) {
    for (const line of block.split(/\r?\n/)) {
      const t = line.trim()
      if (t) set.add(t.replaceAll("\\", "/"))
    }
  }
  return [...set]
}

function safePhaseSlug(raw) {
  const base =
    raw && raw.trim().length > 0
      ? raw.trim()
      : new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  return base.replace(/[/\\<>:"|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "_").slice(0, 80)
}

function hasTar() {
  const r = spawnSync("tar", ["--version"], { encoding: "utf8" })
  return !r.error && r.status === 0
}

function pathExists(p) {
  return fs
    .access(p)
    .then(() => true)
    .catch(() => false)
}

async function main() {
  let { phaseLabel, autoDetect } = parseArgs(process.argv)

  if (!phaseLabel && autoDetect) {
    phaseLabel = await detectSprintPhaseSlug(ROOT)
    if (phaseLabel) {
      console.log("Phase automatisch erkannt (neueste phase-*-result.md):", phaseLabel)
    }
  }

  const slug = safePhaseSlug(phaseLabel)

  if (!hasTar()) {
    console.error("Das Programm „tar“ wurde nicht gefunden. Bitte installieren oder PATH prüfen.")
    process.exit(1)
  }

  const parent = path.dirname(ROOT)
  const repoFolder = path.basename(ROOT)
  const defaultOut = path.join(ROOT, "artifacts", "phase-zips")
  const outDir = process.env.SOVEREIGN_PHASE_ZIP_DIR?.trim() || defaultOut

  await fs.mkdir(outDir, { recursive: true })

  const deltaZip = path.join(outDir, `SovereignCMS-${slug}-nur-Aenderungen.zip`)
  const fullZip = path.join(outDir, `SovereignCMS-${slug}-repo-slim.zip`)

  const changed = collectChangedPaths()
  const existing = []
  for (const rel of changed) {
    const abs = path.join(ROOT, rel)
    if (await pathExists(abs)) {
      const st = await fs.stat(abs)
      if (st.isFile()) existing.push(rel)
    }
  }

  if (existing.length === 0) {
    console.warn("Keine geänderten Dateien gegenüber HEAD gefunden — Delta-ZIP wird übersprungen.")
  } else {
    const listPath = path.join(os.tmpdir(), `sov-phase-files-${process.pid}-${Date.now()}.txt`)
    await fs.writeFile(listPath, existing.join("\n"), "utf8")
    try {
      const r = spawnSync("tar", ["-a", "-cf", deltaZip, "-T", listPath], {
        cwd: ROOT,
        encoding: "utf8",
      })
      if (r.status !== 0) {
        throw new Error(`tar (Delta) fehlgeschlagen: ${r.stderr || r.stdout || r.status}`)
      }
    } finally {
      await fs.rm(listPath, { force: true })
    }
    console.log("Delta-ZIP:", deltaZip)
  }

  const fullZipTmp = path.join(
    os.tmpdir(),
    `sov-phase-full-${slug}-${process.pid}-${Date.now()}.zip`,
  )

  const tarArgs = ["-a", "-cf", fullZipTmp]
  for (const ex of SLIM_ARCHIVE_EXCLUDES) {
    tarArgs.push("--exclude", ex)
  }
  tarArgs.push(repoFolder)

  const rFull = spawnSync("tar", tarArgs, { cwd: parent, stdio: "inherit" })
  if (rFull.error) throw rFull.error
  if (rFull.status !== 0) {
    await fs.rm(fullZipTmp, { force: true })
    process.exit(rFull.status ?? 1)
  }

  await fs.copyFile(fullZipTmp, fullZip)
  await fs.rm(fullZipTmp, { force: true })

  console.log("Slim-Repo-ZIP (ohne node_modules, .next, .turbo, dist):", fullZip)
  console.log("")
  console.log("Fertig. Ausgabeordner:", outDir)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
