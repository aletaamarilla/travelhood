/**
 * One-use create-only importer for the approved Praga + Guatemala manifest.
 *
 * Default mode is dry-run. Live mode requires:
 *   npx tsx scripts/import-praga-guatemala.ts --write-praga-guatemala-drafts
 */

import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import {createHash, randomUUID} from 'node:crypto'
import {mkdir, readFile, stat, writeFile} from 'node:fs/promises'
import {createReadStream} from 'node:fs'
import {basename, extname, resolve} from 'node:path'

dotenv.config({path: resolve(process.cwd(), '.env')})

const MANIFEST_PATH = 'imports/fillNewDestination/manifest.json'
const IMAGE_DERIVATIVES_PATH = 'imports/fillNewDestination/processed/image-derivatives.json'
const REPORT_DIR = 'imports/fillNewDestination/reports'
const IMPORT_SLUG = 'fillNewDestination'
const LIVE_FLAG = '--write-praga-guatemala-drafts'
const ALLOWED_CONTINENT_IDS = ['continent-europa', 'continent-centroamerica'] as const
const ALLOWED_DOC_TYPES = ['country', 'destination', 'trip'] as const
const ALLOWED_DESTINATION_CATEGORIES = ['playa', 'aventura', 'cultural', 'naturaleza', 'nieve'] as const
const ALLOWED_TRIP_STATUSES = ['open', 'almost-full', 'full'] as const
const ALLOWED_TRIP_TAGS = [
  'semana-santa',
  'puente-mayo',
  'verano',
  'septiembre',
  'puente-octubre',
  'puente-noviembre',
  'navidad',
  'fin-de-anio',
] as const

type AllowedDocType = (typeof ALLOWED_DOC_TYPES)[number]
type AllowedTripStatus = (typeof ALLOWED_TRIP_STATUSES)[number]

type FieldValue<T> = {
  value: T
  status?: string
  source?: string
  notes?: string
}

type SlugField = {
  current: string
  status?: string
  source?: string
}

type RefField = {
  _ref: string
  draftRef?: string
  status?: string
  source?: string
}

type ManifestId = {
  published: string
  draft: string
  status?: string
  source?: string
}

type ManifestCountry = {
  _id: ManifestId
  _type: 'country'
  createPolicy?: string
  fields: {
    name: FieldValue<string>
    slug: SlugField
    continent: RefField
    flag: FieldValue<string>
    currency?: FieldValue<string | null>
    currencyRate?: FieldValue<string | null>
    language?: FieldValue<string | null>
    timezone?: FieldValue<string | null>
    visaRequired?: FieldValue<boolean | null>
    visaInfo?: FieldValue<string | null>
    vaccinesRecommended?: FieldValue<string | null>
  }
}

type ManifestDestination = {
  _id: ManifestId
  _type: 'destination'
  fields: {
    name: FieldValue<string>
    slug: SlugField
    country: RefField
    continent: RefField
    description: FieldValue<string | null>
    shortDescription: FieldValue<string | null>
    categories?: FieldValue<string[]>
    highlights?: FieldValue<string[]>
    idealFor?: FieldValue<string | null>
    hasCoordinator?: FieldValue<boolean>
    heroImage: {
      sourcePath: string
      status?: string
      source?: string
    }
    heroImageAlt: FieldValue<string | null>
    gallery?: {
      sourcePaths: string[]
      status?: string
      notes?: string
    }
    included?: FieldValue<string[]>
    notIncluded?: FieldValue<string[]>
    itinerary?: FieldValue<Array<{day: number; title: string; description: string}>>
    climate: FieldValue<string | null>
    coordinates?: FieldValue<{lat: number; lng: number} | null>
    climateByMonth?: FieldValue<
      Array<{month: string; avgTemp: string; rainfall: string; recommendation: string; note?: string}>
    >
    budgetPerDay?: FieldValue<
      | {
          mealCostLow?: number
          mealCostMid?: number
          beerCost?: number
          dailyBudget?: number
          totalExtras?: number
        }
      | null
    >
    faqs?: FieldValue<Array<{question: string; answer: string}>>
    seo?: FieldValue<Record<string, unknown> | null>
    pdfFile?: {
      sourcePath?: string
      status?: string
      notes?: string
    }
  }
}

type ManifestTrip = {
  _id: ManifestId
  _type: 'trip'
  fields: {
    title: FieldValue<string>
    slug: SlugField
    destination: RefField
    departureDate: FieldValue<string>
    returnDate: FieldValue<string>
    durationDays: FieldValue<number>
    priceFrom: FieldValue<number>
    flightEstimate: FieldValue<number>
    totalPlaces: FieldValue<number>
    placesLeft: FieldValue<number>
    status: FieldValue<AllowedTripStatus | string>
    coordinator?: FieldValue<string | null>
    tags?: FieldValue<string[]>
    promoPrice?: FieldValue<number | null>
    promoLabel?: FieldValue<string | null>
  }
}

type ManifestAsset = {
  sourcePath: string
  sha256: string
  destination: string | string[]
  role: string
  proposedAlt: string | null
  approvalStatus: string
  rights: string
}

type Manifest = {
  schemaVersion: number
  slug: string
  generatedAt: string
  sourceFiles: Array<{path: string; sha256: string; type: string}>
  assets: ManifestAsset[]
  allowlist: {
    countriesPotential: {publishedIds: string[]; draftIds: string[]}
    destinations: {publishedIds: string[]; draftIds: string[]}
    trips: {publishedIds: string[]; draftIds: string[]}
  }
  documents: {
    countries: ManifestCountry[]
    destinations: ManifestDestination[]
    trips: ManifestTrip[]
  }
}

type ImageDerivativeReport = {
  images: Array<{
    sourcePath: string
    destination: string
    role: 'hero' | 'gallery' | string
    derivatives: Array<{
      path: string
      type: string
      sha256: string
      dimensions?: {width: number; height: number}
      hasExif?: boolean
      hasGps?: boolean
      colorSpace?: string
    }>
  }>
}

type SanityRef = {
  _type: 'reference'
  _ref: string
}

type SanitySlug = {
  _type: 'slug'
  current: string
}

type SanityDoc = {
  _id: string
  _type: AllowedDocType
  [key: string]: unknown
}

type ExistingDoc = {
  _id: string
  _type: string
  _rev?: string
  name?: string
  title?: string
  slug?: {current?: string}
  continent?: {_ref?: string}
}

type CountryResolution = {
  targetDraftId: string
  targetPublishedId: string
  finalRef: string
  action: 'create' | 'reuse'
  matches: ExistingDoc[]
  blockers: string[]
}

type RemotePreflight = {
  countries: CountryResolution[]
  docsToCreate: Set<string>
  blockers: string[]
  existing: {
    continents: ExistingDoc[]
    countryCandidates: ExistingDoc[]
    destinationCollisions: ExistingDoc[]
    tripCollisions: ExistingDoc[]
    coordinators: ExistingDoc[]
  }
}

type PlannedAsset = {
  sourcePath: string
  uploadPath: string
  sha256: string
  role: string
  destination: string
  alt: string
  contentType: 'image' | 'file'
}

type UploadedAsset = PlannedAsset & {
  assetId: string
}

type PlannedRun = {
  countries: SanityDoc[]
  destinations: SanityDoc[]
  trips: SanityDoc[]
  assets: PlannedAsset[]
  order: Array<{kind: 'asset' | AllowedDocType; id: string; source?: string}>
}

type ImportReport = {
  runId: string
  timestamp: string
  mode: 'dry-run' | 'live'
  dataset: string
  manifest: {
    path: string
    sha256: string
    slug: string
    generatedAt: string
  }
  status: 'completed' | 'blocked' | 'failed'
  blockers: string[]
  created: {
    assets: UploadedAsset[]
    documents: Array<{_id: string; _type: AllowedDocType}>
  }
  planned: PlannedRun | null
  error: string | null
  recovery: string[]
}

type Options = {
  dryRun: boolean
}

type LoadedInputs = {
  manifest: Manifest
  manifestHash: string
  imageDerivatives: ImageDerivativeReport
}

function parseArgs(argv = process.argv.slice(2)): Options {
  let dryRun = true
  for (const arg of argv) {
    if (arg === '--dry-run') {
      dryRun = true
    } else if (arg === LIVE_FLAG) {
      dryRun = false
    } else {
      throw new Error(`Unknown flag: ${arg}`)
    }
  }
  return {dryRun}
}

function asErrorMessage(error: unknown) {
  return error instanceof Error ? error.stack || error.message : String(error)
}

function makeSlug(current: string): SanitySlug {
  return {_type: 'slug', current}
}

function makeRef(_ref: string): SanityRef {
  return {_type: 'reference', _ref}
}

function makeKey(input: string) {
  return createHash('sha1').update(input).digest('hex').slice(0, 12)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function daysInclusive(start: string, end: string) {
  const startTime = Date.parse(`${start}T00:00:00.000Z`)
  const endTime = Date.parse(`${end}T00:00:00.000Z`)
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return null
  return Math.round((endTime - startTime) / 86_400_000) + 1
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

function assertAllowedDocId(id: string, allowlist: Set<string>, label: string, blockers: string[]) {
  if (!allowlist.has(id)) {
    blockers.push(`${label} ${id} is outside the literal allowlist.`)
  }
}

function validateSlug(current: string, label: string, blockers: string[]) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
    blockers.push(`${label} has invalid slug "${current}".`)
  }
}

function validateManifestContract(manifest: Manifest, imageDerivatives: ImageDerivativeReport): string[] {
  const blockers: string[] = []
  if (manifest.schemaVersion !== 1) blockers.push('Manifest schemaVersion must be 1.')
  if (manifest.slug !== IMPORT_SLUG) blockers.push(`Manifest slug must be ${IMPORT_SLUG}.`)

  const countryDraftAllowlist = new Set(manifest.allowlist.countriesPotential.draftIds)
  const destinationDraftAllowlist = new Set(manifest.allowlist.destinations.draftIds)
  const tripDraftAllowlist = new Set(manifest.allowlist.trips.draftIds)
  const allDraftAllowlist = new Set([
    ...countryDraftAllowlist,
    ...destinationDraftAllowlist,
    ...tripDraftAllowlist,
  ])
  const countryPublishedIds = new Set(manifest.allowlist.countriesPotential.publishedIds)
  const destinationPublishedIds = new Set(manifest.allowlist.destinations.publishedIds)
  const tripPublishedIds = new Set(manifest.allowlist.trips.publishedIds)
  const destinationPublishedByDraft = new Map(
    manifest.documents.destinations.map((destination) => [destination._id.draft, destination._id.published]),
  )
  const countryPublishedByDraft = new Map(
    manifest.documents.countries.map((country) => [country._id.draft, country._id.published]),
  )
  const assetBySource = new Map(manifest.assets.map((asset) => [asset.sourcePath, asset]))
  const derivativeBySource = new Map(imageDerivatives.images.map((image) => [image.sourcePath, image]))

  for (const id of allDraftAllowlist) {
    if (!id.startsWith('drafts.')) blockers.push(`Allowlisted draft ID must use drafts prefix: ${id}.`)
  }

  for (const country of manifest.documents.countries) {
    assertAllowedDocId(country._id.draft, countryDraftAllowlist, 'Country draft ID', blockers)
    if (!country._id.draft.startsWith('drafts.')) blockers.push(`Country must be created as draft: ${country._id.draft}.`)
    if (!countryPublishedIds.has(country._id.published)) blockers.push(`Country published ID is not allowlisted: ${country._id.published}.`)
    if (!isNonEmptyString(country.fields.name.value)) blockers.push(`${country._id.draft} requires name.`)
    validateSlug(country.fields.slug.current, `${country._id.draft}.slug`, blockers)
    if (!ALLOWED_CONTINENT_IDS.includes(country.fields.continent._ref as (typeof ALLOWED_CONTINENT_IDS)[number])) {
      blockers.push(`${country._id.draft} references unsupported continent ${country.fields.continent._ref}.`)
    }
    if (!/^[A-Z]{2}$/.test(country.fields.flag.value)) blockers.push(`${country._id.draft} requires a 2-letter uppercase flag.`)
  }

  for (const destination of manifest.documents.destinations) {
    assertAllowedDocId(destination._id.draft, destinationDraftAllowlist, 'Destination draft ID', blockers)
    if (!destination._id.draft.startsWith('drafts.')) blockers.push(`Destination must be created as draft: ${destination._id.draft}.`)
    if (!destinationPublishedIds.has(destination._id.published)) {
      blockers.push(`Destination published ID is not allowlisted: ${destination._id.published}.`)
    }
    if (!isNonEmptyString(destination.fields.name.value)) blockers.push(`${destination._id.draft} requires name.`)
    validateSlug(destination.fields.slug.current, `${destination._id.draft}.slug`, blockers)
    if (!isNonEmptyString(destination.fields.description.value)) blockers.push(`${destination._id.draft} requires description.`)
    if (!isNonEmptyString(destination.fields.shortDescription.value)) {
      blockers.push(`${destination._id.draft} requires shortDescription.`)
    } else if (destination.fields.shortDescription.value.length > 80) {
      blockers.push(`${destination._id.draft} shortDescription must be 80 chars or fewer.`)
    }
    if (!isNonEmptyString(destination.fields.climate.value)) blockers.push(`${destination._id.draft} requires climate.`)
    if (!isNonEmptyString(destination.fields.heroImage.sourcePath)) blockers.push(`${destination._id.draft} requires hero image source.`)
    if (!isNonEmptyString(destination.fields.heroImageAlt.value)) blockers.push(`${destination._id.draft} requires hero image alt.`)

    const countryRef = destination.fields.country.draftRef ?? countryPublishedByDraft.get(destination.fields.country._ref)
    if (!countryRef && !countryPublishedIds.has(destination.fields.country._ref)) {
      blockers.push(`${destination._id.draft} has unresolved country reference ${destination.fields.country._ref}.`)
    }
    if (!ALLOWED_CONTINENT_IDS.includes(destination.fields.continent._ref as (typeof ALLOWED_CONTINENT_IDS)[number])) {
      blockers.push(`${destination._id.draft} references unsupported continent ${destination.fields.continent._ref}.`)
    }

    for (const category of destination.fields.categories?.value ?? []) {
      if (!ALLOWED_DESTINATION_CATEGORIES.includes(category as (typeof ALLOWED_DESTINATION_CATEGORIES)[number])) {
        blockers.push(`${destination._id.draft} has invalid category ${category}.`)
      }
    }

    const heroAsset = assetBySource.get(destination.fields.heroImage.sourcePath)
    if (!heroAsset) {
      blockers.push(`${destination._id.draft} hero source is absent from approved assets.`)
    } else if (!isNonEmptyString(heroAsset.proposedAlt)) {
      blockers.push(`${destination._id.draft} hero asset requires approved alt.`)
    }
    if (!derivativeBySource.get(destination.fields.heroImage.sourcePath)) {
      blockers.push(`${destination._id.draft} hero source has no processed derivative.`)
    }

    for (const sourcePath of destination.fields.gallery?.sourcePaths ?? []) {
      const asset = assetBySource.get(sourcePath)
      if (!asset) {
        blockers.push(`${destination._id.draft} gallery source is absent from approved assets: ${sourcePath}.`)
      } else if (!isNonEmptyString(asset.proposedAlt)) {
        blockers.push(`${destination._id.draft} gallery source requires approved alt: ${sourcePath}.`)
      }
      if (!derivativeBySource.get(sourcePath)) {
        blockers.push(`${destination._id.draft} gallery source has no processed derivative: ${sourcePath}.`)
      }
    }

    const itinerary = destination.fields.itinerary?.value ?? []
    for (let index = 0; index < itinerary.length; index++) {
      const day = itinerary[index]
      if (day.day !== index + 1) blockers.push(`${destination._id.draft} itinerary day ${day.day} is out of order.`)
      if (!isNonEmptyString(day.title) || !isNonEmptyString(day.description)) {
        blockers.push(`${destination._id.draft} itinerary day ${day.day} requires title and description.`)
      }
    }
  }

  for (const trip of manifest.documents.trips) {
    assertAllowedDocId(trip._id.draft, tripDraftAllowlist, 'Trip draft ID', blockers)
    if (!trip._id.draft.startsWith('drafts.')) blockers.push(`Trip must be created as draft: ${trip._id.draft}.`)
    if (!tripPublishedIds.has(trip._id.published)) blockers.push(`Trip published ID is not allowlisted: ${trip._id.published}.`)
    if (!isNonEmptyString(trip.fields.title.value)) blockers.push(`${trip._id.draft} requires title.`)
    validateSlug(trip.fields.slug.current, `${trip._id.draft}.slug`, blockers)

    const expectedDuration = daysInclusive(trip.fields.departureDate.value, trip.fields.returnDate.value)
    if (expectedDuration === null || expectedDuration < 1) {
      blockers.push(`${trip._id.draft} has invalid inclusive dates.`)
    } else if (expectedDuration !== trip.fields.durationDays.value) {
      blockers.push(`${trip._id.draft} duration must be ${expectedDuration}, got ${trip.fields.durationDays.value}.`)
    }
    if (trip.fields.priceFrom.value <= 0) blockers.push(`${trip._id.draft} priceFrom must be positive.`)
    if (trip.fields.flightEstimate.value <= 0) blockers.push(`${trip._id.draft} flightEstimate must be positive.`)
    if (trip.fields.totalPlaces.value <= 0) blockers.push(`${trip._id.draft} totalPlaces must be positive.`)
    if (trip.fields.placesLeft.value < 0 || trip.fields.placesLeft.value > trip.fields.totalPlaces.value) {
      blockers.push(`${trip._id.draft} placesLeft must be between 0 and totalPlaces.`)
    }
    if (!ALLOWED_TRIP_STATUSES.includes(trip.fields.status.value as AllowedTripStatus)) {
      blockers.push(`${trip._id.draft} status is invalid: ${trip.fields.status.value}.`)
    }
    for (const tag of trip.fields.tags?.value ?? []) {
      if (!ALLOWED_TRIP_TAGS.includes(tag as (typeof ALLOWED_TRIP_TAGS)[number])) {
        blockers.push(`${trip._id.draft} has invalid tag ${tag}.`)
      }
    }
    const destinationRef = trip.fields.destination.draftRef ?? destinationPublishedByDraft.get(trip.fields.destination._ref)
    if (!destinationRef && !destinationPublishedIds.has(trip.fields.destination._ref)) {
      blockers.push(`${trip._id.draft} has unresolved destination reference ${trip.fields.destination._ref}.`)
    }
  }

  return blockers
}

function pickDerivative(report: ImageDerivativeReport, sourcePath: string, contentType: 'image' | 'file') {
  if (contentType === 'file') return null
  const entry = report.images.find((image) => image.sourcePath === sourcePath)
  return entry?.derivatives.find((derivative) => derivative.type === 'image/jpeg') ?? entry?.derivatives[0] ?? null
}

function buildPlannedAssets(manifest: Manifest, imageDerivatives: ImageDerivativeReport): PlannedAsset[] {
  const assets: PlannedAsset[] = []
  for (const asset of manifest.assets) {
    if (!isNonEmptyString(asset.proposedAlt)) continue
    const derivative = pickDerivative(imageDerivatives, asset.sourcePath, 'image')
    if (!derivative) continue
    const destinations = Array.isArray(asset.destination) ? asset.destination : [asset.destination]
    for (const destination of destinations) {
      assets.push({
        sourcePath: asset.sourcePath,
        uploadPath: derivative.path,
        sha256: derivative.sha256,
        role: asset.role,
        destination,
        alt: asset.proposedAlt,
        contentType: 'image',
      })
    }
  }
  return assets
}

function buildAssetLookup(assets: Array<PlannedAsset | UploadedAsset>) {
  return new Map(assets.map((asset) => [`${asset.destination}:${asset.sourcePath}`, asset]))
}

function assetRef(asset: PlannedAsset | UploadedAsset | undefined, fallbackId: string) {
  const ref = 'assetId' in (asset ?? {}) ? (asset as UploadedAsset).assetId : `dry-run.asset.${fallbackId}`
  return {
    _type: 'image',
    asset: makeRef(ref),
  }
}

function buildCountryDoc(country: ManifestCountry): SanityDoc {
  const doc: SanityDoc = {
    _id: country._id.draft,
    _type: 'country',
    name: country.fields.name.value,
    slug: makeSlug(country.fields.slug.current),
    continent: makeRef(country.fields.continent._ref),
    flag: country.fields.flag.value,
  }
  if (country.fields.currency?.value) doc.currency = country.fields.currency.value
  if (country.fields.currencyRate?.value) doc.currencyRate = country.fields.currencyRate.value
  if (country.fields.language?.value) doc.language = country.fields.language.value
  if (country.fields.timezone?.value) doc.timezone = country.fields.timezone.value
  if (typeof country.fields.visaRequired?.value === 'boolean') doc.visaRequired = country.fields.visaRequired.value
  if (country.fields.visaInfo?.value) doc.visaInfo = country.fields.visaInfo.value
  if (country.fields.vaccinesRecommended?.value) doc.vaccinesRecommended = country.fields.vaccinesRecommended.value
  return doc
}

function resolveCountryRef(destination: ManifestDestination, countries: CountryResolution[] | null) {
  const proposedDraft = destination.fields.country.draftRef
  const resolution = countries?.find(
    (country) =>
      country.targetPublishedId === destination.fields.country._ref ||
      country.targetDraftId === proposedDraft ||
      country.targetDraftId === destination.fields.country._ref,
  )
  return resolution?.finalRef ?? proposedDraft ?? destination.fields.country._ref
}

function buildDestinationDoc(
  destination: ManifestDestination,
  plannedAssets: Array<PlannedAsset | UploadedAsset>,
  countries: CountryResolution[] | null,
): SanityDoc {
  const lookup = buildAssetLookup(plannedAssets)
  const hero = lookup.get(`${destination._id.published}:${destination.fields.heroImage.sourcePath}`)
  const gallerySources = destination.fields.gallery?.sourcePaths ?? []
  const gallery = gallerySources
    .map((sourcePath, index) => {
      const asset = lookup.get(`${destination._id.published}:${sourcePath}`)
      if (!asset) return null
      return {
        ...assetRef(asset, `${destination._id.published}.gallery.${index}`),
        _key: makeKey(`${destination._id.draft}:${sourcePath}`),
        alt: asset.alt,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const doc: SanityDoc = {
    _id: destination._id.draft,
    _type: 'destination',
    name: destination.fields.name.value,
    slug: makeSlug(destination.fields.slug.current),
    country: makeRef(resolveCountryRef(destination, countries)),
    continent: makeRef(destination.fields.continent._ref),
    description: destination.fields.description.value,
    shortDescription: destination.fields.shortDescription.value,
    heroImage: assetRef(hero, `${destination._id.published}.hero`),
    heroImageAlt: destination.fields.heroImageAlt.value,
    highlights: destination.fields.highlights?.value ?? [],
    idealFor: destination.fields.idealFor?.value,
    hasCoordinator: destination.fields.hasCoordinator?.value ?? true,
    categories: destination.fields.categories?.value ?? [],
    gallery,
    climate: destination.fields.climate.value,
    included: destination.fields.included?.value ?? [],
    notIncluded: destination.fields.notIncluded?.value ?? [],
    itinerary: (destination.fields.itinerary?.value ?? []).map((day) => ({
      _key: makeKey(`${destination._id.draft}:day:${day.day}`),
      day: day.day,
      title: day.title,
      description: day.description,
    })),
    faqs: (destination.fields.faqs?.value ?? []).map((faq, index) => ({
      _key: makeKey(`${destination._id.draft}:faq:${index}`),
      question: faq.question,
      answer: faq.answer,
    })),
  }

  if (destination.fields.coordinates?.value) {
    doc.coordinates = {
      _type: 'geopoint',
      lat: destination.fields.coordinates.value.lat,
      lng: destination.fields.coordinates.value.lng,
    }
  }
  if (destination.fields.climateByMonth?.value?.length) {
    doc.climateByMonth = destination.fields.climateByMonth.value.map((month) => ({
      _key: makeKey(`${destination._id.draft}:climate:${month.month}`),
      ...month,
    }))
  }
  if (destination.fields.budgetPerDay?.value) doc.budgetPerDay = destination.fields.budgetPerDay.value
  if (destination.fields.seo?.value) doc.seo = destination.fields.seo.value
  return doc
}

function buildTripDoc(trip: ManifestTrip): SanityDoc {
  const doc: SanityDoc = {
    _id: trip._id.draft,
    _type: 'trip',
    title: trip.fields.title.value,
    slug: makeSlug(trip.fields.slug.current),
    destination: makeRef(trip.fields.destination.draftRef ?? trip.fields.destination._ref),
    departureDate: trip.fields.departureDate.value,
    returnDate: trip.fields.returnDate.value,
    durationDays: trip.fields.durationDays.value,
    priceFrom: trip.fields.priceFrom.value,
    flightEstimate: trip.fields.flightEstimate.value,
    totalPlaces: trip.fields.totalPlaces.value,
    placesLeft: trip.fields.placesLeft.value,
    status: trip.fields.status.value,
    tags: trip.fields.tags?.value ?? [],
  }
  if (trip.fields.coordinator?.value) doc.coordinator = makeRef(trip.fields.coordinator.value)
  if (typeof trip.fields.promoPrice?.value === 'number') doc.promoPrice = trip.fields.promoPrice.value
  if (trip.fields.promoLabel?.value) doc.promoLabel = trip.fields.promoLabel.value
  return doc
}

function buildPlan(
  manifest: Manifest,
  imageDerivatives: ImageDerivativeReport,
  countryResolutions: CountryResolution[] | null,
  uploadedAssets: UploadedAsset[] | null = null,
): PlannedRun {
  const assets = uploadedAssets ?? buildPlannedAssets(manifest, imageDerivatives)
  const docsToCreate = new Set(
    countryResolutions
      ? countryResolutions.filter((country) => country.action === 'create').map((country) => country.targetDraftId)
      : manifest.documents.countries.map((country) => country._id.draft),
  )
  const countries = manifest.documents.countries
    .filter((country) => docsToCreate.has(country._id.draft))
    .map((country) => buildCountryDoc(country))
  const destinations = manifest.documents.destinations.map((destination) =>
    buildDestinationDoc(destination, assets, countryResolutions),
  )
  const trips = manifest.documents.trips.map(buildTripDoc)
  return {
    countries,
    destinations,
    trips,
    assets,
    order: [
      ...assets.map((asset) => ({kind: 'asset' as const, id: asset.uploadPath, source: asset.sourcePath})),
      ...countries.map((country) => ({kind: country._type, id: country._id})),
      ...destinations.map((destination) => ({kind: destination._type, id: destination._id})),
      ...trips.map((trip) => ({kind: trip._type, id: trip._id})),
    ],
  }
}

function validateAllowlist(plan: PlannedRun, manifest: Manifest): string[] {
  const blockers: string[] = []
  const allowed = new Set([
    ...manifest.allowlist.countriesPotential.draftIds,
    ...manifest.allowlist.destinations.draftIds,
    ...manifest.allowlist.trips.draftIds,
  ])
  for (const doc of [...plan.countries, ...plan.destinations, ...plan.trips]) {
    if (!allowed.has(doc._id)) blockers.push(`Planned document is outside the allowlist: ${doc._id}.`)
    if (!ALLOWED_DOC_TYPES.includes(doc._type)) blockers.push(`Planned document type is not allowed: ${doc._type}.`)
  }
  return blockers
}

function resolveCountry(country: ManifestCountry, docs: ExistingDoc[]): CountryResolution {
  const aliases = getCountryAliases(country)
  const targetIds = [country._id.published, country._id.draft]
  const matches = docs.filter((doc) => {
    const docName = doc.name ? normalizeText(doc.name) : ''
    return (
      targetIds.includes(doc._id) ||
      (doc.slug?.current ? aliases.slugs.includes(doc.slug.current) : false) ||
      (docName ? aliases.normalizedNames.includes(docName) : false)
    )
  })
  const blockers: string[] = []
  if (matches.length > 1) {
    blockers.push(`Ambiguous country match for ${country.fields.name.value}: ${matches.map((doc) => doc._id).join(', ')}.`)
  }
  if (matches.length === 1 && matches[0]?.continent?._ref !== country.fields.continent._ref) {
    blockers.push(`Country ${matches[0]._id} belongs to an unexpected continent.`)
  }
  return {
    targetDraftId: country._id.draft,
    targetPublishedId: country._id.published,
    finalRef: matches.length === 1 && blockers.length === 0 ? matches[0]._id : country._id.draft,
    action: matches.length === 1 && blockers.length === 0 ? 'reuse' : 'create',
    matches,
    blockers,
  }
}

export function validateRemoteState(manifest: Manifest, existing: RemotePreflight['existing']): RemotePreflight {
  const countries = manifest.documents.countries.map((country) => resolveCountry(country, existing.countryCandidates))
  const docsToCreate = new Set([
    ...countries.filter((country) => country.action === 'create').map((country) => country.targetDraftId),
    ...manifest.documents.destinations.map((destination) => destination._id.draft),
    ...manifest.documents.trips.map((trip) => trip._id.draft),
  ])
  const coordinatorIds = new Set(existing.coordinators.map((coordinator) => coordinator._id))
  const blockers = [
    ...ALLOWED_CONTINENT_IDS.filter((id) => !existing.continents.some((continent) => continent._id === id)).map(
      (id) => `Missing required continent ${id}.`,
    ),
    ...countries.flatMap((country) => country.blockers),
    ...existing.countryCandidates
      .filter((doc) => docsToCreate.has(doc._id))
      .map((doc) => `Country target already exists: ${doc._id}.`),
    ...existing.destinationCollisions.map((doc) => `Destination target already exists: ${doc._id}.`),
    ...existing.tripCollisions.map((doc) => `Trip target already exists: ${doc._id}.`),
    ...manifest.documents.trips
      .filter((trip) => trip.fields.coordinator?.value && !coordinatorIds.has(trip.fields.coordinator.value))
      .map((trip) => `${trip._id.draft} references missing coordinator ${trip.fields.coordinator?.value}.`),
  ]
  return {countries, docsToCreate, blockers, existing}
}

async function runRemotePreflight(client: ReturnType<typeof createClient>, manifest: Manifest): Promise<RemotePreflight> {
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

  const query = `{
    "continents": *[_type == "continent" && _id in $continentIds]{
      _id, _rev, _type, name, slug
    },
    "countryCandidates": *[
      _type == "country" &&
      (_id in $countryIds || slug.current in $countrySlugs || lower(name) in $countryNames)
    ]{
      _id, _rev, _type, name, slug, continent
    },
    "destinationCollisions": *[
      _type == "destination" &&
      (_id in $destinationIds || slug.current in $destinationSlugs || lower(name) in $destinationNames)
    ]{
      _id, _rev, _type, name, slug, continent
    },
    "tripCollisions": *[
      _type == "trip" &&
      (_id in $tripIds || slug.current in $tripSlugs)
    ]{
      _id, _rev, _type, title, slug
    },
    "coordinators": *[_type == "coordinator"]{
      _id, _rev, _type, name, slug
    }
  }`

  const existing = await client.fetch<RemotePreflight['existing']>(query, {
    continentIds: [...ALLOWED_CONTINENT_IDS],
    countryIds,
    countrySlugs,
    countryNames,
    destinationIds,
    destinationSlugs,
    destinationNames,
    tripIds,
    tripSlugs,
  })
  return validateRemoteState(manifest, existing)
}

async function sha256File(path: string) {
  const buffer = await readFile(resolve(process.cwd(), path))
  return createHash('sha256').update(buffer).digest('hex')
}

async function verifyFiles(manifest: Manifest, imageDerivatives: ImageDerivativeReport): Promise<string[]> {
  const blockers: string[] = []
  for (const source of manifest.sourceFiles) {
    try {
      const actual = await sha256File(source.path)
      if (actual !== source.sha256) blockers.push(`Source hash mismatch for ${source.path}.`)
    } catch (error) {
      blockers.push(`Cannot read source file ${source.path}: ${asErrorMessage(error)}`)
    }
  }
  for (const image of imageDerivatives.images) {
    for (const derivative of image.derivatives) {
      try {
        const actual = await sha256File(derivative.path)
        if (actual !== derivative.sha256) blockers.push(`Derivative hash mismatch for ${derivative.path}.`)
      } catch (error) {
        blockers.push(`Cannot read derivative ${derivative.path}: ${asErrorMessage(error)}`)
      }
    }
  }
  return blockers
}

async function loadInputs(): Promise<LoadedInputs> {
  const [manifestRaw, imageRaw] = await Promise.all([
    readFile(resolve(process.cwd(), MANIFEST_PATH), 'utf8'),
    readFile(resolve(process.cwd(), IMAGE_DERIVATIVES_PATH), 'utf8'),
  ])
  return {
    manifest: JSON.parse(manifestRaw) as Manifest,
    manifestHash: createHash('sha256').update(manifestRaw).digest('hex'),
    imageDerivatives: JSON.parse(imageRaw) as ImageDerivativeReport,
  }
}

function getEnv(dryRun: boolean) {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const apiVersion = process.env.SANITY_API_VERSION || '2026-03-16'
  const token = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN
  if (dryRun) return {projectId, dataset, apiVersion, token}
  if (!projectId || projectId === 'YOUR_PROJECT_ID') throw new Error('SANITY_PROJECT_ID is required for live mode.')
  if (!token) throw new Error('SANITY_TOKEN or SANITY_WRITE_TOKEN is required for live mode.')
  return {projectId, dataset, apiVersion, token}
}

async function uploadAssets(client: ReturnType<typeof createClient>, plan: PlannedRun): Promise<UploadedAsset[]> {
  const uploaded: UploadedAsset[] = []
  for (const asset of plan.assets) {
    const absolutePath = resolve(process.cwd(), asset.uploadPath)
    await stat(absolutePath)
    const uploadedAsset = await client.assets.upload(asset.contentType, createReadStream(absolutePath), {
      filename: basename(asset.uploadPath),
      contentType: extname(asset.uploadPath).toLowerCase() === '.webp' ? 'image/webp' : 'image/jpeg',
    })
    uploaded.push({...asset, assetId: uploadedAsset._id})
  }
  return uploaded
}

async function createDocuments(client: ReturnType<typeof createClient>, plan: PlannedRun) {
  const created: Array<{_id: string; _type: AllowedDocType}> = []
  for (const doc of [...plan.countries, ...plan.destinations, ...plan.trips]) {
    await client.create(doc)
    created.push({_id: doc._id, _type: doc._type})
  }
  return created
}

function makeRecovery(created: ImportReport['created']) {
  if (created.assets.length === 0 && created.documents.length === 0) {
    return ['No Sanity IDs were created by this execution.']
  }
  return [
    'Do not clean anything automatically.',
    `Review this run report and only these document IDs: ${created.documents.map((doc) => doc._id).join(', ') || 'none'}.`,
    `Review this run report and only these asset IDs: ${created.assets.map((asset) => asset.assetId).join(', ') || 'none'}.`,
    'Ask a human to approve any manual cleanup before acting.',
  ]
}

async function writeReport(report: ImportReport) {
  await mkdir(resolve(process.cwd(), REPORT_DIR), {recursive: true})
  const path = resolve(process.cwd(), REPORT_DIR, `${report.runId}.json`)
  await writeFile(path, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return path
}

function newReport(options: Options, manifestHash: string, manifest: Manifest, dataset: string): ImportReport {
  const timestamp = new Date().toISOString()
  const runId = `${timestamp.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`
  return {
    runId,
    timestamp,
    mode: options.dryRun ? 'dry-run' : 'live',
    dataset,
    manifest: {
      path: MANIFEST_PATH,
      sha256: manifestHash,
      slug: manifest.slug,
      generatedAt: manifest.generatedAt,
    },
    status: 'failed',
    blockers: [],
    created: {
      assets: [],
      documents: [],
    },
    planned: null,
    error: null,
    recovery: [],
  }
}

function printPlan(plan: PlannedRun, reportPath: string, mode: 'dry-run' | 'live') {
  console.log(`Mode: ${mode}`)
  console.log(`Report: ${reportPath}`)
  console.log('Creation order:')
  for (const item of plan.order) {
    console.log(`- ${item.kind}: ${item.id}${item.source ? ` (${item.source})` : ''}`)
  }
  console.log('Exact documents:')
  console.log(JSON.stringify({countries: plan.countries, destinations: plan.destinations, trips: plan.trips}, null, 2))
  console.log('Exact assets:')
  console.log(JSON.stringify(plan.assets, null, 2))
}

async function main() {
  const options = parseArgs()
  const inputs = await loadInputs()
  const env = getEnv(options.dryRun)
  const report = newReport(options, inputs.manifestHash, inputs.manifest, env.dataset)

  try {
    const localBlockers = [
      ...validateManifestContract(inputs.manifest, inputs.imageDerivatives),
      ...(await verifyFiles(inputs.manifest, inputs.imageDerivatives)),
    ]
    if (localBlockers.length > 0) {
      const blockedPlan = buildPlan(inputs.manifest, inputs.imageDerivatives, null)
      report.status = 'blocked'
      report.blockers = localBlockers
      report.planned = blockedPlan
      report.recovery = makeRecovery(report.created)
      const reportPath = await writeReport(report)
      console.error(`Blocked before Sanity connection. Report: ${reportPath}`)
      for (const blocker of localBlockers) console.error(`- ${blocker}`)
      printPlan(blockedPlan, reportPath, report.mode)
      process.exit(1)
    }

    let preflight: RemotePreflight | null = null
    if (env.projectId && env.token) {
      const client = createClient({
        projectId: env.projectId,
        dataset: env.dataset,
        apiVersion: env.apiVersion,
        token: env.token,
        useCdn: false,
        perspective: 'raw',
      })
      preflight = await runRemotePreflight(client, inputs.manifest)
      if (preflight.blockers.length > 0) {
        report.status = 'blocked'
        report.blockers = preflight.blockers
        report.planned = buildPlan(inputs.manifest, inputs.imageDerivatives, preflight.countries)
        report.recovery = makeRecovery(report.created)
        const reportPath = await writeReport(report)
        console.error(`Blocked by Sanity preflight. Report: ${reportPath}`)
        for (const blocker of preflight.blockers) console.error(`- ${blocker}`)
        process.exit(1)
      }
    }

    const dryPlan = buildPlan(inputs.manifest, inputs.imageDerivatives, preflight?.countries ?? null)
    const allowlistBlockers = validateAllowlist(dryPlan, inputs.manifest)
    if (allowlistBlockers.length > 0) {
      report.status = 'blocked'
      report.blockers = allowlistBlockers
      report.planned = dryPlan
      report.recovery = makeRecovery(report.created)
      const reportPath = await writeReport(report)
      console.error(`Blocked by allowlist. Report: ${reportPath}`)
      for (const blocker of allowlistBlockers) console.error(`- ${blocker}`)
      process.exit(1)
    }

    if (options.dryRun) {
      report.status = 'completed'
      report.planned = dryPlan
      report.recovery = makeRecovery(report.created)
      const reportPath = await writeReport(report)
      printPlan(dryPlan, reportPath, report.mode)
      return
    }

    const liveClient = createClient({
      projectId: env.projectId!,
      dataset: env.dataset,
      apiVersion: env.apiVersion,
      token: env.token,
      useCdn: false,
      perspective: 'raw',
    })
    const livePreflight = await runRemotePreflight(liveClient, inputs.manifest)
    if (livePreflight.blockers.length > 0) {
      report.status = 'blocked'
      report.blockers = livePreflight.blockers
      report.planned = buildPlan(inputs.manifest, inputs.imageDerivatives, livePreflight.countries)
      report.recovery = makeRecovery(report.created)
      const reportPath = await writeReport(report)
      console.error(`Blocked by immediate preflight before live writes. Report: ${reportPath}`)
      for (const blocker of livePreflight.blockers) console.error(`- ${blocker}`)
      process.exit(1)
    }

    const assets = await uploadAssets(liveClient, dryPlan)
    report.created.assets = assets
    const livePlan = buildPlan(inputs.manifest, inputs.imageDerivatives, livePreflight.countries, assets)
    report.planned = livePlan
    report.created.documents = await createDocuments(liveClient, livePlan)
    report.status = 'completed'
    report.recovery = makeRecovery(report.created)
    const reportPath = await writeReport(report)
    printPlan(livePlan, reportPath, report.mode)
  } catch (error) {
    report.status = 'failed'
    report.error = asErrorMessage(error)
    report.recovery = makeRecovery(report.created)
    const reportPath = await writeReport(report)
    console.error(`Import failed. Report: ${reportPath}`)
    console.error(report.error)
    process.exit(1)
  }
}

if (process.argv[1]?.endsWith('import-praga-guatemala.ts')) {
  main()
}

export {
  buildPlan,
  parseArgs,
  validateAllowlist,
  validateManifestContract,
  type ImageDerivativeReport,
  type Manifest,
  type RemotePreflight,
}
