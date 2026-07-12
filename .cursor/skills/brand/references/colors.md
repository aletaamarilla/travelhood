# Colores

## Fuente Real

- Implementación: `src/styles/globals.css`.
- Documento de marca: `.cursor/rules/identidad-corporativa.mdc`.
- Tailwind v4 expone los tokens con `@theme inline`; usa nombres como `bg-teal-deep`, `text-coral`, `bg-sand`.

## Paleta

| Token | HEX | Cuándo usar | No usar |
| --- | --- | --- | --- |
| `teal-deep` / `primary` | `#0B2E3A` | Fondo oscuro principal, texto sobre claro, base de confianza/naturaleza. | No lo sustituyas por azul corporativo frío. |
| `teal-vivid` / `secondary` | `#0E94B0` | Highlights, links, estados activos y CTA secundarios. | No lo uses como único color dominante en toda la página. |
| `coral` / `accent` | `#E5522A` | CTAs principales, urgencia real, títulos de impacto y acentos. | No lo uses para grandes fondos de lectura prolongada. |
| `yellow-sun` | `#F0A800` | Badges, estrellas, detalles optimistas, chips pequeños. | Nunca como fondo general o bloque principal. |
| `sand` | `#F2E8D9` | Texto sobre teal, fondos cálidos puntuales, secciones de comunidad/about. | No saturar la UI con beige desaturado. |
| `background` | `#F5F3EF` | Fondo general cálido de la web. | No reemplazar por blanco puro en páginas completas salvo cards. |
| `card` | `#FFFFFF` | Cards, popovers, superficies de formularios y dropdowns. | No usar como único lenguaje visual sin acentos de marca. |
| `muted` | `#EDE7DB` | Fondos suaves de inputs, bloques secundarios. | No usar para CTAs. |
| `muted-foreground` | `#4A6B75` | Texto secundario, iconos informativos. | No usar para texto crítico o CTA. |
| `border` | `#D6CDBF` | Bordes suaves en cards y separadores. | No usar como color de texto. |
| `destructive` | `#e53e3e` | Errores/destructivo. | No usar para urgencia comercial normal. |
| WhatsApp inline | `#25D366` | Botones/enlaces de WhatsApp existentes. | No mezclarlo con CTAs que no abren WhatsApp. |

## Proporción De Marca

- 60%: `teal-deep` + blanco/gris claro/fondo cálido.
- 25%: `teal-vivid` + `sand`.
- 15%: `coral` + `yellow-sun` para impacto.

## Contraste

- Sobre `teal-deep`, usa `text-white` o `text-sand`.
- Sobre `coral`, usa `text-white`.
- Sobre `yellow-sun`, usa texto oscuro (`text-foreground` o `text-teal-deep`), no blanco.
- Sobre `background` o `card`, usa `text-foreground`; deja `muted-foreground` para metadatos.

## Modo Oscuro

- Existe `@custom-variant dark (&:is(.dark *))`, pero no hay paleta `.dark` definida en `globals.css`.
- No hay modo oscuro definido en el repo.

## Prohibido Por Marca

- Morados.
- Azules corporativos fríos.
- Grises apagados como color dominante.
- Beige desaturado que parezca bancario o institucional.
- CTAs grises, pastel o sin energía.
