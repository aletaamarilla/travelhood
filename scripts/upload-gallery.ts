/**
 * Upload gallery images to Sanity from a ZIP file.
 *
 * Prerequisites:
 *   1. Set SANITY_PROJECT_ID and SANITY_TOKEN in .env (root)
 *   2. The token needs write + asset upload permissions
 *
 * Usage:
 *   npx tsx scripts/upload-gallery.ts <path-to-zip> [flags]
 *
 * Flags:
 *   --dry-run             Show what would be done without uploading or patching
 *   --force               Overwrite galleries even if they already exist
 *   --concurrency N       Number of parallel uploads (default: 3)
 *   --include-placeholder  Include placeholder destinations (Camino de Santiago)
 */

import { createClient } from '@sanity/client'
import AdmZip from 'adm-zip'
import * as dotenv from 'dotenv'
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// ── Sanity client ──

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_TOKEN

if (!projectId || projectId === 'YOUR_PROJECT_ID') {
  console.error('❌ Set SANITY_PROJECT_ID in .env first')
  process.exit(1)
}
if (!token) {
  console.error('❌ Set SANITY_TOKEN in .env (need write permissions)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
})

// ── Folder → Destination(s) mapping ──

const FOLDER_TO_DESTINATIONS: Record<string, string[]> = {
  'Azores':       ['destination-azores'],
  'Brasil':       ['destination-brasil'],
  'Colombia':     ['destination-colombia'],
  'Egipto':       ['destination-egipto'],
  'Filipinas':    ['destination-filipinas-verano', 'destination-filipinas-invierno'],
  'Islandia':     ['destination-islandia'],
  'Lofoten':      ['destination-lofoten'],
  'Puerto Rico':  ['destination-puerto-rico'],
  'Sri Lanka':    ['destination-sri-lanka-verano', 'destination-sri-lanka-otono', 'destination-sri-lanka-invierno'],
  'Zanzibar':     ['destination-zanzibar'],
  'laponia':      ['destination-laponia'],
  'maldivas':     ['destination-maldivas'],
}

const PLACEHOLDER_FOLDERS: Record<string, string[]> = {
  'Camino de Santiago': ['destination-camino-de-santiago'],
}

const EXCLUDED_FOLDERS = new Set(['méxico'])

// ── CLI flag parsing ──

interface Options {
  zipPath: string
  dryRun: boolean
  force: boolean
  concurrency: number
  includePlaceholder: boolean
}

function parseArgs(): Options | null {
  const args = process.argv.slice(2)
  let zipPath = ''
  let dryRun = false
  let force = false
  let concurrency = 3
  let includePlaceholder = false

  const positional: string[] = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--dry-run') {
      dryRun = true
    } else if (arg === '--force') {
      force = true
    } else if (arg === '--concurrency') {
      const next = args[++i]
      const n = parseInt(next, 10)
      if (isNaN(n) || n < 1) {
        console.error('❌ --concurrency requires a positive integer')
        return null
      }
      concurrency = n
    } else if (arg === '--include-placeholder') {
      includePlaceholder = true
    } else if (arg.startsWith('-')) {
      console.error(`❌ Unknown flag: ${arg}`)
      return null
    } else {
      positional.push(arg)
    }
  }

  zipPath = positional[0] ?? ''

  if (!zipPath) {
    return null
  }

  return { zipPath, dryRun, force, concurrency, includePlaceholder }
}

function printUsage() {
  console.log(`
📸 upload-gallery — Upload destination gallery images to Sanity from a ZIP file.

Usage:
  npx tsx scripts/upload-gallery.ts <path-to-zip> [flags]

Flags:
  --dry-run              Show what would be done without uploading or patching
  --force                Overwrite galleries even if they already exist
  --concurrency N        Number of parallel uploads (default: 3)
  --include-placeholder  Include placeholder destinations (Camino de Santiago)

Example:
  npx tsx scripts/upload-gallery.ts "./imagenes web.zip" --dry-run
  npx tsx scripts/upload-gallery.ts "./imagenes web.zip" --force --concurrency 5
`)
}

// ── Helpers ──

const VALID_EXTENSIONS = new Set(['.jpeg', '.jpg', '.heic'])
const DISCARDED_EXTENSIONS = new Set(['.mov'])

function generateKey(): string {
  return Math.random().toString(36).slice(2, 14)
}

// ── ZIP extraction ──

function extractZip(zipPath: string): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'travelhood-gallery-'))
  console.log(`📦 Extracting ZIP to ${tmpDir}...`)
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(tmpDir, true)
  console.log('📦 Extraction complete.')
  return tmpDir
}

// ── File discovery and filtering ──

function getValidFiles(extractedDir: string): Map<string, string[]> {
  const result = new Map<string, string[]>()
  let totalValid = 0
  let totalDiscarded = 0

  const topEntries = fs.readdirSync(extractedDir, { withFileTypes: true })

  // The ZIP may have a single wrapper folder; detect it
  let baseDir = extractedDir
  const subdirs = topEntries.filter((e) => e.isDirectory())
  if (subdirs.length === 1 && topEntries.filter((e) => e.isFile()).length === 0) {
    baseDir = path.join(extractedDir, subdirs[0].name)
  }

  const folderEntries = fs.readdirSync(baseDir, { withFileTypes: true })

  for (const entry of folderEntries) {
    if (!entry.isDirectory()) continue
    const folderName = entry.name
    const folderPath = path.join(baseDir, folderName)

    const files = fs.readdirSync(folderPath)
    const validFiles: string[] = []
    let discardedCount = 0

    for (const file of files) {
      if (file.startsWith('.')) continue // skip hidden files like .DS_Store
      const ext = path.extname(file).toLowerCase()

      if (VALID_EXTENSIONS.has(ext)) {
        validFiles.push(path.join(folderPath, file))
      } else if (DISCARDED_EXTENSIONS.has(ext)) {
        console.log(`  🗑️  Discarded (video): ${folderName}/${file}`)
        discardedCount++
      } else {
        console.log(`  ⚠️  Discarded (unknown format): ${folderName}/${file}`)
        discardedCount++
      }
    }

    validFiles.sort((a, b) => path.basename(a).localeCompare(path.basename(b)))

    if (validFiles.length > 0) {
      result.set(folderName, validFiles)
    }

    totalValid += validFiles.length
    totalDiscarded += discardedCount
  }

  console.log(`\n📊 Summary: ${totalValid} valid files, ${totalDiscarded} discarded, across ${result.size} folders.\n`)
  return result
}

// ── HEIC conversion ──

async function convertHeicToJpeg(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase()
  if (ext !== '.heic') return filePath

  const newPath = filePath.replace(/\.heic$/i, '.jpg')
  console.log(`  🔄 Converting HEIC: ${path.basename(filePath)} → JPEG`)

  try {
    await sharp(filePath).jpeg({ quality: 90 }).toFile(newPath)
  } catch {
    // sharp lacks HEIC support on this system — fall back to heic-convert
    const convert = (await import('heic-convert')).default
    const inputBuffer = fs.readFileSync(filePath)
    const outputBuffer = await convert({ buffer: inputBuffer, format: 'JPEG', quality: 0.9 })
    fs.writeFileSync(newPath, Buffer.from(outputBuffer))
  }

  return newPath
}

// ── Asset upload ──

async function uploadAsset(filePath: string): Promise<string> {
  const stream = fs.createReadStream(filePath)
  const filename = path.basename(filePath)

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const asset = await client.assets.upload('image', stream, { filename })
      return asset._id
    } catch (err) {
      if (attempt === 0) {
        console.log(`  ⚠️  Upload failed for ${filename}, retrying...`)
        await new Promise((r) => setTimeout(r, 2000))
      } else {
        throw err
      }
    }
  }

  throw new Error(`Upload failed for ${filePath} after 2 attempts`)
}

// ── Gallery item builder ──

function buildGalleryItem(assetId: string, destName: string, index: number, _total: number) {
  return {
    _type: 'image' as const,
    _key: generateKey(),
    asset: { _type: 'reference' as const, _ref: assetId },
    alt: `Foto de viaje a ${destName} — imagen ${index + 1} de la galería Travel Hood`,
  }
}

// ── Concurrency helper ──

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  await Promise.all(workers)
  return results
}

// ── Destination processing ──

async function processDestination(
  folderName: string,
  filePaths: string[],
  destIds: string[],
  destName: string,
  options: Options,
): Promise<void> {
  const targetDests: string[] = []

  for (const destId of destIds) {
    const gallery = await client.fetch<unknown[] | null>('*[_id == $id][0].gallery', { id: destId })
    if (gallery && gallery.length > 0 && !options.force) {
      console.log(`  ⏭️  ${destId} already has gallery (${gallery.length} photos). Use --force to overwrite.`)
    } else {
      targetDests.push(destId)
    }
  }

  if (targetDests.length === 0) return

  if (filePaths.length < 6) {
    console.log(`  ⚠️  ${folderName} has only ${filePaths.length} photos (recommended minimum: 6)`)
  }

  // Convert HEIC files
  const convertedPaths: string[] = []
  for (const fp of filePaths) {
    convertedPaths.push(await convertHeicToJpeg(fp))
  }

  if (options.dryRun) {
    console.log(`  🏜️  [DRY-RUN] Would upload ${convertedPaths.length} images for: ${targetDests.join(', ')}`)
    for (const fp of convertedPaths) {
      console.log(`    📄 ${path.basename(fp)}`)
    }
    return
  }

  // Upload assets once
  console.log(`  📤 Uploading ${convertedPaths.length} images...`)
  const assetIds = await runWithConcurrency(convertedPaths, options.concurrency, async (fp, i) => {
    const id = await uploadAsset(fp)
    console.log(`    ✅ [${i + 1}/${convertedPaths.length}] ${path.basename(fp)}`)
    return id
  })

  // Build gallery items
  const galleryItems = assetIds.map((assetId, i) =>
    buildGalleryItem(assetId, destName, i, assetIds.length),
  )

  // Patch each destination
  for (const destId of targetDests) {
    const hasHeroImage = await client.fetch<boolean>(
      'defined(*[_id == $id][0].heroImage)',
      { id: destId },
    )

    const patchPayload: Record<string, unknown> = { gallery: galleryItems }
    // Safety: keep existing portada and bootstrap one from gallery if missing.
    if (!hasHeroImage && galleryItems.length > 0) {
      patchPayload.heroImage = {
        _type: 'image',
        asset: galleryItems[0].asset,
      }
    }

    await client.patch(destId).set(patchPayload).commit()
    console.log(`  ✅ ${destId}: ${galleryItems.length} photos loaded into gallery`)
  }
}

// ── Main ──

async function main() {
  const options = parseArgs()

  if (!options) {
    printUsage()
    process.exit(options === null ? 1 : 0)
  }

  const resolvedZip = path.resolve(options.zipPath)
  if (!fs.existsSync(resolvedZip)) {
    console.error(`❌ ZIP file not found: ${resolvedZip}`)
    process.exit(1)
  }

  console.log('🚀 upload-gallery — Travel Hood Gallery Uploader')
  console.log(`   ZIP: ${resolvedZip}`)
  console.log(`   Mode: ${options.dryRun ? '🏜️ DRY-RUN' : '🔥 LIVE'}`)
  console.log(`   Force: ${options.force ? 'yes' : 'no'}`)
  console.log(`   Concurrency: ${options.concurrency}`)
  console.log(`   Include placeholders: ${options.includePlaceholder ? 'yes' : 'no'}`)
  console.log('')

  // Build active mapping
  const mapping = { ...FOLDER_TO_DESTINATIONS }
  if (options.includePlaceholder) {
    Object.assign(mapping, PLACEHOLDER_FOLDERS)
  }

  // Extract ZIP
  const extractedDir = extractZip(resolvedZip)

  try {
    // Get valid files
    const filesByFolder = getValidFiles(extractedDir)

    // Process each mapped folder
    for (const [folderName, destIds] of Object.entries(mapping)) {
      const files = filesByFolder.get(folderName)

      if (!files || files.length === 0) {
        console.log(`📭 No folder found for: ${folderName}`)
        continue
      }

      const destName = folderName.charAt(0).toUpperCase() + folderName.slice(1)
      console.log(`\n🗂️  Processing ${folderName} (${files.length} files → ${destIds.join(', ')})`)
      await processDestination(folderName, files, destIds, destName, options)
    }

    // Report excluded folders found in ZIP
    for (const [folderName] of filesByFolder) {
      if (EXCLUDED_FOLDERS.has(folderName)) {
        console.log(`\n🚫 Excluded folder found (destination deleted): ${folderName}`)
      }
    }

    // Report unmapped folders
    const allMappedFolders = new Set([
      ...Object.keys(mapping),
      ...EXCLUDED_FOLDERS,
    ])
    for (const [folderName] of filesByFolder) {
      if (!allMappedFolders.has(folderName) && !Object.keys(PLACEHOLDER_FOLDERS).includes(folderName)) {
        console.log(`\n❓ Unmapped folder in ZIP: ${folderName}`)
      }
    }

    // Report active destinations without gallery
    const ALL_ACTIVE_DESTS = [
      'destination-azores', 'destination-brasil', 'destination-egipto',
      'destination-colombia',
      'destination-filipinas-verano', 'destination-filipinas-invierno',
      'destination-indonesia',
      'destination-islandia', 'destination-lofoten', 'destination-puerto-rico',
      'destination-sri-lanka-verano', 'destination-sri-lanka-otono', 'destination-sri-lanka-invierno',
      'destination-zanzibar', 'destination-laponia', 'destination-maldivas',
      'destination-tailandia-verano', 'destination-tailandia-invierno',
    ]

    const coveredDests = new Set(Object.values(mapping).flat())
    const uncoveredDests = ALL_ACTIVE_DESTS.filter((d) => !coveredDests.has(d))
    if (uncoveredDests.length > 0) {
      console.log('\n📋 Active destinations without gallery images in this ZIP:')
      for (const d of uncoveredDests) {
        console.log(`   • ${d}`)
      }
    }

    console.log('\n🎉 Done!')
  } finally {
    // Clean up temp directory
    console.log(`\n🧹 Cleaning up temp directory...`)
    fs.rmSync(extractedDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error('❌ upload-gallery failed:', err)
  process.exit(1)
})
