import { getStoredConsent, hasAnalyticsConsent } from '@/lib/consent'
import type {} from '@/lib/analytics-bootstrap'

// Exact allowlist: never forward arbitrary DOM text, messages, URLs or form fields.
export const EVENT_FIELDS = {
  search_started: ['source'],
  destination_any_selected: ['source', 'destination_mode', 'date_mode', 'date_value'],
  destination_specific_selected: ['source', 'destination_mode', 'destination_slug', 'date_mode', 'date_value'],
  date_any_selected: ['source', 'destination_mode', 'destination_slug', 'date_mode'],
  home_search_submitted: ['source', 'destination_mode', 'destination_slug', 'date_mode', 'date_value', 'resolved_target', 'resolved_href'],
  destination_direct_navigation: ['source', 'destination_mode', 'destination_slug', 'date_mode', 'date_value', 'resolved_target', 'resolved_href'],
  search_results_navigation: ['source', 'destination_mode', 'destination_slug', 'date_mode', 'date_value', 'resolved_target', 'resolved_href'],
  search_option_404_prevented: ['source', 'destination_mode', 'destination_slug', 'date_mode', 'date_value', 'resolved_target', 'resolved_href'],
  destination_view: ['destination_slug', 'trip_id'],
  destination_dates_price_interaction: ['destination_slug', 'cta_location'],
  destination_pdf_download: ['destination_slug', 'cta_location', 'pdf_url'],
  destination_whatsapp_click: ['destination_slug', 'trip_id', 'cta_location'],
  destination_booking_click: ['destination_slug', 'trip_id', 'cta_location', 'booking_provider'],
  private_trip_landing_view: ['page', 'context'],
  private_trip_whatsapp_click: ['page', 'context', 'cta', 'has_utm'],
  private_trip_secondary_cta_click: ['page', 'context', 'cta', 'href', 'has_utm'],
  collaborator_click: ['partner_id', 'source', 'link_type'],
  coordinator_cta_click: ['action', 'source'],
  th_page_view: [],
} as const

export type AnalyticsEvent = keyof typeof EVENT_FIELDS
type Parameters = Record<string, string | boolean | number>

declare global {
  interface Window { dataLayer?: unknown[] }
}

function safeValue(key: string, value: unknown): string | boolean | undefined {
  if (key === 'has_utm') return typeof value === 'boolean' ? value : undefined
  if (typeof value !== 'string' || value.length > 200 || /@|%40|\d{7,}/i.test(value)) return undefined
  if (['pdf_url', 'resolved_href', 'href'].includes(key)) {
    try {
      const url = new URL(value, 'https://travelhood.es')
      if (url.protocol !== 'https:' || url.username || url.password) return undefined
      if (key === 'pdf_url') {
        if (!['travelhood.es', 'cdn.sanity.io'].includes(url.hostname) || !url.pathname.endsWith('.pdf')) return undefined
        return url.origin + url.pathname
      }
      if (url.hostname !== 'travelhood.es') return undefined
      // Search filters remain in the actual navigation; analytics receives only the route.
      return url.pathname
    } catch { return undefined }
  }
  return /^[a-zA-Z0-9_.:-]+$/.test(value) ? value : undefined
}

function context(): Parameters {
  const env = import.meta.env?.PUBLIC_ANALYTICS_ENV
  const internal = /(?:^|; )th_analytics_internal=1(?:;|$)/.test(document.cookie)
  const production = env === 'production' && ['travelhood.es', 'www.travelhood.es'].includes(location.hostname)
  let page = 'https://travelhood.es/'
  try {
    // Canonical is build-time content; no query, fragment or user-supplied location.
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    const url = new URL(canonical || page)
    if (['travelhood.es', 'www.travelhood.es'].includes(url.hostname)) page = url.origin + url.pathname
  } catch { /* Safe homepage fallback. */ }
  let referrer = ''
  try { referrer = new URL(document.referrer).origin } catch { /* Direct visit. */ }
  return {
    measurement_version: '1', page_location: page, page_referrer: referrer,
    traffic_type: internal ? 'internal' : production ? 'external' : 'developer',
    ...(!production || internal ? { debug_mode: true } : {}),
  }
}

export function trackEvent(event: AnalyticsEvent, params: object = {}): boolean {
  try {
    if (typeof window === 'undefined' || !hasAnalyticsConsent() || !Object.hasOwn(EVENT_FIELDS, event)) return false
    const clean: Parameters = {}
    for (const key of EVENT_FIELDS[event]) {
      const value = safeValue(key, (params as Record<string, unknown>)[key])
      if (value !== undefined) clean[key] = value
    }
    const ready = window.__thGoogleConsent?.phase1Ready === true
    if (event === 'th_page_view' && !ready) return false
    const parameters = { ...clean, ...context() }
    window.dataLayer = window.dataLayer || []
    // Legacy top-level names retained. GTM reads only the complete v1 envelope,
    // avoiding parameter inheritance from a previous event in GTM's data model.
    window.dataLayer.push({ event, ...clean, th_event: ready ? { name: event === 'th_page_view' ? 'page_view' : event, parameters } : null })
    return true
  } catch { return false } // A blocked/broken tracker never blocks navigation.
}

let initialized = false
export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  let viewed = false
  // The inline bridge is the only owner of Google defaults, updates, cookies
  // and GTM loading. It remains active even if this deferred module fails.
  window.__thGoogleConsent?.setReader(getStoredConsent)
  const apply = () => {
    try {
      if (hasAnalyticsConsent() && !viewed) viewed = trackEvent('th_page_view')
    } catch { /* Optional analytics never blocks the application. */ }
  }
  window.addEventListener('cookieConsentUpdated', apply)
  window.addEventListener('storage', (event) => {
    if (event.key === 'th_consent_change' || event.key === 'th_consent_storage_blocked' || event.key === null) apply()
  })
  window.addEventListener('focus', apply)
  apply()
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  try { initAnalytics() } catch { /* Hydrate consumers even if a tracker is broken. */ }
}
