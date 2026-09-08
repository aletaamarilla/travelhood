/**
 * Targeted, revision-checked migration. Defaults to a preview.
 * npm run fix:travel-insurance
 * npm run fix:travel-insurance -- --apply
 */
import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
import {writeFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {
  isTravelInsuranceItem,
  withoutTravelInsurance,
  withSeparateTravelInsurance,
} from '../shared/travel-insurance'

export interface InsuranceDocument {
  _id: string
  _rev: string
  _type: string
  included?: string[]
  notIncluded?: string[]
  defaultIncluded?: string[]
  defaultNotIncluded?: string[]
  inheritDefaultNotIncluded?: boolean
  travelInsuranceIncluded?: boolean
  sections?: {body?: string}[]
  faqs?: {answer?: string}[]
}

const oldCoverage = 'Con Travel Hood, viajas siempre cubierto con nuestro seguro médico opcional y la tranquilidad de tener un coordinador contigo en todo momento.'
const newCoverage = 'En Travel Hood, el seguro de viaje no está incluido en el precio de ningún viaje: se contrata aparte. El coordinador puede orientarte, pero la cobertura depende del seguro que contrates.'
const oldFaq = 'No, el seguro de viaje no está incluido en el precio. Te recomendamos contratar uno por tu cuenta antes de viajar. Podemos orientarte sobre opciones recomendadas.'
const newFaq = 'No, el seguro de viaje no está incluido en ninguno de nuestros viajes. Se contrata aparte. Podemos orientarte si tienes dudas.'
const oldSafetyFaq = 'Todos nuestros viajes incluyen seguro de viaje y están organizados por coordinadores experimentados que conocen el destino. Tu seguridad es nuestra prioridad.'
const newSafetyFaq = 'Nuestros viajes están organizados por coordinadores experimentados que conocen el destino. El seguro de viaje no está incluido y se contrata aparte.'

export function buildInsurancePatch(doc: InsuranceDocument) {
  const set: Record<string, unknown> = {}
  const unset: string[] = []
  const changed = (field: string, before: unknown, after: unknown) => {
    if (JSON.stringify(before) !== JSON.stringify(after)) set[field] = after
  }

  if (doc._type === 'siteSettings') {
    if (doc.defaultIncluded) changed('defaultIncluded', doc.defaultIncluded, withoutTravelInsurance(doc.defaultIncluded))
    changed('defaultNotIncluded', doc.defaultNotIncluded, withSeparateTravelInsurance(doc.defaultNotIncluded ?? []))
  }
  if (doc._type === 'destination' || doc._type === 'trip') {
    const hadIncludedInsurance = doc.included?.some(isTravelInsuranceItem) === true
    if (doc.included) changed('included', doc.included, withoutTravelInsurance(doc.included))
    // Destinations inheriting the global list do not need a duplicate local entry.
    if (doc.inheritDefaultNotIncluded === false || hadIncludedInsurance
      || doc.travelInsuranceIncluded === true || doc.notIncluded?.some(isTravelInsuranceItem)) {
      changed('notIncluded', doc.notIncluded, withSeparateTravelInsurance(doc.notIncluded ?? []))
    }
    if (Object.hasOwn(doc, 'travelInsuranceIncluded')) unset.push('travelInsuranceIncluded')
  }
  doc.sections?.forEach((section, index) => {
    if (section.body?.includes(oldCoverage)) {
      set['sections[' + index + '].body'] = section.body.replace(oldCoverage, newCoverage)
    }
  })
  doc.faqs?.forEach((faq, index) => {
    if (!faq.answer) return
    const corrected = faq.answer.replace(oldFaq, newFaq).replace(oldSafetyFaq, newSafetyFaq)
    if (corrected !== faq.answer) set['faqs[' + index + '].answer'] = corrected
  })
  return Object.keys(set).length || unset.length ? {id: doc._id, revision: doc._rev, set, unset} : null
}

async function main() {
  dotenv.config({path: ['.env.local', '.env'], quiet: true})
  const projectId = process.env.SANITY_PROJECT_ID
  const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
  if (!projectId || projectId === 'YOUR_PROJECT_ID') throw new Error('Configura SANITY_PROJECT_ID.')
  const apply = process.argv.includes('--apply')
  if (apply && !token) throw new Error('La corrección del CMS requiere un token de escritura.')
  const client = createClient({
    projectId, token, dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2026-03-16', useCdn: false, perspective: 'raw',
  })
  const docs = await client.fetch<InsuranceDocument[]>(
    '*[_type in ["siteSettings", "destination", "trip", "blogPost", "globalFaq"]]',
  )
  const patches = docs.map(buildInsurancePatch).filter((patch) => patch !== null)
  console.log(JSON.stringify({mode: apply ? 'apply' : 'preview', documents: patches.length, patches}, null, 2))
  if (!apply || !patches.length) return
  const ids = new Set(patches.map((patch) => patch.id))
  const backup = '/tmp/travelhood-insurance-backup-' + Date.now() + '.json'
  writeFileSync(backup, JSON.stringify(docs.filter((doc) => ids.has(doc._id)), null, 2))
  let tx = client.transaction()
  for (const patch of patches) {
    tx = tx.patch(patch.id, (builder) => {
      let update = builder.ifRevisionId(patch.revision)
      if (Object.keys(patch.set).length) update = update.set(patch.set)
      if (patch.unset.length) update = update.unset(patch.unset)
      return update
    })
  }
  await tx.commit({visibility: 'sync'})
  const verified = await client.fetch<InsuranceDocument[]>('*[_id in $ids]', {ids: [...ids]})
  if (verified.length !== ids.size || verified.some((doc) => buildInsurancePatch(doc))) {
    throw new Error('Revisar la verificación de la migración. Copia previa: ' + backup)
  }
  console.log('Corregidos y verificados ' + patches.length + ' documentos. Copia previa: ' + backup)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Error al corregir seguros.')
    process.exitCode = 1
  })
}
