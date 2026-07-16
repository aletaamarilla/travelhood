/**
 * Upload cookie policy to Sanity as legalPage document.
 * Usage: npx tsx scripts/upload-cookie-policy.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_TOKEN

if (!projectId || projectId === 'YOUR_PROJECT_ID') {
  console.error('❌ Set SANITY_PROJECT_ID in .env first')
  process.exit(1)
}
if (!token) {
  console.error('❌ Set SANITY_TOKEN in .env (need write permissions)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2026-04-07',
  token,
  useCdn: false,
})

function makeKey() {
  return Math.random().toString(36).slice(2, 10)
}

function block(style: string, text: string) {
  return {
    _type: 'block' as const,
    _key: makeKey(),
    style,
    children: [{ _type: 'span' as const, _key: makeKey(), text, marks: [] as string[] }],
    markDefs: [],
  }
}

function bullet(text: string, level = 1) {
  return { ...block('normal', text), listItem: 'bullet' as const, level }
}

const body = [
  block('h2', '1. ¿Qué son las cookies?'),
  block('normal', 'Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador cuando los visitas. Se utilizan para recordar tus preferencias, analizar cómo usas el sitio y, en algunos casos, personalizar la publicidad que ves.'),
  block('normal', 'Las cookies no pueden dañar tu dispositivo ni acceder a otros datos almacenados en él.'),

  block('h2', '2. ¿Quién es el responsable del uso de cookies en este sitio?'),
  block('normal', 'El responsable del tratamiento de los datos recogidos a través de las cookies es Travel Hood (travelhood.es). Puedes contactarnos en contacta@travelhood.es para cualquier consulta relacionada con el uso de cookies.'),

  block('h2', '3. ¿Qué tipos de cookies utilizamos?'),
  block('normal', 'En travelhood.es utilizamos los siguientes tipos de cookies:'),

  block('h3', '3.1 Cookies necesarias'),
  block('normal', 'Son imprescindibles para el funcionamiento básico del sitio web. Sin ellas, el sitio no podría funcionar correctamente.'),
  bullet('th_cookie_consent: Almacena tus preferencias de consentimiento de cookies. Duración: 1 año. Proveedor: travelhood.es.'),

  block('h3', '3.2 Cookies analíticas'),
  block('normal', 'Nos ayudan a entender cómo interactúas con el sitio web, qué páginas visitas y cómo llegas a ellas. Esta información nos permite mejorar la experiencia de navegación. Solo se activan si das tu consentimiento.'),
  bullet('_ga: Identifica a los usuarios de forma anónima para distinguir entre visitantes. Duración: 2 años. Proveedor: Google Analytics.'),
  bullet('_ga_*: Almacena el estado de la sesión. Duración: 2 años. Proveedor: Google Analytics.'),
  bullet('_gid: Identifica a los usuarios de forma anónima durante 24 horas. Duración: 24 horas. Proveedor: Google Analytics.'),
  bullet('_gat: Limita la tasa de solicitudes a Google Analytics. Duración: 1 minuto. Proveedor: Google Analytics.'),

  block('h3', '3.3 Cookies de marketing'),
  block('normal', 'Se utilizan para realizar un seguimiento de los visitantes en los sitios web con el fin de mostrar anuncios relevantes y atractivos. Solo se activan si das tu consentimiento.'),
  bullet('_gcl_au: Almacena información de conversiones para Google Ads. Duración: 90 días. Proveedor: Google Ads.'),
  bullet('IDE / DSID: Utilizadas por Google DoubleClick para registrar y generar informes sobre las acciones del usuario tras ver o hacer clic en un anuncio. Duración: 1 año. Proveedor: Google.'),
  bullet('_ttp: Identificador de TikTok Pixel para medir conversiones y optimizar campañas publicitarias. Duración: 13 meses. Proveedor: TikTok.'),
  bullet('tt_clid: Identificador de clic de TikTok Ads para atribución de conversiones. Duración: 13 meses. Proveedor: TikTok.'),

  block('h2', '4. ¿Cómo gestionamos tu consentimiento?'),
  block('normal', 'Cuando visitas travelhood.es por primera vez, te mostramos un banner de cookies donde puedes:'),
  bullet('Aceptar todas las cookies.'),
  bullet('Aceptar solo las necesarias (rechazando analíticas y de marketing).'),
  bullet('Personalizar tus preferencias eligiendo qué categorías de cookies aceptas.'),
  block('normal', 'Utilizamos Google Tag Manager con el modo de consentimiento (Consent Mode v2) y TikTok Pixel con consentimiento explícito para garantizar que las cookies analíticas y de marketing solo se activan si has dado tu consentimiento.'),

  block('h2', '5. ¿Cómo puedes gestionar o eliminar las cookies?'),
  block('normal', 'Puedes cambiar tus preferencias de cookies en cualquier momento. Además, puedes configurar tu navegador para bloquear o eliminar cookies. A continuación te indicamos cómo hacerlo en los navegadores más comunes:'),
  bullet('Google Chrome: Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.'),
  bullet('Mozilla Firefox: Configuración > Privacidad y seguridad > Cookies y datos del sitio.'),
  bullet('Safari: Preferencias > Privacidad > Gestionar datos del sitio web.'),
  bullet('Microsoft Edge: Configuración > Privacidad, búsqueda y servicios > Cookies y permisos del sitio.'),
  block('normal', 'Ten en cuenta que si bloqueas todas las cookies, es posible que algunas funcionalidades del sitio no estén disponibles.'),

  block('h2', '6. Transferencias internacionales de datos'),
  block('normal', 'Algunas de las cookies de terceros que utilizamos (Google Analytics, Google Ads, TikTok) pueden transferir datos a servidores ubicados fuera del Espacio Económico Europeo, en particular a Estados Unidos. Google cumple con el Marco de Privacidad de Datos UE-EE.UU. (EU-US Data Privacy Framework) como base legal para dichas transferencias.'),

  block('h2', '7. Actualización de esta política'),
  block('normal', 'Esta política de cookies puede ser actualizada periódicamente para reflejar cambios en las cookies que utilizamos o en la normativa aplicable. La fecha de la última actualización se indica al principio de esta página.'),
  block('normal', 'Te recomendamos revisar esta política de forma periódica para estar informado sobre cómo protegemos tu privacidad.'),

  block('h2', '8. Más información'),
  block('normal', 'Si tienes cualquier duda sobre nuestra política de cookies, puedes contactarnos en contacta@travelhood.es.'),
  block('normal', 'Para más información sobre cómo tratamos tus datos personales, consulta nuestra Política de Privacidad.'),
]

async function upload() {
  const today = new Date().toISOString().split('T')[0]

  await client.createOrReplace({
    _type: 'legalPage',
    _id: 'legal-politica-de-cookies',
    title: 'Política de Cookies',
    slug: { _type: 'slug', current: 'politica-de-cookies' },
    version: '1.0',
    effectiveDate: today,
    lastReviewedAt: today,
    body,
    seo: {
      title: 'Política de Cookies | Travel Hood',
      description:
        'Política de cookies de Travel Hood. Información sobre las cookies que utilizamos, su finalidad, duración y cómo gestionar tus preferencias.',
    },
  })

  console.log('✅ Política de cookies subida a Sanity correctamente.')
}

upload().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
