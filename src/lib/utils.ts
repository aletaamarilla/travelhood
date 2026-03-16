import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
