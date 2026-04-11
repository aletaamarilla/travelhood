/**
 * Migration script: fixSanityFields
 *
 * Moves includes/notIncludes and itinerary from `trip` to `destination`.
 *
 * For each destination:
 *   - Collects `included`, `notIncluded` from its trips (unique union)
 *   - Takes the longest `itinerary` from its trips
 *   - Writes them as `included`, `notIncluded`, `itinerary` on the destination
 * Then unsets those fields from all trip documents.
 *
 * Usage:
 *   DRY_RUN=1 npx tsx studio/migrations/fixSanityFields.ts   # preview
 *   npx tsx studio/migrations/fixSanityFields.ts              # apply
 *
 * Requires SANITY_TOKEN env var with write access.
 */

import 'dotenv/config'
import {createClient} from '@sanity/client'

const DRY_RUN = process.env.DRY_RUN === '1'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface DestinationDoc {
  _id: string
  name?: string
}

interface TripDoc {
  _id: string
  title?: string
  destination?: {_ref: string}
  included?: string[]
  notIncluded?: string[]
  itinerary?: unknown[]
  extraIncluded?: string[]
  extraNotIncluded?: string[]
  itineraryOverride?: unknown[]
}

async function migrate() {
  console.log(
    DRY_RUN
      ? '🔍 DRY RUN — no changes will be written\n'
      : '🚀 LIVE RUN — changes will be applied\n',
  )

  const destinations: DestinationDoc[] = await client.fetch(
    `*[_type == "destination"]{ _id, name }`,
  )

  console.log(`Found ${destinations.length} destinations\n`)

  const trips: TripDoc[] = await client.fetch(
    `*[_type == "trip"]{ _id, title, destination, included, notIncluded, itinerary, extraIncluded, extraNotIncluded, itineraryOverride }`,
  )

  console.log(`Found ${trips.length} trips\n`)

  const tx = client.transaction()
  let patchCount = 0

  // --- Step 1: Aggregate trip data into destinations ---
  console.log('── Step 1: Migrate trip fields → destination ──')

  for (const dest of destinations) {
    const destTrips = trips.filter((t) => t.destination?._ref === dest._id)

    const allIncluded = destTrips.flatMap((t) => t.included ?? t.extraIncluded ?? [])
    const allNotIncluded = destTrips.flatMap((t) => t.notIncluded ?? t.extraNotIncluded ?? [])
    const included = [...new Set(allIncluded)]
    const notIncluded = [...new Set(allNotIncluded)]

    const longestTrip = destTrips.reduce(
      (best, t) => {
        const itLen = (t.itinerary ?? t.itineraryOverride ?? []).length
        const bestLen = (best.itinerary ?? best.itineraryOverride ?? []).length
        return itLen > bestLen ? t : best
      },
      destTrips[0] ?? ({} as TripDoc),
    )
    const itinerary = longestTrip?.itinerary ?? longestTrip?.itineraryOverride ?? []

    console.log(`  ${dest.name || dest._id} (${destTrips.length} trips)`)
    console.log(`    included: ${included.length} items`)
    console.log(`    notIncluded: ${notIncluded.length} items`)
    console.log(`    itinerary: ${itinerary.length} days`)

    if (!DRY_RUN && (included.length > 0 || notIncluded.length > 0 || itinerary.length > 0)) {
      const patch: Record<string, unknown> = {}
      if (included.length > 0) patch.included = included
      if (notIncluded.length > 0) patch.notIncluded = notIncluded
      if (itinerary.length > 0) patch.itinerary = itinerary
      tx.patch(dest._id, (p) => p.set(patch))
      patchCount++
    }
  }

  // --- Step 2: Clean trip documents ---
  console.log('\n── Step 2: Clean trip documents ──')

  for (const trip of trips) {
    const hasFields =
      (trip.included && trip.included.length > 0) ||
      (trip.notIncluded && trip.notIncluded.length > 0) ||
      (trip.itinerary && trip.itinerary.length > 0) ||
      (trip.extraIncluded && trip.extraIncluded.length > 0) ||
      (trip.extraNotIncluded && trip.extraNotIncluded.length > 0) ||
      (trip.itineraryOverride && trip.itineraryOverride.length > 0)

    if (!DRY_RUN && hasFields) {
      tx.patch(trip._id, (p) =>
        p.unset([
          'included',
          'notIncluded',
          'itinerary',
          'extraIncluded',
          'extraNotIncluded',
          'itineraryOverride',
        ]),
      )
      patchCount++
    }
  }

  // --- Commit ---
  if (!DRY_RUN && patchCount > 0) {
    console.log(`\nCommitting ${patchCount} patches...`)
    await tx.commit()
    console.log('✅ Transaction committed successfully!')
  } else if (DRY_RUN) {
    console.log(`\n🔍 Would commit ${patchCount} patches. Run without DRY_RUN=1 to apply.`)
  } else {
    console.log('\nNo patches needed.')
  }

  console.log('\n✅ Migration complete!')
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
