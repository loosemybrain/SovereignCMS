import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const DIR_NAMES_TO_REMOVE = new Set([".next", ".turbo", "dist"])
const KEEP_FILE_NAMES = new Set([".env.example", "next-env.d.ts"])
const SKIP_DIR_NAMES = new Set(["node_modules", ".git"])

async function removeIfExists(targetPath) {
  try {
    await fs.rm(targetPath, { recursive: true, force: true })
  } catch {
    // noop
  }
}

async function walk(currentPath) {
  let entries
  try {
    entries = await fs.readdir(currentPath, { withFileTypes: true })
  } catch {
    return
  }

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        if (SKIP_DIR_NAMES.has(entry.name)) return
        if (DIR_NAMES_TO_REMOVE.has(entry.name)) {
          await removeIfExists(entryPath)
          return
        }
        await walk(entryPath)
        return
      }

      if (!entry.isFile()) return
      if (KEEP_FILE_NAMES.has(entry.name)) return
      if (entry.name.endsWith(".tsbuildinfo")) {
        await removeIfExists(entryPath)
      }
    }),
  )
}

await walk(ROOT)
console.log("clean complete")