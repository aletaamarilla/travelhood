/**
 * Upload legal documents (.docx) to Sanity as legalPage documents.
 *
 * Reads .docx files from /legales, converts to Portable Text blocks,
 * and creates/updates legalPage documents in Sanity with version tracking.
 *
 * Usage:
 *   npx tsx scripts/upload-legal.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as mammoth from 'mammoth'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

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

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2026-04-07',
  token,
  useCdn: false,
})

function makeKey() {
  return Math.random().toString(36).slice(2, 10)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface PortableTextBlock {
  _type: 'block'
  _key: string
  style: string
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[]
  markDefs: any[]
  listItem?: string
  level?: number
}

function isHeadingLine(line: string): false | 'h2' | 'h3' {
  const trimmed = line.trim()
  if (!trimmed) return false
  // Numbered sections like "1. Datos identificativos:" or all-caps short lines
  if (/^\d+\.\s+/.test(trimmed) && trimmed.length < 100) return 'h2'
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 120) return 'h2'
  return false
}

function textToPortableText(rawText: string): PortableTextBlock[] {
  const lines = rawText.split('\n')
  const blocks: PortableTextBlock[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const headingStyle = isHeadingLine(trimmed)
    const isBullet = /^[–—\-•]\s+/.test(trimmed)
    const cleanText = isBullet ? trimmed.replace(/^[–—\-•]\s+/, '') : trimmed

    const block: PortableTextBlock = {
      _type: 'block',
      _key: makeKey(),
      style: headingStyle || 'normal',
      children: [
        {
          _type: 'span',
          _key: makeKey(),
          text: cleanText,
          marks: [],
        },
      ],
      markDefs: [],
    }

    if (isBullet) {
      block.listItem = 'bullet'
      block.level = 1
    }

    blocks.push(block)
  }

  return blocks
}

interface LegalDoc {
  filename: string
  title: string
  slug: string
  seoTitle: string
  seoDescription: string
}

const LEGAL_DOCS: LegalDoc[] = [
  {
    filename: 'Aviso legal .docx',
    title: 'Aviso legal',
    slug: 'aviso-legal',
    seoTitle: 'Aviso legal | Travel Hood',
    seoDescription:
      'Aviso legal de Travel Hood. Datos identificativos, propiedad intelectual y condiciones de uso del sitio web travelhood.es.',
  },
  {
    filename: 'Política de privacidad.docx',
    title: 'Política de privacidad',
    slug: 'politica-de-privacidad',
    seoTitle: 'Política de privacidad | Travel Hood',
    seoDescription:
      'Política de privacidad de Travel Hood. Información sobre el tratamiento de datos personales, derechos ARCO y uso de cookies.',
  },
  {
    filename: 'Terminos y condiciones.docx',
    title: 'Términos y condiciones',
    slug: 'terminos-y-condiciones',
    seoTitle: 'Términos y condiciones | Travel Hood',
    seoDescription:
      'Términos y condiciones generales de contratación de viajes con Travel Hood. Reservas, pagos, cancelaciones y responsabilidades.',
  },
]

async function upload() {
  const tx = client.transaction()
  const today = new Date().toISOString().split('T')[0]

  for (const doc of LEGAL_DOCS) {
    const filePath = resolve(process.cwd(), 'legales', doc.filename)
    console.log(`📄 Procesando: ${doc.filename}`)

    const result = await mammoth.extractRawText({ path: filePath })
    const rawText = result.value

    // Skip the first line if it matches the title
    const lines = rawText.split('\n')
    const startIdx = lines[0]?.trim().toLowerCase() === doc.title.toLowerCase() ? 1 : 0
    const bodyText = lines.slice(startIdx).join('\n')

    const body = textToPortableText(bodyText)
    console.log(`   → ${body.length} bloques de texto`)

    const _id = `legal-${doc.slug}`

    tx.createOrReplace({
      _type: 'legalPage',
      _id,
      title: doc.title,
      slug: { _type: 'slug', current: doc.slug },
      version: '1.0',
      effectiveDate: today,
      lastReviewedAt: today,
      body,
      seo: {
        title: doc.seoTitle,
        description: doc.seoDescription,
      },
    })
  }

  console.log('\n🚀 Subiendo a Sanity...')
  const result = await tx.commit()
  console.log(`✅ ${result.results.length} documentos legales creados/actualizados.`)
}

upload().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
