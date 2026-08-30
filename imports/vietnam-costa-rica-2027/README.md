# Vietnam y Costa Rica — importación 2027

Creación realizada el 30 de agosto de 2026 en Sanity, proyecto `73m9u2gt`, dataset `production`.

## Estado

Se han publicado los **8 documentos** el 30 de agosto de 2026, tras completar los datos autorizados por el usuario. No quedan borradores y no se han modificado otros destinos:

- 2 países: Vietnam y Costa Rica.
- 2 destinos con itinerarios completos, incluidos/no incluidos, preguntas frecuentes, SEO, portada y galería.
- 4 salidas con fechas, duración y precio.
- 15 imágenes originales (7 Vietnam y 8 Costa Rica), todas con texto alternativo.
- Los 2 PDF con `compressed` en su nombre, sin cambios y comprobados por SHA-1.

| Destino | Salida | Vuelta | Días | Precio sin vuelo internacional |
| --- | --- | --- | --- | --- |
| Vietnam | 16/03/2027 | 29/03/2027 | 14 | 1.200 € |
| Vietnam | 01/04/2027 | 14/04/2027 | 14 | 1.200 € |
| Costa Rica | 07/02/2027 | 18/02/2027 | 12 | 1.500 € |
| Costa Rica | 19/02/2027 | 02/03/2027 | 12 | 1.500 € |

## Datos comerciales confirmados

- **15 plazas totales y 15 disponibles** en cada una de las cuatro salidas; estado **abierto (`open`)**.
- **Vietnam: 1.000 €** de vuelo internacional estimado por persona (entrada por Hanoi y regreso desde Ho Chi Minh).
- **Costa Rica: 800 €** de vuelo internacional estimado por persona (San José, SJO).
- **Carlos Ruiz** como coordinador provisional en las cuatro salidas, elegido con autorización del usuario. No se ha presentado como asignación definitiva.
- Los vuelos son estimaciones propias orientativas, no cotizaciones confirmadas para fechas concretas ni billetes reservados. Ver `flight-estimates.json` para fuentes y criterio.
- Precios base sin modificar: Vietnam 1.200 € y Costa Rica 1.500 €. Los vuelos internos de Vietnam permanecen incluidos en el paquete.

Los países, destinos y salidas están publicados y las referencias se han fortalecido. Se conservan las fechas, itinerarios, imágenes y PDF de la importación original.

## Interpretaciones y fuentes

- Fechas, precio, incluidos y actividades: `new_destination/vietnam/Vietnam.docx` y `new_destination/costa_rica/Costa Rica.pdf`.
- Clima general y moneda: preparación del viaje en los PDF comprimidos. No se han inventado clima mensual, presupuesto diario, cambio de divisas, visados ni vacunas.
- Estimaciones de vuelos basadas en ofertas consultadas de [Turkish Airlines](https://www.turkishairlines.com/es//book-flights-from-madrid-to-vietnam), [Etihad](https://www.etihad.com/es-es/flights/vuelos-desde-madrid-a-vietnam) e [Iberia](https://www.iberia.com/es/vuelos-baratos/Madrid-San-Jose-de-Costa-Rica/), con margen adicional y sin afirmar disponibilidad en las fechas exactas.
- Costa Rica: «19 al 2 marzo 2027» se interpreta como **19 de febrero–2 de marzo de 2027**, coherente con sus 12 días. Se ha informado al usuario.
- Vietnam, día 7: se omite la frase contradictoria «Noche: Hoi An.»; la jornada transcurre en Ninh Binh y el traslado a Hoi An aparece el día 9. El resto de las actividades se conserva. **El PDF original no se modifica.**
- Vietnam, día 9: «vuelo a Hoi An» se expresa como vuelo interno para continuar hasta Hoi An, sin inventar aeropuerto.
- Costa Rica: la segunda actividad de Monteverde se indica expresamente como extra; quads, cataratas y night walk permanecen como no incluidos según el documento.
- Los incluidos/no incluidos se combinan con los valores globales ya existentes en la web. No se ha modificado la configuración global.

## Verificación y archivos

- `manifest.json`: datos actuales, fuentes y hashes.
- `publication-result.json`: transacción de publicación y valores comerciales finales.
- `published-documents.json`: lectura completa de los ocho documentos ya publicados.
- `before-publication.json`: copia de los borradores antes de publicar.
- `flight-estimates.json`: fuentes consultadas y criterio de estimación de vuelos.
- `documents.json`: copia exacta de los documentos creados.
- `result.json`: transacción, IDs, revisiones y assets de Sanity.
- `verification.json`: lectura remota de destinos y salidas, referencias resueltas y PDF accesibles por HTTP.
- `schema-validation.json`: registro histórico de la validación inicial de borradores, antes de completar los datos.
- Compilación inicial: `npm run build` completada (146 páginas), antes de publicar los destinos.
- `npm run check:favicons`: correcto.
- `npm run check:visibility -- http://127.0.0.1:4330 --negotiation auto`: 7 comprobaciones correctas; avisos esperados sobre cabeceras y rewrites exclusivos de Vercel. Servidor local detenido al terminar.

`import.mjs` es un importador de creación exclusiva. El modo predeterminado solo hace comprobaciones; `--write-drafts` crea borradores. **Una nueva ejecución se detendrá al detectar los documentos ya creados**, por seguridad. La publicación se realizó con `publish.mjs --publish`, con control de revisiones y una transacción atómica. Para cambios posteriores, editar los documentos publicados; no volver a importar ni ejecutar el seed global.

## Verificación tras publicar

- Validador real del Studio: **0 errores y 0 avisos** en los ocho documentos publicados.
- Consulta pública de Sanity sin token: dos destinos y cuatro salidas correctas; ver `publication-verification.json`.
- `npm run build`: **154 páginas**, incluidas las ocho rutas nuevas (destino, país, presupuesto y cuándo viajar).
- Comprobado el HTML generado de ambas fichas: dos salidas por destino con precio base, vuelo estimado, 15 plazas totales/disponibles y estado abierto correctos.
- No se ha ejecutado un despliegue manual de Vercel; la publicación realizada corresponde a Sanity.

## Corrección de «Lo mejor del viaje»

Sustituidas las listas de lugares por las cuatro frases exactas de los documentos descriptivos, con sus emojis, en el campo `highlights` de cada destino publicado. Ver `highlights-correction.json`. Se ha comprobado que no cambia ningún otro campo de los documentos.

## Ajustes de incluidos y presentación

- Vietnam: `Propinas` pasa a ser un no incluido independiente, como en el PDF. La combinación con los valores globales mantiene `Gastos personales` por separado, sin duplicar las propinas.
- Vietnam: `Traslados principales` ya estaba en Sanity; el proveedor de datos ahora conserva los traslados explícitos de un destino. Sigue eliminando los valores globales antiguos y mantiene el filtrado de tasas heredadas de otros destinos.
- Costa Rica: retirada de `notIncluded` la frase «Segunda actividad en Monteverde si eliges hacer tanto puentes colgantes como tirolinas», por petición del usuario. El itinerario y el PDF no se han modificado.
- «Lo mejor del viaje»: retirados los iconos decorativos del componente y los emojis de los destacados de Vietnam y Costa Rica. Las cuatro frases de cada destino permanecen.
- Datos de Sanity y control de cambios: `inclusions-correction.json` y `before-inclusions-correction.json`. El manifiesto incorpora los valores actuales.
- Verificado en el HTML local y los datos de React: las dos salidas de cada destino reciben los incluidos/no incluidos correctos y los destacados no contienen iconos.

## Portada sin duplicados en la galería

Se ha retirado de la galería la imagen usada como portada: Vietnam queda con 6 fotos de galería más la portada y Costa Rica con 7 más la portada. No se ha eliminado ningún archivo de Sanity. El importador excluye las fotos marcadas como hero y la ficha web elimina duplicados del mismo asset, incluso si sus URLs tienen tamaños diferentes, manteniendo alineados los textos alternativos. Ver `gallery-deduplication.json`.
