/** Complete and publish only the eight reviewed import drafts. Default: dry-run. */
import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
import assert from 'node:assert/strict'
import {readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

dotenv.config({quiet: true})
const dir = dirname(fileURLToPath(import.meta.url))
const load = async (file) => JSON.parse(await readFile(resolve(dir, file), 'utf8'))
const save = async (file, data) => writeFile(resolve(dir, file), JSON.stringify(data, null, 2) + '\n')
const write = process.argv.includes('--publish')
assert(process.argv.slice(2).every((arg) => ['--publish', '--dry-run'].includes(arg)))
assert.equal(process.env.SANITY_PROJECT_ID, '73m9u2gt')
assert.equal(process.env.SANITY_DATASET || 'production', 'production')
const client = createClient({projectId: process.env.SANITY_PROJECT_ID, dataset: 'production',
  token: process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2026-03-16', useCdn: false, perspective: 'raw'})
const original = await load('before-publication.json')
const ids = (await load('result.json')).plannedDocuments
const current = await client.fetch('*[_id in $ids]', {ids: ids.flatMap((id) => [id, id.replace(/^drafts\./, '')])})
assert.equal(current.length, 8, 'Expected exactly 8 drafts, without published duplicates')
const coordinator = await client.fetch('*[_id == "coordinator-carlos" && _type == "coordinator"][0]{_id,name}')
assert.equal(coordinator?._id, 'coordinator-carlos')
const published = []
for (const id of ids) {
  const draft = current.find((d) => d._id === id)
  assert(draft, `Draft missing: ${id}`)
  assert.deepEqual(draft, original.documents.find((d) => d._id === id), `Draft changed: ${id}`)
  const {_createdAt, _updatedAt, _rev, ...doc} = draft
  doc._id = id.replace(/^drafts\./, '')
  for (const field of ['country', 'destination']) {
    if (doc[field]) doc[field] = {_type: 'reference', _ref: doc[field]._ref}
  }
  if (doc._type === 'trip') {
    const vietnam = doc.destination._ref === 'destination-vietnam'
    Object.assign(doc, {totalPlaces: 15, placesLeft: 15, status: 'open', flightEstimate: vietnam ? 1000 : 800,
      coordinator: {_type: 'reference', _ref: coordinator._id}})
    assert.equal((Date.parse(doc.returnDate) - Date.parse(doc.departureDate)) / 86400000 + 1, doc.durationDays)
    assert.equal(doc.priceFrom, vietnam ? 1200 : 1500)
  }
  published.push(doc)
}
assert.equal(published.filter((d) => d._type === 'trip').length, 4)
const allowedRefs = new Set([...published.map((d) => d._id), 'continent-asia', 'continent-centroamerica', coordinator._id])
for (const doc of published) {
  for (const field of ['country', 'continent', 'destination', 'coordinator']) if (doc[field]) assert(allowedRefs.has(doc[field]._ref))
}
await save('publication-documents.json', published)
console.log(JSON.stringify({mode: write ? 'publish' : 'dry-run', documents: published.length,
  trips: published.filter((d) => d._type === 'trip').map(({_id, totalPlaces, placesLeft, flightEstimate, status}) => ({_id, totalPlaces, placesLeft, flightEstimate, status})),
  coordinator: coordinator.name}, null, 2))
if (!write) process.exit(0)
let tx = client.transaction()
for (const draft of current) {
  // Guard every source revision before creating its published copy and removing the draft.
  tx = tx.patch(draft._id, (p) => p.ifRevisionId(draft._rev).set(draft._type === 'trip' ? {title: draft.title} : {name: draft.name}))
}
for (const doc of published) tx = tx.create(doc)
for (const id of ids) tx = tx.delete(id)
const result = await tx.commit({visibility: 'sync'})
await save('publication-result.json', {publishedAt: new Date().toISOString(), transactionId: result.transactionId,
  documentIds: published.map((d) => d._id), coordinator, flightEstimates: {vietnam: 1000, 'costa-rica': 800}, totalPlaces: 15, placesLeft: 15, status: 'open'})
const actual = await client.fetch('*[_id in $ids]', {ids: [...ids, ...published.map((d) => d._id)]})
assert.equal(actual.length, 8)
for (const expected of published) {
  const found = actual.find((d) => d._id === expected._id)
  assert(found)
  const {_createdAt, _updatedAt, _rev, ...data} = found
  assert.deepEqual(data, expected)
}
await save('published-documents.json', actual)
console.log('Verified: 8 published documents, no remaining drafts; content and assets preserved.')
