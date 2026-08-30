/** Create-only import. Default: read-only preflight. --write-drafts never publishes. */
import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {createReadStream} from 'node:fs'
import {readFile, writeFile} from 'node:fs/promises'
import {basename, resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

dotenv.config({quiet: true})
const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '../..')
const manifest = JSON.parse(await readFile(resolve(dir, 'manifest.json'), 'utf8'))
const write = process.argv.includes('--write-drafts')
assert(process.argv.slice(2).every((arg) => ['--write-drafts', '--dry-run'].includes(arg)), 'Unknown argument')
const token = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN
assert(token, 'SANITY_TOKEN or SANITY_WRITE_TOKEN required')
assert.equal(process.env.SANITY_PROJECT_ID, '73m9u2gt', 'Unexpected project')
assert.equal(process.env.SANITY_DATASET || 'production', 'production', 'Unexpected dataset')
const client = createClient({projectId: process.env.SANITY_PROJECT_ID, dataset: 'production', token,
  apiVersion: '2026-03-16', useCdn: false, perspective: 'raw', timeout: 120000})
const ref = (id) => ({_type: 'reference', _ref: id})
const draftRef = (id, type) => ({...ref(id), _weak: true, _strengthenOnPublish: {type}})
const slug = (current) => ({_type: 'slug', current})
const withKeys = (items, type) => items.map((item, index) => ({_type: type, _key: `${type}-${index + 1}`, ...item}))
const pending = []
const assetSpecs = []
const plannedIds = []

for (const d of manifest.destinations) {
  assert(['vietnam', 'costa-rica'].includes(d.slug))
  assert.equal(d.photos.filter((p) => p.hero).length, 1)
  assert(d.photos.length >= 6)
  assert(d.shortDescription.length <= 80)
  assert(d.hasCoordinator === true && d.travelInsuranceIncluded === false)
  assert.equal(d.itinerary.length, d.slug === 'vietnam' ? 14 : 12)
  d.itinerary.forEach((day, index) => assert.equal(day.day, index + 1))
  assert(/compressed\.pdf$/i.test(d.pdf))
  const pdf = await readFile(resolve(root, d.pdf))
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  assert.equal(createHash('sha1').update(pdf).digest('hex'), d.pdfSha1)
  assetSpecs.push({path: d.pdf, sha1: d.pdfSha1, type: 'file', contentType: 'application/pdf'})
  for (const photo of d.photos) {
    assert(photo.alt.trim())
    const bytes = await readFile(resolve(root, photo.path))
    assert.equal(createHash('sha1').update(bytes).digest('hex'), photo.sha1)
    assetSpecs.push({...photo, type: 'image', contentType: 'image/jpeg'})
  }
  plannedIds.push(d.country.id, `destination-${d.slug}`, ...d.trips.map((t) => t.id))
  for (const t of d.trips) {
    const days = (Date.parse(t.returnDate) - Date.parse(t.departureDate)) / 86400000 + 1
    assert.equal(days, t.durationDays)
    assert.equal(t.durationDays, d.itinerary.length)
    assert.equal(t.priceFrom, d.slug === 'vietnam' ? 1200 : 1500)
    for (const field of ['flightEstimate', 'totalPlaces', 'placesLeft', 'status', 'coordinatorId']) {
      if (t[field] == null) pending.push({trip: t.id, field})
    }
    if (t.flightEstimate != null) assert(t.flightEstimate >= 0)
    if (t.totalPlaces != null) assert(Number.isInteger(t.totalPlaces) && t.totalPlaces > 0)
    if (t.placesLeft != null) assert(Number.isInteger(t.placesLeft) && t.placesLeft >= 0 && t.placesLeft <= t.totalPlaces)
    if (t.status != null) assert(['open', 'almost-full', 'full'].includes(t.status))
  }
}

const allIds = plannedIds.flatMap((id) => [id, `drafts.${id}`])
const state = await client.fetch(`{
  "collisions": *[_id in $ids || (_type in ["country", "destination"] && (slug.current in $slugs || lower(name) in $names)) || (_type == "trip" && (destination._ref in $destinationIds || title match "*Vietnam*" || title match "*Costa Rica*"))]{_id,_type,name,title},
  "continents": *[_type == "continent" && _id in $continents]{_id},
  "coordinators": *[_type == "coordinator" && !(_id in path("drafts.**"))]{_id},
  "assets": *[_type in ["sanity.imageAsset", "sanity.fileAsset"] && sha1hash in $hashes]{_id,sha1hash,url,originalFilename,size}
}`, {ids: allIds, slugs: manifest.destinations.map((d) => d.slug), names: ['vietnam', 'costa rica'],
  destinationIds: manifest.destinations.flatMap((d) => [`destination-${d.slug}`, `drafts.destination-${d.slug}`]),
  continents: manifest.destinations.map((d) => d.continentId), hashes: assetSpecs.map((a) => a.sha1)})
assert.equal(state.collisions.length, 0, `Existing documents: ${JSON.stringify(state.collisions)}. No documents overwritten.`)
assert.equal(state.continents.length, 2, 'Missing published continent')
for (const d of manifest.destinations) for (const t of d.trips) {
  if (t.coordinatorId) assert(state.coordinators.some((c) => c._id === t.coordinatorId), 'Unknown coordinator')
}
const report = {mode: write ? 'write-drafts' : 'dry-run', createdAt: new Date().toISOString(),
  projectId: client.config().projectId, dataset: client.config().dataset,
  plannedDocuments: plannedIds.map((id) => `drafts.${id}`), pending, notes: manifest.notes, assets: []}
const reportPath = resolve(dir, write ? 'result.json' : 'preflight.json')
await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({mode: report.mode, documents: plannedIds.length, images: assetSpecs.filter((a) => a.type === 'image').length,
  pdfs: assetSpecs.filter((a) => a.type === 'file').length, pending}, null, 2))
if (!write) process.exit(0)

const assets = new Map()
for (const spec of assetSpecs) {
  const reused = state.assets.find((a) => a.sha1hash === spec.sha1)
  const asset = reused || await client.assets.upload(spec.type, createReadStream(resolve(root, spec.path)), {
    filename: basename(spec.path), contentType: spec.contentType,
  })
  assert.equal(asset.sha1hash, spec.sha1, `Asset hash mismatch: ${spec.path}`)
  assets.set(spec.path, asset._id)
  report.assets.push({path: spec.path, id: asset._id, sha1: spec.sha1, url: asset.url,
    originalFilename: asset.originalFilename, size: asset.size, reused: !!reused})
  await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n')
  console.log(`${reused ? 'Reused' : 'Uploaded'}: ${spec.path}`)
}
const docs = []
for (const d of manifest.destinations) {
  docs.push({_id: `drafts.${d.country.id}`, _type: 'country', name: d.country.name, slug: slug(d.slug),
    continent: ref(d.continentId), flag: d.country.flag, currency: d.country.currency, language: d.country.language,
    seo: {_type: 'seoFields', title: `Viajes a ${d.name} en grupo | Travelhood`,
      description: d.seo.description, keywords: d.seo.keywords}})
  const gallery = d.photos.filter((p) => !p.hero).map((p, i) => ({_type: 'image', _key: `photo-${i + 1}`, asset: ref(assets.get(p.path)), alt: p.alt}))
  const hero = d.photos.find((p) => p.hero)
  docs.push({_id: `drafts.destination-${d.slug}`, _type: 'destination', name: d.name, slug: slug(d.slug),
    country: draftRef(d.country.id, 'country'), continent: ref(d.continentId), description: d.description,
    shortDescription: d.shortDescription, heroImage: {_type: 'image', asset: ref(assets.get(hero.path))},
    heroImageAlt: hero.alt, gallery, highlights: d.highlights, idealFor: d.idealFor, hasCoordinator: d.hasCoordinator,
    categories: d.categories, climate: d.climate, included: d.included, notIncluded: d.notIncluded,
    travelInsuranceIncluded: d.travelInsuranceIncluded, itinerary: withKeys(d.itinerary, 'itineraryDay'),
    faqs: withKeys(d.faqs, 'faqItem'), seo: {_type: 'destinationSeo', ...d.seo},
    pdfFile: {_type: 'file', asset: ref(assets.get(d.pdf))}})
  for (const t of d.trips) {
    const doc = {_id: `drafts.${t.id}`, _type: 'trip', title: t.title, slug: slug(t.id.replace(/^trip-/, '')),
      destination: draftRef(`destination-${d.slug}`, 'destination'), departureDate: t.departureDate,
      returnDate: t.returnDate, durationDays: t.durationDays, priceFrom: t.priceFrom, tags: t.tags}
    for (const field of ['flightEstimate', 'totalPlaces', 'placesLeft', 'status']) {
      if (t[field] != null) doc[field] = t[field]
    }
    if (t.coordinatorId) doc.coordinator = ref(t.coordinatorId)
    docs.push(doc)
  }
}
await writeFile(resolve(dir, 'documents.json'), JSON.stringify(docs, null, 2) + '\n')
let transaction = client.transaction()
for (const doc of docs) transaction = transaction.create(doc)
const result = await transaction.commit({visibility: 'sync'})
report.transactionId = result.transactionId
await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n')
const actual = await client.fetch('*[_id in $ids]', {ids: docs.map((d) => d._id)})
assert.equal(actual.length, docs.length)
for (const expected of docs) {
  const found = actual.find((d) => d._id === expected._id)
  const {_createdAt, _updatedAt, _rev, ...content} = found
  assert.deepEqual(content, expected, `Readback mismatch: ${expected._id}`)
}
report.verifiedAt = new Date().toISOString()
report.verifiedDocuments = actual.map((d) => ({id: d._id, revision: d._rev}))
await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n')
console.log(`Verified ${actual.length} new draft documents and ${report.assets.length} assets. Nothing published or overwritten.`)
