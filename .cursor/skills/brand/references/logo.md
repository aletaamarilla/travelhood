# Logo

## Assets Reales En Repo

| Archivo | Uso observado | Notas |
| --- | --- | --- |
| `public/images/logo.svg` | Logo principal usado en layout/footer y `data-logo`. | SVG 573x377, relleno `#0f3648`. |
| `public/icon.svg` | Icono/favicon SVG. | SVG 573x573 con el logo centrado, relleno `#0f3648`. |
| `public/placeholder-logo.svg` | Placeholder. | No usar como marca final. |
| `public/placeholder.svg` | Placeholder genérico. | No usar como marca final. |

No existe carpeta `public/brand/`.

## Variantes

- Principal: `public/images/logo.svg` sobre fondos claros (`background`, `card`, `sand`).
- Icono cuadrado/favicon: `public/icon.svg`.
- No hay variante oficial blanca/negativa en el repo.
- No hay versión horizontal/wordmark adicional en el repo.

## Área De Respeto

- Mantén aire alrededor del logo; no lo pegues a bordes, CTAs o textos.
- Regla provisional si no hay manual visual más específico: deja al menos la altura visual del símbolo como margen alrededor.
- No hay área de respeto oficial documentada en el repo.

## Tamaño Mínimo

- En footer el logo aparece como imagen de `h-7 w-auto`; úsalo como referencia mínima en UI.
- En favicons usa `public/icon.svg` o los favicons ya referenciados en `Layout.astro`.
- No hay tamaño mínimo oficial en px documentado en el repo.

## Fondos

- Permitido: fondos claros cálidos (`#F5F3EF`, `#FFFFFF`, `#F2E8D9`) con logo oscuro.
- Permitido con cuidado: fotos reales si hay contraste suficiente y overlay.
- Evita poner el SVG oscuro sobre `teal-deep` o fondos muy oscuros porque no existe variante blanca.

## Prohibido

- No deformes, estires ni recortes el logo.
- No cambies el color del SVG a morado, azul corporativo frío, gris apagado o pastel.
- No uses placeholders como logo final.
- No añadas sombras, biseles, contornos o efectos 3D.
- No coloques el logo sobre fondos con poco contraste.
