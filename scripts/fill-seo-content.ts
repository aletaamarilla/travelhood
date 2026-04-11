import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

let client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (client) return client

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

  client = createClient({
    projectId,
    dataset: 'production',
    apiVersion: '2026-03-16',
    token,
    useCdn: false,
  })
  return client
}

interface Options {
  seo: boolean
  comparisons: boolean
  deleteBlogs: boolean
  dryRun: boolean
  force: boolean
  confirm: boolean
  help: boolean
}

interface ComparisonData {
  slugA: string
  slugB: string
  destIdA: string
  destIdB: string
  verdict: string
  seo: {
    title: string
    description: string
    keywords: string
  }
}

type SeoShape = {
  title?: string
  description?: string
  keywords?: string
}

type SeoDoc = {
  _id: string
  seo?: SeoShape
  slug?: string
}

const SEO_DATA_CONTINENTS: Record<string, { keywords: string }> = {
  'continent-europa': { keywords: 'viajes europa mujeres, viajes en grupo europa, destinos europa' },
  'continent-asia': { keywords: 'viajes asia mujeres, viajes en grupo asia, destinos asia' },
  'continent-africa': { keywords: 'viajes africa mujeres, viajes en grupo africa, destinos africa' },
  'continent-sudamerica': { keywords: 'viajes sudamerica mujeres, viajes en grupo sudamerica' },
  'continent-centroamerica': { keywords: 'viajes centroamerica mujeres, viajes caribe mujeres' },
  'continent-oceania': { keywords: 'viajes oceania mujeres, viajes en grupo oceania' },
}

const SEO_DATA_COUNTRIES: Record<string, { title: string; description: string; keywords: string }> = {
  'country-brasil': {
    title: 'Viajes a Brasil para mujeres | Travel Hood',
    description: 'Descubre Brasil con Travel Hood: viajes en grupo para mujeres desde 1.250€. Playas, ritmo y naturaleza.',
    keywords: 'viajes brasil mujeres, viajes grupo brasil, viajar a brasil',
  },
  'country-colombia': {
    title: 'Viajes a Colombia para mujeres | Travel Hood',
    description: 'Descubre Colombia con Travel Hood: viajes en grupo para mujeres desde 1.350€. Cafe, Caribe y aventura.',
    keywords: 'viajes colombia mujeres, viajes grupo colombia, viajar a colombia',
  },
  'country-finlandia': {
    title: 'Viajes a Laponia para mujeres | Travel Hood',
    description: 'Descubre Laponia con Travel Hood: auroras boreales, huskies y nieve artica en grupo para mujeres.',
    keywords: 'viajes laponia mujeres, auroras boreales grupo, viajar a laponia',
  },
  'country-maldivas': {
    title: 'Viajes a Maldivas para mujeres | Travel Hood',
    description: 'Descubre Maldivas con Travel Hood: viajes en grupo para mujeres desde 950€. Paraiso cristalino.',
    keywords: 'viajes maldivas mujeres, viajes grupo maldivas, viajar a maldivas',
  },
  'country-tanzania': {
    title: 'Viajes a Zanzibar para mujeres | Travel Hood',
    description: 'Descubre Zanzibar con Travel Hood: viajes en grupo para mujeres desde 1.300€. Playa y cultura.',
    keywords: 'viajes zanzibar mujeres, viajes grupo zanzibar, viajar a zanzibar',
  },
  'country-tailandia': {
    title: 'Viajes a Tailandia para mujeres | Travel Hood',
    description: 'Descubre Tailandia con Travel Hood: viajes en grupo para mujeres desde 1.300€. Cultura y playas.',
    keywords: 'viajes tailandia mujeres, viajes grupo tailandia, viajar a tailandia',
  },
  'country-islandia': {
    title: 'Viajes a Islandia para mujeres | Travel Hood',
    description: 'Descubre Islandia con Travel Hood: viajes en grupo para mujeres desde 1.250€. Naturaleza extrema.',
    keywords: 'viajes islandia mujeres, viajes grupo islandia, viajar a islandia',
  },
  'country-indonesia': {
    title: 'Viajes a Indonesia para mujeres | Travel Hood',
    description: 'Descubre Indonesia con Travel Hood: viajes en grupo para mujeres desde 1.250€. Templos y playas.',
    keywords: 'viajes indonesia mujeres, viajes bali mujeres, viajar a indonesia',
  },
  'country-egipto': {
    title: 'Viajes a Egipto para mujeres | Travel Hood',
    description: 'Descubre Egipto con Travel Hood: viajes en grupo para mujeres desde 950€. Piramides e historia.',
    keywords: 'viajes egipto mujeres, viajes grupo egipto, viajar a egipto',
  },
  'country-sri-lanka': {
    title: 'Viajes a Sri Lanka para mujeres | Travel Hood',
    description: 'Descubre Sri Lanka con Travel Hood: viajes en grupo para mujeres desde 1.050€. Safari y playas.',
    keywords: 'viajes sri lanka mujeres, viajes grupo sri lanka, viajar a sri lanka',
  },
  'country-portugal': {
    title: 'Viajes a Azores para mujeres | Travel Hood',
    description: 'Descubre Azores con Travel Hood: viajes en grupo para mujeres desde 900€. Lagos volcanicos.',
    keywords: 'viajes azores mujeres, viajes grupo azores, viajar a azores',
  },
  'country-noruega': {
    title: 'Viajes a Lofoten para mujeres | Travel Hood',
    description: 'Descubre Lofoten con Travel Hood: viajes en grupo para mujeres desde 1.250€. Fiordos y naturaleza.',
    keywords: 'viajes lofoten mujeres, viajes grupo lofoten, viajar a lofoten',
  },
  'country-espana': {
    title: 'Viajes a Espana para mujeres | Travel Hood',
    description: 'Descubre Espana con Travel Hood: el Camino de Santiago y mas en grupo para mujeres.',
    keywords: 'viajes espana mujeres, camino de santiago grupo, viajar a espana',
  },
  'country-filipinas': {
    title: 'Viajes a Filipinas para mujeres | Travel Hood',
    description: 'Descubre Filipinas con Travel Hood: viajes en grupo para mujeres desde 1.350€. Islas paradisiacas.',
    keywords: 'viajes filipinas mujeres, viajes grupo filipinas, viajar a filipinas',
  },
  'country-puerto-rico': {
    title: 'Viajes a Puerto Rico para mujeres | Travel Hood',
    description: 'Descubre Puerto Rico con Travel Hood: viajes en grupo para mujeres desde 1.150€. Caribe latino.',
    keywords: 'viajes puerto rico mujeres, viajes grupo puerto rico, viajar a puerto rico',
  },
}

const SEO_DATA_CATEGORIES: Record<string, { keywords: string }> = {
  'category-playa': { keywords: 'viajes playa mujeres, vacaciones playa grupo, destinos playa' },
  'category-aventura': { keywords: 'viajes aventura mujeres, viajes aventura grupo, destinos aventura' },
  'category-naturaleza': { keywords: 'viajes naturaleza mujeres, viajes naturaleza grupo, ecoturismo mujeres' },
  'category-cultural': { keywords: 'viajes culturales mujeres, viajes culturales grupo, turismo cultural' },
  'category-nieve': { keywords: 'viajes nieve mujeres, viajes nieve grupo, vacaciones nieve' },
}

const SEO_DATA_SEASONS: Record<string, { keywords: string }> = {
  'season-verano': { keywords: 'viajes verano mujeres, vacaciones verano grupo, destinos verano' },
  'season-invierno': { keywords: 'viajes invierno mujeres, vacaciones invierno grupo, destinos invierno' },
  'season-primavera': { keywords: 'viajes primavera mujeres, vacaciones primavera grupo, destinos primavera' },
  'season-semana-santa': { keywords: 'viajes semana santa mujeres, vacaciones semana santa, escapadas semana santa' },
}

const SEO_DATA_EXISTING_COMPARISONS: Record<string, { title: string; description: string; keywords: string }> = {
  'islandia-vs-laponia': {
    title: 'Islandia vs Laponia | Travel Hood',
    description: 'Islandia o Laponia? Compara naturaleza extrema y auroras boreales para mujeres viajeras.',
    keywords: 'islandia vs laponia, comparar islandia laponia, norte europa',
  },
}

const NEW_COMPARISONS: ComparisonData[] = [
  {
    slugA: 'indonesia',
    slugB: 'tailandia-verano',
    destIdA: 'destination-indonesia',
    destIdB: 'destination-tailandia-verano',
    verdict: 'Indonesia ofrece variedad total: templos, volcanes y playas. Tailandia combina cultura urbana con islas paradisiacas. Indonesia si buscas aventura y diversidad. Tailandia si prefieres gastronomia y vida nocturna.',
    seo: {
      title: 'Indonesia vs Tailandia | Travel Hood',
      description: 'Indonesia o Tailandia? Compara destinos para mujeres viajeras: precios, experiencias y cual elegir.',
      keywords: 'indonesia vs tailandia, bali o tailandia, comparar destinos asia',
    },
  },
  {
    slugA: 'indonesia',
    slugB: 'sri-lanka-verano',
    destIdA: 'destination-indonesia',
    destIdB: 'destination-sri-lanka-verano',
    verdict: 'Indonesia es playa y templos. Sri Lanka es safari, trenes panoramicos y cultura milenaria. Indonesia para surf y fiestas. Sri Lanka para naturaleza variada y precios mas bajos.',
    seo: {
      title: 'Indonesia vs Sri Lanka | Travel Hood',
      description: 'Indonesia o Sri Lanka? Compara ambos destinos asiaticos para viajeras: naturaleza, playa y precio.',
      keywords: 'indonesia vs sri lanka, bali o sri lanka, destinos asia mujeres',
    },
  },
  {
    slugA: 'tailandia-verano',
    slugB: 'filipinas-verano',
    destIdA: 'destination-tailandia-verano',
    destIdB: 'destination-filipinas-verano',
    verdict: 'Tailandia tiene mejor infraestructura turistica y gastronomia. Filipinas tiene playas mas virgenes y menos masificacion. Tailandia para primeras experiencias en Asia. Filipinas para viajeras que buscan autenticidad.',
    seo: {
      title: 'Tailandia vs Filipinas | Travel Hood',
      description: 'Tailandia o Filipinas? Compara playas, precios y experiencias para mujeres viajeras.',
      keywords: 'tailandia vs filipinas, comparar tailandia filipinas',
    },
  },
  {
    slugA: 'sri-lanka-verano',
    slugB: 'filipinas-verano',
    destIdA: 'destination-sri-lanka-verano',
    destIdB: 'destination-filipinas-verano',
    verdict: 'Sri Lanka combina safari, montana y playa en un solo viaje. Filipinas es isla hopping puro y playas de postal. Sri Lanka para variedad total. Filipinas para relax y snorkel.',
    seo: {
      title: 'Sri Lanka vs Filipinas | Travel Hood',
      description: 'Sri Lanka o Filipinas? Compara naturaleza, playas y aventura para viajeras en grupo.',
      keywords: 'sri lanka vs filipinas, comparar destinos asia',
    },
  },
  {
    slugA: 'egipto',
    slugB: 'zanzibar',
    destIdA: 'destination-egipto',
    destIdB: 'destination-zanzibar',
    verdict: 'Egipto es historia monumental y desierto. Zanzibar es playa paradisiaca y cultura swahili. Egipto si te fascina la historia antigua. Zanzibar si buscas playa y un destino africano autentico.',
    seo: {
      title: 'Egipto vs Zanzibar | Travel Hood',
      description: 'Egipto o Zanzibar? Compara cultura, playa y aventura en Africa para mujeres viajeras.',
      keywords: 'egipto vs zanzibar, comparar egipto zanzibar, africa mujeres',
    },
  },
  {
    slugA: 'azores',
    slugB: 'islandia',
    destIdA: 'destination-azores',
    destIdB: 'destination-islandia',
    verdict: 'Azores tiene lagos volcanicos, termas y clima templado. Islandia tiene glaciares, cascadas y paisajes extremos. Azores para naturaleza accesible y barata. Islandia para experiencias epicas.',
    seo: {
      title: 'Azores vs Islandia | Travel Hood',
      description: 'Azores o Islandia? Compara naturaleza volcanica, precios y experiencias para viajeras.',
      keywords: 'azores vs islandia, comparar azores islandia, naturaleza europa',
    },
  },
  {
    slugA: 'azores',
    slugB: 'lofoten',
    destIdA: 'destination-azores',
    destIdB: 'destination-lofoten',
    verdict: 'Azores es verde, volcanico y templado. Lofoten es fiordos, playas articas y trekking. Azores para relax natural. Lofoten para aventura nordica intensa.',
    seo: {
      title: 'Azores vs Lofoten | Travel Hood',
      description: 'Azores o Lofoten? Compara dos joyas europeas de naturaleza para viajeras en grupo.',
      keywords: 'azores vs lofoten, comparar azores lofoten, naturaleza europa',
    },
  },
  {
    slugA: 'brasil',
    slugB: 'puerto-rico',
    destIdA: 'destination-brasil',
    destIdB: 'destination-puerto-rico',
    verdict: 'Brasil tiene playas enormes, fiesta y naturaleza salvaje. Puerto Rico tiene cultura latina concentrada y Caribe autentico. Brasil para viajes largos e intensos. Puerto Rico para escapadas caribenas cortas.',
    seo: {
      title: 'Brasil vs Puerto Rico | Travel Hood',
      description: 'Brasil o Puerto Rico? Compara playas, cultura y experiencias en America para viajeras.',
      keywords: 'brasil vs puerto rico, comparar brasil puerto rico',
    },
  },
  {
    slugA: 'brasil',
    slugB: 'colombia',
    destIdA: 'destination-brasil',
    destIdB: 'destination-colombia',
    verdict: 'Brasil es playa y ritmo carioca. Colombia es cafe, Caribe y montana. Brasil para fiesta y naturaleza costera. Colombia para variedad geografica y cultural.',
    seo: {
      title: 'Brasil vs Colombia | Travel Hood',
      description: 'Brasil o Colombia? Compara dos gigantes de Sudamerica para mujeres viajeras en grupo.',
      keywords: 'brasil vs colombia, comparar brasil colombia, sudamerica mujeres',
    },
  },
  {
    slugA: 'maldivas',
    slugB: 'zanzibar',
    destIdA: 'destination-maldivas',
    destIdB: 'destination-zanzibar',
    verdict: 'Maldivas es lujo minimalista y snorkel puro. Zanzibar es cultura, especias y playas variadas. Maldivas para desconexion total. Zanzibar para playa con aventura y cultura.',
    seo: {
      title: 'Maldivas vs Zanzibar | Travel Hood',
      description: 'Maldivas o Zanzibar? Compara paraisos de playa para mujeres viajeras: precio y experiencia.',
      keywords: 'maldivas vs zanzibar, comparar maldivas zanzibar, playa mujeres',
    },
  },
  {
    slugA: 'laponia',
    slugB: 'lofoten',
    destIdA: 'destination-laponia',
    destIdB: 'destination-lofoten',
    verdict: 'Laponia es auroras boreales, huskies y nieve. Lofoten es fiordos, trekking y pueblos pesqueros. Laponia para experiencia invernal magica. Lofoten para aventura de verano nordico.',
    seo: {
      title: 'Laponia vs Lofoten | Travel Hood',
      description: 'Laponia o Lofoten? Compara dos destinos nordicos para mujeres viajeras en grupo.',
      keywords: 'laponia vs lofoten, comparar laponia lofoten, norte europa mujeres',
    },
  },
]

function makeRef(id: string) {
  return { _type: 'reference' as const, _ref: id }
}

function makeSlug(value: string) {
  return { _type: 'slug' as const, current: value }
}

function normalizeForSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseArgs(): Options {
  const args = process.argv.slice(2)
  const options: Options = {
    seo: false,
    comparisons: false,
    deleteBlogs: false,
    dryRun: false,
    force: false,
    confirm: false,
    help: false,
  }

  for (const arg of args) {
    if (arg === '--seo') options.seo = true
    else if (arg === '--comparisons') options.comparisons = true
    else if (arg === '--delete-blogs') options.deleteBlogs = true
    else if (arg === '--all') {
      options.seo = true
      options.comparisons = true
      options.deleteBlogs = true
    } else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--force') options.force = true
    else if (arg === '--confirm') options.confirm = true
    else if (arg === '--help' || arg === '-h') options.help = true
    else {
      console.error(`❌ Unknown flag: ${arg}`)
      printUsage()
      process.exit(1)
    }
  }

  return options
}

function printUsage() {
  console.log(`
🧩 fill-seo-content — Travel Hood Sanity content migration script.

Usage:
  npx tsx scripts/fill-seo-content.ts [flags]

Flags:
  --seo           Fill SEO for continents, countries, categories, seasons, comparisons
  --comparisons   Create new comparison documents
  --delete-blogs  Delete all blogPost documents (requires --confirm)
  --all           Equivalent to --seo --comparisons --delete-blogs
  --dry-run       Show actions without writing to Sanity
  --force         Overwrite existing SEO values
  --confirm       Required when using --delete-blogs in live mode
  --help, -h      Show this help

Examples:
  npx tsx scripts/fill-seo-content.ts --seo --dry-run
  npx tsx scripts/fill-seo-content.ts --comparisons
  npx tsx scripts/fill-seo-content.ts --all --confirm
`)
}

function validateSeoLength(title?: string, description?: string): boolean {
  if (title && title.length > 60) return false
  if (description && description.length > 155) return false
  return true
}

async function fillContinentsSeo(options: Options) {
  const sanity = getClient()
  const continents = await sanity.fetch<SeoDoc[]>('*[_type == "continent"]{ _id, seo }')
  for (const continent of continents) {
    const data = SEO_DATA_CONTINENTS[continent._id]
    if (!data) {
      console.warn(`⚠️ No SEO data configured for continent: ${continent._id}`)
      continue
    }

    const existingKeywords = continent.seo?.keywords?.trim()
    if (existingKeywords && !options.force) {
      console.log(`⏭️ continent ${continent._id}: seo.keywords already set`)
      continue
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] continent ${continent._id} -> seo.keywords`)
      continue
    }

    await sanity.patch(continent._id).set({ 'seo.keywords': data.keywords }).commit()
    console.log(`✅ continent ${continent._id}: seo.keywords updated`)
  }
}

async function fillCountriesSeo(options: Options) {
  const sanity = getClient()
  const countries = await sanity.fetch<SeoDoc[]>('*[_type == "country"]{ _id, seo }')
  const existingCountryIds = new Set(countries.map((country) => country._id))

  for (const [countryId, data] of Object.entries(SEO_DATA_COUNTRIES)) {
    if (!existingCountryIds.has(countryId)) {
      console.warn(`⚠️ Country in map not found in Sanity: ${countryId}`)
    }
    if (!validateSeoLength(data.title, data.description)) {
      console.warn(`⚠️ SEO length invalid for ${countryId}. Skipping.`)
    }
  }

  for (const country of countries) {
    const data = SEO_DATA_COUNTRIES[country._id]
    if (!data) {
      console.warn(`⚠️ No SEO data configured for country: ${country._id}`)
      continue
    }

    if (!validateSeoLength(data.title, data.description)) {
      console.warn(`⚠️ Invalid title/description length for ${country._id}. Skipping.`)
      continue
    }

    const patch: Record<string, string> = {}
    if (options.force || !country.seo?.title?.trim()) patch['seo.title'] = data.title
    if (options.force || !country.seo?.description?.trim()) patch['seo.description'] = data.description
    if (options.force || !country.seo?.keywords?.trim()) patch['seo.keywords'] = data.keywords

    if (Object.keys(patch).length === 0) {
      console.log(`⏭️ country ${country._id}: SEO already complete`)
      continue
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] country ${country._id} -> ${Object.keys(patch).join(', ')}`)
      continue
    }

    await sanity.patch(country._id).set(patch).commit()
    console.log(`✅ country ${country._id}: updated ${Object.keys(patch).join(', ')}`)
  }
}

async function fillCategoriesSeo(options: Options) {
  const sanity = getClient()
  const categories = await sanity.fetch<SeoDoc[]>('*[_type == "tripCategory"]{ _id, seo }')
  const categoryIds = await sanity.fetch<{ _id: string; name: string }[]>('*[_type == "tripCategory"]{ _id, name }')
  for (const category of categoryIds) {
    if (!SEO_DATA_CATEGORIES[category._id]) {
      console.warn(`⚠️ Category without SEO mapping: ${category._id} (${category.name})`)
    }
  }

  for (const category of categories) {
    const data = SEO_DATA_CATEGORIES[category._id]
    if (!data) {
      continue
    }

    if (category.seo?.keywords?.trim() && !options.force) {
      console.log(`⏭️ tripCategory ${category._id}: seo.keywords already set`)
      continue
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] tripCategory ${category._id} -> seo.keywords`)
      continue
    }

    await sanity.patch(category._id).set({ 'seo.keywords': data.keywords }).commit()
    console.log(`✅ tripCategory ${category._id}: seo.keywords updated`)
  }
}

async function fillSeasonsSeo(options: Options) {
  const sanity = getClient()
  const seasons = await sanity.fetch<SeoDoc[]>('*[_type == "season"]{ _id, seo }')
  const seasonIds = await sanity.fetch<{ _id: string; name: string }[]>('*[_type == "season"]{ _id, name }')
  for (const season of seasonIds) {
    if (!SEO_DATA_SEASONS[season._id]) {
      console.warn(`⚠️ Season without SEO mapping: ${season._id} (${season.name})`)
    }
  }

  for (const season of seasons) {
    const data = SEO_DATA_SEASONS[season._id]
    if (!data) {
      continue
    }

    if (season.seo?.keywords?.trim() && !options.force) {
      console.log(`⏭️ season ${season._id}: seo.keywords already set`)
      continue
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] season ${season._id} -> seo.keywords`)
      continue
    }

    await sanity.patch(season._id).set({ 'seo.keywords': data.keywords }).commit()
    console.log(`✅ season ${season._id}: seo.keywords updated`)
  }
}

async function fillComparisonsSeo(options: Options) {
  const sanity = getClient()
  const comparisons = await sanity.fetch<SeoDoc[]>(
    '*[_type == "comparison"]{ _id, seo, "slug": slug.current }',
  )

  for (const comparison of comparisons) {
    const key = comparison.slug ?? ''
    const data = SEO_DATA_EXISTING_COMPARISONS[key]
    if (!data) continue

    if (!validateSeoLength(data.title, data.description)) {
      console.warn(`⚠️ Invalid SEO length for comparison ${comparison._id}. Skipping.`)
      continue
    }

    const patch: Record<string, string> = {}
    if (options.force || !comparison.seo?.title?.trim()) patch['seo.title'] = data.title
    if (options.force || !comparison.seo?.description?.trim()) patch['seo.description'] = data.description
    if (options.force || !comparison.seo?.keywords?.trim()) patch['seo.keywords'] = data.keywords

    if (Object.keys(patch).length === 0) {
      console.log(`⏭️ comparison ${comparison._id}: SEO already complete`)
      continue
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] comparison ${comparison._id} -> ${Object.keys(patch).join(', ')}`)
      continue
    }

    await sanity.patch(comparison._id).set(patch).commit()
    console.log(`✅ comparison ${comparison._id}: updated ${Object.keys(patch).join(', ')}`)
  }
}

async function fillSeo(options: Options) {
  console.log('\n🔎 Filling SEO content...')
  await fillContinentsSeo(options)
  await fillCountriesSeo(options)
  await fillCategoriesSeo(options)
  await fillSeasonsSeo(options)
  await fillComparisonsSeo(options)
}

function getComparisonIdentity(slugA: string, slugB: string) {
  const ordered = [normalizeForSlug(slugA), normalizeForSlug(slugB)].sort((a, b) => a.localeCompare(b))
  const joined = `${ordered[0]}-vs-${ordered[1]}`
  return {
    id: `comparison-${joined}`,
    slug: joined,
  }
}

async function createComparisons(options: Options) {
  console.log('\n⚖️ Creating new comparisons...')

  const sanity = getClient()
  const destinations = await sanity.fetch<{ _id: string; slug: string }[]>(
    '*[_type == "destination"]{ _id, "slug": slug.current }',
  )
  const destinationIds = new Set(destinations.map((destination) => destination._id))

  for (const item of NEW_COMPARISONS) {
    if (!destinationIds.has(item.destIdA) || !destinationIds.has(item.destIdB)) {
      console.warn(`⚠️ Missing destination(s) for ${item.slugA} vs ${item.slugB}. Skipping.`)
      continue
    }

    if (!validateSeoLength(item.seo.title, item.seo.description)) {
      console.warn(`⚠️ SEO length invalid for ${item.slugA} vs ${item.slugB}. Skipping.`)
      continue
    }

    const identity = getComparisonIdentity(item.slugA, item.slugB)
    const existing = await sanity.fetch<{ _id: string } | null>(
      '*[_id == $id][0]{ _id }',
      { id: identity.id },
    )

    if (existing && !options.force) {
      console.log(`⏭️ comparison ${identity.id}: already exists`)
      continue
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] ${identity.id} (${item.destIdA} vs ${item.destIdB})`)
      continue
    }

    await sanity.createOrReplace({
      _id: identity.id,
      _type: 'comparison',
      destinationA: makeRef(item.destIdA),
      destinationB: makeRef(item.destIdB),
      slug: makeSlug(identity.slug),
      verdict: item.verdict,
      seo: {
        title: item.seo.title,
        description: item.seo.description,
        keywords: item.seo.keywords,
      },
    })
    console.log(`✅ created ${identity.id}`)
  }
}

async function deleteBlogs(options: Options) {
  console.log('\n🗑️ Deleting blog posts...')
  const sanity = getClient()
  const blogPosts = await sanity.fetch<{ _id: string; title?: string }[]>(
    '*[_type == "blogPost"]{ _id, title }',
  )

  if (blogPosts.length === 0) {
    console.log('ℹ️ No hay blogs que eliminar')
    return
  }

  console.log(`Found ${blogPosts.length} blog posts:`)
  for (const post of blogPosts) {
    console.log(` - ${post._id}: ${post.title ?? '(sin titulo)'}`)
  }

  if (!options.confirm && !options.dryRun) {
    console.log('⚠️ Usa --confirm para ejecutar la eliminacion en modo live')
    return
  }

  if (options.dryRun) {
    console.log('[DRY-RUN] Would unset relatedPosts/relatedDestinations and delete all blog posts')
    return
  }

  for (const post of blogPosts) {
    await sanity.patch(post._id).unset(['relatedPosts', 'relatedDestinations']).commit()
  }

  try {
    const tx = sanity.transaction()
    for (const post of blogPosts) {
      tx.delete(post._id)
    }
    await tx.commit()
    for (const post of blogPosts) {
      console.log(`✅ deleted ${post._id}`)
    }
  } catch (error) {
    console.warn('⚠️ Batch delete failed, retrying one-by-one...', error)
    for (const post of blogPosts) {
      await sanity.delete(post._id)
      console.log(`✅ deleted ${post._id}`)
    }
  }
}

async function main() {
  const options = parseArgs()

  if (options.help) {
    printUsage()
    return
  }

  if (!options.seo && !options.comparisons && !options.deleteBlogs) {
    printUsage()
    return
  }

  console.log('🚀 fill-seo-content — Travel Hood content migration')
  console.log(`Mode: ${options.dryRun ? 'DRY-RUN' : 'LIVE'}`)
  console.log(`Flags: seo=${options.seo} comparisons=${options.comparisons} deleteBlogs=${options.deleteBlogs} force=${options.force}`)

  if (options.seo) await fillSeo(options)
  if (options.comparisons) await createComparisons(options)
  if (options.deleteBlogs) await deleteBlogs(options)

  console.log('\n🎉 Done.')
}

main().catch((err) => {
  console.error('❌ fill-seo-content failed:', err)
  process.exit(1)
})
