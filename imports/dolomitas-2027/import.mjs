/** Create-only Dolomitas import. Default: read-only preflight; --write-drafts never publishes. */
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {createReadStream} from 'node:fs'
import {readFile, writeFile} from 'node:fs/promises'
import {basename, dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '../..')
dotenv.config({path: resolve(root, '.env'), quiet: true})

assert(process.argv.slice(2).every((arg) => ['--dry-run', '--write-drafts'].includes(arg)), 'Unknown argument')
const writeDrafts = process.argv.includes('--write-drafts')
assert(!(writeDrafts && process.argv.includes('--dry-run')), 'Choose --dry-run or --write-drafts')
assert.equal(process.env.SANITY_PROJECT_ID, '73m9u2gt', 'Unexpected Sanity project')
assert.equal(process.env.SANITY_DATASET || 'production', 'production', 'Unexpected Sanity dataset')
const writeToken = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN
const readToken = process.env.SANITY_READ_TOKEN || writeToken
const token = writeDrafts ? writeToken : readToken
assert(token, writeDrafts ? 'Sanity write token required' : 'Sanity read token required')

const client = createClient({
  projectId: '73m9u2gt',
  dataset: 'production',
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
  perspective: 'raw',
  timeout: 120000,
})
const manifest = JSON.parse(await readFile(resolve(dir, 'manifest.json'), 'utf8'))
const save = (filename, value) => writeFile(resolve(dir, filename), `${JSON.stringify(value, null, 2)}\n`)
const {destination: destination, trips} = manifest

assert.equal(destination.id, 'destination-dolomitas')
assert.equal(destination.country.id, 'country-italia')
assert.equal(destination.continentId, 'continent-europa')
assert.equal(destination.slug, 'dolomitas')
assert.equal(destination.photos.length, 5, 'Expected the documented five-photo exception')
assert.equal(destination.photos.filter((photo) => photo.hero).length, 1)
assert.equal(destination.itinerary.length, 7)
destination.itinerary.forEach((day, index) => {
  assert.equal(day.day, index + 1)
  assert(day.title && day.description)
})
assert(destination.shortDescription.length <= 80)
assert.equal(destination.hasCoordinator, true)
assert.equal(destination.inheritDefaultNotIncluded, true)
assert(!destination.included.some((item) => /seguro de viaje/i.test(item)))
assert(!destination.notIncluded.some((item) => /vuelos|seguro de viaje|comidas|gastos personales/i.test(item)),
  'Global exclusions must not be duplicated')
for (const [key, value] of Object.entries(destination.seo)) {
  if (/title$/i.test(key)) assert(value.length <= 60, `${key} is longer than 60 characters`)
  if (/description$/i.test(key)) assert(value.length <= 155, `${key} is longer than 155 characters`)
}

assert.equal(trips.length, 4)
assert.equal(new Set(trips.map((trip) => trip.departureDate)).size, 4)
for (const trip of trips) {
  assert.equal(trip.id, `trip-dolomitas-${trip.departureDate}`)
  assert.equal((Date.parse(trip.returnDate) - Date.parse(trip.departureDate)) / 86400000 + 1, 7)
  assert.equal(trip.durationDays, 7)
  assert.equal(trip.priceFrom, 1000)
  assert.equal(trip.totalPlaces, 15)
  assert.equal(trip.placesLeft, 15)
  assert.equal(trip.status, 'open')
  assert.equal(trip.coordinatorId, null, 'Coordinator pending assignment')
}

const assetSpecs = [
  {path: destination.pdf, sha1: destination.pdfSha1, type: 'file', contentType: 'application/pdf'},
  ...destination.photos.map((photo) => ({...photo, type: 'image', contentType: 'image/jpeg'})),
]
for (const spec of assetSpecs) {
  const bytes = await readFile(resolve(root, spec.path))
  assert.equal(createHash('sha1').update(bytes).digest('hex'), spec.sha1, `Hash mismatch: ${spec.path}`)
  if (spec.type === 'file') assert.equal(bytes.subarray(0, 5).toString(), '%PDF-')
  else assert(spec.alt?.trim(), `Missing alt: ${spec.path}`)
}

const publishedIds = [destination.country.id, destination.id, ...trips.map((trip) => trip.id)]
const allIds = publishedIds.flatMap((id) => [id, `drafts.${id}`])
const state = await client.fetch(`{
  "collisions": *[_id in $ids || (_type == "country" && (slug.current == "italia" || lower(name) == "italia")) || (_type == "destination" && (slug.current == "dolomitas" || lower(name) == "dolomitas")) || (_type == "trip" && (destination._ref == "destination-dolomitas" || title match "*Dolomitas*"))]{_id,_type,name,title,"slug":slug.current,_rev},
  "continent": *[_id == "continent-europa" && _type == "continent"][0]{_id,name,_rev},
  "assets": *[_type in ["sanity.imageAsset", "sanity.fileAsset"] && sha1hash in $hashes]{_id,sha1hash,url,size,originalFilename}
}`, {ids: allIds, hashes: assetSpecs.map((spec) => spec.sha1)})

assert.equal(state.collisions.length, 0, `Dolomitas or Italia already exists: ${JSON.stringify(state.collisions)}`)
assert(state.continent, 'Published Europe continent is missing')

const preflight = {
  checkedAt: new Date().toISOString(),
  mode: writeDrafts ? 'write-drafts' : 'dry-run',
  projectId: client.config().projectId,
  dataset: client.config().dataset,
  plannedPublishedIds: publishedIds,
  plannedDraftIds: publishedIds.map((id) => `drafts.${id}`),
  assetCount: assetSpecs.length,
  existingAssets: state.assets,
  continent: state.continent,
  coordinator: 'pending-assignment',
  approvals: manifest.approvals,
  notes: manifest.notes,
}
await save('preflight.json', preflight)
console.log(JSON.stringify({mode: preflight.mode, documents: publishedIds.length, images: 5, pdfs: 1, collisions: 0}, null, 2))
if (!writeDrafts) process.exit(0)
assert.equal(manifest.approvals?.capacityConfirmed, true, 'Capacity must be confirmed')
assert.equal(manifest.approvals?.publicationRequested, true, 'Publication must be requested')
assert.equal(manifest.approvals?.coordinatorPendingAssignment, true)

const assets = new Map()
const assetReport = {uploadedAt: new Date().toISOString(), assets: []}
for (const spec of assetSpecs) {
  const reused = state.assets.find((asset) => asset.sha1hash === spec.sha1)
  const asset = reused || await client.assets.upload(spec.type, createReadStream(resolve(root, spec.path)), {
    filename: basename(spec.path),
    contentType: spec.contentType,
  })
  assert.equal(asset.sha1hash, spec.sha1, `Uploaded asset hash mismatch: ${spec.path}`)
  assets.set(spec.path, asset._id)
  assetReport.assets.push({
    path: spec.path,
    id: asset._id,
    sha1: asset.sha1hash,
    url: asset.url,
    size: asset.size,
    reused: Boolean(reused),
  })
  await save('assets.json', assetReport)
  console.log(`${reused ? 'Reused' : 'Uploaded'} ${basename(spec.path)}`)
}

const ref = (_ref) => ({_type: 'reference', _ref})
const draftRef = (_ref, type) => ({...ref(_ref), _weak: true, _strengthenOnPublish: {type}})
const slug = (current) => ({_type: 'slug', current})
const keyed = (items, type) => items.map((item, index) => ({_type: type, _key: `${type}-${index + 1}`, ...item}))
const hero = destination.photos.find((photo) => photo.hero)
const documents = [
  {
    _id: `drafts.${destination.country.id}`,
    _type: 'country',
    name: destination.country.name,
    slug: slug(destination.country.slug),
    continent: ref(destination.continentId),
    flag: destination.country.flag,
    currency: destination.country.currency,
    language: destination.country.language,
    visaRequired: false,
    seo: {
      _type: 'seoFields',
      title: 'Viajes a Italia en grupo | Travel Hood',
      description: 'Descubre Italia en grupo con Travel Hood: rutas por las Dolomitas, naturaleza, senderismo y viajes organizados para venir por tu cuenta.',
      keywords: 'Italia en grupo, viaje a Italia, Dolomitas, viajes organizados Italia',
    },
  },
  {
    _id: `drafts.${destination.id}`,
    _type: 'destination',
    name: destination.name,
    slug: slug(destination.slug),
    country: draftRef(destination.country.id, 'country'),
    continent: ref(destination.continentId),
    description: destination.description,
    shortDescription: destination.shortDescription,
    heroImage: {_type: 'image', asset: ref(assets.get(hero.path))},
    heroImageAlt: hero.alt,
    gallery: destination.photos.filter((photo) => !photo.hero).map((photo, index) => ({
      _type: 'image',
      _key: `photo-${index + 1}`,
      asset: ref(assets.get(photo.path)),
      alt: photo.alt,
    })),
    highlights: destination.highlights,
    idealFor: destination.idealFor,
    hasCoordinator: destination.hasCoordinator,
    categories: destination.categories,
    climate: destination.climate,
    included: destination.included,
    inheritDefaultNotIncluded: destination.inheritDefaultNotIncluded,
    notIncluded: destination.notIncluded,
    itinerary: keyed(destination.itinerary, 'itineraryDay'),
    faqs: keyed(destination.faqs, 'faqItem'),
    seo: {_type: 'destinationSeo', ...destination.seo},
    pdfFile: {_type: 'file', asset: ref(assets.get(destination.pdf))},
  },
  ...trips.map((trip) => ({
    _id: `drafts.${trip.id}`,
    _type: 'trip',
    title: trip.title,
    slug: slug(trip.slug),
    destination: draftRef(destination.id, 'destination'),
    departureDate: trip.departureDate,
    returnDate: trip.returnDate,
    durationDays: trip.durationDays,
    priceFrom: trip.priceFrom,
    totalPlaces: trip.totalPlaces,
    placesLeft: trip.placesLeft,
    status: trip.status,
    tags: trip.tags,
  })),
]

await save('draft-documents.json', documents)
await writeFile(resolve(dir, 'draft-documents.ndjson'), `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`)
let transaction = client.transaction()
for (const document of documents) transaction = transaction.create(document)
const result = await transaction.commit({visibility: 'sync'})
const actual = await client.fetch('*[_id in $ids]', {ids: documents.map((document) => document._id)})
assert.equal(actual.length, documents.length)
for (const expected of documents) {
  const found = actual.find((document) => document._id === expected._id)
  assert(found)
  const {_createdAt, _updatedAt, _rev, ...content} = found
  assert.deepEqual(content, expected, `Draft readback mismatch: ${expected._id}`)
}
await save('saved-drafts.json', actual)
await save('draft-result.json', {
  createdAt: new Date().toISOString(),
  transactionId: result.transactionId,
  documentIds: actual.map((document) => document._id),
  revisions: actual.map((document) => ({id: document._id, revision: document._rev})),
})
console.log(`Verified ${actual.length} new draft documents. Nothing published or overwritten.`)
