import {
  resolveSearchNavigation,
  type ResolvedSearchNavigation,
  type SearchDestinationRef,
  type SearchIntent,
} from "@/lib/search-intent"

const CONSENT_COOKIE_NAME = "th_cookie_consent"

export type SearchTrackingSource = "home_hero" | "viajes_page"

export type SearchConversionEvent =
  | "search_started"
  | "destination_any_selected"
  | "destination_specific_selected"
  | "date_any_selected"
  | "home_search_submitted"
  | "destination_direct_navigation"
  | "search_results_navigation"
  | "search_option_404_prevented"

export interface SearchTrackingPayload {
  source: SearchTrackingSource
  destination_mode?: "any" | "specific"
  destination_slug?: string
  date_mode?: "any" | "specific"
  date_value?: string
  resolved_target?: "destination" | "results"
  resolved_href?: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

function hasAnalyticsConsent(): boolean {
  if (typeof document === "undefined") return false
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`))
    if (!match) return false
    const consent = JSON.parse(decodeURIComponent(match[1])) as { analytics?: boolean }
    return consent.analytics === true
  } catch {
    return false
  }
}

export function pushSearchEvent(
  event: SearchConversionEvent,
  params: SearchTrackingPayload,
): boolean {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return false
  const payload = Object.fromEntries(
    Object.entries({ event, ...params }).filter(([, value]) => value !== undefined),
  )
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  return true
}

export function intentToTrackingFields(
  intent: SearchIntent,
  destinations: readonly SearchDestinationRef[],
): Pick<SearchTrackingPayload, "destination_mode" | "destination_slug" | "date_mode" | "date_value"> {
  const destination_mode = intent.destination.mode

  let destination_slug: string | undefined
  if (intent.destination.mode === "specific" && intent.destination.kind === "destination") {
    const { destinationId } = intent.destination
    const matched = destinations.find((item) => item.id === destinationId)
    destination_slug = matched?.slug
  }

  const date_mode = intent.date.mode
  let date_value: string | undefined
  if (intent.date.mode === "specific") {
    date_value =
      intent.date.kind === "period"
        ? intent.date.periodId
        : String(intent.date.monthIndex)
  }

  return { destination_mode, destination_slug, date_mode, date_value }
}

function buildResolvedPayload(
  source: SearchTrackingSource,
  intent: SearchIntent,
  destinations: readonly SearchDestinationRef[],
  resolved: ResolvedSearchNavigation,
): SearchTrackingPayload {
  return {
    source,
    ...intentToTrackingFields(intent, destinations),
    resolved_target: resolved.target,
    resolved_href: resolved.href,
  }
}

function wasDestinationFallback(intent: SearchIntent, resolved: ResolvedSearchNavigation): boolean {
  return (
    intent.destination.mode === "specific" &&
    intent.destination.kind === "destination" &&
    resolved.target === "results"
  )
}

/** Tracks home hero submit: one submitted event plus exactly one navigation outcome. */
export function trackHomeSearchSubmit(
  intent: SearchIntent,
  destinations: readonly SearchDestinationRef[],
): void {
  const resolved = resolveSearchNavigation(intent, destinations)
  const payload = buildResolvedPayload("home_hero", intent, destinations, resolved)

  pushSearchEvent("home_search_submitted", payload)

  if (resolved.target === "destination") {
    pushSearchEvent("destination_direct_navigation", payload)
  } else {
    pushSearchEvent("search_results_navigation", payload)
    if (wasDestinationFallback(intent, resolved)) {
      pushSearchEvent("search_option_404_prevented", payload)
    }
  }
}

export function trackSearchStarted(source: SearchTrackingSource): void {
  pushSearchEvent("search_started", { source })
}

export function trackDestinationAnySelected(
  source: SearchTrackingSource,
  intent: SearchIntent,
  destinations: readonly SearchDestinationRef[],
): void {
  pushSearchEvent("destination_any_selected", {
    source,
    ...intentToTrackingFields(intent, destinations),
  })
}

export function trackDestinationSpecificSelected(
  source: SearchTrackingSource,
  intent: SearchIntent,
  destinations: readonly SearchDestinationRef[],
): void {
  pushSearchEvent("destination_specific_selected", {
    source,
    ...intentToTrackingFields(intent, destinations),
  })
}

export function trackDateAnySelected(
  source: SearchTrackingSource,
  intent: SearchIntent,
  destinations: readonly SearchDestinationRef[],
): void {
  pushSearchEvent("date_any_selected", {
    source,
    ...intentToTrackingFields(intent, destinations),
  })
}
