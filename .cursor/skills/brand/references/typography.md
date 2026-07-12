# Tipografía

## Familias

| Fuente | Estado | Uso |
| --- | --- | --- |
| `DM Sans` | Implementación real en `src/styles/globals.css` como `--font-sans`. | Body, UI, párrafos, labels y navegación. |
| `Space Grotesk` | Implementación real en `src/styles/globals.css` como `--font-serif`. | H1, H2, claims y títulos con personalidad. |
| `Syne` | Definida en documento de marca, no cargada en el repo. | Títulos/display si se incorpora. |
| `Nunito` | Definida en documento de marca, no cargada en el repo. | Cuerpo/UI si se incorpora. |

No hay archivos `.woff2` en el repo aunque `globals.css` referencia `/fonts/dm-sans-*.woff2` y `/fonts/space-grotesk-*.woff2`.

## Jerarquía Recomendada

| Nivel | Implementación observada | Uso |
| --- | --- | --- |
| H1 | `font-serif text-3xl font-extrabold sm:text-5xl leading-tight text-balance` | Hero y títulos de página. |
| H2 | `font-serif text-2xl font-extrabold sm:text-3xl` | Secciones principales. |
| H3/Card title | `font-serif text-lg font-bold` o `text-xl font-bold` | Cards de destino, bloques de confianza. |
| Body | `text-sm` / `text-base leading-relaxed` | Texto corrido, descripciones y FAQs. |
| Caption/meta | `text-xs text-muted-foreground` | Fechas, precio auxiliar, atribuciones. |
| Etiqueta | `text-[10px]` a `text-[12px] font-semibold uppercase tracking-wider` | Badges, chips y microcopy. |

## Reglas

- Usa `font-sans` por defecto; `Layout.astro` aplica `font-sans antialiased` al body.
- Usa `font-serif` para impacto, no para párrafos largos.
- Mantén títulos breves y con ritmo; evita titulares corporativos largos.
- Usa `text-balance` en H1/H2 cuando el título pueda partir mal.
- No bajes body por debajo de `text-sm` en contenido importante.
- Usa `tracking-wider` solo en etiquetas cortas, no en párrafos.

## Fallback

- Fallback real en CSS: `sans-serif`.
- Fallback mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`.
- Si se migra a las fuentes del documento de marca, actualiza primero `src/styles/globals.css`, después `design-tokens.mdc` y este archivo.
