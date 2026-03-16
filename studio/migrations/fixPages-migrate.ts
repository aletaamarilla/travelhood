/**
 * Migration script: fixPages
 * 
 * Migrates the Sanity data model so that:
 * - siteSettings gets defaultIncluded / defaultNotIncluded
 * - destinations get extraIncluded, extraNotIncluded, itinerary
 * - trips rename included → extraIncluded, notIncluded → extraNotIncluded, itinerary → itineraryOverride
 * 
 * Usage:
 *   DRY_RUN=1 npx tsx studio/migrations/fixPages-migrate.ts   # preview changes
 *   npx tsx studio/migrations/fixPages-migrate.ts              # apply changes
 * 
 * Requires SANITY_TOKEN env var with write access.
 */

import { createClient } from '@sanity/client'

const DRY_RUN = process.env.DRY_RUN === '1'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const BASE_INCLUDED = [
  'Alojamiento',
  'Transporte interno',
  'Actividades incluidas',
  'Coordinador Travelhood',
]

const BASE_NOT_INCLUDED = [
  'Vuelo internacional',
  'Comidas no especificadas',
  'Gastos personales',
]

async function migrate() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no changes will be written\n' : '🚀 LIVE RUN — changes will be applied\n')

  // Step 1: Patch siteSettings
  console.log('── Step 1: Patch siteSettings ──')
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
  if (settings) {
    console.log(`  siteSettings (_id: ${settings._id})`)
    console.log(`    defaultIncluded: ${JSON.stringify(BASE_INCLUDED)}`)
    console.log(`    defaultNotIncluded: ${JSON.stringify(BASE_NOT_INCLUDED)}`)
    if (!DRY_RUN) {
      await client.patch(settings._id)
        .set({ defaultIncluded: BASE_INCLUDED, defaultNotIncluded: BASE_NOT_INCLUDED })
        .commit()
      console.log('    ✅ Patched')
    }
  } else {
    console.log('  ⚠️ No siteSettings document found')
  }

  // Step 2: For each destination, extract extras from its trips
  console.log('\n── Step 2: Patch destinations with extras ──')
  const destinations = await client.fetch(`*[_type == "destination"]{ _id, name }`)

  for (const dest of destinations) {
    const trips = await client.fetch(
      `*[_type == "trip" && destination._ref == $destId]{ _id, included, notIncluded, itinerary }`,
      { destId: dest._id }
    )

    const allIncluded = trips.flatMap((t: { included?: string[] }) => t.included ?? [])
    const allNotIncluded = trips.flatMap((t: { notIncluded?: string[] }) => t.notIncluded ?? [])

    const extraIncluded = [...new Set(allIncluded.filter((item: string) => !BASE_INCLUDED.includes(item)))]
    const extraNotIncluded = [...new Set(allNotIncluded.filter((item: string) => !BASE_NOT_INCLUDED.includes(item)))]

    // Pick the longest itinerary from trips as the destination's base itinerary
    const longestTrip = trips.reduce(
      (best: { itinerary?: unknown[] }, t: { itinerary?: unknown[] }) =>
        (t.itinerary?.length ?? 0) > (best.itinerary?.length ?? 0) ? t : best,
      trips[0] ?? {}
    )
    const itinerary = longestTrip?.itinerary ?? []

    console.log(`  ${dest.name} (_id: ${dest._id})`)
    console.log(`    extraIncluded: ${JSON.stringify(extraIncluded)}`)
    console.log(`    extraNotIncluded: ${JSON.stringify(extraNotIncluded)}`)
    console.log(`    itinerary: ${itinerary.length} days`)

    if (!DRY_RUN && (extraIncluded.length > 0 || extraNotIncluded.length > 0 || itinerary.length > 0)) {
      const patch: Record<string, unknown> = {}
      if (extraIncluded.length > 0) patch.extraIncluded = extraIncluded
      if (extraNotIncluded.length > 0) patch.extraNotIncluded = extraNotIncluded
      if (itinerary.length > 0) patch.itinerary = itinerary
      await client.patch(dest._id).set(patch).commit()
      console.log('    ✅ Patched')
    }
  }

  // Step 3: Rename trip fields
  console.log('\n── Step 3: Rename trip fields ──')
  const allTrips = await client.fetch(
    `*[_type == "trip"]{ _id, title, included, notIncluded, itinerary }`
  )

  for (const trip of allTrips) {
    const extraIncluded = (trip.included ?? []).filter((item: string) => !BASE_INCLUDED.includes(item))
    const extraNotIncluded = (trip.notIncluded ?? []).filter((item: string) => !BASE_NOT_INCLUDED.includes(item))

    console.log(`  ${trip.title} (_id: ${trip._id})`)
    console.log(`    extraIncluded (overrides): ${JSON.stringify(extraIncluded)}`)
    console.log(`    extraNotIncluded (overrides): ${JSON.stringify(extraNotIncluded)}`)
    console.log(`    itineraryOverride: will be empty (inherited from destination)`)

    if (!DRY_RUN) {
      await client.patch(trip._id)
        .set({
          extraIncluded: extraIncluded,
          extraNotIncluded: extraNotIncluded,
          itineraryOverride: [],
        })
        .unset(['included', 'notIncluded', 'itinerary'])
        .commit()
      console.log('    ✅ Patched')
    }
  }

  console.log('\n✅ Migration complete!')
  if (DRY_RUN) {
    console.log('   Run without DRY_RUN=1 to apply changes.')
  }
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
