/**
 * Removes "Coordinador Travelhood 24/7" from included in all destinations.
 * The correct default "Coordinador Travel Hood 24/7" lives in siteSettings.
 *
 * Usage:  npx tsx scripts/remove-coordinator-from-destinations.ts
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

async function main() {
  const destinations = await client.fetch<Array<{
    _id: string
    title: string
    slug: { current: string }
    included?: string[]
  }>>(`*[_type == "destination"]{ _id, title, slug, included } | order(title asc)`)

  let changed = 0

  for (const dest of destinations) {
    const orig = dest.included ?? []
    const filtered = orig.filter(item => item.trim().toLowerCase() !== 'coordinador travelhood 24/7')

    if (filtered.length < orig.length) {
      await client.patch(dest._id).set({ included: filtered }).commit()
      console.log(`✅ ${dest.slug?.current} — eliminado "Coordinador Travelhood 24/7" (quedan ${filtered.length} extras)`)
      changed++
    }
  }

  console.log(`\n${changed === 0 ? '🎉 Ningún destino tenía ese ítem.' : `✅ ${changed} destino(s) actualizados.`}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
