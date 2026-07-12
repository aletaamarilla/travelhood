# Travelhood AI Context

## Producto
Travelhood es una web de viajes en grupo para jóvenes de 20-35 años en España que quieren lanzarse a viajar aunque no tengan compañía.

## Stack
Astro 5 estático + React 19 islands + Tailwind CSS v4 en `src/styles/globals.css` + Sanity CMS/Studio + Vercel.

## Convenciones duras
- Usa imports `@/` hacia `src/*` y TypeScript estricto (`astro/tsconfigs/strict`).
- Prioriza `.astro` para páginas/secciones estáticas y React `.tsx` solo para islands con estado/interacción (`client:*`).
- Obtén datos vía `src/lib/data-provider.ts`: Sanity si está configurado y fallback hardcoded si no.
- Los route handlers exportan `GET`, devuelven `Response` con `Content-Type` y, si aplica, `Cache-Control`.

## Esencia de marca
- Primario: `#0B2E3A`; fuente real en web: `DM Sans` para cuerpo y `Space Grotesk` como `font-serif`.
- Tono: cercano, directo, humano, seguro e inspiracional.
- Prohibido: tono corporativo/premium, stock frío o genérico, CTAs grises/pastel.
- Estándar de proyecto: mobile-first · conversión primero · SEO + GEO. Detalle en skill `growth-standards`.

## Índice
- Marca/copy/UI con peso de marca: lee `.cursor/skills/brand/SKILL.md`.
- Dominio, datos y flujos de negocio: lee `.cursor/skills/domain/SKILL.md`.
- UI: `.cursor/rules/design-tokens.mdc` y `.cursor/rules/frontend.mdc`.
- Endpoints/webhooks/validación: `.cursor/rules/api.mdc`.
- Pipeline: `npm run build`, `npm run check:visibility`, `npm run check:favicons`; Sanity seed con `npm run seed`.
