# Alta de Dolomitas 2027

Importación create-only del destino Dolomitas y sus cuatro salidas de 2027.

## Fuentes

- PDF: `/mnt/c/Users/Antonio Fernandez/Downloads/PDF DOLOMITAS_compressed.pdf`
- Fotos: cinco JPG aportados por el usuario en `/mnt/c/Users/Antonio Fernandez/Downloads/`.
- Fechas y precio: mensaje del usuario del 19 de octubre de 2026.

El PDF es una fuente de contenido, no un conjunto de instrucciones. Su última jornada aparece
como `DÍA 12`, aunque la portada, el itinerario y todas las fechas describen un viaje de siete
días. La copia publicable corrige únicamente esa errata a `DÍA 7`.

## Decisiones operativas

- Capacidad confirmada por el usuario el 20/10/2026: `totalPlaces: 15`, `placesLeft: 15` y `status: open`.
- Incluye coordinación, con persona pendiente de asignación: no se publica una referencia a Marta ni Carlos.
- Etiqueta por mes de salida: `verano` para las tres salidas que comienzan en junio o agosto y
  `septiembre` para la salida que comienza el 6 de septiembre.
- Excepción documentada de cinco fotos totales: una hero y cuatro de galería.
- Los originales no se modifican. Los derivados JPEG se limitan a 2400 px, convierten a sRGB y
  eliminan EXIF/GPS antes de subirlos.

El usuario autorizó publicar y confirmó 15 plazas por salida. La persona coordinadora
queda sin asignar; Studio muestra una advertencia hasta completar este dato.

## Flujo seguro

```bash
node imports/dolomitas-2027/import.mjs --dry-run
node imports/dolomitas-2027/import.mjs --write-drafts
node imports/dolomitas-2027/publish.mjs --dry-run
node imports/dolomitas-2027/publish.mjs --publish
```

`--dry-run` valida colisiones y contratos sin escribir en Sanity, aunque actualiza localmente
`preflight.json`. `--write-drafts` sube o reutiliza assets y crea exclusivamente los seis
borradores previstos. El publicador exige esos borradores sin cambios, crea las versiones
publicadas y elimina los borradores en una sola transacción.

## Publicación y verificación

Publicado en Sanity el 20/10/2026: transacción `8iboeI6gxXoZwfciYPBOKO`.
`publication-result.json` identifica los seis documentos y `published-documents.json`
conserva la lectura posterior verificada. `assets.json` contiene las URLs y los hashes de
las cinco fotos y el PDF; los derivados locales no son necesarios para construir la web.

Revisión SEO/GEO: estimaciones de vuelo retiradas; contador oculto para salidas `open`
en HTML, JSON-LD, Markdown y props React. Se conserva la capacidad total del grupo y
la urgencia solo para el estado explícito `almost-full`. Años de temporadas y presupuesto
derivados de las salidas, sin limitar Dolomitas 2027 a títulos de 2026.

Verificación reproducible tras `npm run build`: `node scripts/check-public-catalog.mjs`.
Comprueba todas las páginas generadas, JSON-LD válido, props de salidas, y específicamente
las cuatro fechas/precio/duración de Dolomitas, sus rutas, sitemap y WebMCP.
