import assert from 'node:assert/strict'
import { normalizeBookingUrl } from '../../shared/booking'
import { getTripBookingLink } from '@/lib/booking'
import { buildWhatsAppUrl } from '@/lib/config'
import { createElement, type ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DeparturesModal } from '@/components/TripDetailPage'

const title = 'Islandia — 18–25 octubre 2027'
const phone = '34686684204'
const firstUrl = 'https://reservas.travelhood.es/grupos/viajes/17756?codigo=ISLANDIA_18-25_OCTUBRE'
const secondUrl = 'https://reservas.travelhood.es/grupos/viajes/17755?codigo=ISLANDIA_11-18_OCTUBRE'
const whatsapp = buildWhatsAppUrl(phone, `Hola! Me interesa el viaje ${title}. ¿Puedo reservar?`)

// Each departure keeps its own payment link and code; clearing it restores WhatsApp.
for (const bookingUrl of [firstUrl, secondUrl]) {
  assert.deepEqual(getTripBookingLink({ title, bookingUrl }, phone), { href: bookingUrl, provider: 'mygoqu' })
}
assert.equal(getTripBookingLink({ title, bookingUrl: `  ${firstUrl}  ` }, phone).href, firstUrl)
for (const bookingUrl of [undefined, '', '   ', 'javascript:alert(1)', 'http://reservas.travelhood.es',
  '//reservas.travelhood.es', '/grupos/viajes/17756', 'https://', 'https://user:pass@example.com',
  'https://reservas.travelhood.es/invalid code', 'https://reservas.travelhood.es/\ncode']) {
  assert.deepEqual(getTripBookingLink({ title, bookingUrl }, phone), { href: whatsapp, provider: 'whatsapp' })
}
assert.equal(normalizeBookingUrl(null), undefined)
assert.equal(normalizeBookingUrl(123), undefined)
assert.equal(getTripBookingLink({ title }, '34911222333').href.includes('wa.me/34911222333'), true)

// The same date selector can mix payment, WhatsApp and full departures.
type ModalProps = ComponentProps<typeof DeparturesModal>
const trip: ModalProps['availableTrips'][number] = {
  id: 'islandia-2027-10-18', destinationId: 'islandia', title,
  departureDate: '2027-10-18', returnDate: '2027-10-25', durationDays: 8,
  priceFrom: 1290, flightEstimate: 280, totalPlaces: 13, placesLeft: 8,
  coordinatorId: 'marta', status: 'open', included: [], notIncluded: [], itinerary: [], tags: [],
}
const props: ModalProps = {
  availableTrips: [
    { ...trip, bookingUrl: firstUrl },
    { ...trip, id: 'without-link' },
    { ...trip, id: 'invalid-link', bookingUrl: 'javascript:alert(1)' },
  ],
  fullTrips: [{ ...trip, id: 'full', status: 'full', placesLeft: 0, bookingUrl: secondUrl }],
  destinationName: 'Islandia', isOpen: true, onClose() {}, whatsappPhone: phone,
  onWhatsAppClick() {}, onBookingClick() {},
}
const html = renderToStaticMarkup(createElement(DeparturesModal, props))
const reserveHrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>Reservar<\/a>/g)].map((m) => m[1])
assert.deepEqual(reserveHrefs, [firstUrl, whatsapp, whatsapp])
assert(!html.includes(secondUrl), 'Full trips must keep their WhatsApp waitlist, even with a payment URL.')
assert(!html.includes('javascript:'))
assert(html.includes(encodeURIComponent(`Hola! Me interesa el viaje ${title} pero veo que está completo. ¿Me avisáis si se libera plaza?`)))
assert.equal(renderToStaticMarkup(createElement(DeparturesModal, { ...props, isOpen: false })), '')
console.log('Booking: payment links, WhatsApp fallback and full-trip waitlist passed.')
