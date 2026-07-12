---
name: growth-standards
description: "Estándar obligatorio de este proyecto: mobile-first, orientación a conversión
(CRO) y optimización para SEO y GEO (aparecer y ser citado por buscadores de IA). Úsala SIEMPRE
que se conceptualice, planifique, diseñe o implemente cualquier página, copy o flujo de cara al
usuario (landing, web, formularios, UI). Si lo que se produce lo verá un cliente final, esta
skill aplica."
---

# Growth standards (mobile-first · conversión · SEO · GEO)

Todo lo de cara al usuario se diseña PRIMERO para móvil, con la conversión como objetivo nº1, y
construido para posicionar en buscadores clásicos (SEO) y de IA (GEO).

## Mobile-first (innegociable)
- Diseña el layout para ~375px primero; el desktop es mejora progresiva, no al revés.
- CTA principal visible sin scroll y alcanzable con el pulgar (zona inferior).
- Tap targets ≥44px; nunca el hover como única vía de interacción.
- Presupuesto: LCP < 2.5s, CLS < 0.1, INP < 200ms en 4G.
- Imágenes responsivas (srcset, AVIF/WebP, lazy-load), sin layout shift.
- Body ≥16px legible sin zoom, contraste AA.

## Conversión (CRO)
- Una sola acción principal por pantalla; toda la jerarquía visual lleva a ella.
- Above the fold: propuesta de valor clara + CTA + 1 frase de qué consigue el usuario.
- Prueba social y señales de confianza (reseñas, garantías) cerca del CTA.
- Menos fricción: mínimos campos en formularios, autocompletado, nada innecesario.
- Urgencia/escasez solo si es real. Copy en voz activa que diga qué pasa al pulsar.
- Eventos de conversión y embudo instrumentados desde el día 1.

## SEO (buscadores clásicos)
- Renderizado SSR/SSG para que el contenido sea indexable.
- 1 H1 por página; H2/H3 coherentes con búsquedas reales.
- Title y meta description únicos por intención; Open Graph / Twitter cards.
- URLs limpias y semánticas; canonical; sitemap.xml y robots.txt.
- Datos estructurados schema.org según tipo (LocalBusiness, Product, FAQ, Breadcrumb...).
- Core Web Vitals en verde (se solapa con mobile-first).
- Contenido único y útil; alt en imágenes; enlazado interno con anchors descriptivos.

## GEO (buscadores de IA: ChatGPT, Perplexity, Google AI Overviews...)
- Escribe para ser EXTRAÍBLE: respuesta directa primero, desarrollo después (answer-first).
- Encabezados como preguntas reales del usuario; FAQ con respuestas autocontenidas.
- Frases declarativas con entidades claras (qué, quién, dónde, precio) citables sin ambigüedad.
- Datos estructurados (FAQPage, Product, LocalBusiness): las IAs los usan para responder.
- Autoridad y frescura: fechas visibles, consistencia de marca (entity SEO).
- Añade `llms.txt` en la raíz con resumen del sitio y enlaces clave para agentes/IA.
- HTML semántico: el contenido importante en texto, no escondido tras JS o imágenes.

## Checklist antes de dar por terminada una página/feature de cara al usuario
1. ¿Convierte bien en móvil real (no solo en el responsive del editor)?
2. ¿CTA claro above-the-fold y sin fricción?
3. ¿LCP/CLS/INP dentro de presupuesto?
4. ¿Title, meta, OG, H1 único, canonical y schema.org puestos?
5. ¿Contenido answer-first con FAQ extraíble + llms.txt?
6. ¿Eventos de conversión midiéndose?
