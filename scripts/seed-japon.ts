/**
 * Seed script: adds ONLY the Japan country, destination and trip to Sanity.
 * Does NOT touch any other existing document.
 *
 * Uses createOrReplace with deterministic _id scoped to Japan docs only.
 *
 * Usage:
 *   npx tsx scripts/seed-japon.ts
 *   npx tsx scripts/seed-japon.ts --dry-run
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
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
})

function makeSlug(value: string) {
  return { _type: 'slug' as const, current: value }
}

function makeRef(id: string) {
  return { _type: 'reference' as const, _ref: id }
}

function makeKey() {
  return Math.random().toString(36).slice(2, 10)
}

const dryRun = process.argv.includes('--dry-run')

async function seed() {
  const travelData = await import('../src/lib/travel-data.js')
  const {
    countries, destinations, trips,
    defaultIncluded, defaultNotIncluded,
  } = travelData

  const country = countries.find((c: { id: string }) => c.id === 'jp')
  const destination = destinations.find((d: { id: string }) => d.id === 'japon')
  const japanTrips = trips.filter((t: { destinationId: string }) => t.destinationId === 'japon')

  if (!country) { console.error('❌ Country jp not found in travel-data'); process.exit(1) }
  if (!destination) { console.error('❌ Destination japon not found in travel-data'); process.exit(1) }
  if (japanTrips.length === 0) { console.warn('⚠️ No trips found for japon') }

  const tx = client.transaction()

  // Deterministic IDs (same convention as seed-sanity.ts)
  const countryId = `country-japon`
  const continentRef = `continent-asia`
  const destId = `destination-japon`

  // 1. Country
  console.log('🏳️ Country: Japón')
  tx.createOrReplace({
    _type: 'country',
    _id: countryId,
    name: country.name,
    slug: makeSlug(country.slug),
    continent: makeRef(continentRef),
    flag: country.flag,
    currency: country.currency,
    currencyRate: country.currencyRate,
    language: country.language,
    timezone: country.timezone,
    visaRequired: country.visaRequired,
    visaInfo: country.visaInfo,
    vaccinesRecommended: country.vaccinesRecommended,
  })

  // 2. Destination
  console.log('📍 Destination: Japón')

  const faqs = (destination.faqs ?? []).map((f: { question: string; answer: string }) => ({
    _key: makeKey(),
    question: f.question,
    answer: f.answer,
  }))

  const itinerary = (destination.itinerary ?? []).map((day: { day: number; title: string; description: string }) => ({
    _key: makeKey(),
    day: day.day,
    title: day.title,
    description: day.description,
  }))

  tx.createOrReplace({
    _type: 'destination',
    _id: destId,
    name: destination.name,
    slug: makeSlug(destination.slug),
    country: makeRef(countryId),
    continent: makeRef(continentRef),
    description: destination.description,
    shortDescription: destination.shortDescription,
    heroImageAlt: destination.heroImageAlt,
    highlights: destination.highlights,
    idealFor: destination.idealFor,
    climate: destination.climate,
    categories: destination.categories,
    coordinates: destination.coordinates
      ? { _type: 'geopoint', lat: destination.coordinates.lat, lng: destination.coordinates.lng }
      : undefined,
    climateByMonth: destination.climateByMonth?.map((m: { month: string; avgTemp: string; rainfall: string; recommendation: string; note?: string }) => ({
      _key: makeKey(),
      month: m.month,
      avgTemp: m.avgTemp,
      rainfall: m.rainfall,
      recommendation: m.recommendation,
      note: m.note,
    })),
    budgetPerDay: destination.budgetPerDay
      ? {
          mealCostLow: destination.budgetPerDay.mealCostLow,
          mealCostMid: destination.budgetPerDay.mealCostMid,
          beerCost: destination.budgetPerDay.beerCost,
          dailyBudget: destination.budgetPerDay.dailyBudget,
          totalExtras: destination.budgetPerDay.totalExtras,
        }
      : undefined,
    hasCoordinator: destination.hasCoordinator ?? true,
    included: [...defaultIncluded, ...(destination.extraIncluded ?? [])],
    notIncluded: [...defaultNotIncluded, ...(destination.extraNotIncluded ?? [])],
    itinerary,
    faqs,
    seo: destination.seo
      ? {
          title: destination.seo.title,
          description: destination.seo.description,
          keywords: destination.seo.keywords,
          cuandoViajarTitle: destination.seo.cuandoViajarTitle,
          cuandoViajarDescription: destination.seo.cuandoViajarDescription,
          presupuestoTitle: destination.seo.presupuestoTitle,
          presupuestoDescription: destination.seo.presupuestoDescription,
        }
      : undefined,
  })

  // 3. Trips
  console.log(`✈️ Trips: ${japanTrips.length} trip(s)`)
  for (const t of japanTrips) {
    const tripSlug = t.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const tripId = `trip-${tripSlug}`
    console.log(`  → ${tripId}`)

    tx.createOrReplace({
      _type: 'trip',
      _id: tripId,
      title: t.title,
      slug: makeSlug(tripSlug),
      destination: makeRef(destId),
      departureDate: t.departureDate,
      returnDate: t.returnDate,
      durationDays: t.durationDays,
      priceFrom: t.priceFrom,
      promoPrice: t.promoPrice,
      promoLabel: t.promoLabel,
      flightEstimate: t.flightEstimate,
      totalPlaces: t.totalPlaces,
      placesLeft: t.placesLeft,
      coordinator: makeRef(`coordinator-${t.coordinatorId}`),
      status: t.status,
      tags: t.tags,
    })
  }

  if (dryRun) {
    console.log('\n⏭️ Dry-run: no changes committed.')
    return
  }

  console.log('\n🚀 Committing transaction (only Japan docs)...')
  const result = await tx.commit()
  console.log(`✅ Done! ${result.results.length} documents created/updated.`)
  console.log('ℹ️ No other documents were touched.')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
