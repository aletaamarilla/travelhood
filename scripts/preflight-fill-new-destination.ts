/**
 * Read-only Sanity preflight for fillNewDestination.
 *
 * Usage:
 *   npx tsx scripts/preflight-fill-new-destination.ts --preflight
 *   npx tsx scripts/preflight-fill-new-destination.ts --dry-run
 */

import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'

dotenv.config({path: resolve(process.cwd(), '.env')})

type Ref = {
  _ref?: string
}

type SanityDoc = {
  _id: string
  _rev: string
  _type: string
  name?: string
  title?: string
  slug?: {current?: string}
  hasCoordinator?: boolean
  continent?: Ref
  destination?: Ref
  destinations?: Ref[]
  departureDate?: string
  returnDate?: string
}

type ManifestCountry = {
  _id: {
    published: string
    draft: string
  }
  fields: {
    name: {value: string}
    slug: {current: string}
    continent: {_ref: string}
  }
}

type ManifestDestination = {
  _id: {
    published: string
    draft: string
  }
  fields: {
    name: {value: string}
    slug: {current: string}
    hasCoordinator: {value: boolean}
  }
}

type ManifestTrip = {
  _id: {
    published: string
    draft: string
  }
  fields: {
    title: {value: string}
    slug: {current: string}
    destination: {_ref: string; draftRef?: string}
    coordinator: {value: string | null}
  }
}

type Manifest = {
  slug: string
  documents: {
    countries: ManifestCountry[]
    destinations: ManifestDestination[]
    trips: ManifestTrip[]
  }
}

type CountryResolution = {
  targetName: string
  targetIds: string[]
  targetSlugs: string[]
  targetNormalizedNames: string[]
  status: 'reuse' | 'new' | 'blocked'
  matches: SanityDoc[]
  selectedId?: string
  blockers: string[]
}

type PreflightResult = {
  generatedAt: string
  mode: 'preflight'
  sanity: {
    projectId: string
    dataset: string
    apiVersion: string
    tokenConfigured: boolean
    perspective: 'raw'
  }
  targets: {
    continents: string[]
    countryIds: string[]
    destinationIds: string[]
    destinationSlugs: string[]
    tripIds: string[]
    tripSlugs: string[]
    proposedCoordinatorIds: string[]
  }
  checks: {
    continents: SanityDoc[]
    countries: CountryResolution[]
    destinationCollisions: SanityDoc[]
    tripCollisions: SanityDoc[]
    coordinators: SanityDoc[]
    coordinatorCompatibility: {
      tripId: string
      destinationId: string
      destinationHasCoordinator: boolean
      proposedCoordinatorId: string | null
      status: 'compatible' | 'blocked'
      message: string
    }[]
  }
  blockers: string[]
}

const REQUIRED_CONTINENT_IDS = ['continent-europa', 'continent-centroamerica']
const OUTPUT_DIR = 'imports/fillNewDestination/preflight'
const REPORT_PATH = `${OUTPUT_DIR}/preflight-report.md`
const SNAPSHOT_PATH = `${OUTPUT_DIR}/preflight-snapshot.json`

function requirePreflightMode() {
  const isPreflight = process.argv.includes('--preflight') || process.argv.includes('--dry-run')
  if (!isPreflight) {
    throw new Error('Run with --preflight or --dry-run to confirm read-only mode.')
  }
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function compactDoc(doc: SanityDoc) {
  return {
    _id: doc._id,
    _rev: doc._rev,
    _type: doc._type,
    name: doc.name,
    title: doc.title,
    slug: doc.slug?.current,
    hasCoordinator: doc.hasCoordinator,
    continentRef: doc.continent?._ref,
    destinationRef: doc.destination?._ref,
    destinationRefs: doc.destinations?.map((destination) => destination._ref).filter(Boolean),
    departureDate: doc.departureDate,
    returnDate: doc.returnDate,
  }
}

function getCountryAliases(country: ManifestCountry) {
  const slug = country.fields.slug.current
  const name = country.fields.name.value

  if (slug === 'chequia') {
    return {
      slugs: ['chequia', 'republica-checa'],
      normalizedNames: ['chequia', 'republica checa'],
    }
  }

  return {
    slugs: [slug],
    normalizedNames: [normalizeText(name)],
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

async function loadManifest(): Promise<Manifest> {
  const raw = await readFile(resolve(process.cwd(), 'imports/fillNewDestination/manifest.json'), 'utf8')
  return JSON.parse(raw) as Manifest
}

function getEnv() {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const apiVersion = process.env.SANITY_API_VERSION || '2026-03-16'
  const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN

  if (!projectId || projectId === 'YOUR_PROJECT_ID') {
    throw new Error('SANITY_PROJECT_ID is required for preflight.')
  }

  if (!token) {
    throw new Error('SANITY_READ_TOKEN or SANITY_TOKEN is required to include drafts in preflight.')
  }

  return {projectId, dataset, apiVersion, token}
}

function resolveCountry(country: ManifestCountry, docs: SanityDoc[]): CountryResolution {
  const aliases = getCountryAliases(country)
  const targetIds = [country._id.published, country._id.draft]
  const targetSlugs = aliases.slugs
  const targetNormalizedNames = aliases.normalizedNames

  const matches = docs.filter((doc) => {
    const docName = doc.name ? normalizeText(doc.name) : ''
    return (
      targetIds.includes(doc._id) ||
      (doc.slug?.current ? targetSlugs.includes(doc.slug.current) : false) ||
      (docName ? targetNormalizedNames.includes(docName) : false)
    )
  })

  const blockers: string[] = []
  if (matches.length > 1) {
    blockers.push(`Ambiguous country match for ${country.fields.name.value}: ${matches.map((doc) => doc._id).join(', ')}`)
  }

  if (matches.length === 1 && matches[0]?.continent?._ref !== country.fields.continent._ref) {
    blockers.push(
      `Country ${matches[0]._id} resolves to continent ${matches[0].continent?._ref || 'missing'}, expected ${country.fields.continent._ref}`,
    )
  }

  return {
    targetName: country.fields.name.value,
    targetIds,
    targetSlugs,
    targetNormalizedNames,
    status: blockers.length > 0 ? 'blocked' : matches.length === 1 ? 'reuse' : 'new',
    matches,
    selectedId: blockers.length === 0 && matches.length === 1 ? matches[0]?._id : undefined,
    blockers,
  }
}

function buildCoordinatorCompatibility(manifest: Manifest, destinationLookup: Map<string, ManifestDestination>, coordinators: SanityDoc[]) {
  const coordinatorIds = new Set(coordinators.map((doc) => doc._id))

  return manifest.documents.trips.map((trip) => {
    const destinationId = trip.fields.destination._ref
    const destination = destinationLookup.get(destinationId)
    const destinationHasCoordinator = destination?.fields.hasCoordinator.value ?? true
    const proposedCoordinatorId = trip.fields.coordinator.value

    if (!destinationHasCoordinator) {
      return {
        tripId: trip._id.published,
        destinationId,
        destinationHasCoordinator,
        proposedCoordinatorId,
        status: proposedCoordinatorId ? ('blocked' as const) : ('compatible' as const),
        message: proposedCoordinatorId
          ? 'Destination hasCoordinator is false but a coordinator reference is proposed.'
          : 'Destination does not require a coordinator.',
      }
    }

    if (!proposedCoordinatorId) {
      return {
        tripId: trip._id.published,
        destinationId,
        destinationHasCoordinator,
        proposedCoordinatorId,
        status: 'blocked' as const,
        message: 'Destination requires a coordinator, but the manifest has no proposed coordinator reference.',
      }
    }

    if (!coordinatorIds.has(proposedCoordinatorId)) {
      return {
        tripId: trip._id.published,
        destinationId,
        destinationHasCoordinator,
        proposedCoordinatorId,
        status: 'blocked' as const,
        message: 'Proposed coordinator was not found in Sanity.',
      }
    }

    return {
      tripId: trip._id.published,
      destinationId,
      destinationHasCoordinator,
      proposedCoordinatorId,
      status: 'compatible' as const,
      message: 'Proposed coordinator exists and is compatible with hasCoordinator.',
    }
  })
}

function buildReport(result: PreflightResult) {
  const lines: string[] = []
  lines.push('# Preflight fillNewDestination')
  lines.push('')
  lines.push(`Generated at: ${result.generatedAt}`)
  lines.push(`Mode: ${result.mode} / Sanity perspective ${result.sanity.perspective}`)
  lines.push(`Dataset: ${result.sanity.dataset}`)
  lines.push(`Credentials: ${result.sanity.tokenConfigured ? 'configured; token not printed' : 'missing'}`)
  lines.push(`Snapshot: \`${SNAPSHOT_PATH}\``)
  lines.push('')
  lines.push('## Status')
  lines.push('')
  if (result.blockers.length === 0) {
    lines.push('COMPLETED: no collisions or ambiguous references were found.')
  } else {
    lines.push('BLOCKED: preflight found blockers and exited non-zero.')
    lines.push('')
    for (const blocker of result.blockers) {
      lines.push(`- ${blocker}`)
    }
  }

  lines.push('')
  lines.push('## Continents')
  lines.push('')
  lines.push('| Target ID | Found ID | Rev | Status |')
  lines.push('| --- | --- | --- | --- |')
  for (const id of result.targets.continents) {
    const found = result.checks.continents.find((doc) => doc._id === id)
    lines.push(`| \`${id}\` | ${found ? `\`${found._id}\`` : 'missing'} | ${found?._rev ? `\`${found._rev}\`` : '-'} | ${found ? 'reuse' : 'blocked'} |`)
  }

  lines.push('')
  lines.push('## Countries')
  lines.push('')
  lines.push('| Target | IDs checked | Slugs checked | Resolution | Existing match | Rev |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const country of result.checks.countries) {
    const match = country.matches.length === 1 ? country.matches[0] : undefined
    lines.push(
      `| ${country.targetName} | ${country.targetIds.map((id) => `\`${id}\``).join('<br>')} | ${country.targetSlugs.map((slug) => `\`${slug}\``).join('<br>')} | ${country.status} | ${match ? `\`${match._id}\`` : country.matches.length > 1 ? country.matches.map((doc) => `\`${doc._id}\``).join('<br>') : 'new country'} | ${match?._rev ? `\`${match._rev}\`` : '-'} |`,
    )
  }

  lines.push('')
  lines.push('## Destination And Trip Collisions')
  lines.push('')
  lines.push(`Destination target IDs: ${result.targets.destinationIds.map((id) => `\`${id}\``).join(', ')}`)
  lines.push(`Destination target slugs: ${result.targets.destinationSlugs.map((slug) => `\`${slug}\``).join(', ')}`)
  lines.push(`Destination collisions: ${result.checks.destinationCollisions.length === 0 ? 'none' : result.checks.destinationCollisions.map((doc) => `\`${doc._id}\``).join(', ')}`)
  lines.push('')
  lines.push(`Trip target IDs: ${result.targets.tripIds.map((id) => `\`${id}\``).join(', ')}`)
  lines.push(`Trip target slugs: ${result.targets.tripSlugs.map((slug) => `\`${slug}\``).join(', ')}`)
  lines.push(`Trip collisions: ${result.checks.tripCollisions.length === 0 ? 'none' : result.checks.tripCollisions.map((doc) => `\`${doc._id}\``).join(', ')}`)

  lines.push('')
  lines.push('## Coordinators')
  lines.push('')
  if (result.checks.coordinators.length === 0) {
    lines.push('No coordinators found in Sanity.')
  } else {
    lines.push('| ID | Rev | Name | Slug | Destination refs |')
    lines.push('| --- | --- | --- | --- | --- |')
    for (const coordinator of result.checks.coordinators) {
      lines.push(
        `| \`${coordinator._id}\` | \`${coordinator._rev}\` | ${coordinator.name ?? '-'} | ${coordinator.slug?.current ? `\`${coordinator.slug.current}\`` : '-'} | ${(coordinator.destinations ?? []).map((ref) => `\`${ref._ref}\``).join(', ') || '-'} |`,
      )
    }
  }

  lines.push('')
  lines.push('## Coordinator Compatibility')
  lines.push('')
  lines.push('| Trip | Destination | hasCoordinator | Proposed coordinator | Status | Message |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const check of result.checks.coordinatorCompatibility) {
    lines.push(
      `| \`${check.tripId}\` | \`${check.destinationId}\` | ${check.destinationHasCoordinator ? 'true' : 'false'} | ${check.proposedCoordinatorId ? `\`${check.proposedCoordinatorId}\`` : 'missing'} | ${check.status} | ${check.message} |`,
    )
  }

  lines.push('')
  lines.push('## Read-Only Guarantee')
  lines.push('')
  lines.push('- The utility only creates a Sanity client and runs GROQ fetches with `useCdn: false` and `perspective: raw`.')
  lines.push('- Local artifacts written by this run are the report and snapshot paths listed above.')
  lines.push('- No secrets are printed or saved.')
  lines.push('')

  return `${lines.join('\n')}\n`
}

async function writeArtifacts(result: PreflightResult) {
  await mkdir(resolve(process.cwd(), OUTPUT_DIR), {recursive: true})
  const snapshot = {
    generatedAt: result.generatedAt,
    sanity: {
      dataset: result.sanity.dataset,
      apiVersion: result.sanity.apiVersion,
      perspective: result.sanity.perspective,
      tokenConfigured: result.sanity.tokenConfigured,
      projectIdConfigured: Boolean(result.sanity.projectId),
    },
    preexistingDocuments: {
      continents: result.checks.continents.map(compactDoc),
      countryMatches: result.checks.countries.flatMap((country) => country.matches.map(compactDoc)),
      destinationCollisions: result.checks.destinationCollisions.map(compactDoc),
      tripCollisions: result.checks.tripCollisions.map(compactDoc),
      coordinators: result.checks.coordinators.map(compactDoc),
    },
    blockers: result.blockers,
  }

  await writeFile(resolve(process.cwd(), SNAPSHOT_PATH), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  await writeFile(resolve(process.cwd(), REPORT_PATH), buildReport(result), 'utf8')
}

async function main() {
  requirePreflightMode()
  const env = getEnv()
  const manifest = await loadManifest()
  const client = createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    token: env.token,
    useCdn: false,
    perspective: 'raw',
  })

  const destinationLookup = new Map(
    manifest.documents.destinations.map((destination) => [destination._id.published, destination]),
  )
  const countryAliases = manifest.documents.countries.map(getCountryAliases)
  const countryIds = unique(manifest.documents.countries.flatMap((country) => [country._id.published, country._id.draft]))
  const countrySlugs = unique(countryAliases.flatMap((alias) => alias.slugs))
  const countryNames = unique(countryAliases.flatMap((alias) => alias.normalizedNames))
  const destinationIds = unique(
    manifest.documents.destinations.flatMap((destination) => [destination._id.published, destination._id.draft]),
  )
  const destinationSlugs = unique(manifest.documents.destinations.map((destination) => destination.fields.slug.current))
  const destinationNames = unique(manifest.documents.destinations.map((destination) => normalizeText(destination.fields.name.value)))
  const tripIds = unique(manifest.documents.trips.flatMap((trip) => [trip._id.published, trip._id.draft]))
  const tripSlugs = unique(manifest.documents.trips.map((trip) => trip.fields.slug.current))
  const proposedCoordinatorIds = unique(
    manifest.documents.trips
      .map((trip) => trip.fields.coordinator.value)
      .filter((coordinatorId): coordinatorId is string => Boolean(coordinatorId)),
  )

  const query = `{
    "continents": *[_type == "continent" && _id in $continentIds]{
      _id, _rev, _type, name, slug
    },
    "countryCandidates": *[
      _type == "country" &&
      (
        _id in $countryIds ||
        slug.current in $countrySlugs ||
        lower(name) in $countryNames
      )
    ]{
      _id, _rev, _type, name, slug, continent
    },
    "destinationCollisions": *[
      _type == "destination" &&
      (
        _id in $destinationIds ||
        slug.current in $destinationSlugs ||
        lower(name) in $destinationNames
      )
    ]{
      _id, _rev, _type, name, slug, hasCoordinator, country, continent
    },
    "tripCollisions": *[
      _type == "trip" &&
      (
        _id in $tripIds ||
        slug.current in $tripSlugs
      )
    ]{
      _id, _rev, _type, title, slug, destination, departureDate, returnDate
    },
    "coordinators": *[_type == "coordinator"] | order(name asc){
      _id, _rev, _type, name, slug, destinations
    }
  }`

  const data = await client.fetch<{
    continents: SanityDoc[]
    countryCandidates: SanityDoc[]
    destinationCollisions: SanityDoc[]
    tripCollisions: SanityDoc[]
    coordinators: SanityDoc[]
  }>(query, {
    continentIds: REQUIRED_CONTINENT_IDS,
    countryIds,
    countrySlugs,
    countryNames,
    destinationIds,
    destinationSlugs,
    destinationNames,
    tripIds,
    tripSlugs,
  })

  const countries = manifest.documents.countries.map((country) => resolveCountry(country, data.countryCandidates))
  const coordinatorCompatibility = buildCoordinatorCompatibility(manifest, destinationLookup, data.coordinators)
  const blockers = [
    ...REQUIRED_CONTINENT_IDS.filter((id) => !data.continents.some((continent) => continent._id === id)).map(
      (id) => `Missing required continent ${id}`,
    ),
    ...countries.flatMap((country) => country.blockers),
    ...data.destinationCollisions.map((doc) => `Destination target already exists: ${doc._id}`),
    ...data.tripCollisions.map((doc) => `Trip target already exists: ${doc._id}`),
    ...coordinatorCompatibility
      .filter((check) => check.status === 'blocked')
      .map((check) => `${check.tripId}: ${check.message}`),
  ]

  const result: PreflightResult = {
    generatedAt: new Date().toISOString(),
    mode: 'preflight',
    sanity: {
      projectId: env.projectId,
      dataset: env.dataset,
      apiVersion: env.apiVersion,
      tokenConfigured: Boolean(env.token),
      perspective: 'raw',
    },
    targets: {
      continents: REQUIRED_CONTINENT_IDS,
      countryIds,
      destinationIds,
      destinationSlugs,
      tripIds,
      tripSlugs,
      proposedCoordinatorIds,
    },
    checks: {
      continents: data.continents,
      countries,
      destinationCollisions: data.destinationCollisions,
      tripCollisions: data.tripCollisions,
      coordinators: data.coordinators,
      coordinatorCompatibility,
    },
    blockers,
  }

  await writeArtifacts(result)

  if (blockers.length > 0) {
    console.error(`Preflight blocked. See ${REPORT_PATH}`)
    for (const blocker of blockers) {
      console.error(`- ${blocker}`)
    }
    process.exit(1)
  }

  console.log(`Preflight completed. See ${REPORT_PATH}`)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Preflight failed: ${message}`)
  process.exit(1)
})
