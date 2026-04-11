/**
 * Uploads the SVG logo to Sanity and patches siteSettings.orgLogo
 *
 * Usage: npx tsx scripts/upload-logo-sanity.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_TOKEN

if (!projectId || !token) {
  console.error('Set SANITY_PROJECT_ID and SANITY_TOKEN in .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
})

async function uploadLogo() {
  const logoPath = resolve(process.cwd(), 'public/images/logo.svg')
  const logoBuffer = readFileSync(logoPath)

  console.log('Uploading logo.svg to Sanity assets...')
  const asset = await client.assets.upload('image', logoBuffer, {
    filename: 'logo.svg',
    contentType: 'image/svg+xml',
  })

  console.log(`Asset uploaded: ${asset._id}`)

  console.log('Patching siteSettings.orgLogo...')
  await client
    .patch('siteSettings')
    .set({
      orgLogo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    .commit()

  console.log('Done! orgLogo updated in siteSettings.')
}

uploadLogo().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
