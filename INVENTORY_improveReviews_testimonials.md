# Inventario editorial de reseñas Trustpilot - improveReviews

Fecha de revision manual: 2026-05-14
Estado de auditoria: aceptada internamente con decision conservadora. Ninguna resena actual es publicable como Trustpilot hasta que exista evidencia externa suficiente.

## Criterio editorial

Este inventario aplica el criterio de `concepts/CONCEPT_improveReviews.md`: la web debe mostrar una seleccion editorial de reseñas publicadas originalmente en Trustpilot, con atribucion clara, trazabilidad interna y sin widgets, logos, badges ni claims tipo "Trustpilot verified". El tono debe ser cercano, humano y prudente: comunidad, confianza y autenticidad sin lenguaje corporativo ni apariencia de certificacion externa.

No se deben publicar apellidos, fotos ni ciudades demasiado identificables sin consentimiento. En esta revision los nombres ya son de pila, las edades y ciudades son generales, y no hay imagenes asociadas.

## Alcance revisado

- Datos fallback actuales: `src/lib/travel-data.ts`, export `testimonials`.
- Documentos Sanity inferidos desde seed local: `scripts/seed-sanity.ts` crea `testimonial-0` a `testimonial-5` a partir del fallback.
- No se ha encontrado export local de Sanity con documentos `_type == "testimonial"` distinto del seed.
- No se ha mutado Sanity ni se ha ejecutado seed.

## Resultado de verificacion externa

URL general de Trustpilot aceptada: sin valor. Es un dato obligatorio para publicar resenas Trustpilot, pero no se incluye placeholder porque no hay una convencion de repo que permita simular URLs externas sin riesgo editorial.

Intentos de localizacion:

- Busqueda publica de `travelhood.es` + Trustpilot: sin perfil de Travel Hood localizado.
- Busqueda adicional reportada por orquestador: `Travel Hood Trustpilot Travelhood opiniones`; sin perfil publico de Trustpilot localizado, solo paginas de `travelhood.es` y resultados no relacionados/foro.
- Busqueda publica por cada quote exacta + Trustpilot: sin coincidencias en Trustpilot; los resultados apuntan a paginas propias de `travelhood.es`.
- URLs candidatas probadas como referencia operativa, no aceptadas como evidencia: `https://www.trustpilot.com/review/travelhood.es` y `https://es.trustpilot.com/review/travelhood.es`. La peticion directa devuelve bloqueo 403 de CloudFront desde este entorno y no permite confirmar existencia ni contenido.

Decision editorial aceptada: retirar/no publicar las seis resenas actuales como resenas Trustpilot. No usar texto "Review publicada originalmente en Trustpilot" en estas piezas hasta que exista URL general confirmada y evidencia manual por resena o por perfil.

## Inventario por reseña

### 1. Laura

- `fallbackId`: `t1`
- `sanitySeedId`: `testimonial-0`
- `name`: Laura
- `age`: 28
- `city`: Madrid
- `destination`: Brasil
- `quote`: "Fui sin conocer a nadie. Volvi con gente que ya considero amigos."
- `rating`: 5
- `image`: sin imagen
- `source`: `trustpilot`
- `verificationStatus`: `retired`
- `externalReviewUrl`: sin valor; evidencia externa Trustpilot ausente
- `sourceProfileUrl`: sin valor; requerido para cualquier publicacion futura
- `experienceDateLabel`: pendiente
- `editorialReviewedAt`: 2026-05-14
- `editorialEvidenceRef`: `fallback:src/lib/travel-data.ts:testimonials.t1`; `seed:scripts/seed-sanity.ts:testimonial-0`; `external Trustpilot evidence missing`
- `isVisible`: false
- `featured`: false
- `sortOrder`: 1
- Decision: retirar hasta confirmar origen Trustpilot. No publicar solo con enlace general porque tampoco hay URL general aceptada.
- Nota de privacidad/consentimiento: nombre de pila, edad y ciudad grande son publicables si la reseña se confirma; no hay foto. Mantener sin apellidos.

### 2. Pablo

- `fallbackId`: `t2`
- `sanitySeedId`: `testimonial-1`
- `name`: Pablo
- `age`: 25
- `city`: Barcelona
- `destination`: Laponia
- `quote`: "Ver las auroras boreales con 13 personas mas que sienten lo mismo que tu... no hay palabras."
- `rating`: 5
- `image`: sin imagen
- `source`: `trustpilot`
- `verificationStatus`: `retired`
- `externalReviewUrl`: sin valor; evidencia externa Trustpilot ausente
- `sourceProfileUrl`: sin valor; requerido para cualquier publicacion futura
- `experienceDateLabel`: pendiente
- `editorialReviewedAt`: 2026-05-14
- `editorialEvidenceRef`: `fallback:src/lib/travel-data.ts:testimonials.t2`; `seed:scripts/seed-sanity.ts:testimonial-1`; `external Trustpilot evidence missing`
- `isVisible`: false
- `featured`: false
- `sortOrder`: 2
- Decision: retirar hasta confirmar origen Trustpilot. No publicar solo con enlace general porque tampoco hay URL general aceptada.
- Nota de privacidad/consentimiento: nombre de pila, edad y ciudad grande son publicables si la reseña se confirma; no hay foto. Mantener sin apellidos.

### 3. Ana

- `fallbackId`: `t3`
- `sanitySeedId`: `testimonial-2`
- `name`: Ana
- `age`: 31
- `city`: Valencia
- `destination`: Indonesia
- `quote`: "Indonesia me volaba la cabeza cada dia. Y el grupo hizo que fuera 10 veces mejor."
- `rating`: 5
- `image`: sin imagen
- `source`: `trustpilot`
- `verificationStatus`: `retired`
- `externalReviewUrl`: sin valor; evidencia externa Trustpilot ausente
- `sourceProfileUrl`: sin valor; requerido para cualquier publicacion futura
- `experienceDateLabel`: pendiente
- `editorialReviewedAt`: 2026-05-14
- `editorialEvidenceRef`: `fallback:src/lib/travel-data.ts:testimonials.t3`; `seed:scripts/seed-sanity.ts:testimonial-2`; `external Trustpilot evidence missing`
- `isVisible`: false
- `featured`: false
- `sortOrder`: 3
- Decision: retirar hasta confirmar origen Trustpilot. No publicar solo con enlace general porque tampoco hay URL general aceptada.
- Nota de privacidad/consentimiento: nombre de pila, edad y ciudad grande son publicables si la reseña se confirma; no hay foto. Mantener sin apellidos.

### 4. Miguel

- `fallbackId`: `t4`
- `sanitySeedId`: `testimonial-3`
- `name`: Miguel
- `age`: 27
- `city`: Sevilla
- `destination`: Maldivas
- `quote`: "Pense que Maldivas en grupo seria raro. Fue la mejor decision que he tomado."
- `rating`: 5
- `image`: sin imagen
- `source`: `trustpilot`
- `verificationStatus`: `retired`
- `externalReviewUrl`: sin valor; evidencia externa Trustpilot ausente
- `sourceProfileUrl`: sin valor; requerido para cualquier publicacion futura
- `experienceDateLabel`: pendiente
- `editorialReviewedAt`: 2026-05-14
- `editorialEvidenceRef`: `fallback:src/lib/travel-data.ts:testimonials.t4`; `seed:scripts/seed-sanity.ts:testimonial-3`; `external Trustpilot evidence missing`
- `isVisible`: false
- `featured`: false
- `sortOrder`: 4
- Decision: retirar hasta confirmar origen Trustpilot. No publicar solo con enlace general porque tampoco hay URL general aceptada.
- Nota de privacidad/consentimiento: nombre de pila, edad y ciudad grande son publicables si la reseña se confirma; no hay foto. Mantener sin apellidos.

### 5. Sara

- `fallbackId`: `t5`
- `sanitySeedId`: `testimonial-4`
- `name`: Sara
- `age`: 24
- `city`: Bilbao
- `destination`: Zanzibar
- `quote`: "Zanzibar no estaba en mi radar. Ahora es mi viaje favorito de toda la vida."
- `rating`: 5
- `image`: sin imagen
- `source`: `trustpilot`
- `verificationStatus`: `retired`
- `externalReviewUrl`: sin valor; evidencia externa Trustpilot ausente
- `sourceProfileUrl`: sin valor; requerido para cualquier publicacion futura
- `experienceDateLabel`: pendiente
- `editorialReviewedAt`: 2026-05-14
- `editorialEvidenceRef`: `fallback:src/lib/travel-data.ts:testimonials.t5`; `seed:scripts/seed-sanity.ts:testimonial-4`; `external Trustpilot evidence missing`
- `isVisible`: false
- `featured`: false
- `sortOrder`: 5
- Decision: retirar hasta confirmar origen Trustpilot. No publicar solo con enlace general porque tampoco hay URL general aceptada.
- Nota de privacidad/consentimiento: nombre de pila, edad y ciudad grande son publicables si la reseña se confirma; no hay foto. Mantener sin apellidos.

### 6. David

- `fallbackId`: `t6`
- `sanitySeedId`: `testimonial-5`
- `name`: David
- `age`: 30
- `city`: Malaga
- `destination`: Brasil
- `quote`: "Repeti con Travel Hood. La primera vez fui solo, la segunda convenci a dos amigos."
- `rating`: 5
- `image`: sin imagen
- `source`: `trustpilot`
- `verificationStatus`: `retired`
- `externalReviewUrl`: sin valor; evidencia externa Trustpilot ausente
- `sourceProfileUrl`: sin valor; requerido para cualquier publicacion futura
- `experienceDateLabel`: pendiente
- `editorialReviewedAt`: 2026-05-14
- `editorialEvidenceRef`: `fallback:src/lib/travel-data.ts:testimonials.t6`; `seed:scripts/seed-sanity.ts:testimonial-5`; `external Trustpilot evidence missing`
- `isVisible`: false
- `featured`: false
- `sortOrder`: 6
- Decision: retirar hasta confirmar origen Trustpilot. No publicar solo con enlace general porque tampoco hay URL general aceptada.
- Nota de privacidad/consentimiento: nombre de pila, edad y ciudad grande son publicables si la reseña se confirma; no hay foto. Mantener sin apellidos.

## Siguientes pasos manuales para desbloquear publicacion

1. Confirmar la URL publica exacta del perfil de Travel Hood en Trustpilot desde una sesion de navegador normal.
2. Para cada reseña que se quiera mantener, guardar una evidencia interna estable: captura fechada, ID/URL de review individual si existe, o referencia interna al hallazgo en el perfil.
3. Si solo se confirma el perfil general y no hay enlaces individuales estables, cambiar `verificationStatus` de las reseñas confirmadas a `profile-link`, rellenar `sourceProfileUrl`, `experienceDateLabel` y mantener atribucion prudente.
4. Si aparece URL individual publica y estable, cambiar `verificationStatus` a `individual-link` y rellenar `externalReviewUrl`.
5. Mantener retiradas las reseñas sin evidencia externa suficiente.
