# QA editorial de reseñas - improveReviews

Fecha: 2026-05-14
Estado: bloqueado para validacion literal en produccion. No se ha mutado Sanity ni se ha ejecutado `npm run seed`.

## Alcance

Esta guia cubre la carga editorial y QA de contenido para las reseñas reales de Trustpilot en Sanity:

- documentos `testimonial`
- documento `siteSettings`
- paginas `/`, `/opiniones/`, `/destino/[slug]/`, `/viajar-sola/` y `/viajes-para-mujeres/`

El inventario editorial vigente esta en `INVENTORY_improveReviews_testimonials.md`. Ese inventario marca las seis reseñas fallback actuales como `retired` e `isVisible: false` porque no existe evidencia externa suficiente de Trustpilot.

## Bloqueadores manuales

- Falta acceso manual confirmado a Sanity Studio para editar documentos reales.
- Falta acceso manual confirmado a Trustpilot para verificar la URL publica del perfil y, si existen, los enlaces individuales de cada opinion.
- No hay confirmacion explicita para ejecutar `npm run seed`; no debe ejecutarse.
- No se puede completar la validacion literal de produccion hasta que el equipo editorial rellene y publique los campos reales en Sanity.

## Checklist de Sanity

Para cada documento `testimonial` que vaya a publicarse:

- `source`: `trustpilot`
- `verificationStatus`: `individual-link` si hay URL individual estable; `profile-link` si solo hay perfil publico; `pending-review` o `retired` si no debe publicarse
- `externalReviewUrl`: obligatorio cuando `verificationStatus` es `individual-link`
- `sourceProfileUrl`: obligatorio cuando se usa enlace de perfil o como respaldo editorial
- `editorialReviewedAt`: fecha/hora de la revision manual
- `editorialEvidenceRef`: referencia interna estable, sin datos personales sensibles
- `isVisible`: `true` solo si la opinion esta aprobada para publicar
- `featured`: `true` solo para reseñas visibles destacadas en home
- `sortOrder`: numero entero, menor aparece antes

Para `siteSettings`:

- `trustpilotProfileUrl`: URL HTTPS real del perfil publico de Travel Hood en Trustpilot
- `reviewsAttributionText`: texto sobrio de atribucion, sin logos, badges ni claims de verificacion
- `reviewsLastReviewedAt`: fecha/hora de la ultima revision manual
- `reviewsCtaLabel`: etiqueta clara, por ejemplo `Ver opiniones en Trustpilot`

## Criterios de publicacion

- Publicar solo reseñas con `isVisible != false` y `verificationStatus` en `individual-link` o `profile-link`.
- Mantener ocultas las reseñas `pending-review`, `retired` o sin evidencia externa suficiente.
- Usar solo nombres de pila; evitar apellidos, fotos o ciudades demasiado identificables sin consentimiento.
- No mostrar widgets, logos, badges ni claims tipo `Trustpilot verified`.
- Los enlaces externos deben ser HTTPS, apuntar a Trustpilot y abrir en nueva pestana con `rel="noopener noreferrer"`.

## QA visual obligatorio

Cuando Sanity tenga datos reales publicados, validar en estas rutas:

- `/`: si hay reseñas `featured`, aparece el bloque de opiniones; si no hay reseñas publicables, el bloque no aparece.
- `/opiniones/`: muestra el estado editorial correcto. Con reseñas visibles, se ven tarjetas ordenadas por `sortOrder`; sin reseñas visibles, aparece el mensaje de revision.
- `/destino/[slug]/`: las reseñas del destino aparecen solo si estan visibles y trazables.
- `/viajar-sola/`: la seccion de experiencias no muestra tarjetas antiguas ni pendientes.
- `/viajes-para-mujeres/`: la seccion de opiniones no muestra tarjetas antiguas ni pendientes.

En cada ruta, comprobar:

- No aparecen reseñas `retired`, `pending-review` o `isVisible: false`.
- La atribucion publica es prudente y coherente con `reviewsAttributionText`.
- Cada enlace `Ver en Trustpilot` o CTA externo abre en nueva pestana.
- Si solo hay `sourceProfileUrl`, la tarjeta apunta al perfil; si hay `externalReviewUrl`, apunta a la opinion individual.

## Revision de `scripts/seed-sanity.ts`

No usar el seed para carga editorial real sin una decision explicita. Riesgos observados:

- `siteSettings` se escribe con `createOrReplace` y no incluye los campos editoriales de opiniones, por lo que puede borrar `trustpilotProfileUrl`, `reviewsAttributionText`, `reviewsLastReviewedAt` y `reviewsCtaLabel`.
- Los documentos `testimonial-0` a `testimonial-5` se escriben con `createOrReplace`, por lo que pueden sobrescribir ediciones reales con los datos fallback.
- La fase de purga elimina documentos `testimonial` cuyo `_id` no este en el seed local.
- El flag `--dry-run` solo evita la purga; la transaccion principal se confirma igualmente.

Antes de cualquier uso del seed en produccion:

- hacer backup/export de Sanity
- confirmar por escrito que se acepta el impacto
- adaptar el script para preservar los campos editoriales reales o excluir `siteSettings` y `testimonial`
- comprobar primero en dataset no productivo

## Validacion local realizada

Con fallback local, las seis reseñas actuales estan marcadas como `retired` e `isVisible: false`. La logica local debe comportarse asi:

- `filterVisibleReviews` excluye reseñas `retired`, `pending-review` e `isVisible: false`.
- `getTestimonials`, `getFeaturedTestimonials` y `getTestimonialsByDestination` normalizan los datos con ese filtro.
- Las paginas de landing muestran mensajes de revision o no renderizan secciones cuando no hay reseñas visibles.
- `/opiniones/` muestra el estado `En revision` y no renderiza tarjetas de reseñas retiradas.

Comprobaciones ejecutadas el 2026-05-14:

- `npx tsx -e "...filterVisibleReviews(testimonials)..."`: 6 reseñas totales, 0 visibles, 0 seleccionadas.
- `npm run build`: build completada correctamente con fallback local.
- HTML generado revisado en `/`, `/opiniones/`, `/destino/brasil/`, `/viajar-sola/`, `/viajes-para-mujeres/` y `/travelhood/`: sin frases de reseñas retiradas, sin `Reseña publicada originalmente`, sin `Ver en Trustpilot` y sin bloque de opiniones de home cuando no hay reseñas destacadas visibles.

Intento de MCP browser:

- No se ha podido invocar `cursor-ide-browser` porque el servidor MCP solo expone `SERVER_METADATA.json` en este workspace y no hay descriptores de herramientas disponibles para leer el schema antes de llamar al tool.
- Fallback usado: validacion sobre `dist/` generado por `npm run build`.

## Reintento autopilot 2026-05-14 05:36

Se ha reintentado la tarea manual una vez, sin ejecutar `npm run seed`, sin escribir en Sanity y sin fabricar evidencia de Trustpilot.

Resultado del reintento:

- `cursor-ide-browser`: sigue sin descriptores de herramientas disponibles; no se puede llamar al MCP cumpliendo el requisito de leer schema antes del tool.
- `npx tsx -e "...filterVisibleReviews(testimonials)..."`: 6 reseñas totales, 0 visibles, 0 seleccionadas, estado unico `retired`.
- `npm run build`: build completada correctamente.
- Revision de HTML generado en `/`, `/opiniones/`, `/destino/brasil/`, `/viajar-sola/`, `/viajes-para-mujeres/` y `/travelhood/`: sin frases de reseñas retiradas, sin atribucion Trustpilot y sin enlaces `Ver en Trustpilot` cuando no hay reseñas publicables.

Bloqueo restante: la validacion literal de contenido publicado sigue requiriendo acceso manual a Sanity Studio y Trustpilot para completar datos reales, publicar cambios editoriales y abrir enlaces externos en navegador.
