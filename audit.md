# Auditoría Travelhood — Hoja de ruta accionable

> Este documento es tu checklist maestra. Cada tarea tiene prioridad, dificultad, y el prompt sugerido para pedírselo a la IA.
> Ve marcando `[x]` cada tarea que completes.

---

## Estado actual: 6.5/10

| Área | Nota | Resumen |
|------|------|---------|
| SEO Técnico | 9/10 | Schema markup excepcional, meta tags completos, sitemap, canonical |
| SEO On-Page | 8/10 | URLs semánticas, breadcrumbs, internal linking |
| SEO Contenido | 6/10 | Falta volumen de blog, profundidad en comparaciones |
| SEO Off-Page | 0/10 | Sin backlinks, sin PR, sin menciones |
| Conversión | 4/10 | Sin pagos, sin formulario de reserva, LeadMagnet roto |
| Legal | 1/10 | Sin aviso legal, sin privacidad, sin cookies banner |
| Infraestructura | 8/10 | Astro + Sanity + Vercel excelente, sin backend ni analytics |
| Competitividad | 5/10 | Mejor schema que Weroad, pero sin motor de ventas |

---

## FASE 0 — LEGAL (Prioridad: BLOQUEANTE)

> Sin esto no puedes operar legalmente. Riesgo de multas RGPD de hasta 20M€.
> Tiempo estimado: 1-2 días.

### Archivos a crear / modificar

- [ ] **0.1 — Poner número de WhatsApp REAL en toda la web**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Fácil`
  - Archivos: `src/pages/index.astro`, `src/components/TripDetailPage.tsx`, `src/pages/blog/[slug].astro`
  - Prompt: *"Busca todas las ocurrencias de `34600000000` en el proyecto y sustitúyelas por mi número real: 34XXXXXXXXX"*

- [ ] **0.2 — Crear página de Aviso Legal**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Fácil`
  - Archivo a crear: `src/pages/aviso-legal.astro`
  - Contenido: Razón social, CIF, domicilio, email, número de licencia de agencia de viajes (CICL/CICMA)
  - Prompt: *"Crea una página /aviso-legal/ con los datos fiscales de mi empresa: [NOMBRE], CIF [X], domicilio [X], licencia agencia [X]. Usa el Layout y Navbar existentes."*

- [ ] **0.3 — Crear Política de Privacidad**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Fácil`
  - Archivo a crear: `src/pages/politica-privacidad.astro`
  - Prompt: *"Crea una política de privacidad RGPD para travelhood.es. Recogemos emails via LeadMagnet, WhatsApp como canal de contacto. Hosting en Vercel (EEUU), CMS Sanity (Noruega)."*

- [ ] **0.4 — Crear Política de Cookies + Banner**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Media`
  - Archivos: `src/pages/politica-cookies.astro` (nuevo), `src/layouts/Layout.astro` (añadir banner)
  - Prompt: *"Crea una política de cookies y un banner de consentimiento RGPD. De momento solo usamos cookies técnicas. Prepara el banner para poder añadir Google Analytics y Meta Pixel después."*

- [ ] **0.5 — Crear Condiciones de Contratación**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Media`
  - Archivo a crear: `src/pages/condiciones.astro`
  - Prompt: *"Crea las condiciones generales de contratación para una agencia de viajes combinados según la Ley española. Incluir política de cancelación (100% con 30 días, 50% con 15 días, etc)."*

- [ ] **0.6 — Añadir enlaces legales al Footer**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Fácil`
  - Archivo: `src/components/Footer.astro`
  - Prompt: *"Añade al footer enlaces a /aviso-legal/, /politica-privacidad/, /politica-cookies/ y /condiciones/. Muestra también el número de licencia de agencia y el CIF."*

---

## FASE 1 — ANALYTICS Y TRACKING (Prioridad: CRÍTICA)

> Sin datos no puedes optimizar nada. Implementar ANTES del sistema de pagos.
> Tiempo estimado: 1 día.

- [ ] **1.1 — Google Analytics 4**
  - Prioridad: `🔴 CRÍTICA`
  - Dificultad: `Fácil`
  - Archivo: `src/layouts/Layout.astro`
  - Previo: Crear cuenta en analytics.google.com, obtener el Measurement ID (G-XXXXXXX)
  - Prompt: *"Añade el script de Google Analytics 4 con ID G-XXXXXXX al Layout. Debe cargarse solo si el usuario acepta cookies (integrar con el banner de cookies de la tarea 0.4)."*

- [ ] **1.2 — Google Search Console**
  - Prioridad: `🔴 CRÍTICA`
  - Dificultad: `Fácil`
  - Archivo: `src/layouts/Layout.astro`
  - Previo: Verificar dominio en search.google.com/search-console
  - Prompt: *"Añade la meta tag de verificación de Google Search Console al head del Layout."*

- [ ] **1.3 — Meta Pixel (Facebook/Instagram)**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Archivo: `src/layouts/Layout.astro`
  - Previo: Crear pixel en business.facebook.com
  - Prompt: *"Añade el Meta Pixel con ID XXXXXXX al Layout. Debe respetar el consentimiento de cookies."*

- [ ] **1.4 — Eventos de conversión**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Archivos: `src/components/TripDetailPage.tsx`, `src/components/LeadMagnet.tsx`, `src/components/SearchIsland.tsx`
  - Prompt: *"Añade eventos de Google Analytics en: click en 'Reservar' (event: begin_checkout), click en WhatsApp (event: contact), envío de email en LeadMagnet (event: generate_lead), y búsqueda en SearchIsland (event: search)."*

- [ ] **1.5 — Crear robots.txt**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Archivo a crear: `public/robots.txt`
  - Prompt: *"Crea un robots.txt para travelhood.es. Permitir todo excepto /studio/. Añadir referencia al sitemap.xml."*

---

## FASE 2 — LEAD MAGNET FUNCIONAL (Prioridad: CRÍTICA)

> Cada día que pasa, los emails que recoge el formulario se pierden al vacío.
> Tiempo estimado: 2-3 horas.

- [ ] **2.1 — Elegir servicio de email marketing**
  - Prioridad: `🔴 CRÍTICA`
  - Dificultad: `Decisión`
  - Opciones recomendadas:
    - **Brevo** (gratis hasta 300 emails/día) — recomendado para empezar
    - **Resend** (gratis hasta 3000 emails/mes) — más developer-friendly
    - **Mailchimp** (gratis hasta 500 contactos) — más conocido
  - Acción: Crear cuenta y obtener API key

- [ ] **2.2 — Crear endpoint API para recoger emails**
  - Prioridad: `🔴 CRÍTICA`
  - Dificultad: `Media`
  - Cambio necesario: Pasar Astro de `output: 'static'` a `output: 'hybrid'` o crear Vercel Function
  - Prompt: *"Crea un endpoint API en /api/subscribe que reciba un email por POST, lo valide, y lo guarde en Brevo/Resend usando su API. Devuelve JSON con éxito o error."*

- [ ] **2.3 — Conectar LeadMagnet.tsx al endpoint**
  - Prioridad: `🔴 CRÍTICA`
  - Dificultad: `Fácil`
  - Archivo: `src/components/LeadMagnet.tsx`
  - Prompt: *"Modifica el handleSubmit del LeadMagnet para que haga un fetch POST a /api/subscribe con el email. Muestra loading state, éxito, y error. Dispara evento GA4 generate_lead en éxito."*

- [ ] **2.4 — Conectar formulario de newsletter del blog**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Archivo: `src/pages/blog/[slug].astro`
  - Prompt: *"El formulario de newsletter del sidebar del blog no tiene acción. Conéctalo al mismo endpoint /api/subscribe."*

- [ ] **2.5 — Crear secuencia de bienvenida (en Brevo/Resend)**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Esto es fuera del código, en el panel de Brevo/Resend
  - Emails sugeridos:
    1. Bienvenida + top 3 destinos (inmediato)
    2. "Cómo funciona Travelhood" + testimonios (día 2)
    3. "Los 5 destinos más pedidos" (día 5)
    4. Oferta exclusiva o early bird (día 7)
    5. "Última oportunidad" + escasez (día 14)

---

## FASE 3 — SISTEMA DE RESERVAS (Prioridad: BLOQUEANTE para revenue)

> Este es el "motor" que falta. Sin esto, la web no puede vender.
> Tiempo estimado: 1-2 semanas.

- [ ] **3.1 — Elegir arquitectura de backend**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Decisión`
  - Opciones:
    - **Supabase** (Postgres + Auth + Funciones) — recomendado, gratis para empezar
    - **Vercel Functions + Stripe** — más simple, sin base de datos propia
    - **PocketBase** — self-hosted, simple
  - Prompt para decidir: *"Necesito un backend para gestionar reservas de viajes. Cada reserva tiene: viaje_id, nombre, email, teléfono, señal pagada (200€), estado (pendiente/confirmada/cancelada). ¿Qué me recomiendas entre Supabase y Vercel Functions+Stripe?"*

- [ ] **3.2 — Integrar Stripe como pasarela de pago**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Alta`
  - Previo: Crear cuenta en stripe.com, obtener API keys
  - Prompt: *"Integra Stripe Checkout en el proyecto. Cuando un usuario clicke 'Reservar' en un viaje, debe abrir Stripe Checkout con el precio de la señal (200€), el nombre del viaje, y redirigir a una página de éxito."*

- [ ] **3.3 — Crear formulario de reserva**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Alta`
  - Archivos: nuevo componente `src/components/BookingForm.tsx`, modificar `TripDetailPage.tsx`
  - Prompt: *"Crea un modal de reserva que se abra al clickar 'Reservar'. Campos: nombre completo, email, teléfono, fecha de nacimiento, comentarios. Al enviar, crea la sesión de Stripe Checkout con los datos."*

- [ ] **3.4 — Página de confirmación de reserva**
  - Prioridad: `🔴 BLOQUEANTE`
  - Dificultad: `Media`
  - Archivo a crear: `src/pages/reserva-confirmada.astro`
  - Prompt: *"Crea una página de confirmación de reserva que se muestre tras el pago exitoso de Stripe. Muestra los datos del viaje, número de reserva, y próximos pasos."*

- [ ] **3.5 — Emails transaccionales**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Prompt: *"Tras una reserva exitosa, envía un email de confirmación al viajero con: datos del viaje, fecha, qué incluye, y un PDF adjunto si existe. Usa Resend/Brevo."*

- [ ] **3.6 — Webhook de Stripe para actualizar estado**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Alta`
  - Prompt: *"Crea un webhook de Stripe en /api/webhook/stripe que reciba eventos de pago completado y actualice el estado de la reserva. Si se usa Supabase, actualiza la fila. Además, actualiza placesLeft en Sanity."*

---

## FASE 4 — SEO QUICK WINS (Prioridad: ALTA)

> Mejoras pequeñas con gran impacto en posicionamiento.
> Tiempo estimado: 1-2 horas cada una.

- [ ] **4.1 — Preconnect a Sanity CDN**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Archivo: `src/layouts/Layout.astro`
  - Prompt: *"Añade `<link rel='preconnect' href='https://cdn.sanity.io'>` al head del Layout."*

- [ ] **4.2 — Meta author en Layout**
  - Prioridad: `🟢 BAJA`
  - Dificultad: `Fácil`
  - Archivo: `src/layouts/Layout.astro`
  - Prompt: *"Añade `<meta name='author' content='Travelhood'>` al head."*

- [ ] **4.3 — Schema Review individual en testimonios**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Archivo: `src/pages/destino/[slug].astro`
  - Prompt: *"Añade schema Review individual para cada testimonio del destino, además del AggregateRating existente. Cada Review debe tener author, reviewRating, y reviewBody."*

- [ ] **4.4 — Blog tags como enlaces a tag pages**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Archivos: `src/pages/blog/[slug].astro` (cambiar `<span>` por `<a>`), crear `src/pages/blog/tag/[tag].astro`
  - Prompt: *"Convierte los tags del blog de `<span>` a `<a href='/blog/tag/[tag]/'>`. Crea la página dinámica /blog/tag/[tag]/ que liste todos los posts con ese tag."*

- [ ] **4.5 — Imágenes con width/height explícitos**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Archivos: `src/components/SearchIsland.tsx`, `src/components/TripDetailPage.tsx`
  - Prompt: *"Busca todas las `<img>` que no tengan width y height explícitos y añádelos para evitar CLS. Usa width='800' height='600' como valores por defecto para fotos de destinos."*

- [ ] **4.6 — OG image con dimensiones**
  - Prioridad: `🟢 BAJA`
  - Dificultad: `Fácil`
  - Archivo: `src/layouts/Layout.astro`
  - Prompt: *"Añade `og:image:width` (1200) y `og:image:height` (630) como meta tags junto al og:image existente."*

---

## FASE 5 — TRUST Y PRUEBA SOCIAL (Prioridad: ALTA)

> La confianza convierte más que cualquier descuento.
> Tiempo estimado: variable.

- [ ] **5.1 — Google Business Profile**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil (fuera del código)`
  - Acción: Crear perfil en business.google.com, pedir reviews a viajeros reales
  - Impacto: Rich snippets con estrellas en resultados de Google

- [ ] **5.2 — Integrar widget de Trustpilot o Google Reviews**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Archivo: `src/components/TestimonialsSection.astro` o nuevo componente
  - Prompt: *"Integra el widget de Trustpilot/Google Reviews en la sección de testimonios de la home. Muestra la nota media y el número total de reviews."*

- [ ] **5.3 — Mostrar logos de confianza**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Archivo: `src/components/TrustSection.astro` o Footer
  - Prompt: *"Añade una barra de confianza con logos: 'Agencia registrada CICMA-XXXX', 'Seguro de viaje incluido', 'Pago seguro con Stripe', '+500 viajeros'. Estilo discreto, en el footer o encima del footer."*

- [ ] **5.4 — Contador de viajeros en tiempo real**
  - Prioridad: `🟢 BAJA`
  - Dificultad: `Media`
  - Prompt: *"Añade un contador animado en la home que muestre '+500 viajeros han viajado con nosotros'. El número debe venir de un campo en Sanity SiteSettings para que sea actualizable."*

---

## FASE 6 — CONTENIDO SEO (Prioridad: MEDIA-ALTA)

> El contenido es el combustible del SEO orgánico. Sin volumen no hay tráfico.
> Esfuerzo continuo.

- [ ] **6.1 — Calendario editorial de blog**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Decisión`
  - Objetivo: 2-3 artículos/semana
  - Categorías sugeridas:
    - Guías de destino ("Guía completa para viajar a Tailandia en 2026")
    - Listas ("10 destinos baratos para jóvenes en verano")
    - Experiencias ("Mi primer viaje sola: de miedo a repetir")
    - Prácticos ("Qué meter en la maleta para un viaje a Asia")
    - Comparativas ("Bali vs Tailandia: ¿cuál elegir?")

- [ ] **6.2 — Enriquecer comparaciones con contenido editorial**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Archivos: `src/pages/comparar/[slug].astro`, contenido en Sanity
  - Prompt: *"Las páginas de comparación /comparar/ solo muestran datos. Añade un bloque de texto editorial (almacenado en el campo verdict de Sanity) con 500-800 palabras comparando ambos destinos."*

- [ ] **6.3 — Crear páginas de cuándo-viajar con contenido profundo**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Archivo: `src/pages/cuando-viajar-a/[slug].astro`
  - Prompt: *"Asegúrate de que cada página /cuando-viajar-a/[slug]/ tenga al menos 800 palabras de contenido editorial sobre el clima, mejor época, y datos mes a mes del destino."*

- [ ] **6.4 — Crear landing pages para keywords long-tail**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Media`
  - Keywords objetivo:
    - "viajes en grupo para solteros"
    - "viajes organizados para jóvenes baratos"
    - "viajes en grupo semana santa 2026"
    - "viajar sola a tailandia"
    - "viajes aventura 20 30 años"
  - Prompt: *"Crea una landing page en Sanity (tipo landingPage) para la keyword '[KEYWORD]'. Usa el schema existente con headline, subtitle, editorial, stats, faqs, y featuredDestinations."*

---

## FASE 7 — PERFORMANCE Y TÉCNICO (Prioridad: MEDIA)

> Optimizaciones que mejoran velocidad y estabilidad.
> Tiempo estimado: 1-2 días.

- [ ] **7.1 — Sentry para monitoreo de errores**
  - Prioridad: `🟡 ALTA`
  - Dificultad: `Fácil`
  - Prompt: *"Integra Sentry en el proyecto Astro para capturar errores de JavaScript en producción."*

- [ ] **7.2 — Activar Sanity CDN**
  - Prioridad: `🟢 BAJA`
  - Dificultad: `Fácil`
  - Archivo: `src/lib/sanity.ts`
  - Prompt: *"Cambia useCdn a true en el cliente de Sanity. Como el sitio es estático, los datos se obtienen en build time y el CDN es más rápido."*

- [ ] **7.3 — Implementar ISR cuando crezca el catálogo**
  - Prioridad: `🟢 BAJA (futuro)`
  - Dificultad: `Alta`
  - Cuándo: Cuando tengas 50+ destinos y el build supere los 5 minutos
  - Prompt: *"Migra las páginas dinámicas (/destino/[slug], /blog/[slug]) a output hybrid con ISR de 1 hora para que no tengas que hacer full rebuild cada vez."*

- [ ] **7.4 — CSP Headers en Vercel**
  - Prioridad: `🟢 BAJA`
  - Dificultad: `Media`
  - Archivo a crear: `vercel.json`
  - Prompt: *"Configura Content Security Policy headers en vercel.json para prevenir XSS. Permitir scripts de GA, Meta, Stripe, y Sanity CDN."*

---

## FASE 8 — ESCALA Y DOMINIO (Prioridad: FUTURO)

> Features para cuando ya estés facturando y quieras dominar el mercado.

- [ ] **8.1 — Programa de referidos**
  - "Invita a un amigo, ambos recibís 50€ de descuento"
  - Requiere: sistema de códigos, tracking, aplicación en checkout

- [ ] **8.2 — Cuenta de usuario**
  - Historial de viajes, favoritos, alertas de precio
  - Requiere: auth (Supabase Auth, Clerk, o NextAuth)

- [ ] **8.3 — Multi-idioma (inglés)**
  - Captar turismo europeo que busca "group trips for young adults"
  - Requiere: i18n en Astro, contenido traducido en Sanity

- [ ] **8.4 — Upsells en checkout**
  - Seguro premium, pack de fotos, actividades extra
  - Requiere: Stripe con line items múltiples

- [ ] **8.5 — App PWA**
  - Service worker, push notifications, offline access
  - Requiere: manifest.json, service worker

- [ ] **8.6 — A/B testing**
  - Testear variantes de CTAs, precios, landing pages
  - Opciones: Vercel Edge Config, PostHog, Google Optimize

---

## CÓMO USAR ESTE DOCUMENTO

### Para trabajar con IA (Cursor, ChatGPT, etc.)

1. Elige una tarea de la fase más prioritaria que tengas pendiente
2. Copia el **prompt sugerido** y pégalo en el chat
3. Completa los datos que estén entre corchetes `[X]`
4. Revisa el resultado y marca la tarea como `[x]`
5. Pasa a la siguiente

### Orden de ejecución recomendado

```
FASE 0 (Legal)          → HAZ ESTO PRIMERO. Sin esto, riesgo legal.
FASE 1 (Analytics)      → Segundo. Sin datos, todo es ciego.
FASE 2 (Lead Magnet)    → Tercero. Cada día pierdes leads.
FASE 3 (Reservas)       → Cuarto. El "motor" de revenue.
FASE 4-5 (SEO + Trust)  → En paralelo con Fase 3.
FASE 6 (Contenido)      → Continuo, empieza cuando puedas.
FASE 7-8 (Técnico)      → Cuando todo lo anterior funcione.
```

### Métricas para saber si vas bien

| Métrica | Antes | Objetivo 3 meses | Objetivo 6 meses |
|---------|-------|-------------------|-------------------|
| Tráfico orgánico | ? (sin analytics) | 5.000 visitas/mes | 20.000 visitas/mes |
| Tasa de conversión | 0% (sin pagos) | 1-2% | 3-5% |
| Emails capturados | 0 (formulario roto) | 500 | 2.000 |
| Reservas/mes | 0 (sin sistema) | 20-30 | 80-100 |
| Revenue mensual | 0€ | 15.000-30.000€ | 80.000-150.000€ |
| Posiciones top 10 | ? | 50 keywords | 200 keywords |

---

*Última actualización: Marzo 2026*
*Generado por auditoría completa del código fuente de travelhood.es*
