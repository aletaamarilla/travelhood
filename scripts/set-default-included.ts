/**
 * Sets defaultIncluded / defaultNotIncluded on the siteSettings document.
 * ONLY touches siteSettings — does NOT modify any destination or trip.
 *
 * Usage:  npx tsx scripts/set-default-included.ts
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

const defaultIncluded = [
  'Alojamiento durante todo el viaje',
  'Coordinador Travel Hood 24/7',
]

const defaultNotIncluded = [
  'Vuelos internacionales',
  'Comidas y cenas no especificadas',
  'Seguro de viaje',
  'Actividades no incluidas en el itinerario',
  'Gastos personales y propinas',
]

async function main() {
  const existing = await client.fetch<{ _id: string; defaultIncluded?: string[]; defaultNotIncluded?: string[] } | null>(
    `*[_type == "siteSettings"][0]{ _id, defaultIncluded, defaultNotIncluded }`
  )

  if (!existing) {
    console.error('❌ No se encontró el documento siteSettings en Sanity.')
    process.exit(1)
  }

  console.log(`📄 siteSettings encontrado: ${existing._id}`)
  console.log(`   defaultIncluded actual:    ${JSON.stringify(existing.defaultIncluded ?? [])}`)
  console.log(`   defaultNotIncluded actual: ${JSON.stringify(existing.defaultNotIncluded ?? [])}`)

  await client
    .patch(existing._id)
    .set({ defaultIncluded, defaultNotIncluded })
    .commit()

  console.log('\n✅ defaultIncluded y defaultNotIncluded actualizados en siteSettings.')
  console.log('   Included:', defaultIncluded)
  console.log('   Not included:', defaultNotIncluded)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
