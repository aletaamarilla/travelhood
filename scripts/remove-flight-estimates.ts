/**
 * Removes the retired flightEstimate field and the known published flight-cost
 * copy from Sanity. Defaults to a read-only preview.
 *
 * npm run remove:flight-estimates
 * npm run remove:flight-estimates -- --apply
 */
import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
import {mkdirSync, writeFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'

const EXPECTED_PROJECT_ID = '73m9u2gt'
const EXPECTED_DATASET = 'production'
const REPORT_DIR = 'imports/remove-flight-estimates-2026-10-20'

export interface SanityDocument {
  _id: string
  _rev: string
  _type: string
  flightEstimate?: number
  [key: string]: unknown
}

type CopyReplacement = {
  id: string
  path: string
  before: string
  after: string
}

export type FlightEstimatePatch = {
  id: string
  revision: string
  type: string
  set: Record<string, string>
  unset: string[]
}

export const COPY_REPLACEMENTS: CopyReplacement[] = [
  {
    id: 'continent-africa',
    path: 'faqs[2].answer',
    before: 'Desde 590€ para Marruecos en puente hasta 1.190€ para Zanzíbar o Egipto. Los vuelos a Marruecos son muy baratos (50-180€), los de África subsahariana algo más (500-700€).',
    after: 'Desde 590€ para Marruecos en puente hasta 1.190€ para Zanzíbar o Egipto. Los vuelos internacionales no están incluidos y se reservan por separado.',
  },
  {
    id: 'continent-asia',
    path: 'faqs[2].answer',
    before: 'Los vuelos cuestan 500-900€ según destino, pero una vez allí todo es muy barato. Tailandia, Vietnam y Bali son de los destinos más económicos del mundo.',
    after: 'El precio del viaje depende del destino y la duración. Los vuelos internacionales no están incluidos y se reservan por separado. Una vez allí, Tailandia, Vietnam y Bali son destinos muy económicos.',
  },
  {
    id: 'destination-brasil-carnaval',
    path: 'seo.presupuestoDescription',
    before: 'Precio, vuelo estimado y gastos diarios de las dos salidas especiales a Río de Janeiro durante el Carnaval de 2027.',
    after: 'Precio, qué incluye y gastos diarios de las dos salidas especiales a Río de Janeiro durante el Carnaval de 2027.',
  },
  {
    id: 'destination-tailandia-festival-linternas',
    path: 'seo.presupuestoDescription',
    before: 'Precio, vuelo estimado y gastos diarios para la edición especial de Tailandia del 21 de noviembre al 4 de diciembre de 2026.',
    after: 'Precio, qué incluye y gastos diarios para la edición especial de Tailandia del 21 de noviembre al 4 de diciembre de 2026.',
  },
  {
    id: 'season-puentes',
    path: 'faqs[2].answer',
    before: 'Mayo y octubre suelen tener los vuelos más baratos. Marruecos en puente de mayo (desde 590€ + vuelo 50-150€) es la opción más económica.',
    after: 'Mayo y octubre suelen ser buenas fechas para viajar. Marruecos en puente de mayo (desde 590€) es la opción más económica.',
  },
  {
    id: 'season-verano',
    path: 'faqs[2].answer',
    before: 'Grecia (desde 990€ + vuelo 200€) y Vietnam (desde 1.150€) ofrecen la mejor relación calidad-precio en verano.',
    after: 'Grecia (desde 990€) y Vietnam (desde 1.150€) ofrecen la mejor relación calidad-precio en verano.',
  },
  {
    id: 'continent-europa',
    path: 'editorialIntro',
    before: 'Europa es mucho más que monumentos y museos. Es perderse por calles empedradas de Grecia al atardecer, cazar auroras boreales en Islandia, recorrer los fiordos noruegos o descubrir la Laponia más salvaje bajo la nieve. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años por los rincones más auténticos del viejo continente, combinando cultura, naturaleza y experiencias que no encontrarías en una guía turística. Nuestros grupos reducidos de 12 a 18 personas viajan con coordinador en destino, alojamiento incluido y un itinerario diseñado para vivir cada país de verdad. Europa tiene destinos para todos los gustos: desde escapadas de puente de 5 días hasta aventuras de dos semanas. Y lo mejor: los vuelos son cortos y baratos, así que el presupuesto total es muy accesible.',
    after: 'Europa es mucho más que monumentos y museos. Es perderse por calles empedradas de Grecia al atardecer, cazar auroras boreales en Islandia, recorrer los fiordos noruegos o descubrir la Laponia más salvaje bajo la nieve. En Travelhood organizamos viajes en grupo para jóvenes de 20 a 35 años por los rincones más auténticos del viejo continente, combinando cultura, naturaleza y experiencias que no encontrarías en una guía turística. Nuestros grupos reducidos de 12 a 18 personas viajan con coordinador en destino, alojamiento incluido y un itinerario diseñado para vivir cada país de verdad. Europa tiene destinos para todos los gustos: desde escapadas de puente de 5 días hasta aventuras de dos semanas. Los vuelos internacionales no están incluidos y se reservan por separado.',
  },
  {
    id: 'season-septiembre',
    path: 'faqs[1].answer',
    before: 'Porque es temporada baja en muchos destinos. Los vuelos y alojamientos bajan de precio, y los lugares turísticos están menos masificados.',
    after: 'Porque es temporada baja en muchos destinos. Hay menos demanda, los alojamientos pueden bajar de precio y los lugares turísticos están menos masificados.',
  },
  {
    id: 'season-navidad',
    path: 'faqs[2].answer',
    before: 'Los vuelos suben en Navidad, pero el precio del viaje con Travelhood es competitivo. Laponia desde 1.390€ y Maldivas desde 1.350€ (sin vuelo).',
    after: 'El precio del viaje con Travelhood depende del destino y las fechas. Laponia parte desde 1.390€ y Maldivas desde 1.350€. Los vuelos internacionales no están incluidos.',
  },
]

function readPath(value: unknown, path: string): unknown {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  return parts.reduce<unknown>((current, part) => {
    if (current === null || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[part]
  }, value)
}

export function buildFlightEstimatePatch(doc: SanityDocument): FlightEstimatePatch | null {
  const set: Record<string, string> = {}
  const unset: string[] = []
  if (Object.hasOwn(doc, 'flightEstimate')) unset.push('flightEstimate')

  for (const replacement of COPY_REPLACEMENTS) {
    if (replacement.id !== doc._id) continue
    const current = readPath(doc, replacement.path)
    if (current === replacement.before) set[replacement.path] = replacement.after
  }

  if (!unset.length && !Object.keys(set).length) return null
  return {id: doc._id, revision: doc._rev, type: doc._type, set, unset}
}

export function findLegacyCopy(documents: SanityDocument[]) {
  const hits: Array<{id: string; path: string}> = []
  for (const replacement of COPY_REPLACEMENTS) {
    const document = documents.find((doc) => doc._id === replacement.id)
    if (!document || readPath(document, replacement.path) !== replacement.after) {
      hits.push({id: replacement.id, path: replacement.path})
    }
  }
  return hits
}

function save(name: string, value: unknown) {
  mkdirSync(REPORT_DIR, {recursive: true})
  writeFileSync(`${REPORT_DIR}/${name}`, `${JSON.stringify(value, null, 2)}\n`)
}

async function main() {
  dotenv.config({path: ['.env.local', '.env'], quiet: true})
  const args = process.argv.slice(2)
  const unknownArgs = args.filter((arg) => arg !== '--apply')
  if (unknownArgs.length) throw new Error(`Argumentos no reconocidos: ${unknownArgs.join(', ')}`)

  const apply = args.includes('--apply')
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || EXPECTED_DATASET
  const token = apply
    ? process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
    : process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
  if (projectId !== EXPECTED_PROJECT_ID || dataset !== EXPECTED_DATASET) {
    throw new Error(`Destino Sanity inesperado: ${projectId || '(sin projectId)'}/${dataset}.`)
  }
  if (!token) throw new Error(`La ${apply ? 'migración' : 'previsualización'} requiere un token de Sanity.`)

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: process.env.SANITY_API_VERSION || '2026-03-16',
    useCdn: false,
    perspective: 'raw',
  })
  const replacementIds = [...new Set(COPY_REPLACEMENTS.map(({id}) => id))]
  const documents = await client.fetch<SanityDocument[]>(
    '*[defined(flightEstimate) || _id in $replacementIds]',
    {replacementIds},
  )
  const patches = documents.map(buildFlightEstimatePatch).filter((patch) => patch !== null)
  const copyConflicts = COPY_REPLACEMENTS.filter((replacement) => {
    const document = documents.find((entry) => entry._id === replacement.id)
    const current = document && readPath(document, replacement.path)
    return !document || (current !== replacement.before && current !== replacement.after)
  })
  if (copyConflicts.length) {
    throw new Error(`Hay textos publicados que no coinciden con la copia revisada: ${JSON.stringify(copyConflicts.map(({id, path}) => ({id, path})))}.`)
  }

  const fieldDocuments = documents.filter((doc) => Object.hasOwn(doc, 'flightEstimate'))
  const plan = {
    generatedAt: new Date().toISOString(),
    mode: apply ? 'apply' : 'preview',
    projectId,
    dataset,
    fieldDocuments: fieldDocuments.length,
    copyDocuments: patches.filter((patch) => Object.keys(patch.set).length).length,
    patches,
  }
  const applyRunPrefix = plan.generatedAt.replace(/[:.]/g, '-')
  if (!apply) save('plan.json', plan)
  else if (patches.length) save(`${applyRunPrefix}-apply-plan.json`, plan)
  console.log(JSON.stringify({
    mode: plan.mode,
    fieldDocuments: plan.fieldDocuments,
    copyDocuments: plan.copyDocuments,
    patches: patches.length,
  }, null, 2))
  if (!apply || !patches.length) return

  save(`${applyRunPrefix}-before.json`, documents.filter((doc) => patches.some((patch) => patch.id === doc._id)))
  let transaction = client.transaction()
  for (const patch of patches) {
    transaction = transaction.patch(patch.id, (builder) => {
      let update = builder.ifRevisionId(patch.revision)
      if (Object.keys(patch.set).length) update = update.set(patch.set)
      if (patch.unset.length) update = update.unset(patch.unset)
      return update
    })
  }
  const result = await transaction.commit({visibility: 'sync'})
  const [remainingFields, verificationDocuments] = await Promise.all([
    client.fetch<number>('count(*[defined(flightEstimate)])'),
    client.fetch<SanityDocument[]>('*[_id in $ids]', {ids: [...new Set(documents.map(({_id}) => _id))]}),
  ])
  const remainingCopy = findLegacyCopy(verificationDocuments)
  if (remainingFields !== 0 || remainingCopy.length) {
    throw new Error(`Verificación fallida: ${remainingFields} campos y ${remainingCopy.length} textos antiguos. Consulta before.json.`)
  }
  const verification = {
    verifiedAt: new Date().toISOString(),
    transactionId: result.transactionId,
    updatedDocuments: patches.length,
    removedFields: fieldDocuments.length,
    updatedCopyDocuments: patches.filter((patch) => Object.keys(patch.set).length).length,
    remainingFields,
    remainingCopy,
  }
  save(`${applyRunPrefix}-result.json`, verification)
  console.log(JSON.stringify(verification, null, 2))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Error al retirar las estimaciones de vuelo.')
    process.exitCode = 1
  })
}
