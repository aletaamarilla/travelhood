import { buildWhatsAppUrl } from '@/lib/config'
import type { Trip } from '@/lib/travel-data'
import { normalizeBookingUrl } from '../../shared/booking'

export type BookingProvider = 'mygoqu' | 'whatsapp'

export function getTripBookingLink(
  trip: Pick<Trip, 'title' | 'bookingUrl'>,
  whatsappPhone: string,
): { href: string; provider: BookingProvider } {
  const bookingUrl = normalizeBookingUrl(trip.bookingUrl)
  return bookingUrl
    ? { href: bookingUrl, provider: 'mygoqu' }
    : {
        href: buildWhatsAppUrl(whatsappPhone, `Hola! Me interesa el viaje ${trip.title}. ¿Puedo reservar?`),
        provider: 'whatsapp',
      }
}
