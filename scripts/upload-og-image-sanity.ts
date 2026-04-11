/**
 * Uploads the default OG image to Sanity and patches siteSettings.defaultSeoImage
 *
 * Usage: npx tsx scripts/upload-og-image-sanity.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_TOKEN

if (!projectId) {
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
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
})

async function uploadOgImage() {
  const imgPath = resolve(process.cwd(), 'public/images/og-default.jpg')
  const imgBuffer = readFileSync(imgPath)

  console.log('Uploading og-default.jpg to Sanity assets...')
  const asset = await client.assets.upload('image', imgBuffer, {
    filename: 'og-default.jpg',
    contentType: 'image/jpeg',
  })

  console.log(`Asset uploaded: ${asset._id}`)

  console.log('Patching siteSettings.defaultSeoImage...')
  await client
    .patch('siteSettings')
    .set({
      defaultSeoImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    .commit()

  console.log('Done! defaultSeoImage updated in siteSettings.')
}

uploadOgImage().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
