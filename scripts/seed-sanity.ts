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
  } = travelData
  const { blogPosts } = blogData
  const { comparisons } = comparisonsData

  const tx = client.transaction()

  // Maps to track generated _ids for references
  const continentIdMap = new Map<string, string>()
  const countryIdMap = new Map<string, string>()
  const destIdMap = new Map<string, string>()
  const coordIdMap = new Map<string, string>()

  // 1. Site Settings
  console.log('📝 siteSettings...')
  tx.createOrReplace({
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteName: 'Travelhood',
    siteUrl: 'https://travelhood.es',
    priceRange: '590€ - 1.590€',
    contactEmail: 'hola@travelhood.es',
    socialLinks: [
      { _key: makeKey(), platform: 'instagram', url: 'https://instagram.com/travelhood.es' },
      { _key: makeKey(), platform: 'tiktok', url: 'https://tiktok.com/@travelhood.es' },
    ],
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
    })
  }

  // 4. Destinations
  console.log('📍 Destinations...')
  for (const d of destinations) {
    const _id = `destination-${d.slug}`
    destIdMap.set(d.id, _id)

    const faqs: { _key: string; question: string; answer: string }[] = []

    tx.createOrReplace({
      _type: 'destination',
      _id,
      name: d.name,
      slug: makeSlug(d.slug),
      country: makeRef(countryIdMap.get(d.countryId) ?? ''),
      continent: makeRef(continentIdMap.get(d.continentId) ?? ''),
      description: d.description,
      shortDescription: d.shortDescription,
      highlights: d.highlights,
      idealFor: d.idealFor,
      climate: d.climate,
      categories: d.categories,
      faqs,
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

    let enrichedItinerary = t.itinerary.map((d: { day: number; title: string; description: string }) => ({
      _key: makeKey(),
      day: d.day,
      title: d.title,
      description: d.description,
    }))


    tx.createOrReplace({
      _type: 'trip',
      _id: `trip-${tripSlug}`,
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
      included: t.included,
      notIncluded: t.notIncluded,
      itinerary: enrichedItinerary,
      tags: t.tags,
    })
  }

  // 7. Testimonials
  console.log('⭐ Testimonials...')
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    tx.createOrReplace({
      _type: 'testimonial',
      _id: `testimonial-${i}`,
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
    tx.createOrReplace({
      _type: 'tripCategory',
      _id: `category-${cat.slug}`,
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
    tx.createOrReplace({
      _type: 'season',
      _id: `season-${s.slug}`,
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
    tx.createOrReplace({
      _type: 'blogPost',
      _id: `blog-${p.slug}`,
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
    tx.createOrReplace({
      _type: 'comparison',
      _id: `comparison-${c.slugA}-vs-${c.slugB}`,
      slug: makeSlug(`${c.slugA}-vs-${c.slugB}`),
      destinationA: makeRef(destIdMap.get(destA?.id ?? '') ?? ''),
      destinationB: makeRef(destIdMap.get(destB?.id ?? '') ?? ''),
      verdict: c.verdict,
    })
  }

  // Commit
  console.log('\n🚀 Committing transaction...')
  const result = await tx.commit()
  console.log(`✅ Done! ${result.results.length} documents created/updated.`)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
