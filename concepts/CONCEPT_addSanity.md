# CONCEPT: addSanity — Panel de Administración con Sanity CMS

## 1. Contexto y Decisiones de Diseño

### Problema
Todo el contenido del sistema Travelhood está hardcodeado en archivos TypeScript (`travel-data.ts`, `destination-details.ts`, `blog-data.ts`, `comparisons.ts`). Esto significa que cualquier cambio de precio, fecha, plaza disponible, artículo de blog o texto SEO requiere intervención directa en código y un deploy.

### Solución
Integrar **Sanity.io** como CMS headless. Se creará un proyecto Sanity (Studio) independiente que servirá como panel de administración. El frontend Astro consumirá los datos de Sanity en build time (SSG), manteniendo el output estático actual.

### Criterio de qué va a Sanity y qué no

| Va a Sanity (lo gestiona tu chica) | Se queda en código (lo gestionas tú) |
|---|---|
| Viajes: precios, fechas, plazas, estado, promos | Componentes, layouts, estilos CSS |
| Destinos: descripciones, highlights, clima, fotos, datos GEO | Lógica de filtros y búsqueda |
| Continentes: textos editoriales, FAQs, SEO | Schemas de structured data (schema.org) |
| Países: datos GEO (moneda, visa, idioma, zona horaria) | Configuración de Astro/Vercel/build |
| Blog: artículos completos con SEO | Brand identity (colores, tipografía) |
| Coordinadores: bio, foto, quote | Navbar, Footer, estructura de componentes |
| Testimonios: todos los campos | Animaciones y UX interactions |
| Categorías de viaje: editorial, SEO | Utilidades (cn, helpers) |
| Temporadas: editorial, FAQs, SEO | Integración de mapas (Leaflet) |
| Comparativas: destinos, veredicto y SEO | |
| Landing pages: viajar-sola, viajes-para-mujeres, etc. | |
| SEO por página: title, description, keywords, ogImage, noIndex | |
| Imágenes: hero, galerías, avatares (con alt text) | |
| FAQs: por destino, categoría, temporada, continente | |
| Datos GEO: clima por mes, presupuesto diario, visa, moneda | |

---

## 2. Arquitectura del Sistema

```
┌──────────────────┐     GROQ queries      ┌──────────────────┐
│   Sanity Studio   │ ◄──────────────────► │   Sanity Cloud    │
│  (admin panel)    │                       │   (Content Lake)  │
│  studio.travelhood│                       │                   │
└──────────────────┘                       └────────┬─────────┘
                                                     │
                                            API (GROQ/HTTP)
                                                     │
                                           ┌─────────▼─────────┐
                                           │   Astro Frontend   │
                                           │   (build time)     │
                                           │   travelhood.es    │
                                           └─────────┬─────────┘
                                                     │
                                              Webhook on publish
                                                     │
                                           ┌─────────▼─────────┐
                                           │   Vercel Deploy    │
                                           │   (rebuild SSG)    │
                                           └───────────────────┘
```

### Flujo de trabajo
1. Tu chica entra a `studio.travelhood.es` (Sanity Studio)
2. Crea/edita contenido (nuevo viaje, cambio de precio, nuevo post...)
3. Al publicar, un **webhook** dispara un rebuild en Vercel
4. El site se regenera en ~1-2 minutos con el contenido actualizado
5. El site sigue siendo **100% estático** (misma performance)

---

## 3. Modelo de Contenido — Grafo Relacional Sanity

```
                    ┌──────────────┐
                    │ siteSettings │  (singleton)
                    │──────────────│
                    │ siteName     │
                    │ siteUrl      │
                    │ orgLogo      │
                    │ priceRange   │
                    │ socialLinks  │
                    │ defaultSeo   │
                    └──────────────┘

    ┌──────────────┐        1:N        ┌──────────────┐
    │  continent   │ ◄──────────────── │   country    │
    │──────────────│                   │──────────────│
    │ name         │                   │ name         │
    │ slug         │        1:N        │ slug         │
    │ editorialInt │ ◄──────────┐      │ flag         │
    │ heroImage    │            │      │ continent ──►│
    │ bestMonths   │            │      │ currency     │
    │ faqs[]       │            │      │ language     │
    │ seo{}        │            │      │ timezone     │
    └──────────────┘            │      │ visaRequired │
                                │      │ visaInfo     │
                                │      └──────┬───────┘
    ┌──────────────┐            │             │
    │  tripCategor │            │             │ 1:N
    │──────────────│            │             ▼
    │ name         │            │      ┌──────────────┐
    │ slug         │            │      │ destination  │
    │ editorial    │            ├──────│──────────────│
    │ heroImage    │            │      │ name         │
    │ idealProfile │            │      │ slug         │
    │ faqs[]       │            │      │ country ────►│
    │ seo{}        │            │      │ continent ──►│
    └──────────────┘            │      │ description  │
                                │      │ heroImage    │
    ┌──────────────┐            │      │ gallery[]    │
    │   season     │            │      │ climate      │
    │──────────────│            │      │ climateByMon │
    │ name         │            │      │ coordinates  │
    │ slug         │            │      │ budgetPerDay │
    │ tags[]       │            │      │ faqs[]       │
    │ editorial    │            │      │ seo{}        │
    │ heroImage    │            │      └──────┬───────┘
    │ faqs[]       │            │             │
    │ seo{}        │            │             │ 1:N
    └──────────────┘            │             ▼
                                │      ┌──────────────┐       ┌──────────────┐
    ┌──────────────┐            │      │    trip      │       │ coordinator  │
    │  comparison  │            │      │──────────────│  N:1  │──────────────│
    │──────────────│            │      │ destination─►│◄──────│ name         │
    │ destinationA►│────────────┘      │ departDate   │       │ slug         │
    │ destinationB►│                   │ priceFrom    │       │ bio          │
    │ verdict      │                   │ coordinator─►│       │ quote        │
    │ seo{}        │                   │ itinerary[]  │       │ image        │
    └──────────────┘                   │ seo{}        │       └──────────────┘
                                       └──────────────┘

    ┌──────────────┐           ┌──────────────────────────────┐
    │ testimonial  │           │         blogPost             │
    │──────────────│           │──────────────────────────────│
    │ name         │           │ title, slug, sections[]      │
    │ destination─►│           │ relatedDest[]►, relatedPost[]│
    │ quote        │           │ seo{}                        │
    │ rating       │           └──────────────────────────────┘
    │ image        │
    └──────────────┘           ┌──────────────────────────────┐
                               │       landingPage            │
                               │──────────────────────────────│
                               │ slug (viajar-sola, etc.)     │
                               │ title, hero, editorial       │
                               │ faqs[], featuredDest[]►      │
                               │ seo{}                        │
                               └──────────────────────────────┘
```

---

## 4. Schemas de Sanity — Detalle por Documento (con descripciones de campo)

> **Convención:** Cada campo incluye una `description` en español que se mostrará en Sanity Studio para guiar a la editora.

---

### 4.1 `siteSettings` (singleton)

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| siteName | string | `"Nombre del sitio web. Aparece en el footer y en el schema.org."` |
| siteUrl | url | `"URL principal del sitio (ej: https://travelhood.es). No cambiar sin consultar."` |
| orgLogo | image | `"Logo principal de Travelhood. Se usa en schema.org y redes sociales."` |
| priceRange | string | `"Rango de precios que se muestra en Google (ej: '590€ - 1.590€')."` |
| contactEmail | string | `"Email de contacto principal. Se muestra en el footer."` |
| socialLinks | array of {platform, url} | `"Redes sociales de Travelhood. Cada una con plataforma (Instagram, TikTok...) y enlace."` |
| defaultSeoImage | image | `"Imagen por defecto cuando se comparte en redes sociales y no hay otra específica. Tamaño ideal: 1200x630px."` |

---

### 4.2 `continent`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Nombre del continente (ej: Europa, Asia, África). Se muestra en la web y en las URLs."` |
| slug | slug (from name) | `"Se genera automáticamente. Es la URL: /destinos/europa/. ⚠️ No cambiar después de publicar."` |
| editorialIntro | text, required | `"Texto largo editorial que describe el continente. Aparece en la página /destinos/[continente]/. Escribe en tono Travelhood: cercano, directo, inspiracional. 150-300 palabras ideal."` |
| heroImage | image, required | `"Imagen principal del continente. Se muestra como fondo del hero. Tamaño mínimo: 1920x1080px. Subir foto real, no stock."` |
| heroImageAlt | string | `"Texto alternativo de la imagen hero. Describe lo que se ve en la foto para SEO y accesibilidad (ej: 'Grupo de viajeros en las islas griegas')."` |
| bestMonths | string | `"Resumen de la mejor época por destino (ej: 'Grecia: may-sep. Laponia: dic-mar'). Se muestra en la tabla de mejores meses."` |
| faqs | array of {question, answer} | `"Preguntas frecuentes sobre este continente. Se muestran en la página del continente y generan schema FAQ en Google. Mínimo 3 preguntas."` |
| — faq.question | string | `"La pregunta tal como la haría un viajero (ej: '¿Necesito pasaporte para viajar por Europa?')."` |
| — faq.answer | text | `"Respuesta clara y directa. Sin rodeos. 2-4 líneas máximo."` |
| **seo** | object | — |
| — seo.title | string | `"Título que aparece en Google. Máximo 60 caracteres. Incluir 'Travelhood' al final (ej: 'Viajes en grupo a Europa para jóvenes | Travelhood')."` |
| — seo.description | text | `"Descripción que aparece en Google debajo del título. Máximo 155 caracteres. Incluir precio y beneficio clave."` |
| — seo.keywords | string | `"Palabras clave separadas por comas (ej: 'viajes europa jóvenes, viajes grupo europa'). Se usan para el meta keywords."` |
| — seo.ogImage | image | `"Imagen para compartir en redes sociales. Si no se pone, se usa la imagen hero. Tamaño ideal: 1200x630px."` |

---

### 4.3 `country`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Nombre del país (ej: Brasil, Japón, Marruecos)."` |
| slug | slug | `"Se genera automáticamente. URL: /pais/brasil/. ⚠️ No cambiar después de publicar."` |
| continent | reference → continent, required | `"¿A qué continente pertenece este país?"` |
| flag | string, required | `"Código ISO de 2 letras del país en MAYÚSCULAS (ej: BR, JP, MA). Se usa para mostrar la bandera."` |
| currency | string | `"Moneda local con código (ej: 'Real brasileño (BRL)'). Se muestra en las guías de presupuesto."` |
| currencyRate | string | `"Tipo de cambio aproximado respecto al euro (ej: '1€ ≈ 5,5 BRL'). Actualizar periódicamente."` |
| language | string | `"Idiomas principales del país (ej: 'Portugués'). Informativo para los viajeros."` |
| timezone | string | `"Zona horaria del país respecto a España (ej: 'GMT-3 (4h menos que España)')."` |
| visaRequired | boolean | `"¿Necesitan visado los ciudadanos españoles? Marcar Sí o No."` |
| visaInfo | text | `"Detalles sobre el visado: cómo obtenerlo, coste, duración permitida (ej: 'Visa on arrival, 35 USD, 30 días'). Dejar vacío si no necesitan visa."` |
| vaccinesRecommended | text | `"Vacunas recomendadas u obligatorias (ej: 'Hepatitis A y B recomendadas. Fiebre amarilla obligatoria si vienes de país endémico'). Dejar vacío si no aplica."` |
| seo | object | — |
| — seo.title | string | `"Título SEO para la página del país. Máx. 60 caracteres."` |
| — seo.description | text | `"Descripción SEO. Máx. 155 caracteres."` |
| — seo.keywords | string | `"Palabras clave separadas por comas."` |

---

### 4.4 `destination`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Nombre del destino (ej: Laponia, Bali, Zanzíbar). No siempre coincide con el país."` |
| slug | slug, required | `"URL del destino: /destino/bali/. ⚠️ No cambiar después de publicar."` |
| country | reference → country, required | `"¿En qué país está este destino?"` |
| continent | reference → continent, required | `"¿En qué continente? Redundante pero necesario para filtros rápidos."` |
| description | text, required | `"Descripción larga y emocional del destino. 3-5 frases en tono Travelhood. Se muestra en la página del destino."` |
| shortDescription | string, required | `"Una sola frase corta para las cards de destino (ej: 'Auroras boreales, huskies y magia bajo la nieve ártica.'). Máx. 80 caracteres."` |
| heroImage | image, required | `"Imagen principal del destino. Se muestra como fondo del hero. Mínimo 1920x1080px."` |
| heroImageAlt | string | `"Texto alternativo del hero (ej: 'Atardecer en los templos de Bali con arrozales'). Para SEO y accesibilidad."` |
| gallery | array of image | `"Galería de fotos del destino. Mínimo 6 fotos, ideal 8-10. Subir fotos reales de viajeros. Cada foto debe tener su texto alternativo (alt)."` |
| highlights | array of string | `"Lugares destacados del destino (ej: 'Tokio', 'Kioto', 'Monte Fuji'). Se muestran como chips/etiquetas."` |
| idealFor | string | `"Para quién es ideal este destino (ej: 'Amantes de la naturaleza y el ecoturismo'). Una frase."` |
| climate | string, required | `"Resumen del clima (ej: 'Tropical, 27-30°C'). Se usa en las tablas de datos y en la página 'cuándo viajar'."` |
| categories | array of string (options: playa, aventura, cultural, naturaleza, nieve) | `"Tipos de viaje que aplican a este destino. Seleccionar todas las que correspondan."` |
| **climateByMonth** | array of object (12 items) | `"Datos de clima mes a mes. Se usan en la página 'Cuándo viajar a [destino]'. Rellenar al menos los meses en los que hay viajes."` |
| — month | string (options: Ene-Dic) | `"Mes del año."` |
| — avgTemp | string | `"Temperatura media (ej: '28°C'). Si hay mucha variación, poner rango (ej: '15-25°C')."` |
| — rainfall | string | `"Nivel de lluvia: 'Baja', 'Media', 'Alta'. Orientativo."` |
| — recommendation | string (options: Ideal, Buena, Aceptable, No recomendado) | `"¿Es buen mes para visitar? 'Ideal' = mejor época. 'No recomendado' = monzón, frío extremo, etc."` |
| — note | string | `"Nota breve opcional (ej: 'Temporada de cerezos', 'Monzón', 'Gran Migración')."` |
| **budgetPerDay** | object | `"Datos de presupuesto diario en destino. Se usan en la página de presupuesto /presupuesto/[destino]/."` |
| — mealCostLow | string | `"Coste de una comida económica/callejera (ej: '1-3€')."` |
| — mealCostMid | string | `"Coste de un restaurante medio (ej: '5-10€')."` |
| — beerCost | string | `"Precio de una cerveza local (ej: '1-2€')."` |
| — dailyBudget | string | `"Presupuesto diario recomendado en destino, sin incluir el viaje (ej: '20-30€/día')."` |
| — totalExtras | string | `"Gastos extra totales estimados para todo el viaje (ej: '250-350€ para 12 días')."` |
| **coordinates** | geopoint | `"Coordenadas del centro del destino (latitud, longitud). Se usan para el mapa. Puedes buscar en Google Maps."` |
| faqs | array of {question, answer} | `"Preguntas frecuentes del destino. Se muestran en la página del destino y generan schema FAQ. Mínimo 3."` |
| — faq.question | string | `"La pregunta tal como la haría un viajero."` |
| — faq.answer | text | `"Respuesta directa, 2-4 líneas."` |
| **seo** | object | — |
| — seo.title | string | `"Título SEO de la página del destino. Máx. 60 caracteres. Incluir 'Travelhood'."` |
| — seo.description | text | `"Descripción SEO. Máx. 155 caracteres. Incluir precio y beneficio."` |
| — seo.keywords | string | `"Palabras clave separadas por comas."` |
| — seo.ogImage | image | `"Imagen para redes sociales. Si vacío, se usa el hero. 1200x630px."` |
| — seo.cuandoViajarTitle | string | `"Título SEO para la página 'Cuándo viajar a [destino]'. Máx. 60 caracteres."` |
| — seo.cuandoViajarDescription | text | `"Descripción SEO para 'Cuándo viajar'. Máx. 155 caracteres."` |
| — seo.presupuestoTitle | string | `"Título SEO para la página 'Presupuesto [destino]'. Máx. 60 caracteres."` |
| — seo.presupuestoDescription | text | `"Descripción SEO para 'Presupuesto'. Máx. 155 caracteres."` |

---

### 4.5 `trip`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| title | string, required | `"Nombre del viaje (ej: 'Japón — Semana Santa 2026'). Se muestra en cards y la página del destino."` |
| slug | slug | `"Se genera automáticamente desde el título. Se usa internamente."` |
| destination | reference → destination, required | `"¿A qué destino pertenece este viaje?"` |
| departureDate | date, required | `"Fecha de salida del viaje (ej: 2026-03-28)."` |
| returnDate | date, required | `"Fecha de vuelta."` |
| durationDays | number, required | `"Número total de días del viaje. Calcúlalo desde la fecha de salida a la de vuelta."` |
| priceFrom | number, required | `"Precio base por persona en euros, SIN vuelo (ej: 1290). No incluir el símbolo €."` |
| promoPrice | number | `"Precio con descuento, si hay promoción activa (ej: 1090). Dejar vacío si no hay promo."` |
| promoLabel | string | `"Texto de la etiqueta de promo (ej: '-15% Early Bird', 'Oferta flash'). Dejar vacío si no hay promo."` |
| flightEstimate | number, required | `"Precio estimado del vuelo ida/vuelta desde España en euros (ej: 650). Orientativo para el viajero."` |
| totalPlaces | number, required | `"Plazas totales del grupo (ej: 16). Normalmente entre 12 y 18."` |
| placesLeft | number, required | `"Plazas que quedan disponibles. ⚠️ Actualizar cuando se confirmen reservas."` |
| coordinator | reference → coordinator, required | `"¿Qué coordinador/a lleva este viaje?"` |
| status | string (options: open, almost-full, full), required | `"Estado del viaje: 'open' = plazas disponibles, 'almost-full' = últimas plazas (≤4), 'full' = completo (no se muestra en la web)."` |
| included | array of string | `"Lista de lo que incluye el viaje (ej: 'Alojamiento', 'Transporte interno', 'Coordinador Travelhood'). Un elemento por línea."` |
| notIncluded | array of string | `"Lista de lo que NO incluye (ej: 'Vuelo internacional', 'Comidas no especificadas'). Un elemento por línea."` |
| **itinerary** | array of itineraryDay | `"Itinerario día a día del viaje. Cada día con título, descripción y opcionalmente coordenadas para el mapa."` |
| — day | number | `"Número del día (1, 2, 3...)."` |
| — title | string | `"Título corto del día (ej: 'Tokio', 'Chiang Mai — naturaleza')."` |
| — description | string | `"Descripción de las actividades del día (ej: 'Templos dorados, street food y clase de cocina thai'). 1-2 frases."` |
| — lat | number | `"Latitud de la ubicación principal del día. Opcional. Para el mapa interactivo."` |
| — lng | number | `"Longitud de la ubicación. Opcional. Puedes copiarla de Google Maps."` |
| tags | array of string (options: semana-santa, puente-mayo, verano, septiembre, puente-octubre, puente-noviembre, navidad, fin-de-anio) | `"Temporadas a las que pertenece este viaje. Se usa para los filtros y las páginas de temporada."` |

---

### 4.6 `coordinator`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Nombre completo del coordinador/a (ej: 'Marta López')."` |
| slug | slug | `"Se genera automáticamente."` |
| age | number | `"Edad del coordinador/a. Se muestra en su perfil."` |
| role | string | `"Rol (ej: 'Coordinadora Senior', 'Coordinador de Aventura')."` |
| bio | text, required | `"Biografía corta del coordinador/a. 2-3 frases en tono Travelhood: cercano y personal."` |
| quote | string | `"Frase destacada del coordinador/a que lo defina (ej: 'Lo mejor de un viaje no es el destino, es con quién lo compartes.')."` |
| image | image, required | `"Foto del coordinador/a. Foto real, cercana y en acción. Mínimo 400x400px."` |
| imageAlt | string | `"Texto alternativo de la foto (ej: 'Marta López, coordinadora de Travelhood en Japón')."` |
| destinations | array of reference → destination | `"Destinos que coordina. Se muestran en su perfil."` |

---

### 4.7 `testimonial`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Solo el nombre de pila del viajero/a (ej: 'Laura'). No apellidos por privacidad."` |
| age | number, required | `"Edad del viajero/a en el momento del viaje."` |
| city | string, required | `"Ciudad de origen (ej: 'Madrid', 'Barcelona')."` |
| destination | reference → destination, required | `"¿A qué destino corresponde este testimonio?"` |
| quote | text, required | `"Testimonio del viajero/a. Debe ser textual, en primera persona (ej: 'Fui sin conocer a nadie. Volví con gente que ya considero amigos.'). Máx. 2-3 frases."` |
| rating | number (1-5), required | `"Valoración de 1 a 5 estrellas. Normalmente 5."` |
| image | image | `"Foto del viajero/a. Opcional. Si hay, usar foto real del viaje."` |
| imageAlt | string | `"Texto alternativo de la foto."` |
| featured | boolean | `"¿Mostrar este testimonio en la home? Marcar solo los mejores (3-6 máximo)."` |

---

### 4.8 `tripCategory`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Nombre de la categoría (ej: 'Aventura', 'Playa', 'Cultural', 'Naturaleza', 'Nieve')."` |
| slug | slug, required | `"URL: /tipos/aventura/. ⚠️ No cambiar."` |
| editorial | text, required | `"Texto editorial largo describiendo esta categoría de viaje. 150-250 palabras. Tono Travelhood."` |
| heroImage | image, required | `"Imagen principal de la categoría. Mínimo 1920x1080px."` |
| heroImageAlt | string | `"Texto alternativo del hero."` |
| idealProfile | text | `"Descripción del perfil de viajero ideal para esta categoría (ej: 'Viajeros activos que buscan experiencias intensas...')."` |
| faqs | array of {question, answer} | `"Preguntas frecuentes sobre esta categoría. Mínimo 3."` |
| seo | object | — |
| — seo.title | string | `"Título SEO. Máx. 60 caracteres."` |
| — seo.description | text | `"Descripción SEO. Máx. 155 caracteres."` |
| — seo.keywords | string | `"Palabras clave separadas por comas."` |

---

### 4.9 `season`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| name | string, required | `"Nombre de la temporada (ej: 'Semana Santa', 'Verano', 'Navidad')."` |
| slug | slug, required | `"URL: /temporada/verano/. ⚠️ No cambiar."` |
| tags | array of string (options) | `"Tags de viajes que pertenecen a esta temporada (ej: 'semana-santa', 'verano'). Deben coincidir con los tags de los viajes."` |
| editorial | text, required | `"Texto editorial de la temporada. 150-250 palabras. Actualizar cada año con fechas y datos actuales."` |
| heroImage | image, required | `"Imagen principal de la temporada. Mínimo 1920x1080px."` |
| heroImageAlt | string | `"Texto alternativo del hero."` |
| faqs | array of {question, answer} | `"Preguntas frecuentes sobre esta temporada. Mínimo 3. ⚠️ Actualizar fechas cada año."` |
| seo | object | — |
| — seo.title | string | `"Título SEO. ⚠️ Incluir el año (ej: 'Viajes verano 2026'). Máx. 60 caracteres."` |
| — seo.description | text | `"Descripción SEO. Máx. 155 caracteres. Incluir año y precios."` |
| — seo.keywords | string | `"Palabras clave separadas por comas."` |

---

### 4.10 `blogPost`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| title | string, required | `"Título del artículo. Debe ser atractivo y contener la keyword principal (ej: 'Viajar sola sin miedo: la guía definitiva'). Máx. 70 caracteres."` |
| slug | slug, required | `"URL del artículo: /blog/viajar-sola-sin-miedo/. Se genera desde el título. ⚠️ No cambiar después de publicar."` |
| excerpt | text, required | `"Resumen corto del artículo para las cards del blog. 1-2 frases. Máx. 160 caracteres."` |
| category | string (options: Inspiración, Destinos, Guías, Comunidad), required | `"Categoría del artículo. Se usa para filtrar en el blog."` |
| image | image, required | `"Imagen principal del artículo. Se muestra en el hero y en las cards. Mínimo 1200x630px."` |
| imageAlt | string, required | `"Texto alternativo descriptivo de la imagen (ej: 'Grupo de viajeras jóvenes en la playa de Zanzíbar')."` |
| publishedAt | datetime, required | `"Fecha y hora de publicación. Se muestra en el artículo y se usa para ordenar."` |
| updatedAt | datetime | `"Fecha de última actualización. Si se modifica el contenido, actualizar esta fecha. Google lo usa para el schema Article."` |
| readTime | string | `"Tiempo de lectura estimado (ej: '6 min'). Calcúlalo contando ~200 palabras/minuto."` |
| featured | boolean | `"¿Mostrar este artículo destacado en la página del blog? Solo marcar los 4-6 mejores."` |
| author | object | — |
| — author.name | string | `"Nombre del autor (ej: 'Travelhood')."` |
| — author.role | string | `"Rol (ej: 'Equipo editorial')."` |
| relatedDestinations | array of reference → destination | `"Destinos relacionados con el artículo. Se usan para sugerir viajes al final del post."` |
| relatedPosts | array of reference → blogPost | `"Artículos relacionados. Se muestran como sugerencias al final. Seleccionar 2-3."` |
| tags | array of string | `"Etiquetas del artículo para SEO y organización interna (ej: 'viajar sola', 'viajes en grupo'). Separar por líneas."` |
| **sections** | array of section | `"Secciones del artículo. Cada sección tiene un título (H2) y un cuerpo de texto. Añadir opcionalmente imagen y botón CTA."` |
| — section.heading | string | `"Título de la sección (H2). Incluir keywords de forma natural."` |
| — section.body | text | `"Contenido de la sección. Usar saltos de línea para párrafos. Se pueden usar • para listas. Tono Travelhood."` |
| — section.image | image | `"Imagen opcional para esta sección. Rompe la monotonía del texto."` |
| — section.imageAlt | string | `"Texto alternativo de la imagen de sección."` |
| — section.cta | object | `"Botón de llamada a la acción opcional."` |
| — section.cta.text | string | `"Texto del botón (ej: 'Ver viajes disponibles')."` |
| — section.cta.href | string | `"URL a la que lleva el botón (ej: '/viajes/', '/destino/tailandia/')."` |
| **seo** | object | — |
| — seo.metaDescription | text | `"Descripción para Google. Máx. 155 caracteres. Debe incluir la keyword y un beneficio claro."` |
| — seo.keywords | string | `"Palabras clave separadas por comas."` |
| — seo.ogImage | image | `"Imagen para redes sociales. Si vacío, se usa la imagen principal. 1200x630px."` |
| — seo.noIndex | boolean | `"¿Ocultar de Google? Solo marcar si el artículo es temporal o de prueba."` |

---

### 4.11 `comparison`

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| destinationA | reference → destination, required | `"Primer destino de la comparativa."` |
| destinationB | reference → destination, required | `"Segundo destino de la comparativa."` |
| slug | slug | `"Se genera automáticamente: tailandia-vs-bali. ⚠️ No cambiar."` |
| verdict | text, required | `"Veredicto final de la comparativa. 3-5 frases explicando cuándo elegir cada uno. Tono Travelhood: directo y útil."` |
| seo | object | — |
| — seo.title | string | `"Título SEO (ej: '¿Tailandia o Bali? — Comparativa para viajeros | Travelhood'). Máx. 60 caracteres."` |
| — seo.description | text | `"Descripción SEO. Máx. 155 caracteres."` |
| — seo.keywords | string | `"Palabras clave separadas por comas (ej: 'tailandia o bali, tailandia vs bali')."` |

---

### 4.12 `landingPage` (NUEVO — faltaba en la versión anterior)

> Para las páginas estáticas editoriales: `/viajar-sola`, `/viajes-para-mujeres`, `/como-funciona`, `/opiniones`, `/preguntas-frecuentes`, `/ofertas`.

| Campo | Tipo | `description` en Sanity Studio |
|---|---|---|
| title | string, required | `"Título interno de la landing (ej: 'Viajar sola'). Se usa para identificarla en el panel."` |
| slug | string, required, readOnly | `"Slug fijo de la página (ej: 'viajar-sola', 'viajes-para-mujeres'). ⚠️ NO CAMBIAR. Coincide con la ruta en la web."` |
| headline | string, required | `"Titular principal (H1) de la página. Se muestra en el hero."` |
| subtitle | string | `"Subtítulo bajo el H1. Una frase que refuerce el mensaje."` |
| heroImage | image, required | `"Imagen de fondo del hero. Mínimo 1920x1080px."` |
| heroImageAlt | string | `"Texto alternativo del hero."` |
| editorial | text, required | `"Texto editorial principal de la página. 200-400 palabras. Tono Travelhood."` |
| featuredDestinations | array of reference → destination | `"Destinos destacados que se muestran en esta landing. Seleccionar 3-6."` |
| faqs | array of {question, answer} | `"Preguntas frecuentes. Mínimo 3. Generan schema FAQ en Google."` |
| **stats** | array of {label, value} | `"Datos estadísticos que se muestran en bloques grandes (ej: '70%' + 'reservan solos'). 3-5 datos."` |
| — stat.label | string | `"Etiqueta del dato (ej: 'de los viajeros reservan solos')."` |
| — stat.value | string | `"Valor del dato (ej: '70%', '98%', '14')."` |
| seo | object | — |
| — seo.title | string | `"Título SEO. Máx. 60 caracteres."` |
| — seo.description | text | `"Descripción SEO. Máx. 155 caracteres."` |
| — seo.keywords | string | `"Palabras clave separadas por comas."` |
| — seo.ogImage | image | `"Imagen para redes sociales. 1200x630px."` |

---

## 5. Gaps SEO corregidos (vs. versión anterior)

| Gap | Antes | Ahora |
|---|---|---|
| `keywords` por página | Hardcodeado en cada `.astro` | Campo `seo.keywords` en cada documento |
| `ogImage` por documento | Solo en Layout props | Campo `seo.ogImage` en cada documento |
| `noIndex` | Solo en Layout, no editable | Campo `seo.noIndex` en blogPost y landingPage |
| SEO de páginas derivadas | No existía | `seo.cuandoViajarTitle`, `seo.presupuestoTitle` en destination |
| `dateModified` en blog | No existía | Campo `updatedAt` en blogPost |
| Alt text de imágenes | Generado programáticamente | Campo editable `heroImageAlt` + alt en gallery |
| SEO de comparativas | No existía | Objeto `seo` completo en comparison |
| Landing pages editoriales | Hardcodeadas en `.astro` | Nuevo tipo `landingPage` |
| Focus keywords | No existía | `seo.keywords` guía la redacción |

---

## 6. Gaps GEO corregidos (vs. versión anterior)

| Gap | Antes | Ahora |
|---|---|---|
| Clima por mes | Solo `climate` (string genérico) | `climateByMonth[]` con temp, lluvia, recomendación |
| Datos de visa | Hardcodeado en FAQs | Campos `visaRequired`, `visaInfo` en country |
| Moneda y cambio | Hardcodeado en blog posts | Campos `currency`, `currencyRate` en country |
| Idioma del país | No existía | Campo `language` en country |
| Zona horaria | No existía | Campo `timezone` en country |
| Vacunas | Hardcodeado en FAQs | Campo `vaccinesRecommended` en country |
| Presupuesto diario | Calculado de trips | `budgetPerDay{}` con costes desglosados en destination |
| Coordenadas del destino | Solo en itinerario | `coordinates` (geopoint) en destination |
| Coordenadas del itinerario | Mapa separado en `destination-details.ts` | Integrado en `trip.itinerary[].lat/lng` |

---

## 7. Flujos del Sistema

### 7.1 Flujo de Publicación
```
Tu chica edita en Sanity Studio
        │
        ▼
Sanity valida campos obligatorios
        │
        ▼
Click en "Publish"
        │
        ▼
Sanity webhook → Vercel Deploy Hook
        │
        ▼
Vercel ejecuta `astro build`
        │
        ▼
Build consume datos de Sanity via GROQ
        │
        ▼
Site estático actualizado (~1-2 min)
```

### 7.2 Flujo de Nuevo Viaje
```
1. Verificar que el destino existe (si no, crearlo primero)
2. Verificar que el país y continente existen
3. Crear trip → vincular destino + coordinador
4. Rellenar: fechas, precio, plazas, itinerario
5. Asignar tags de temporada
6. Publicar → rebuild automático
```

### 7.3 Flujo de Gestión de Plazas
```
1. Buscar trip en Sanity Studio (por título)
2. Cambiar `placesLeft` y `status`
3. Publicar → el site refleja el cambio (~1 min)
```

### 7.4 Flujo de Nuevo Post de Blog
```
1. Crear blogPost
2. Rellenar título, slug, excerpt, categoría
3. Subir imagen hero + alt text
4. Escribir secciones (H2 + cuerpo + imagen/CTA opcionales)
5. Rellenar SEO: metaDescription, keywords
6. Vincular destinos y posts relacionados
7. Marcar como featured si aplica
8. Publicar → nuevo artículo disponible
```

---

## 8. Integración Técnica con Astro

### 8.1 Estructura del Proyecto
```
travelhoodsystem/
├── studio/                    ← Sanity Studio (nuevo)
│   ├── schemas/
│   │   ├── continent.ts
│   │   ├── country.ts
│   │   ├── destination.ts
│   │   ├── trip.ts
│   │   ├── coordinator.ts
│   │   ├── testimonial.ts
│   │   ├── tripCategory.ts
│   │   ├── season.ts
│   │   ├── blogPost.ts
│   │   ├── comparison.ts
│   │   ├── landingPage.ts
│   │   └── siteSettings.ts
│   ├── sanity.config.ts
│   └── sanity.cli.ts
├── src/
│   ├── lib/
│   │   ├── sanity.ts          ← Cliente Sanity + queries GROQ (nuevo)
│   │   ├── travel-data.ts     ← Se mantiene como FALLBACK, luego se elimina
│   │   ├── schemas.ts         ← Se mantiene (schema.org, no Sanity)
│   │   └── utils.ts           ← Se mantiene
│   ├── pages/                 ← Se adaptan para consumir de Sanity
│   └── components/            ← Mínimos cambios (solo tipos de datos)
```

### 8.2 Variables de Entorno
```
SANITY_PROJECT_ID=xxxxx
SANITY_DATASET=production
SANITY_API_VERSION=2026-03-16
```

---

## 9. Edge Cases y Blind Spots

### 9.1 Slugs y URLs
- **Riesgo:** Si cambia un slug, se rompe la URL antigua y el SEO acumulado.
- **Solución:** Slugs `readOnly` una vez publicados + aviso visual en Sanity.

### 9.2 Consistencia Relacional
- **Riesgo:** Borrar un destino que tiene trips vinculados.
- **Solución:** Validación custom en Sanity que impida borrar con referencias activas.

### 9.3 Imágenes sin Alt Text
- **Riesgo:** Subir imagen sin texto alternativo = penalización SEO.
- **Solución:** Validación en Sanity que marque `alt` como requerido en gallery.

### 9.4 SEO Titles demasiado largos
- **Riesgo:** Titles >60 chars se cortan en Google.
- **Solución:** Validación `max: 60` en campos seo.title + contador visual.

### 9.5 Datos de temporada desactualizados
- **Riesgo:** Textos editoriales de temporadas con año antiguo (ej: "Semana Santa 2025").
- **Solución:** Incluir recordatorio en la `description` del campo: "⚠️ Actualizar fechas cada año."

### 9.6 Coordenadas incorrectas
- **Riesgo:** Lat/lng incorrectos desplazan el mapa.
- **Solución:** Usar el tipo `geopoint` nativo de Sanity que muestra un mapa interactivo para seleccionar el punto.

### 9.7 Costes de Sanity
- **Free tier:** 3 usuarios, 500k API requests/mes, 10GB assets. Más que suficiente.

### 9.8 Rich Text vs Plain Text
- **Decisión:** Usar `text` plain para casi todo. Si en el futuro se necesita formato (negritas, listas), migrar campos puntuales a `blockContent`.

---

## 10. UX del Panel para tu Chica

### Organización del Studio
```
📁 Contenido Principal
  ├── 🌍 Continentes
  ├── 🏳️ Países  
  ├── 📍 Destinos
  └── ✈️ Viajes (trips)

📁 Catálogo
  ├── 🏷️ Categorías de viaje
  ├── 📅 Temporadas
  └── 🔄 Comparativas

📁 Comunidad
  ├── 👤 Coordinadores
  └── ⭐ Testimonios

📁 Blog
  └── 📝 Artículos

📁 Páginas
  └── 📄 Landings (viajar-sola, mujeres, etc.)

⚙️ Configuración del sitio
```

### Facilidades
- Todos los campos tienen `description` en español explicando qué es y cómo rellenarlo
- Validaciones: campos obligatorios, rangos, máximos de caracteres
- Contadores de caracteres en campos SEO (title ≤ 60, description ≤ 155)
- Vista previa del slug/URL que se generará
- Fieldsets agrupados: "SEO", "Precios", "Itinerario", "Datos GEO"
- Orden lógico: lo importante primero, lo técnico al final
- Tipo `geopoint` con mapa interactivo para coordenadas

---

## 11. Resumen de Documentos

| Tipo | Cantidad Actual | Frecuencia de Cambio | Campos Clave Nuevos |
|---|---|---|---|
| siteSettings | 1 | Muy baja | — |
| continent | 6 | Baja | seo{} |
| country | 25 | Baja | currency, visa, vaccines, timezone |
| destination | 25 | Media | climateByMonth[], budgetPerDay{}, coordinates, seo derivados |
| trip | ~35 | **Alta** | — (ya estaba completo) |
| coordinator | 2 | Baja | imageAlt |
| testimonial | 6+ | Media | featured |
| tripCategory | 5 | Baja | seo{} |
| season | 6 | Media | seo{} |
| blogPost | 22+ | **Alta** | updatedAt, seo.noIndex, seo.ogImage |
| comparison | 7 | Baja | seo{} |
| landingPage | ~6 | Media | stats[], featuredDestinations |
