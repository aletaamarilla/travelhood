# QA fillNewDestination - rendimiento y accesibilidad

Fecha: 2026-07-10

## Alcance

Rutas validadas:

- `/destino/praga/`
- `/destino/guatemala/`

No se ejecutaron `seed`, importaciones ni escrituras a Sanity. La validacion se hizo contra build estatico local servido con `astro preview`.

## Entorno de medicion

- Host: WSL2 Linux, repo local `/home/amfernandez/personalProjects/travelhoodsystem`.
- Browser: Chromium headless `/snap/bin/chromium` via Chrome DevTools Protocol.
- URL base: `http://127.0.0.1:4410`.
- Viewport movil: `390x844`, DPR `3`, emulando Pixel/Android.
- Red: emulacion CDP 4G, `150 ms` RTT, `1.6 Mbps` bajada, `0.75 Mbps` subida.
- CPU: throttling `4x`.
- Limitacion: no se midio en movil fisico real; las cifras son de emulacion local reproducible.

## Core Web Vitals

Medicion de carga inicial, cache desactivada, antes de interacciones:

| Ruta | LCP | CLS | INP / interaccion | Resultado |
| --- | ---: | ---: | ---: | --- |
| `/destino/praga/` | `1.928 s` | `0.000` | `0 ms` observado en pasada final; sin eventos >16 ms | Pasa |
| `/destino/guatemala/` | `0.300 s` | `0.000` | `0 ms` observado en pasada final; sin eventos >16 ms | Pasa |

Evidencia adicional:

- Hero Praga servido como WebP publico de `1200x802`, `84,716 bytes` transferidos, `fetchPriority=high`.
- Hero Guatemala servido como WebP publico de `1200x676`, `15,866 bytes` transferidos, `fetchPriority=high`.
- Galeria mantiene `loading="lazy"`; en movil el navegador precarga imagenes cercanas del carrusel, pero no desplaza LCP tras optimizacion.

## Accesibilidad y UX movil

- Body confirmado a `16px`.
- Foco visible: `outline: 3px solid` en navegacion por teclado.
- CTA above-the-fold en movil:
  - WhatsApp: `44x44`.
  - Ver salidas: `118x44`.
- Targets tactiles de controles visibles probados: sin violaciones `<44px` en navbar, barra fija movil, modal de salidas, galeria, acordeones y PDF.
- Contraste:
  - Texto principal `#0B2E3A` sobre fondo `#F5F3EF`: `12.92:1`.
  - Texto `#F2E8D9` sobre `#0B2E3A`: `11.81:1`.
  - Texto `#0B2E3A` sobre WhatsApp `#25D366`: `7.22:1`.
- Se corrigio el uso de texto blanco sobre coral/WhatsApp en los CTAs de la ficha y navbar de estas rutas.

## Funcionalidad probada sin hover

Validado en emulacion movil:

- Modal de salidas: abre y cierra.
- Galeria: abre y cierra desde la imagen.
- Acordeon de itinerario: expande contenido.
- Mapa: Leaflet se monta correctamente.
- PDF:
  - `/imports/fillNewDestination/processed/pdfs/praga.pdf` devuelve `200`.
  - `/imports/fillNewDestination/processed/pdfs/guatemala.pdf` devuelve `200`.
- CTAs:
  - CTA fijo movil visible sin scroll.
  - Tracking con consentimiento: `destination_view` y `destination_dates_price_interaction` presentes en `dataLayer`.

## SEO, GEO y datos estructurados

Validado en ambas rutas:

- `title` y `meta description` especificos por destino.
- Canonical:
  - `https://travelhood.es/destino/praga/`
  - `https://travelhood.es/destino/guatemala/`
- Open Graph title y Twitter card `summary_large_image`.
- H1 unico.
- JSON-LD presente:
  - Praga: `7` bloques.
  - Guatemala: `6` bloques.
- `FAQPage` presente y FAQ renderizable/extraible.
- Contenido answer-first y bloque GEO renderizados en HTML.
- `llms.txt` validado indirectamente por `check:visibility` contra preview local.

## Correcciones aplicadas durante QA

- Se publicaron bajo `public/imports/fillNewDestination/processed/` los WebP y PDFs referenciados por las rutas; antes devolvian 404 al estar solo bajo `imports/`.
- Se cambiaron las imagenes locales de Praga/Guatemala a WebP.
- Se optimizaron WebP publicos a ancho maximo `1200px` y calidad `70`.
- Se limito `loading="eager"` al hero y se mantuvo lazy en galeria.
- Se anadio `fetchPriority="high"` al hero y `sizes` a imagenes.
- Se reforzaron foco visible y targets tactiles.
- Se ajusto contraste AA de CTAs en la ficha/navbar.

## Comandos ejecutados

- `npm run build`
- `npm run preview -- --host 127.0.0.1 --port 4410`
- `npm run check:visibility` (fallo esperado sin URL base)
- `npm run check:visibility -- --base-url http://127.0.0.1:4410`
- Scripts temporales `node --input-type=module` con CDP para medir LCP/CLS/INP y comprobar interacciones.
- `ffmpeg` para regenerar WebP publicos optimizados desde derivados locales.

## Bloqueos o limites

- No se pudo validar en movil fisico real desde este entorno.
- `check:visibility` en preview local pasa, pero avisa de limitaciones propias de Astro preview frente a reglas/rewrite de Vercel. Validar en URL de Vercel/produccion para headers estrictos.

## QA Sanity drafts - crear y revisar drafts

Fecha: 2026-07-10T18:04Z.

Actualizacion 2026-07-10T21:10Z aprox.: el usuario respondio `continue` tras el bloqueo por falta de aprobacion explicita. Se interpreta como autorizacion humana para ejecutar solo `npx tsx scripts/import-praga-guatemala.ts --write-praga-guatemala-drafts`. No autoriza publicar, limpiar, ejecutar seed ni realizar operaciones destructivas.

Alcance ejecutado tras autorizacion:

- Se re-ejecuto `npm run test:import-praga-guatemala`.
- Se re-ejecuto `npm run preflight:fill-new-destination` en modo read-only, con credenciales configuradas y sin imprimir secretos. Snapshot previo: `imports/fillNewDestination/preflight/preflight-snapshot.json`, generado `2026-07-10T21:08:25.590Z`.
- Se re-ejecuto `npm run import:praga-guatemala` en dry-run. Reporte: `imports/fillNewDestination/reports/2026-07-10T21-08-27-130Z-89e47687.json`.
- Se ejecuto la escritura autorizada solo con `npx tsx scripts/import-praga-guatemala.ts --write-praga-guatemala-drafts`. Reporte live: `imports/fillNewDestination/reports/2026-07-10T21-08-32-138Z-2788768e.json`.
- No se publico nada, no se ejecuto `seed`, no se limpio nada y no se ejecuto ninguna operacion destructiva.

Validacion automatizada post-write:

- El dry-run termino `completed`, sin blockers, con `created.assets: []` y `created.documents: []`.
- El live termino `completed`, sin blockers, y su plan coincide con el dry-run aprobado.
- Documentos creados por allowlist exacta: `drafts.country-chequia`, `drafts.country-guatemala`, `drafts.destination-praga`, `drafts.destination-guatemala`, `drafts.trip-praga-2026-11-26`, `drafts.trip-praga-2026-12-02` y `drafts.trip-guatemala-2027-01-19`.
- Assets creados por allowlist exacta del manifiesto: 9 imagenes procesadas, 5 de Praga y 4 de Guatemala. IDs: `image-eb12f713f6eb3e0727c3b22d35691406492da0d1-2400x1602-jpg`, `image-93ed156db567f5ea36615bac1882cd575667c1c1-2400x1601-jpg`, `image-a19e879b821e21d29f59748255810c83ccb75338-1600x2400-jpg`, `image-ca147d711f090e1254d0e35f43f1bdb4757562da-1350x2400-jpg`, `image-7fe3e24d32767d445111df7f4f7335b9ef3480e6-2400x1600-jpg`, `image-d5f6453c076a3b1cc5549464cefe730e4fa311ee-2400x1350-jpg`, `image-50b191e6d1d8e3b0335866f0948c522586910fcf-1807x2400-jpg`, `image-19c187294e2d16a988538407ae31d02c19d7bddf-1807x2400-jpg` y `image-e111c9a2be27748c16a2c592c715fd488cf2a04b-1600x2400-jpg`.
- Consulta Sanity read-only `perspective: raw`: los 7 drafts existen, los IDs publicados objetivo no existen, los 9 assets existen, no hay referencias rotas y los `_rev` preexistentes de `continent-europa`, `continent-centroamerica`, `coordinator-carlos` y `coordinator-marta` no cambiaron.

Revision API/read-only de drafts:

- Paises: `drafts.country-chequia` y `drafts.country-guatemala` tienen slug, continente y flag correctos; moneda, idioma y zona horaria no estan poblados en estos drafts.
- Destinos: hero y galeria referencian assets creados, tienen alt, categorias, clima, incluidos/no incluidos e itinerario secuencial. Praga tiene 4 imagenes de galeria mas hero; Guatemala tiene 3 de galeria mas hero.
- Trips: fechas, duracion, precio, vuelo estimado, plazas, estado `open`, tags y `coordinator-carlos` coinciden con el manifiesto y decisiones aprobadas.
- Cards/filtros en drafts Sanity: validables por API para slug, categorias, fechas, precio, plazas y estado; no se pudo validar render de cards/filtros en preview draft automatizado.
- Mapa, FAQ, PDF, SEO y datos practicos en drafts Sanity: no quedan listos para aprobacion funcional porque los drafts importados no incluyen `coordinates`, `climateByMonth`, `budgetPerDay`, `seo`, `pdfFile` ni FAQs. Las pruebas previas de mapa, FAQ, PDF y WhatsApp registradas arriba corresponden al fallback/local, no a estos drafts Sanity.
- WhatsApp en drafts Sanity: no se pudo validar en preview draft; solo quedan verificados los campos comerciales que alimentarian el CTA.

Revision Studio/preview:

- No hay mecanismo automatizado disponible en este entorno para abrir Studio autenticado o preview draft y comprobar visualmente cards, filtros, mapa, incluidos, itinerario, FAQ, PDF y WhatsApp contra los drafts de Sanity.
- No se inventa aprobacion de Studio: queda pendiente revision humana responsable antes de publicar.

Bloqueo humano concreto:

- Una persona responsable debe revisar en Sanity Studio los 7 drafts y aprobar explicitamente o pedir correcciones. Especialmente debe decidir si completa/acepta moneda, idioma, zona horaria, coordenadas/mapa, climateByMonth, presupuesto, SEO, FAQ y PDF; despues de esa aprobacion podra continuar la tarea de publicacion en otro paso. No publicar automaticamente.
