---
name: domain
description: "Conocimiento de negocio de Travelhood: qué hace, entidades y modelo de
datos, glosario, reglas de negocio e integraciones. Úsala SIEMPRE que se implemente una
feature, se modele datos, se diseñe un flujo o haya dudas sobre el negocio o un término."
---

# Domain

## Qué Es

Travelhood organiza viajes en grupo para personas de 20-35 años que quieren viajar aunque no tengan compañía, con destinos diferenciales, grupo reducido y coordinador en destino.

## Entidades Clave

- `continent`: continente con slug `/destinos/[slug]/`, intro editorial, hero, mejores meses, FAQs y SEO.
- `country`: país con continente, bandera ISO, moneda, idioma, zona horaria, visado, vacunas y SEO.
- `destination`: destino con país/continente, descripciones, hero, highlights, categorías (`playa`, `aventura`, `cultural`, `naturaleza`, `nieve`), clima, galería, presupuesto, incluye/no incluye, itinerario, FAQs, PDF y SEO.
- `trip`: salida fechada vinculada a destino, fechas, duración, precio base, estimación de vuelo, promo, plazas, estado (`open`, `almost-full`, `full`), coordinador y tags de temporada.
- `coordinator`: coordinador/a con nombre, slug, edad, rol, bio, quote, foto y destinos.
- `testimonial`: opinión visible o retirada, rating, fuente (`trustpilot`/`editorial`), trazabilidad editorial, destino opcional y orden manual.
- `siteSettings`: singleton con nombre/URL, logo, contacto, WhatsApp, licencia, señal de reserva, Trustpilot, incluidos/no incluidos globales e imágenes de páginas.
- `tripCategory`, `season`, `comparison`, `blogPost`, `landingPage`, `legalPage`, `globalFaq`: contenido editorial/SEO, landings y FAQs.

## Reglas De Negocio

- Los datos se leen por `src/lib/data-provider.ts`: Sanity si `SANITY_PROJECT_ID` existe y fallback hardcoded si no.
- Los viajes `full` no aparecen en `allTripsQuery`; `almost-full` representa últimas plazas y suele activarse con `placesLeft <= 4` en UI.
- El grupo habitual se comunica como 12-13 personas; `totalPlaces` se valida como número positivo.
- `priceFrom` y `flightEstimate` son euros por persona; el vuelo internacional no está incluido.
- `promoPrice` sustituye al precio base solo si es menor; usa `resolvePrice`.
- Si `destination.hasCoordinator` es `false`, se elimina el incluido global que mencione coordinador y el viaje no exige coordinador.
- Las imágenes reales deben tener alt; galería de destino recomienda mínimo 6 fotos, ideal 8-10.
- Testimonios: publicar solo `isVisible != false` y `verificationStatus != retired`; no usar logos/widgets/badges de Trustpilot.
- Slugs publicados no deben cambiarse después de publicar según descripciones del schema.

## Flujos Críticos

- Descubrimiento: Home -> buscador por continente/destino y fecha/temporada -> `/viajes/#resultados`.
- Evaluación: card de viaje/destino -> `/destino/[slug]/` con fechas, precio, plazas, incluye/no incluye, itinerario, coordinador, FAQs, testimonios y PDF si existe.
- Contacto/reserva actual: CTAs hacia WhatsApp con `buildWhatsAppUrl`; la web habla de señal de reserva, pero no hay motor de pago en código.
- SEO programático: páginas por destino, país, continente, tipo, temporada, presupuesto, cuándo viajar, comparación, blog, FAQ y recursos `.well-known`.
- Contenido: Sanity Studio modela catálogo, comunidad, blog, landings, legal y configuración; scripts `seed-sanity` migran datos hardcoded.

## Integraciones

- Sanity CMS: `@sanity/client`, `@sanity/image-url`, Studio en `studio/`, variables `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_STUDIO_APP_ID`.
- Vercel: adapter `@astrojs/vercel`, salida estática.
- Google Tag Manager: `PUBLIC_GTM_ID`, cargado en `Layout.astro` con consentimiento de cookies.
- WhatsApp: enlaces `wa.me` con teléfono de `siteSettings` o `FALLBACK_WHATSAPP_PHONE`.
- Trustpilot: URLs de perfil/opinión en testimonios y páginas de opiniones; sin widgets ni claims de verificación.
- Leaflet: dependencia para mapas/coordenadas de destino.
- WebMCP/agent visibility: endpoints públicos en `.well-known` y `webmcp-data.json`.
- No hay Stripe, pasarela de pago, email transaccional, CRM ni formulario backend en dependencias o `.env.example`.

## Glosario

- Viaje/trip: salida fechada de un destino concreto.
- Destino: experiencia vendible como Bali, Japón o Zanzíbar; no siempre equivale al país.
- País/continente: taxonomía geográfica para filtros, SEO y páginas editoriales.
- Coordinador: persona que acompaña/organiza en destino cuando aplica.
- Señal de reserva: importe global en `siteSettings.depositAmount`, valor inicial 250 EUR.
- Plaza: disponibilidad del viaje (`totalPlaces`, `placesLeft`, `status`).
- Incluye/no incluye: mezcla de defaults globales de `siteSettings` + extras del destino.
- Temporada/tag: filtro tipo `semana-santa`, `verano`, `navidad`, `fin-de-anio`.
- Fallback hardcoded: datos locales en `src/lib/travel-data.ts` y `src/lib/blog-data.ts` si Sanity no está configurado.
