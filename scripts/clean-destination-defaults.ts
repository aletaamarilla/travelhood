/**
 * Removes default included/notIncluded items from destination documents.
 * Only removes items that match siteSettings defaults — leaves extras intact.
 *
 * Usage:
 *   npx tsx scripts/clean-destination-defaults.ts          # dry-run (default)
 *   npx tsx scripts/clean-destination-defaults.ts --apply   # actually apply changes
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

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
  apiVersion: '2026-04-11',
  token,
  useCdn: false,
})

const applyChanges = process.argv.includes('--apply')

function normalize(s: string): string {
  return s.trim().toLowerCase()
}

async function main() {
  const settings = await client.fetch<{ defaultIncluded?: string[]; defaultNotIncluded?: string[] }>(
    `*[_type == "siteSettings"][0]{ defaultIncluded, defaultNotIncluded }`
  )

  if (!settings) {
    console.error('❌ No se encontró siteSettings')
    process.exit(1)
  }

  const defIncSet = new Set((settings.defaultIncluded ?? []).map(normalize))
  const defNotSet = new Set((settings.defaultNotIncluded ?? []).map(normalize))

  console.log('═══ Defaults en siteSettings ═══')
  console.log('  Included:', settings.defaultIncluded)
  console.log('  Not included:', settings.defaultNotIncluded)
  console.log('')

  const destinations = await client.fetch<Array<{
    _id: string
    title: string
    slug: { current: string }
    included?: string[]
    notIncluded?: string[]
  }>>(`*[_type == "destination"]{ _id, title, slug, included, notIncluded } | order(title asc)`)

  console.log(`📋 ${destinations.length} destinos encontrados\n`)

  let totalChanges = 0

  for (const dest of destinations) {
    const origIncluded = dest.included ?? []
    const origNotIncluded = dest.notIncluded ?? []

    const removedIncluded = origIncluded.filter(item => defIncSet.has(normalize(item)))
    const keptIncluded = origIncluded.filter(item => !defIncSet.has(normalize(item)))

    const removedNotIncluded = origNotIncluded.filter(item => defNotSet.has(normalize(item)))
    const keptNotIncluded = origNotIncluded.filter(item => !defNotSet.has(normalize(item)))

    const hasChanges = removedIncluded.length > 0 || removedNotIncluded.length > 0

    if (hasChanges) {
      totalChanges++
      console.log(`── ${dest.title} (${dest.slug?.current}) ──`)

      if (removedIncluded.length > 0) {
        console.log(`   🗑️  Se BORRAN de included (${removedIncluded.length}):`)
        removedIncluded.forEach(item => console.log(`       - "${item}"`))
        console.log(`   ✅ Se MANTIENEN en included (${keptIncluded.length}):`)
        keptIncluded.forEach(item => console.log(`       + "${item}"`))
      }

      if (removedNotIncluded.length > 0) {
        console.log(`   🗑️  Se BORRAN de notIncluded (${removedNotIncluded.length}):`)
        removedNotIncluded.forEach(item => console.log(`       - "${item}"`))
        console.log(`   ✅ Se MANTIENEN en notIncluded (${keptNotIncluded.length}):`)
        keptNotIncluded.forEach(item => console.log(`       + "${item}"`))
      }

      if (applyChanges) {
        await client
          .patch(dest._id)
          .set({
            included: keptIncluded,
            notIncluded: keptNotIncluded,
          })
          .commit()
        console.log(`   ✅ APLICADO`)
      }

      console.log('')
    } else {
      console.log(`── ${dest.title} (${dest.slug?.current}) → Sin duplicados ──`)
    }
  }

  console.log('═══════════════════════════════════')
  if (totalChanges === 0) {
    console.log('🎉 Ningún destino tiene defaults duplicados.')
  } else if (applyChanges) {
    console.log(`✅ ${totalChanges} destino(s) limpiados.`)
  } else {
    console.log(`⚠️  ${totalChanges} destino(s) tienen defaults duplicados.`)
    console.log('   Para aplicar los cambios ejecuta:')
    console.log('   npx tsx scripts/clean-destination-defaults.ts --apply')
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
