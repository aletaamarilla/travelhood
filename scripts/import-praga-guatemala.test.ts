import assert from 'node:assert/strict'

import {
  buildPlan,
  parseArgs,
  validateAllowlist,
  validateManifestContract,
  validateRemoteState,
  type ImageDerivativeReport,
  type Manifest,
  type RemotePreflight,
} from './import-praga-guatemala.ts'

function field<T>(value: T) {
  return {value}
}

function baseManifest(): Manifest {
  return {
    schemaVersion: 1,
    slug: 'fillNewDestination',
    generatedAt: '2026-07-10',
    sourceFiles: [],
    assets: [
      {
        sourcePath: 'new_destination/praga_images/Praga 1.jpg',
        sha256: 'source-praga',
        destination: 'destination-praga',
        role: 'hero_candidate',
        proposedAlt: 'Mercado navideno de Praga',
        approvalStatus: 'approved_by_user',
        rights: 'approved_by_user',
      },
      {
        sourcePath: 'new_destination/guatemala_images/hero.jpg',
        sha256: 'source-guatemala',
        destination: 'destination-guatemala',
        role: 'hero_candidate',
        proposedAlt: 'Atardecer en Guatemala',
        approvalStatus: 'approved_by_user',
        rights: 'approved_by_user',
      },
    ],
    allowlist: {
      countriesPotential: {
        publishedIds: ['country-chequia', 'country-guatemala'],
        draftIds: ['drafts.country-chequia', 'drafts.country-guatemala'],
      },
      destinations: {
        publishedIds: ['destination-praga', 'destination-guatemala'],
        draftIds: ['drafts.destination-praga', 'drafts.destination-guatemala'],
      },
      trips: {
        publishedIds: ['trip-praga-2026-11-26', 'trip-praga-2026-12-02', 'trip-guatemala-2027-01-19'],
        draftIds: ['drafts.trip-praga-2026-11-26', 'drafts.trip-praga-2026-12-02', 'drafts.trip-guatemala-2027-01-19'],
      },
    },
    documents: {
      countries: [
        {
          _id: {published: 'country-chequia', draft: 'drafts.country-chequia'},
          _type: 'country',
          fields: {
            name: field('Chequia'),
            slug: {current: 'chequia'},
            continent: {_ref: 'continent-europa'},
            flag: field('CZ'),
          },
        },
        {
          _id: {published: 'country-guatemala', draft: 'drafts.country-guatemala'},
          _type: 'country',
          fields: {
            name: field('Guatemala'),
            slug: {current: 'guatemala'},
            continent: {_ref: 'continent-centroamerica'},
            flag: field('GT'),
          },
        },
      ],
      destinations: [
        {
          _id: {published: 'destination-praga', draft: 'drafts.destination-praga'},
          _type: 'destination',
          fields: {
            name: field('Praga'),
            slug: {current: 'praga'},
            country: {_ref: 'country-chequia', draftRef: 'drafts.country-chequia'},
            continent: {_ref: 'continent-europa'},
            description: field('Descubre Praga en grupo.'),
            shortDescription: field('Mercados navidenos en grupo.'),
            categories: field(['cultural']),
            heroImage: {sourcePath: 'new_destination/praga_images/Praga 1.jpg'},
            heroImageAlt: field('Mercado navideno de Praga'),
            climate: field('Frio continental en invierno'),
            itinerary: field([]),
          },
        },
        {
          _id: {published: 'destination-guatemala', draft: 'drafts.destination-guatemala'},
          _type: 'destination',
          fields: {
            name: field('Guatemala'),
            slug: {current: 'guatemala'},
            country: {_ref: 'country-guatemala', draftRef: 'drafts.country-guatemala'},
            continent: {_ref: 'continent-centroamerica'},
            description: field('Descubre Guatemala en grupo.'),
            shortDescription: field('Volcanes y cultura maya en grupo.'),
            categories: field(['aventura', 'cultural', 'naturaleza']),
            heroImage: {sourcePath: 'new_destination/guatemala_images/hero.jpg'},
            heroImageAlt: field('Atardecer en Guatemala'),
            climate: field('Templado y tropical segun zona'),
            itinerary: field([]),
          },
        },
      ],
      trips: [
        {
          _id: {published: 'trip-praga-2026-11-26', draft: 'drafts.trip-praga-2026-11-26'},
          _type: 'trip',
          fields: {
            title: field('Praga - Noviembre 2026'),
            slug: {current: 'praga-noviembre-2026'},
            destination: {_ref: 'destination-praga', draftRef: 'drafts.destination-praga'},
            departureDate: field('2026-11-26'),
            returnDate: field('2026-11-30'),
            durationDays: field(5),
            priceFrom: field(425),
            flightEstimate: field(300),
            totalPlaces: field(15),
            placesLeft: field(15),
            status: field('open'),
            coordinator: field('coordinator-carlos'),
            tags: field(['puente-noviembre']),
          },
        },
        {
          _id: {published: 'trip-praga-2026-12-02', draft: 'drafts.trip-praga-2026-12-02'},
          _type: 'trip',
          fields: {
            title: field('Praga - Diciembre 2026'),
            slug: {current: 'praga-diciembre-2026'},
            destination: {_ref: 'destination-praga', draftRef: 'drafts.destination-praga'},
            departureDate: field('2026-12-02'),
            returnDate: field('2026-12-06'),
            durationDays: field(5),
            priceFrom: field(425),
            flightEstimate: field(300),
            totalPlaces: field(15),
            placesLeft: field(15),
            status: field('open'),
            coordinator: field('coordinator-carlos'),
            tags: field(['navidad']),
          },
        },
        {
          _id: {published: 'trip-guatemala-2027-01-19', draft: 'drafts.trip-guatemala-2027-01-19'},
          _type: 'trip',
          fields: {
            title: field('Guatemala - Enero 2027'),
            slug: {current: 'guatemala-enero-2027'},
            destination: {_ref: 'destination-guatemala', draftRef: 'drafts.destination-guatemala'},
            departureDate: field('2027-01-19'),
            returnDate: field('2027-01-30'),
            durationDays: field(12),
            priceFrom: field(1300),
            flightEstimate: field(900),
            totalPlaces: field(15),
            placesLeft: field(15),
            status: field('open'),
            coordinator: field('coordinator-carlos'),
            tags: field([]),
          },
        },
      ],
    },
  }
}

function imageReport(): ImageDerivativeReport {
  return {
    images: [
      {
        sourcePath: 'new_destination/praga_images/Praga 1.jpg',
        destination: 'destination-praga',
        role: 'hero',
        derivatives: [{path: 'processed/praga.jpg', type: 'image/jpeg', sha256: 'derivative-praga'}],
      },
      {
        sourcePath: 'new_destination/guatemala_images/hero.jpg',
        destination: 'destination-guatemala',
        role: 'hero',
        derivatives: [{path: 'processed/guatemala.jpg', type: 'image/jpeg', sha256: 'derivative-guatemala'}],
      },
    ],
  }
}

function existingState(): RemotePreflight['existing'] {
  return {
    continents: [{_id: 'continent-europa', _type: 'continent'}, {_id: 'continent-centroamerica', _type: 'continent'}],
    countryCandidates: [],
    destinationCollisions: [],
    tripCollisions: [],
    coordinators: [{_id: 'coordinator-carlos', _type: 'coordinator'}],
  }
}

function blockersFor(manifest: Manifest, state = existingState()) {
  return validateRemoteState(manifest, state).blockers.join('\n')
}

const valid = baseManifest()
assert.deepEqual(validateManifestContract(valid, imageReport()), [])
assert.equal(parseArgs([]).dryRun, true)
assert.equal(parseArgs(['--write-praga-guatemala-drafts']).dryRun, false)

const plan = buildPlan(valid, imageReport(), null)
assert.equal(plan.countries.length, 2)
assert.equal(plan.destinations.length, 2)
assert.equal(plan.trips.length, 3)
assert.deepEqual(validateAllowlist(plan, valid), [])
assert.deepEqual(
  plan.order.map((item) => item.kind),
  ['asset', 'asset', 'country', 'country', 'destination', 'destination', 'trip', 'trip', 'trip'],
)

const publishedCollision = existingState()
publishedCollision.destinationCollisions.push({_id: 'destination-praga', _type: 'destination', slug: {current: 'praga'}})
assert.match(blockersFor(valid, publishedCollision), /Destination target already exists: destination-praga/)

const draftCollision = existingState()
draftCollision.tripCollisions.push({_id: 'drafts.trip-praga-2026-11-26', _type: 'trip'})
assert.match(blockersFor(valid, draftCollision), /Trip target already exists: drafts\.trip-praga-2026-11-26/)

const slugCollision = existingState()
slugCollision.destinationCollisions.push({_id: 'destination-existing-praga', _type: 'destination', slug: {current: 'praga'}})
assert.match(blockersFor(valid, slugCollision), /Destination target already exists: destination-existing-praga/)

const ambiguousCountry = existingState()
ambiguousCountry.countryCandidates.push(
  {_id: 'country-guatemala', _type: 'country', name: 'Guatemala', slug: {current: 'guatemala'}, continent: {_ref: 'continent-centroamerica'}},
  {
    _id: 'country-guatemala-manual',
    _type: 'country',
    name: 'Guatemala',
    slug: {current: 'guatemala'},
    continent: {_ref: 'continent-centroamerica'},
  },
)
assert.match(blockersFor(valid, ambiguousCountry), /Ambiguous country match for Guatemala/)

const missingReference = existingState()
missingReference.continents = [{_id: 'continent-europa', _type: 'continent'}]
assert.match(blockersFor(valid, missingReference), /Missing required continent continent-centroamerica/)

const missingCoordinator = existingState()
missingCoordinator.coordinators = []
assert.match(blockersFor(valid, missingCoordinator), /references missing coordinator coordinator-carlos/)

const invalidData = baseManifest()
invalidData.documents.trips[0].fields.priceFrom.value = 0
invalidData.documents.trips[1].fields.durationDays.value = 4
invalidData.documents.destinations[0].fields.slug.current = 'Praga Invierno'
const invalidBlockers = validateManifestContract(invalidData, imageReport()).join('\n')
assert.match(invalidBlockers, /priceFrom must be positive/)
assert.match(invalidBlockers, /duration must be 5/)
assert.match(invalidBlockers, /invalid slug/)

const outsideAllowlist = baseManifest()
outsideAllowlist.documents.destinations[0]._id.draft = 'drafts.destination-ajeno'
const outsidePlan = buildPlan(outsideAllowlist, imageReport(), null)
assert.match(validateAllowlist(outsidePlan, outsideAllowlist).join('\n'), /outside the allowlist/)

console.log('import-praga-guatemala offline checks passed')
