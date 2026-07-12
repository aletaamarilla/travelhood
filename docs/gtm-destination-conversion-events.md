# GTM destination conversion events

Eventos enviados a `window.dataLayer` para medir el embudo de destinos sin registrar PII. Todos se bloquean si la cookie `th_cookie_consent` no tiene `analytics: true`.

| Event name | Trigger | Parameters |
| --- | --- | --- |
| `destination_view` | Vista hidratada de `TripDetailPage` tras consentimiento analítico. Se envía una vez por `destination_slug` y página. | `destination_slug`, `trip_id` si hay salida destacada |
| `destination_dates_price_interaction` | Clic en “Ver salidas”, “Ver salidas y precios” o equivalente. | `destination_slug`, `cta_location` |
| `destination_pdf_download` | Clic en un enlace de descarga PDF de destino. | `destination_slug`, `cta_location`, `pdf_url` |
| `destination_whatsapp_click` | Clic en CTAs de WhatsApp/contacto de destino, salida, lista de espera o comunidad. | `destination_slug`, `trip_id` si el CTA corresponde a una salida concreta, `cta_location` |

## CTA locations

- `mobile_bottom_bar`, `mobile_bottom_bar_whatsapp`, `mobile_bottom_bar_no_dates`
- `sidebar`, `sidebar_doubts`, `sidebar_no_dates`, `sidebar_community`, `sidebar_pdf`
- `bottom_cta`, `bottom_cta_whatsapp`, `bottom_cta_full`, `bottom_cta_waitlist`, `bottom_cta_no_dates`, `bottom_cta_community`
- `departures_modal_reserve`, `departures_modal_waitlist`, `departures_modal_community`
- `detail_pdf_section`, `private_trip_section`
- `presupuesto_bottom_cta`, `cuando_viajar_bottom_cta`

## GTM/GA4 test steps

1. Open a destination page with no `th_cookie_consent` cookie and confirm no custom destination events are pushed.
2. Accept analytics cookies and confirm one `destination_view` is pushed with `destination_slug`.
3. Click each visible “Ver salidas” CTA once and confirm one `destination_dates_price_interaction` with the expected `cta_location`.
4. Click a reserve or waitlist CTA in the departures modal and confirm one `destination_whatsapp_click` with `destination_slug`, `trip_id` and `cta_location`.
5. Click each PDF link and confirm one `destination_pdf_download` with `pdf_url`.
6. Reject analytics cookies and confirm none of the custom events above are pushed.

Do not map WhatsApp message text, phone numbers, user identifiers or free-text content into GA4 parameters.
