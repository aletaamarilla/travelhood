import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Sanity Image Helpers ──

export function sanityImgSrcset(url: string, widths: number[] = [400, 800, 1200, 1600]): string {
  return widths
    .map(w => {
      const sized = url.includes('?') ? `${url}&w=${w}` : `${url}?w=${w}`;
      return `${sized}&auto=format ${w}w`;
    })
    .join(', ');
}

// ── Trip Deduplication by Destination ──

/**
 * Given a list of trips, returns one trip per destination.
 * Keeps the trip with the earliest departure date; on tie, the lowest effective price.
 * The input array order is otherwise preserved (first occurrence wins position).
 */
export function deduplicateTripsByDestination<
  T extends { destinationId: string; departureDate: string; priceFrom: number; promoPrice?: number },
>(trips: T[]): T[] {
  const seen = new Map<string, T>()
  for (const trip of trips) {
    const existing = seen.get(trip.destinationId)
    if (!existing) {
      seen.set(trip.destinationId, trip)
      continue
    }
    const existingDate = new Date(existing.departureDate).getTime()
    const currentDate = new Date(trip.departureDate).getTime()
    if (
      currentDate < existingDate ||
      (currentDate === existingDate &&
        (trip.promoPrice ?? trip.priceFrom) < (existing.promoPrice ?? existing.priceFrom))
    ) {
      seen.set(trip.destinationId, trip)
    }
  }
  const bestIds = new Set([...seen.values()].map((t) => t))
  return trips.filter((t) => bestIds.has(t))
}

// ── Price Resolution ──

export interface ResolvedPrice {
  price: number
  originalPrice: number
  hasDiscount: boolean
  promoLabel?: string
}

export function resolvePrice(
  trip: { priceFrom: number; promoPrice?: number; promoLabel?: string },
  extra?: { promoPrice?: number; promoLabel?: string },
): ResolvedPrice {
  const finalPrice = extra?.promoPrice ?? trip.promoPrice ?? trip.priceFrom
  return {
    price: finalPrice,
    originalPrice: trip.priceFrom,
    hasDiscount: finalPrice < trip.priceFrom,
    promoLabel: extra?.promoLabel ?? trip.promoLabel,
  }
}
