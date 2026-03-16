# CONCEPT: fixPages

## Diagnóstico del problema principal

### "¿Por qué `included`/`notIncluded` está en el modelo de viajes?"

Actualmente, el schema `trip.ts` en Sanity declara `included` y `notIncluded` como arrays de strings a nivel de **cada viaje individual**. Esto es un error de modelado porque:

1. **El 90% de los viajes comparten exactamente el mismo contenido.** En `travel-data.ts` se ve claramente: existe un `defaultIncluded` y `defaultNotIncluded` que se reutiliza en ~25 viajes. Solo ~5 viajes añaden extras específicos ("Japan Rail Pass", "Crucero por el Nilo", "Noche en jaima del desierto").

2. **Lo que incluye un viaje es una propiedad del DESTINO, no del viaje.** El Japan Rail Pass lo incluyen TODOS los viajes a Japón. El crucero por el Nilo lo incluyen TODOS los viajes a Egipto. Son extras del destino, no del viaje.

3. **Genera inconsistencia en las páginas.** La página `presupuesto/[slug].astro` hace `destTrips[0].included` — coge el included del primer viaje encontrado, lo cual es frágil y puede devolver datos distintos si hay varios viajes al mismo destino con diferentes listas.

4. **Duplica contenido entre modelos y páginas.** La página `como-funciona.astro` tiene su propia lista hardcoded de `includes`/`notIncludes` que es distinta (más descriptiva) que la de los trips. Dos fuentes de verdad para lo mismo.

---

## Arquitectura y Modelos — Solución óptima

### Reestructuración del campo `included`/`notIncluded`

**Mover a `destination` con herencia:**

```
destination (Sanity schema)
├── baseIncluded: string[]        ← Lo que siempre incluye Travelhood (hereda de siteSettings)
├── extraIncluded: string[]       ← Extras del destino ("Japan Rail Pass", "Crucero por el Nilo")
├── baseNotIncluded: string[]     ← Lo que nunca incluye (hereda de siteSettings)
├── extraNotIncluded: string[]    ← Extras no incluidos del destino ("Ropa térmica")
```

**Cadena de herencia:**

```
siteSettings.defaultIncluded          → Base global para TODOS los viajes
  ↓ merge
destination.extraIncluded             → Extras por destino
  ↓ merge (opcional, raro)
trip.extraIncluded                    → Override puntual por viaje (casi nunca se usa)
```

**Resultado final computed en `data-provider.ts`:**
```
trip.included = [...siteSettings.defaultIncluded, ...destination.extraIncluded, ...trip.extraIncluded]
trip.notIncluded = [...siteSettings.defaultNotIncluded, ...destination.extraNotIncluded, ...trip.extraNotIncluded]
```

### Cambios en schemas de Sanity

| Schema | Cambio |
|--------|--------|
| `siteSettings` | Añadir `defaultIncluded: string[]` y `defaultNotIncluded: string[]` |
| `destination` | Añadir `extraIncluded: string[]` y `extraNotIncluded: string[]` |
| `trip` | Renombrar `included` → `extraIncluded` (opcional, solo para overrides puntuales) |
| `trip` | Renombrar `notIncluded` → `extraNotIncluded` (opcional) |

---

## Flujos de Sistema

### 1. Resolución de included/notIncluded

```
getTrips() / mapTrip()
  → Lee siteSettings.defaultIncluded (cache global)
  → Lee destination.extraIncluded (via referencia)
  → Lee trip.extraIncluded (propio, normalmente vacío)
  → Merge: [...defaults, ...destExtras, ...tripExtras]
  → Deduplica
  → Devuelve trip.included final
```

### 2. Páginas que consumen included/notIncluded

| Página | Consumo actual | Consumo correcto |
|--------|---------------|-----------------|
| `destino/[slug].astro` → `TripDetailPage.tsx` | `trip.included` (por viaje) | `destination.included` (computed) |
| `presupuesto/[slug].astro` | `destTrips[0].included` (frágil) | `destination.included` (directo) |
| `como-funciona.astro` | Hardcoded inline | `siteSettings.defaultIncluded` |

### 3. Otros problemas de páginas detectados

#### 3.1 Overfetching masivo
Casi todas las páginas llaman `getDestinations()`, `getTrips()`, `getCountries()`, `getContinents()` cargando TODAS las entidades. Ejemplo: `destino/[slug].astro` carga TODOS los destinos, TODOS los trips, TODOS los testimonials para luego filtrar con `.find()`.

**Solución:** Usar las funciones `getBySlug` y queries específicas que ya existen pero no se usan.

#### 3.2 Duplicación de templates
Los siguientes bloques están copy-pasteados entre 6-8 páginas:
- Hero section con breadcrumb
- Trip card grid
- GEODataBlock con datos casi idénticos
- CTA final con fondo `bg-teal-deep`
- FAQ section

**Solución:** Extraer componentes Astro reutilizables:
- `HeroSection.astro` (breadcrumb + h1 + subtitle + image)
- `TripCardGrid.astro` (grid de cards de viaje)
- `CTASection.astro` (call to action final)
- `FAQSection.astro` (wrapper del ContinentFAQ con título)

#### 3.3 Resolución de precios inconsistente
La lógica `extra.promoPrice ?? trip.promoPrice ?? trip.priceFrom` se repite en 8+ sitios con variaciones sutiles. En `destinos/[slug].astro` línea 56 hace `extra.promoPrice ?? trip.promoPrice ?? trip.priceFrom`, pero en `destino/[slug].astro` línea 48 hace una cosa distinta.

**Solución:** Una función helper `resolvePrice(trip): { price, originalPrice, hasDiscount, promoLabel }`.

#### 3.4 Doble fuente de verdad promo
`getTripExtra()` viene de `destination-details.ts` (datos hardcoded extra) y compite con `trip.promoPrice` del propio modelo. Esto genera confusión sobre cuál tiene precedencia.

#### 3.5 `como-funciona.astro` desconectada del modelo
La página tiene su propia versión de "qué incluye" (más detallada y descriptiva) que no coincide con los datos del trip. Si se actualiza un include en Sanity, la página de cómo funciona no se actualiza.

---

## Edge Cases y Blind Spots

### Modelado
- **Destinos sin viajes:** `presupuesto/[slug].astro` hace `destTrips[0].included` que será `undefined` si no hay viajes activos. Ya tiene un guard (`included.length > 0`) pero es frágil.
- **Viajes al mismo destino con distinto included:** Si Japón tiene un viaje con Rail Pass y otro sin él, ¿cuál "included" gana? Con el modelo actual no hay forma de saberlo. Con la solución propuesta (extras en destino), queda claro.
- **Migración de datos:** Al mover included de trip a destination, los viajes existentes en Sanity perderían su campo. Necesita migración con script.

### Rendimiento
- **N+1 en resolución:** Si `mapTrip()` necesita leer `siteSettings` y `destination` para computar included, hay que cachear el siteSettings y hacer un join eficiente en la query GROQ.
- **Build time:** Con el overfetching actual, cada página hace 4-6 queries a Sanity. Con 20 destinos × 5 páginas derivadas = 100+ páginas, cada una con 4-6 queries = 400-600 queries en build. Hay que reducir esto.

### SEO / Contenido
- **`como-funciona.astro` hardcodeada:** Si se cambia la política de lo que incluye Travelhood (ej: dejan de incluir seguro), hay que actualizar en 3 sitios: siteSettings, travel-data.ts y como-funciona.astro. Con la solución propuesta, se actualiza en 1 sitio.
- **FAQs generadas dinámicamente:** Las FAQs de `presupuesto/[slug].astro` y `cuando-viajar-a/[slug].astro` usan `included` para generar respuestas. Si included viene del trip[0], el contenido de la FAQ depende de qué viaje salga primero.

### Seguridad / Datos
- **No hay validación de integridad:** Si un editor borra el `included` de un trip en Sanity, la UI no rompe (hay fallback a `[]`) pero la información desaparece silenciosamente.
- **Duplicación hardcoded / Sanity:** El sistema tiene `isSanityConfigured()` con fallback a `travel-data.ts`. Si Sanity está configurado, los `defaultIncluded` hardcoded se ignoran pero siguen en el código.

---

## Problema #2: El itinerario también está en el modelo de viajes

### Mismo patrón, mismo error

El campo `itinerary` en el schema `trip` tiene exactamente el mismo problema que `included`/`notIncluded`. Veamos la evidencia en los datos hardcoded:

| Destino | Viajes con itinerario | ¿Itinerarios iguales? |
|---------|----------------------|----------------------|
| **Japón** | SS 2026, Sept 2026 | NO — pero mismos lugares (Tokio, Kioto/Akihabara, Fuji/Osaka). Variaciones cosméticas. |
| **Tailandia** | SS 2026, Jul 2026, Nov 2026, FDA 2026 | NO — mismas 3 zonas (Bangkok, Norte, Islas/Sur) con descripciones ligeramente distintas. |
| **Bali** | SS 2026, Ago 2026, Sept 2026 | NO — mismos 3 bloques (Ubud, volcán/cascadas, islas) con títulos diferentes. |
| **Marruecos** | SS 2026, Mayo 2026, Oct 2026 | NO — mismo recorrido (Marrakech, interior, costa/desierto) con variaciones. |
| **Islandia** | Mayo 2026, Oct 2026 | Casi idénticos (Reikiavik, cascadas, auroras/glaciar). |
| **Zanzíbar** | Ago 2026, Sept 2026 | Casi idénticos (Stone Town, snorkel, Nungwi). |
| **Grecia** | Mayo 2026, Jun 2026 | Casi idénticos (Atenas, Santorini, Mykonos). |

**Conclusión:** El itinerario es una propiedad del **destino**, no del viaje. Cada viaje al mismo destino recorre los mismos lugares. Lo que cambia entre viajes son las fechas, precio y plazas — no la ruta.

### ¿Por qué está mal tenerlo en trip?

1. **Duplicación real:** El editor de Sanity tiene que copiar/pegar el itinerario cada vez que crea un nuevo viaje a Japón. Son los mismos 14 días con los mismos lugares.
2. **Inconsistencia silenciosa:** Los dos viajes a Japón tienen itinerarios que dicen cosas distintas ("Akihabara — Templos y barrio otaku" vs "Kioto — Templos y geishas") cuando la ruta real probablemente es la misma. El editor adapta el resumen a su gusto cada vez.
3. **Peso innecesario:** Cada trip carga su itinerario completo (con coordenadas). Si hay 30 viajes, son 30 itinerarios cuando podrían ser ~15 (uno por destino).
4. **El componente `TripDetailPage.tsx` ya lo trata como del destino:** Muestra UN solo itinerario (el del viaje seleccionado), pero el mapa y la ruta son del destino, no del viaje concreto.

### Solución para itinerary

**Mover `itinerary` al modelo `destination`:**

```
destination (Sanity schema)
├── itinerary: itineraryDay[]     ← El itinerario "base" de este destino
```

**Eliminar `itinerary` del modelo `trip`.** El viaje ya referencia a `destination`, así que hereda el itinerario automáticamente.

**Caso edge — viajes con distinta duración al mismo destino:**
- Marruecos SS (9 días) vs Marruecos Mayo (5 días) tienen itinerarios distintos porque la duración es diferente.
- **Solución:** El destino tiene el itinerario "completo" (el más largo). Los viajes cortos usan un subset. Alternativamente, se pueden tener "variantes de itinerario" en el destino:

```
destination
├── itineraryVariants: [
│     { durationDays: 9, label: "Ruta completa", days: itineraryDay[] },
│     { durationDays: 5, label: "Ruta exprés",   days: itineraryDay[] },
│   ]
```

O la opción más simple: el trip tiene un campo opcional `itineraryOverride` que solo se rellena cuando la ruta difiere del destino base.

### Cambios en schemas

| Schema | Cambio |
|--------|--------|
| `destination` | Añadir `itinerary: itineraryDay[]` (itinerario base del destino) |
| `trip` | Cambiar `itinerary` → `itineraryOverride` (opcional, solo si difiere del destino) |
| `data-provider.ts` | `mapTrip()` resuelve: `trip.itineraryOverride ?? destination.itinerary` |

---

## Resumen de la solución óptima

1. **Mover `included`/`notIncluded` base a `siteSettings`** — una única fuente de verdad global.
2. **Añadir `extraIncluded`/`extraNotIncluded` a `destination`** — extras por destino (Japan Rail Pass, etc.).
3. **Reducir `trip.included` a un override opcional** — casi nunca se usará.
4. **Mover `itinerary` a `destination`** — el itinerario es del destino, no del viaje.
5. **Reducir `trip.itinerary` a `itineraryOverride`** — solo para viajes con ruta diferente a la del destino.
6. **Crear helper `resolvePrice(trip)`** — eliminar la lógica duplicada en 8+ páginas.
7. **Extraer componentes Astro reutilizables** — eliminar copy-paste de hero/cards/CTA/FAQ.
8. **Conectar `como-funciona.astro` a siteSettings** — una fuente de verdad para "qué incluye".
9. **Optimizar data fetching** — usar queries por slug en vez de cargar todo y filtrar.
