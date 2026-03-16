import {createClient, type SanityClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url'

let _client: SanityClient | null = null

function getClient(): SanityClient {
  if (!_client) {
    const projectId = import.meta.env.SANITY_PROJECT_ID
    if (!projectId || projectId === 'YOUR_PROJECT_ID') {
      throw new Error('Sanity not configured')
    }
    _client = createClient({
      projectId,
      dataset: import.meta.env.SANITY_DATASET || 'production',
      apiVersion: import.meta.env.SANITY_API_VERSION || '2026-03-16',
      useCdn: false,
    })
  }
  return _client
}

export function urlFor(source: SanityImageSource) {
  return imageUrlBuilder(getClient()).image(source)
}

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return getClient().fetch<T>(query, params ?? {})
}
