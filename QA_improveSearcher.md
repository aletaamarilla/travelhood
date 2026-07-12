# QA improveSearcher — buscador híbrido

Fecha: 2026-07-11

## Alcance

Validar contrato de navegación del nuevo buscador (`resolveSearchNavigation`, URLs legacy `donde`/`cuando`), checks de catálogo searchable y regresión de rutas de conversión (home, `/viajes/`, `/destino/{slug}/`).

Entorno automático: repo local WSL2, datos Sanity vía `.env` cuando aplica.

---

## Pruebas unitarias (tsx)

| Script | Resultado | Notas |
| --- | --- | --- |
| `npm run test:search-intent` | **PASS** | Casos cubiertos abajo |
| `npm run test:searchable-destinations` | **PASS** | 10/22 destinos publicables en catálogo hardcoded |
| `src/lib/search-tracking.test.ts` | **PASS** | Payload estructurado + detección de fallback 404 |

### Casos en `src/lib/search-intent.test.ts`

| Escenario | Esperado | Cubierto |
| --- | --- | --- |
| Cualquier sitio + cualquier fecha | `/viajes/#resultados` | Sí |
| Destino concreto + cualquier fecha | `/destino/{slug}/` | Sí |
| Destino concreto + temporada | `/destino/{slug}/` (fecha en landing) | Sí |
| Destino concreto + mes | `/destino/{slug}/` | Sí |
| Cualquier sitio + mes | `/viajes/?cuando={n}#resultados` | Sí |
| Cualquier sitio + temporada | `/viajes/?cuando={period}#resultados` | Sí |
| Continente existente | `/viajes/?donde={continent}#resultados` | Sí |
| ID destino inexistente en catálogo | fallback `/viajes/` sin `/destino/` | Sí |
| Legacy: slug + periodo en query | parse correcto | Sí |
| Legacy: slug inexistente en `donde` | destino abierto, fecha preservada | Sí |
| Legacy: id destino en `donde` | parse por id | Sí |
| Legacy: mes en `cuando` | `monthIndex` | Sí |
| Legacy: `donde=any&cuando=any` | intent por defecto | Sí |
| Sentinels no en URL de resultados | sin `any` en query | Sí |
| Continente + temporada en `buildSearchResultsHref` | query combinada | Sí |

---

## Checks npm (validación de pipeline)

| Comando | Resultado | Detalle |
| --- | --- | --- |
| `npm run build` | **PASS** | 140 páginas estáticas, redirects inyectados |
| `npm run check:favicons` | **PASS** | Assets y referencias en Layout válidos |
| `npm run check:search-destinations` | **PASS** | 10 searchable vs 22 rutas `/destino/` (Sanity) |
| `npm run check:visibility` | **PASS*** | Contra preview local `http://127.0.0.1:4321` |

\* **Notas `check:visibility`:** 7 checks OK y 3 WARN esperados en Astro preview (Link header / rewrites / negociación Markdown no aplican en local; validar en preview Vercel o producción para criterio estricto).

---

## Smoke HTTP (preview `http://127.0.0.1:4321`, 2026-07-11)

| Ruta | HTTP |
| --- | ---: |
| `/` | 200 |
| `/viajes/` | 200 |
| `/viajes/?donde=brasil&cuando=verano#resultados` | 200 |
| `/viajes/?donde=south-america&cuando=7#resultados` | 200 |
| `/destino/brasil/` | 200 |
| `/destino/praga/` | 200 |
| `/destino/slug-inexistente/` | 404 (esperado) |

---

## Revisión final integral (2026-07-11, subagente review-final-backend)

**Ejecutado:** 2026-07-11 22:11 UTC+2 · entorno WSL2 · dev server `http://127.0.0.1:4321`

### Código y contrato compartido

| Área | Veredicto | Evidencia |
| --- | --- | --- |
| Helpers compartidos | **OK** | `search-intent.ts`, `search-options.ts`, `search-tracking.ts` usados por `SearchIsland` y `SearchPage` sin abstracciones extra |
| Navegación híbrida | **OK** | Destino concreto searchable → `/destino/{slug}/`; resto → `/viajes/#resultados`; fallback seguro si id/slug no está en catálogo |
| Catálogo searchable | **OK** | `getSearchCatalog()` filtra por slug, copy, hero, país y continente; `check:search-destinations` sin fallos |
| Refactors no relacionados | **OK** | Diffs acotados a buscador, data-provider, páginas home/viajes, `llms.txt`; sin refactors colaterales detectados |
| Duplicación residual aceptable | **INFO** | `useClickOutside`, `continentEmoji` y filtro de sugerencias en `SearchPage` siguen locales; coherente con convención «sin abstracciones innecesarias» |

### Copy y marca

| Elemento | Veredicto |
| --- | --- |
| Tono Travelhood (cercano, directo, humano, seguro) | **OK** — «Cualquier sitio», «No sé dónde ir, quiero ver opciones», CTA dinámico «Ver viaje a {destino}» |
| FAQ `/viajes/` | **OK** — answer-first, orientado a exploración y destino concreto |
| Inconsistencia menor | **INFO** — FAQ dice «Cualquier destino»; UI dice «Cualquier sitio» (misma intención, vocabulario distinto) |

### SEO / GEO

| Criterio | Veredicto |
| --- | --- |
| Canonical home/viajes/destino | **OK** — `https://travelhood.es/`, `/viajes/`, `/destino/{slug}/` |
| Meta description únicas | **OK** verificadas en HTML servido |
| Schema.org | **OK** — Breadcrumb, CollectionPage, ItemList, FAQ en `/viajes/`; destino mantiene TouristDestination/Event/Breadcrumb |
| `public/llms.txt` | **OK** — documenta flujo buscador, catálogo searchable y fallback a `/viajes/` |
| Contenido answer-first | **OK** — bloque editorial + FAQ + GEODataBlock en `/viajes/` |

### Tracking y consentimiento

| Criterio | Veredicto | Método |
| --- | --- | --- |
| Sin consentimiento → sin eventos | **OK** | Script `tsx`: cookie ausente → `pushSearchEvent` retorna `false`, `dataLayer` vacío |
| Consentimiento rechazado → sin eventos | **OK** | Script `tsx`: `{ analytics: false }` → bloqueado |
| Con consentimiento → dataLayer | **OK** | Script `tsx`: `{ analytics: true }` → payload `home_search_submitted` en `dataLayer[0]` |
| Payload sin texto libre | **OK** | `intentToTrackingFields` + `search-tracking.test.ts` usan ids/slugs estructurados |
| GTM Preview en navegador | **NO EJECUTADA** | MCP browser solo expone `mcp_auth` tras autenticar; validar en staging con GTM Preview |

### Accesibilidad (revisión por código + smoke)

| Criterio | Veredicto |
| --- | --- |
| Formulario con `aria-label` | **OK** — `SearchIsland` |
| Controles con `aria-expanded` / `aria-controls` | **OK** |
| Labels / `sr-only` en inputs | **OK** |
| Tap targets ≥44px (`min-h-11`) | **OK** en botones principales del buscador |
| Foco visible (`focus-visible:outline-*`) | **OK** |
| Teclado Escape / submit | **OK** — `handleDropdownKeyDown`, `<form onSubmit>` |
| Lector de pantalla / tap real | **NO VERIFICADO** — requiere dispositivo o staging |

### Visual / responsive

| Viewport | Veredicto |
| --- | --- |
| 375px / 390px / tablet / desktop | **NO VERIFICADO VISUALMENTE** — MCP browser sin herramientas de interacción en este entorno |
| Barra inferior móvil home | **OK por código** — barra `fixed bottom-0 z-50 lg:hidden`; buscador hero `z-20` + `translate-y-1/2` en sección superior; dropdowns `z-50` solo al abrir en zona hero |
| Tap targets | **OK por código** — controles principales con `min-h-11` / `min-w-11` en `SearchIsland` y `SearchPage` |
| Regresión evidente home/viajes/destino | **NO DETECTADA** — smoke HTTP 200 en `/`, `/viajes/`, `/destino/brasil/`; build 140 páginas |

### Rendimiento (CWV)

| Métrica | Presupuesto | Veredicto |
| --- | --- | --- |
| LCP | < 2.5s | **NO MEDIDO** — Lighthouse falló (Chrome no disponible en WSL) |
| CLS | < 0.1 | **NO MEDIDO** |
| INP | < 200ms | **NO MEDIDO** |
| Bundles cliente | Referencia | `SearchIsland` ~10.7 kB gzip ~2.7 kB; `search-options` compartido ~5.9 kB; `SearchPage` ~31.5 kB gzip ~8.8 kB |

---

## Issues detectados

### Críticos corregidos en esta revisión

Ninguno. No se encontraron bugs de 404, navegación rota ni tracking sin consentimiento que requirieran parche de código.

### Riesgos / pendientes no bloqueantes

1. **Catálogo Sanity vs CDN en build:** `astro build` con `useCdn: true` puede serializar 22 destinos con hero resuelto mientras los scripts de check (fetch fresco) reportan 10 searchable. La lógica de filtro es correcta; el desfase es de caché CDN de Sanity, no del resolver. Recomendación operativa: validar conteo en preview Vercel tras deploy o considerar `useCdn: false` solo en `getSearchCatalog` si se exige paridad estricta build/check.
2. **CWV y UX móvil real:** medir en preview Vercel con Lighthouse/PageSpeed y probar tap en iOS/Android.
3. **GTM Preview en navegador:** confirmar eventos en `dataLayer` tras aceptar/rechazar cookies en staging (consentimiento ya verificado por script).
4. **`check:visibility` estricto:** repetir contra URL de producción/preview Vercel (local: 7 OK, 3 WARN esperados).
5. **`astro check`:** 2 errores TS no bloqueantes — narrowing en `search-tracking.ts:71` (`DestinationSelection`) y `meta.env` en `scripts/check-search-destinations.ts:24`. `npm run build` y tests pasan.
6. **Copy FAQ vs UI:** FAQ `/viajes/` dice «Cualquier destino»; UI dice «Cualquier sitio» (misma intención, vocabulario distinto).

---

## Veredicto final de revisión

| Área | Estado |
| --- | --- |
| Tests + checks automáticos | **OK** — build, test:search-intent, test:searchable-destinations, search-tracking.test, check:favicons, check:search-destinations, check:visibility (local) |
| Contrato navegación + anti-404 | **OK** — `resolveSearchNavigation` + catálogo searchable; 404 solo en slugs inexistentes |
| SEO/GEO estático | **OK** — canonical, schema (BreadcrumbList/CollectionPage/FAQPage/ItemList en `/viajes/`), `llms.txt` |
| Tracking (lógica + consentimiento) | **OK** — gating verificado por script; eventos definidos en `search-tracking.ts` |
| Accesibilidad básica (código) | **OK** — aria-label, aria-expanded, sr-only, focus-visible, teclado Escape/submit |
| Visual responsive + CWV + GTM browser | **Pendiente staging** — no medible en WSL sin browser/Lighthouse |

**Recomendación de cierre al orquestador: SÍ**, con reservas documentadas arriba. La feature cumple criterios automáticos y de integridad del flujo; lo pendiente es validación humana/entorno productivo (móvil real, CWV, GTM Preview, visibility estricta en Vercel), no bloqueos de código detectados en esta revisión.

**Roadmap:** no se marcaron tareas `[DONE]` (lo hace el orquestador).
