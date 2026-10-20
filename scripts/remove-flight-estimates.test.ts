import assert from 'node:assert/strict'
import {
  buildFlightEstimatePatch,
  COPY_REPLACEMENTS,
  findLegacyCopy,
  type SanityDocument,
} from './remove-flight-estimates'

const trip: SanityDocument = {
  _id: 'trip-example',
  _rev: 'rev-1',
  _type: 'trip',
  flightEstimate: 650,
  priceFrom: 1200,
}
assert.deepEqual(buildFlightEstimatePatch(trip), {
  id: 'trip-example',
  revision: 'rev-1',
  type: 'trip',
  set: {},
  unset: ['flightEstimate'],
})

const africaReplacement = COPY_REPLACEMENTS.find(({id}) => id === 'continent-africa')!
const africa: SanityDocument = {
  _id: africaReplacement.id,
  _rev: 'rev-2',
  _type: 'continent',
  faqs: [{}, {}, {answer: africaReplacement.before}],
}
assert.deepEqual(buildFlightEstimatePatch(africa), {
  id: africaReplacement.id,
  revision: 'rev-2',
  type: 'continent',
  set: {[africaReplacement.path]: africaReplacement.after},
  unset: [],
})

const alreadyMigrated: SanityDocument = {
  ...africa,
  faqs: [{}, {}, {answer: africaReplacement.after}],
}
assert.equal(buildFlightEstimatePatch(alreadyMigrated), null)
assert.deepEqual(findLegacyCopy([alreadyMigrated]), COPY_REPLACEMENTS
  .filter(({id}) => id !== africaReplacement.id)
  .map(({id, path}) => ({id, path})))

const allLegacyDocuments = COPY_REPLACEMENTS.map((replacement, index) => {
  const document: SanityDocument = {_id: replacement.id, _rev: `rev-${index}`, _type: 'test'}
  const match = replacement.path.match(/^faqs\[(\d+)\]\.answer$/)
  if (match) {
    const faqIndex = Number(match[1])
    document.faqs = Array.from({length: faqIndex + 1}, () => ({}))
    ;(document.faqs as Array<{answer?: string}>)[faqIndex] = {answer: replacement.before}
  } else if (replacement.path.includes('.')) {
    const [root, leaf] = replacement.path.split('.')
    document[root] = {[leaf]: replacement.before}
  } else {
    document[replacement.path] = replacement.before
  }
  return document
})
assert.equal(findLegacyCopy(allLegacyDocuments).length, COPY_REPLACEMENTS.length)

console.log('remove-flight-estimates: tests passed')
