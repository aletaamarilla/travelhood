/** Publish only the six reviewed Dolomitas drafts, with revision guards. Default: dry-run. */
import assert from 'node:assert/strict'
import {readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '../..')
dotenv.config({path: resolve(root, '.env'), quiet: true})
assert(process.argv.slice(2).every((arg) => ['--dry-run', '--publish'].includes(arg)), 'Unknown argument')
const publish = process.argv.includes('--publish')
assert(!(publish && process.argv.includes('--dry-run')), 'Choose --dry-run or --publish')
assert.equal(process.env.SANITY_PROJECT_ID, '73m9u2gt', 'Unexpected Sanity project')
assert.equal(process.env.SANITY_DATASET || 'production', 'production', 'Unexpected Sanity dataset')
const token = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN
assert(token, 'Sanity write token required')

const client = createClient({
  projectId: '73m9u2gt',
  dataset: 'production',
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
  perspective: 'raw',
  timeout: 120000,
})
const read = async (filename) => JSON.parse(await readFile(resolve(dir, filename), 'utf8'))
const save = (filename, value) => writeFile(resolve(dir, filename), `${JSON.stringify(value, null, 2)}\n`)
const original = await read('saved-drafts.json')
const manifest = await read('manifest.json')
assert.equal(manifest.approvals?.capacityConfirmed, true, 'Capacity must be confirmed')
assert.equal(manifest.approvals?.publicationRequested, true, 'Publication must be requested')
assert.equal(manifest.approvals?.coordinatorPendingAssignment, true)
const expectedDraftIds = [
  'drafts.country-italia',
  'drafts.destination-dolomitas',
  ...manifest.trips.map((trip) => `drafts.${trip.id}`),
]
assert.equal(original.length, 6)
assert.deepEqual(new Set(original.map((document) => document._id)), new Set(expectedDraftIds))

const publishedIds = expectedDraftIds.map((id) => id.replace(/^drafts\./, ''))
const current = await client.fetch('*[_id in $ids]', {ids: [...expectedDraftIds, ...publishedIds]})
assert.equal(current.length, 6, 'Expected six drafts and no published Dolomitas/Italia documents')
const semanticCollisions = await client.fetch(`*[!(_id in $allowedIds) && (
  (_type == "country" && (slug.current == "italia" || lower(name) == "italia")) ||
  (_type == "destination" && (slug.current == "dolomitas" || lower(name) == "dolomitas")) ||
  (_type == "trip" && (destination._ref == "destination-dolomitas" || title match "*Dolomitas*"))
)]{_id,_type,name,title,"slug":slug.current,_rev}`, {
  allowedIds: [...expectedDraftIds, ...publishedIds],
})
assert.equal(semanticCollisions.length, 0,
  `Semantic collision created during review: ${JSON.stringify(semanticCollisions)}`)
const coordinator = {status: 'pending-assignment'}

const documents = original.map((before) => {
  const draft = current.find((document) => document._id === before._id)
  assert.deepEqual(draft, before, `Draft changed since review: ${before._id}`)
  const {_createdAt, _updatedAt, _rev, ...document} = structuredClone(draft)
  document._id = document._id.replace(/^drafts\./, '')
  for (const field of ['country', 'destination']) {
    if (document[field]) document[field] = {_type: 'reference', _ref: document[field]._ref}
  }
  if (document._type === 'trip') {
    delete document.flightEstimate
    assert.equal(document.priceFrom, 1000)
    assert.equal(document.totalPlaces, 15)
    assert.equal(document.placesLeft, 15)
    assert.equal(document.status, 'open')
    assert.equal(document.coordinator, undefined)
    assert.equal((Date.parse(document.returnDate) - Date.parse(document.departureDate)) / 86400000 + 1, 7)
  }
  return document
})
assert.equal(documents.filter((document) => document._type === 'trip').length, 4)
await save('publication-documents.json', documents)
await writeFile(resolve(dir, 'publication-documents.ndjson'), `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`)
console.log(JSON.stringify({
  mode: publish ? 'publish' : 'dry-run',
  documents: documents.length,
  coordinator,
  priceFrom: 1000,
  totalPlaces: 15,
  placesLeft: 15,
}, null, 2))
if (!publish) process.exit(0)

let transaction = client.transaction()
for (const draft of current) {
  transaction = transaction.patch(draft._id, (patch) => patch.ifRevisionId(draft._rev).set(
    draft._type === 'trip' ? {title: draft.title} : {name: draft.name},
  ))
}
for (const document of documents) transaction = transaction.create(document)
for (const draftId of expectedDraftIds) transaction = transaction.delete(draftId)
const result = await transaction.commit({visibility: 'sync'})

const actual = await client.fetch('*[_id in $ids]', {ids: [...expectedDraftIds, ...publishedIds]})
assert.equal(actual.length, documents.length)
for (const expected of documents) {
  const found = actual.find((document) => document._id === expected._id)
  assert(found)
  const {_createdAt, _updatedAt, _rev, ...content} = found
  assert.deepEqual(content, expected, `Published readback mismatch: ${expected._id}`)
}
await save('published-documents.json', actual)
await save('publication-result.json', {
  publishedAt: new Date().toISOString(),
  transactionId: result.transactionId,
  documentIds: publishedIds,
  coordinator,
  priceFrom: 1000,
})
console.log('Verified six published documents and no remaining Dolomitas drafts.')
