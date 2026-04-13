/**
 * Seed script: migrates hardcoded data from .ts files into Sanity.
 *
 * Prerequisites:
 *   1. Set SANITY_PROJECT_ID and SANITY_TOKEN in .env (root)
 *   2. The token needs write permissions (create in sanity.io/manage → API → Tokens)
 *
 * Usage:
 *   npx tsx scripts/seed-sanity.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
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

// Dynamic imports to load the TS data
async function loadData() {
  const travelData = await import('../src/lib/travel-data.js')
  const blogData = await import('../src/lib/blog-data.js')
  const comparisonsData = await import('../src/lib/comparisons.js')
  const detailsData = await import('../src/lib/destination-details.js')
  return { travelData, blogData, comparisonsData, detailsData }
}

function makeSlug(value: string) {
  return { _type: 'slug' as const, current: value }
}

function makeRef(id: string) {
  return { _type: 'reference' as const, _ref: id }
}

function makeKey() {
  return Math.random().toString(36).slice(2, 10)
}

async function seed() {
  const { travelData, blogData, comparisonsData, detailsData } = await loadData()
  const {
    continents, countries, destinations, trips,
    coordinators, testimonials, tripCategories, seasons,
    defaultIncluded, defaultNotIncluded,
  } = travelData
  const { blogPosts } = blogData
  const { comparisons } = comparisonsData

  const tx = client.transaction()

  const dryRun = process.argv.includes('--dry-run')

  const continentIdMap = new Map<string, string>()
  const countryIdMap = new Map<string, string>()
  const destIdMap = new Map<string, string>()
  const coordIdMap = new Map<string, string>()
  const tripIds = new Set<string>()
  const testimonialIds = new Set<string>()
  const categoryIds = new Set<string>()
  const seasonIds = new Set<string>()
  const blogPostIds = new Set<string>()
  const comparisonIds = new Set<string>()

  // 1. Site Settings
  console.log('📝 siteSettings...')
  tx.createOrReplace({
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteName: 'Travel Hood',
    siteUrl: 'https://travelhood.es',
    priceRange: '590€ - 1.590€',
    contactEmail: 'contacta@travelhood.es',
    socialLinks: [
      { _key: makeKey(), platform: 'instagram', url: 'https://instagram.com/travelhood_esp' },
      { _key: makeKey(), platform: 'tiktok', url: 'https://tiktok.com/@travelhood.es' },
    ],
    whatsappPhone: '34686684204',
    whatsappCommunityUrl: 'https://chat.whatsapp.com/CA8Mqw35bdG4dkHfxGeVUZ',
  })

  // 2. Continents
  console.log('🌍 Continents...')
  for (const c of continents) {
    const _id = `continent-${c.slug}`
    continentIdMap.set(c.id, _id)
    tx.createOrReplace({
      _type: 'continent',
      _id,
      name: c.name,
      slug: makeSlug(c.slug),
      editorialIntro: c.editorialIntro,
      heroImage: undefined, // images need manual upload
      bestMonths: c.bestMonths,
      faqs: c.faqs.map((f) => ({ _key: makeKey(), question: f.question, answer: f.answer })),
      seo: {
        title: c.seoTitle,
        description: c.seoDescription,
      },
    })
  }

  // 3. Countries
  console.log('🏳️ Countries...')
  for (const c of countries) {
    const _id = `country-${c.slug}`
    countryIdMap.set(c.id, _id)
    tx.createOrReplace({
      _type: 'country',
      _id,
      name: c.name,
      slug: makeSlug(c.slug),
      continent: makeRef(continentIdMap.get(c.continentId) ?? ''),
      flag: c.flag,
      currency: c.currency,
      currencyRate: c.currencyRate,
      language: c.language,
      timezone: c.timezone,
      visaRequired: c.visaRequired,
      visaInfo: c.visaInfo,
      vaccinesRecommended: c.vaccinesRecommended,
    })
  }

  // 4. Destinations
  console.log('📍 Destinations...')
  for (const d of destinations) {
    const _id = `destination-${d.slug}`
    destIdMap.set(d.id, _id)

    const faqs = (d.faqs ?? []).map((f: { question: string; answer: string }) => ({
      _key: makeKey(),
      question: f.question,
      answer: f.answer,
    }))

    const destItinerary = (d.itinerary ?? []).map((day: { day: number; title: string; description: string }) => ({
      _key: makeKey(),
      day: day.day,
      title: day.title,
      description: day.description,
    }))

    tx.createOrReplace({
      _type: 'destination',
      _id,
      name: d.name,
      slug: makeSlug(d.slug),
      country: makeRef(countryIdMap.get(d.countryId) ?? ''),
      continent: makeRef(continentIdMap.get(d.continentId) ?? ''),
      description: d.description,
      shortDescription: d.shortDescription,
      heroImageAlt: d.heroImageAlt,
      highlights: d.highlights,
      idealFor: d.idealFor,
      climate: d.climate,
      categories: d.categories,
      coordinates: d.coordinates
        ? { _type: 'geopoint', lat: d.coordinates.lat, lng: d.coordinates.lng }
        : undefined,
      climateByMonth: d.climateByMonth?.map((m) => ({
        _key: makeKey(),
        month: m.month,
        avgTemp: m.avgTemp,
        rainfall: m.rainfall,
        recommendation: m.recommendation,
        note: m.note,
      })),
      budgetPerDay: d.budgetPerDay
        ? {
            mealCostLow: d.budgetPerDay.mealCostLow,
            mealCostMid: d.budgetPerDay.mealCostMid,
            beerCost: d.budgetPerDay.beerCost,
            dailyBudget: d.budgetPerDay.dailyBudget,
            totalExtras: d.budgetPerDay.totalExtras,
          }
        : undefined,
      hasCoordinator: d.hasCoordinator ?? true,
      included: [...defaultIncluded, ...(d.extraIncluded ?? [])],
      notIncluded: [...defaultNotIncluded, ...(d.extraNotIncluded ?? [])],
      itinerary: destItinerary,
      faqs,
      seo: d.seo
        ? {
            title: d.seo.title,
            description: d.seo.description,
            keywords: d.seo.keywords,
            cuandoViajarTitle: d.seo.cuandoViajarTitle,
            cuandoViajarDescription: d.seo.cuandoViajarDescription,
            presupuestoTitle: d.seo.presupuestoTitle,
            presupuestoDescription: d.seo.presupuestoDescription,
          }
        : undefined,
    })
  }

  // 5. Coordinators
  console.log('👤 Coordinators...')
  for (const c of coordinators) {
    const _id = `coordinator-${c.id}`
    coordIdMap.set(c.id, _id)
    tx.createOrReplace({
      _type: 'coordinator',
      _id,
      name: c.name,
      slug: makeSlug(c.id),
      age: c.age,
      role: c.role,
      bio: c.bio,
      quote: c.quote,
      destinations: c.destinations.map((dId: string) => ({
        _key: makeKey(),
        ...makeRef(destIdMap.get(dId) ?? ''),
      })),
    })
  }

  // 6. Trips
  console.log('✈️ Trips...')
  for (const t of trips) {
    const tripSlug = t.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const tripId = `trip-${tripSlug}`
    tripIds.add(tripId)
    tx.createOrReplace({
      _type: 'trip',
      _id: tripId,
      title: t.title,
      slug: makeSlug(tripSlug),
      destination: makeRef(destIdMap.get(t.destinationId) ?? ''),
      departureDate: t.departureDate,
      returnDate: t.returnDate,
      durationDays: t.durationDays,
      priceFrom: t.priceFrom,
      promoPrice: t.promoPrice,
      promoLabel: t.promoLabel,
      flightEstimate: t.flightEstimate,
      totalPlaces: t.totalPlaces,
      placesLeft: t.placesLeft,
      coordinator: makeRef(coordIdMap.get(t.coordinatorId) ?? ''),
      status: t.status,
      tags: t.tags,
    })
  }

  // 7. Testimonials
  console.log('⭐ Testimonials...')
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    const testId = `testimonial-${i}`
    testimonialIds.add(testId)
    tx.createOrReplace({
      _type: 'testimonial',
      _id: testId,
      name: t.name,
      age: t.age,
      city: t.city,
      destination: makeRef(destIdMap.get(t.destinationId) ?? ''),
      quote: t.quote,
      rating: t.rating,
      featured: i < 6,
    })
  }

  // 8. Trip Categories
  console.log('🏷️ Trip Categories...')
  for (const cat of tripCategories) {
    const catId = `category-${cat.slug}`
    categoryIds.add(catId)
    tx.createOrReplace({
      _type: 'tripCategory',
      _id: catId,
      name: cat.name,
      slug: makeSlug(cat.slug),
      editorial: cat.editorial,
      idealProfile: cat.idealProfile,
      faqs: cat.faqs.map((f: { question: string; answer: string }) => ({
        _key: makeKey(),
        question: f.question,
        answer: f.answer,
      })),
      seo: {
        title: cat.seoTitle,
        description: cat.seoDescription,
      },
    })
  }

  // 9. Seasons
  console.log('📅 Seasons...')
  for (const s of seasons) {
    const seasonId = `season-${s.slug}`
    seasonIds.add(seasonId)
    tx.createOrReplace({
      _type: 'season',
      _id: seasonId,
      name: s.name,
      slug: makeSlug(s.slug),
      tags: s.tags,
      editorial: s.editorial,
      faqs: s.faqs.map((f: { question: string; answer: string }) => ({
        _key: makeKey(),
        question: f.question,
        answer: f.answer,
      })),
      seo: {
        title: s.seoTitle,
        description: s.seoDescription,
      },
    })
  }

  // 10. Blog Posts
  console.log('📝 Blog Posts...')
  for (const p of blogPosts) {
    const blogId = `blog-${p.slug}`
    blogPostIds.add(blogId)
    tx.createOrReplace({
      _type: 'blogPost',
      _id: blogId,
      title: p.title,
      slug: makeSlug(p.slug),
      excerpt: p.excerpt,
      category: p.category,
      imageAlt: p.imageAlt,
      publishedAt: p.dateISO ? `${p.dateISO}T00:00:00Z` : undefined,
      readTime: p.readTime,
      featured: p.featured,
      author: p.author,
      tags: p.tags,
      sections: p.sections.map((sec) => ({
        _key: makeKey(),
        heading: sec.heading,
        body: sec.body,
        imageAlt: sec.imageAlt,
        cta: sec.cta,
      })),
      relatedDestinations: p.relatedDestinations
        .map((slug: string) => {
          const dest = destinations.find((d) => d.slug === slug || d.id === slug)
          return dest ? { _key: makeKey(), ...makeRef(destIdMap.get(dest.id) ?? '') } : null
        })
        .filter(Boolean),
      relatedPosts: p.relatedSlugs.map((slug: string) => ({
        _key: makeKey(),
        ...makeRef(`blog-${slug}`),
      })),
      seo: {
        metaDescription: p.metaDescription,
      },
    })
  }

  // 11. Comparisons
  console.log('🔄 Comparisons...')
  for (const c of comparisons) {
    const destA = destinations.find((d) => d.slug === c.slugA)
    const destB = destinations.find((d) => d.slug === c.slugB)
    if (!destA || !destB) {
      console.log(`  ⚠️ Skipping comparison ${c.slugA} vs ${c.slugB}: destination not found`)
      continue
    }
    const compId = `comparison-${c.slugA}-vs-${c.slugB}`
    comparisonIds.add(compId)
    tx.createOrReplace({
      _type: 'comparison',
      _id: compId,
      slug: makeSlug(`${c.slugA}-vs-${c.slugB}`),
      destinationA: makeRef(destIdMap.get(destA.id) ?? ''),
      destinationB: makeRef(destIdMap.get(destB.id) ?? ''),
      verdict: c.verdict,
    })
  }

  // Commit
  console.log('\n🚀 Committing transaction...')
  const result = await tx.commit()
  console.log(`✅ Done! ${result.results.length} documents created/updated.`)

  // 12. Purge orphan documents
  console.log('\n🧹 Purging orphan documents...')

  const purgeTargets: { type: string; validIds: Set<string> }[] = [
    { type: 'comparison', validIds: comparisonIds },
    { type: 'trip', validIds: tripIds },
    { type: 'testimonial', validIds: testimonialIds },
    { type: 'blogPost', validIds: blogPostIds },
    { type: 'coordinator', validIds: new Set(coordIdMap.values()) },
    { type: 'destination', validIds: new Set(destIdMap.values()) },
    { type: 'country', validIds: new Set(countryIdMap.values()) },
    { type: 'continent', validIds: new Set(continentIdMap.values()) },
    { type: 'tripCategory', validIds: categoryIds },
    { type: 'season', validIds: seasonIds },
  ]

  let totalPurged = 0

  for (const { type, validIds } of purgeTargets) {
    const existing = await client.fetch<string[]>(
      `*[_type == $type]._id`,
      { type }
    )
    const orphans = existing.filter((id) => !validIds.has(id))

    if (orphans.length === 0) continue

    console.log(`  ${type}: ${orphans.length} orphan(s) → ${orphans.join(', ')}`)

    if (!dryRun) {
      const deleteTx = client.transaction()
      for (const id of orphans) {
        deleteTx.delete(id)
      }
      await deleteTx.commit()
      console.log(`  🗑️ Deleted ${orphans.length} ${type}(s)`)
    } else {
      console.log(`  ⏭️ Skipped (dry-run)`)
    }

    totalPurged += orphans.length
  }

  if (totalPurged === 0) {
    console.log('  No orphan documents found.')
  } else if (dryRun) {
    console.log(`\n⚠️ Dry-run: ${totalPurged} orphan(s) would be deleted. Run without --dry-run to apply.`)
  } else {
    console.log(`\n🗑️ Purged ${totalPurged} orphan document(s) total.`)
  }
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
