# INVENTORY fillNewDestination

Estado: inventario de solo lectura para la tarea "Inventariar fuentes y construir el manifiesto de importacion".

Fecha de inventario: 2026-07-10

## Alcance Ejecutado

- Se inspecciono `new_destination/Praga & guatemala.pdf`.
- Se inspeccionaron `new_destination/praga_images/` y `new_destination/guatemala_images/`.
- Se creo el manifiesto versionable `imports/fillNewDestination/manifest.json`.
- No se modifico ningun archivo dentro de `new_destination/`.
- No se ejecuto `npm run seed`, `scripts/seed-sanity.ts`, migraciones, scripts de limpieza ni escrituras a Sanity.

## Artefactos Creados

- `INVENTORY_fillNewDestination.md`: este inventario humano.
- `imports/fillNewDestination/manifest.json`: fuente versionable para la importacion futura, con fuente, hash, destino, rol, dimensiones, alt propuesto, derechos, estado de aprobacion y futuro asset ID.
- `imports/fillNewDestination/preflight/preflight-report.md`: informe de preflight de Sanity generado por `npm run preflight:fill-new-destination`.
- `imports/fillNewDestination/preflight/preflight-snapshot.json`: snapshot de IDs y `_rev` preexistentes para comparar despues de una importacion autorizada.

## Fuentes Originales

| Fuente | Tamano bytes | SHA-256 | Estado |
| --- | ---: | --- | --- |
| `new_destination/Praga & guatemala.pdf` | 128838 | `d57bc466538938137fd23d2118e51162a22c7da497ae3c9718c6cf68b8eb6441` | verificado |
| `new_destination/guatemala_images/20260104_233404442_iOS.jpg` | 303210 | `136ce852b518a966b1244c4ff408256b53527640dff905ce2aced3053b735bea` | verificado |
| `new_destination/guatemala_images/20260220_170641158_iOS.heic` | 1593552 | `5128da820f3eb9186f8eae89882b24affd79105ff3cec79be46561856b6d6b92` | verificado; dimensiones/alt pendientes |
| `new_destination/guatemala_images/20260220_234633611_iOS.heic` | 1484413 | `c29c74e3263ced72ed9653eff585e7d5abc01901cf4dbba72b7e880c3c8e1350` | verificado; dimensiones/alt pendientes |
| `new_destination/guatemala_images/IMG_20240815_174718.jpg` | 7604734 | `b8458e471485154232bbb9fcab7871ec30618a4073a08a155a8ed151cb635687` | verificado |
| `new_destination/guatemala_images/IMG_20240820_132058 (1).jpg` | 7214218 | `d2bebd05d32527c19cd7af0ee42d9935f21b7ae4412a83f18ae006837846172b` | verificado |
| `new_destination/guatemala_images/pexels-harold-productions-74516182-10637017.jpg` | 1880700 | `6e68fbe07edc408dbb0db9ca14d03af5f0bfff4e53762bdbc7e330e1533c7bd3` | verificado; licencia pendiente |
| `new_destination/praga_images/Praga 1.jpg` | 3758206 | `a0c1d35a26d814a0fd2d7dc128337d804cce5b726d0bffc53cd0c958dc25cfc0` | verificado |
| `new_destination/praga_images/Praga 2.jpg` | 4309028 | `b92861df569377d722b535d34ef9acfd2f4e241470fb60f9a94fc0ef7dcea450` | verificado |
| `new_destination/praga_images/Praga 3.jpg` | 3086223 | `1032408b6c9e6ac449e199206e61ec9d84d4241f290956870a21b0d6a25835ef` | verificado |
| `new_destination/praga_images/Praga 4.jpg` | 3772502 | `6b5ae1818739efb758fc5700f28e7079a8f250f1770189c66001911cc186e6db` | verificado |
| `new_destination/praga_images/Praga 5.jpg` | 3696394 | `c49ac6ecdf0c9160f5b0b052bf684063a07b2fb72e407e55c6cf94a74c9afd2b` | verificado |

## Dimensiones De Assets

| Asset | Dimensiones | Rol propuesto | Estado |
| --- | --- | --- | --- |
| `praga_images/Praga 1.jpg` | 7360 x 4912 | hero candidate Praga | pendiente aprobacion |
| `praga_images/Praga 2.jpg` | 7218 x 4817 | galeria Praga | pendiente aprobacion |
| `praga_images/Praga 3.jpg` | 4624 x 6936 | galeria Praga | pendiente aprobacion |
| `praga_images/Praga 4.jpg` | 3808 x 6770 | galeria Praga | pendiente aprobacion |
| `praga_images/Praga 5.jpg` | 6016 x 4011 | galeria Praga | pendiente aprobacion |
| `guatemala_images/20260104_233404442_iOS.jpg` | 4032 x 2268 | hero candidate Guatemala | pendiente aprobacion |
| `guatemala_images/IMG_20240815_174718.jpg` | 3072 x 4080 | galeria Guatemala | pendiente aprobacion |
| `guatemala_images/IMG_20240820_132058 (1).jpg` | 3072 x 4080 | galeria Guatemala | pendiente aprobacion |
| `guatemala_images/pexels-harold-productions-74516182-10637017.jpg` | 3648 x 5472 | galeria Guatemala si licencia aprobada | pendiente licencia |
| `guatemala_images/20260220_170641158_iOS.heic` | no verificable sin conversion | pendiente conversion de copia | bloqueado por metadata |
| `guatemala_images/20260220_234633611_iOS.heic` | no verificable sin conversion | pendiente conversion de copia | bloqueado por metadata |

## Extraccion Del PDF

El PDF tiene 10 paginas y contiene dos bloques comerciales:

### Praga

- Duracion: 5 dias.
- Fechas:
  - 26-30 noviembre 2026.
  - 2-6 diciembre 2026.
- Precio base: 425 EUR.
- Propuesta: escapada navidena por Praga con calles medievales, monumentos iluminados, rio Moldava y mercados navidenos.
- Highlights: mercados navidenos, tours privados, Ciudad Vieja, Barrio Judio, Castillo, paseo en barco por el Moldava y tour de la cerveza.
- Itinerario transcrito y normalizado en el manifiesto: dias 1 a 5.
- Incluidos especificos guardados en el manifiesto, sin duplicar defaults de `siteSettings`:
  - 2 tours privados con guia local en espanol.
  - Paseo en barco por el rio Moldava.
  - Tour de la cerveza.
  - Visita a los mercados navidenos.
- No incluidos especificos guardados en el manifiesto:
  - Transporte publico durante el viaje.

### Guatemala

- Duracion: 12 dias.
- Fecha: 19-30 enero 2027.
- Precio base: 1.300 EUR.
- Propuesta: aventura por Peten, Yaxha, Tikal, Antigua, Acatenango, Atitlan y El Paredon.
- Highlights: Lago Peten Itza, Volcan Acatenango, liberacion de tortugas, clase de cocina guatemalteca, templos mayas, ciudades coloniales, volcanes, lagos y playas del Pacifico.
- Itinerario transcrito y normalizado en el manifiesto: dias 1 a 11 y ultimo dia marcado como `day: 15` por inconsistencia de fuente.
- Incluidos especificos guardados en el manifiesto, sin duplicar defaults de `siteSettings`:
  - Traslados en lancha indicados en el itinerario.
  - Guias locales certificados en Tikal, Yaxha, Antigua y Acatenango.
  - Ruta en kayak por el Lago Peten Itza.
  - Ascenso al Volcan Acatenango con material de montana y guias especializados.
  - Clase de cocina guatemalteca.
  - Liberacion de tortugas.
  - Cena de bienvenida.
- No incluidos especificos guardados en el manifiesto:
  - Visado.

## Allowlist Modelada

El manifiesto separa IDs publicados y `drafts.*`.

- Paises potenciales:
  - Publicados: `country-chequia`, `country-guatemala`.
  - Drafts: `drafts.country-chequia`, `drafts.country-guatemala`.
  - Estado: potenciales; antes de crear se debe resolver si ya existen Chequia/Republica Checa o Guatemala por `_id`, slug y nombre normalizado.
- Destinos:
  - Publicados: `destination-praga`, `destination-guatemala`.
  - Drafts: `drafts.destination-praga`, `drafts.destination-guatemala`.
- Trips, exactamente tres:
  - `trip-praga-2026-11-26` / `drafts.trip-praga-2026-11-26`.
  - `trip-praga-2026-12-02` / `drafts.trip-praga-2026-12-02`.
  - `trip-guatemala-2027-01-19` / `drafts.trip-guatemala-2027-01-19`.

## Inconsistencias Y Carencias

- Guatemala: el ultimo dia aparece como `DIA 15`, pero la duracion indicada es 12 dias y las fechas 19-30 enero 2027 tambien corresponden a 12 dias. El usuario aprobo corregirlo a dia 12 en los datos importables el 2026-07-10.
- Campos comerciales aprobados por el usuario el 2026-07-10: `totalPlaces: 15`, `placesLeft: 15`, `status: open`, `coordinator: coordinator-carlos` para las tres salidas, `flightEstimate: 300 EUR` para Praga y `flightEstimate: 900 EUR` para Guatemala.
- Datos variables de pais: el usuario aprobo que el agente los complete con fuentes publicas oficiales y fecha de revision visible.
- Datos de destino no presentes en el PDF: el usuario aprobo que el agente proponga clima, coordenadas, clima por mes, presupuesto diario, FAQs y SEO con estado revisable. Para cerrar el bloqueo del importador, se completo solo `climate` en el manifiesto con fuentes publicas trazables: CHMI para Praga e INSIVUMEH para Guatemala, revisado el 2026-07-10.
- Praga solo tiene 5 imagenes fuente totales; el usuario aprobo la excepcion con 5 imagenes.
- Las dos imagenes HEIC de Guatemala quedaron convertidas como derivados trazables, pero no tienen alt aprobado en una fuente previa al importador; por tanto no se incluyen en la galeria importable de esta tarea.
- La imagen con nombre de Pexels queda aprobada por el usuario para su uso.
- El PDF es combinado; el usuario decidio conservarlo solo como fuente y no publicarlo como PDF final de destino hasta tener un PDF especifico aprobado.

## Decisiones Manuales Registradas

Responsable: usuario.

Fecha: 2026-07-10.

| Decision | Valor aprobado |
| --- | --- |
| Nombre canonico de pais para Praga | Chequia |
| Coordinador | `coordinator-carlos` para las tres salidas |
| Plazas | 15 totales y 15 disponibles al inicio |
| Estado inicial | `open` para las tres salidas |
| Vuelo estimado Praga | 300 EUR |
| Vuelo estimado Guatemala | 900 EUR |
| Ultimo dia Guatemala | Corregir `DIA 15` a dia 12 |
| Tag Guatemala enero | Sin tag de temporada |
| Galeria Praga | Excepcion aprobada con 5 imagenes |
| Imagen Pexels | Aprobada |
| Derechos de imagenes propias | Aprobados |
| PDF combinado | Solo fuente, no publicar como PDF final |
| Datos practicos de pais | Completar con fuentes publicas oficiales |
| Datos GEO/SEO/FAQ de destino | El agente puede proponerlos con estado revisable |

## Resolucion De Bloqueo De Clima

El dry-run del importador bloqueaba porque `destination.climate` es requerido por el schema y el PDF no contenia ese dato.

Resolucion aplicada el 2026-07-10:

- `drafts.destination-praga`: clima completado como propuesta revisable con CHMI (normales climatologicas 1991-2020 y mapas de temperatura del aire) como fuente publica.
- `drafts.destination-guatemala`: clima completado como propuesta revisable con INSIVUMEH (epoca seca noviembre-abril y perspectiva/variabilidad climatica) como fuente publica.
- Las dos HEIC de Guatemala no se importan porque no existe alt aprobado suficiente; quedan documentadas como fuente/derivado pendiente y fuera de la galeria importable.
- No se completaron coordenadas, clima por mes, presupuesto, FAQs ni SEO en esta tarea porque no eran necesarios para desbloquear el contrato minimo del importador.

## Validaciones Ejecutadas

- Hash SHA-256 y tamano de todos los archivos fuente antes de crear el manifiesto.
- Extraccion de texto del PDF con `pypdf`, sin modificar el archivo.
- Lectura de dimensiones JPG con PIL.
- Verificacion de tipo HEIC con `file`; las dimensiones quedaron pendientes por falta de soporte de conversion/lectura.
- Revision visual de JPG para proponer alt text.
- Lectura de `siteSettings` defaults en fallback/scripts para no duplicar incluidos/no incluidos globales en destinos.
- Modelado de allowlist con unicamente las altas previstas para Praga y Guatemala y exactamente tres viajes.

## Derivados Procesados

Fecha de procesamiento: 2026-07-10.

- Reintento de persistencia ejecutado el 2026-07-10: se regeneraron los binarios en el workspace y se valido su existencia fisica con `Path.exists()`/`stat()`.
- Se crearon copias JPEG y WebP en `imports/fillNewDestination/processed/images/` para las 11 imagenes aprobadas: 5 de Praga y 6 de Guatemala.
- Las dos HEIC de Guatemala se convirtieron a JPEG/WebP como copias tecnicas; los originales HEIC quedan solo como fuente trazable y no deben referenciarse desde frontend o Sanity. En el manifiesto vigente quedan excluidas de la galeria importable por no tener alt aprobado.
- Se conservaron proporciones, orientacion valida y perfil sRGB; no se hizo ampliacion artificial. Las copias se limitaron a maximo 2400 px por lado con `withoutEnlargement`.
- Se eliminaron EXIF/GPS sensibles de todos los derivados de imagen. La validacion con PIL confirma 0 tags EXIF y sin GPS en las copias.
- Se dividio `new_destination/Praga & guatemala.pdf` en `imports/fillNewDestination/processed/pdfs/praga.pdf` y `imports/fillNewDestination/processed/pdfs/guatemala.pdf`.
- La pagina compartida del PDF se proceso con redaccion real: `praga.pdf` conserva fechas/precio de Praga y excluye Guatemala; `guatemala.pdf` conserva el bloque de Guatemala y excluye Praga/precio 425 EUR.
- El manifiesto `imports/fillNewDestination/manifest.json` se actualizo con `processedOutputs`, hashes de derivados, roles finales, alt/licencia, exclusiones y relaciones fuente-derivado.
- Se genero `imports/fillNewDestination/processed/validation-report.json` con el resultado de validacion tecnica y la lista `persistedFiles`.

## Validaciones De Procesado

- Hashes originales: sin cambios frente al manifiesto.
- Existencia real: 24 binarios persistidos bajo `imports/fillNewDestination/processed/` con `exists: true`, tamano mayor que 0 y hash SHA-256 en `validation-report.json`.
- Imagenes procesadas: todas abren correctamente, tienen dimensiones/orientacion validas, espacio sRGB y no conservan EXIF/GPS.
- HEIC: no hay referencias directas `.heic` en `src/` ni en `studio/`; solo quedan registradas como fuentes en manifiestos.
- PDFs: `praga.pdf` tiene 4 paginas y contiene Praga, fechas 26-30 noviembre 2026 / 2-6 diciembre 2026 y precio 425 EUR; no contiene Guatemala ni 1.300 EUR.
- PDFs: `guatemala.pdf` tiene 7 paginas y contiene Guatemala, fechas 19-30 enero 2027, 12 dias y precio 1.300 EUR; no contiene Praga ni 425 EUR.
- Licencias/aprobaciones: se procesaron solo assets aprobados en el manifiesto; la imagen Pexels consta como aprobada por el usuario.

## Estado

La tarea de inventario queda completada para su alcance inicial. La preparacion de derivados web/PDF queda documentada en este inventario y en el manifiesto, sin modificar ningun archivo dentro de `new_destination/`.
