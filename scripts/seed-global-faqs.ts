/**
 * Seed script: loads global FAQ blocks into Sanity.
 *
 * Idempotent — uses createOrReplace with deterministic _id.
 *
 * Usage:
 *   npx tsx scripts/seed-global-faqs.ts
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
  apiVersion: '2026-03-16',
  token,
  useCdn: false,
})

function makeKey() {
  return Math.random().toString(36).slice(2, 10)
}

interface FaqBlock {
  id: string
  title: string
  slug: string
  order: number
  pages: string[]
  faqs: { question: string; answer: string }[]
}

const FAQ_BLOCKS: FaqBlock[] = [
  {
    id: 'globalFaq-el-viaje',
    title: 'El viaje',
    slug: 'el-viaje',
    order: 0,
    pages: ['preguntas-frecuentes', 'como-funciona'],
    faqs: [
      {
        question: '¿Qué incluye el precio del viaje?',
        answer: 'Alojamiento completo, transporte interno, actividades del itinerario y coordinador Travel Hood en destino. Los extras específicos de cada destino se detallan en la página del viaje (crucero por el Nilo, noche en jaima, etc.).',
      },
      {
        question: '¿El vuelo está incluido?',
        answer: 'No. Cada viajero reserva su propio vuelo para encontrar la mejor oferta desde su aeropuerto. Te asesoramos y te indicamos los vuelos recomendados.',
      },
      {
        question: '¿Cuántos días duran los viajes?',
        answer: 'Entre 5 días (puentes) y 14 días (viajes largos). La mayoría son de 10-12 días. Cada viaje tiene sus fechas concretas en la página del destino.',
      },
      {
        question: '¿Cómo son los alojamientos?',
        answer: 'Varían según el destino: hoteles, hostels boutique, riads, guest houses locales. Siempre con buena valoración y ubicación estratégica. No es lujo de resort, pero tampoco mochilero puro. Buscamos el equilibrio perfecto.',
      },
      {
        question: '¿Hay tiempo libre en el itinerario?',
        answer: 'Sí. Combinamos actividades organizadas con tiempo libre para que explores a tu ritmo. Normalmente hay 2-3 horas al día o medias jornadas libres según el destino.',
      },
    ],
  },
  {
    id: 'globalFaq-reservas-pagos',
    title: 'Reservas y pagos',
    slug: 'reservas-pagos',
    order: 1,
    pages: ['preguntas-frecuentes', 'como-funciona', 'home', 'trip-detail'],
    faqs: [
      {
        question: '¿Cómo reservo?',
        answer: 'Desde la página del viaje que te interese, rellena el formulario de reserva y realiza el pago de la señal para confirmar tu plaza. Recibirás un email de confirmación con todos los detalles.',
      },
      {
        question: '¿Qué métodos de pago aceptáis?',
        answer: 'Aceptamos transferencia bancaria. Todos los pagos son seguros y recibes confirmación por email.',
      },
      {
        question: '¿Puedo pagar a plazos?',
        answer: 'Sí. La señal se paga al reservar y el resto antes de la fecha de salida. Si necesitas flexibilidad, escríbenos y buscamos una solución.',
      },
      {
        question: '¿Cuánto cuesta un viaje con Travel Hood?',
        answer: 'El precio depende del destino y la duración del viaje. Consulta la página de cada viaje para ver el precio actualizado. El vuelo internacional no está incluido.',
      },
    ],
  },
  {
    id: 'globalFaq-el-grupo',
    title: 'El grupo',
    slug: 'el-grupo',
    order: 2,
    pages: ['preguntas-frecuentes', 'home', 'trip-detail', 'viajar-sola'],
    faqs: [
      {
        question: '¿Puedo ir solo/a?',
        answer: 'Por supuesto. La mayoría de nuestros viajeros reservan solos. Esa es la esencia de Travel Hood: llegas sin conocer a nadie y vuelves con amigos de verdad.',
      },
      {
        question: '¿Qué edad tiene la gente?',
        answer: 'Todos los viajeros tienen entre 20 y 35 años. Es un rango donde todos conectan fácilmente y comparten el mismo momento vital.',
      },
      {
        question: '¿Cuántas personas van en cada grupo?',
        answer: 'Entre 12 y 13 personas. Lo suficientemente pequeño para intimidad y conexión real, pero con la variedad justa para que siempre haya alguien con quien conectar.',
      },
      {
        question: '¿Y si no conozco a nadie?',
        answer: 'Es lo normal. El coordinador facilita la integración desde el primer momento. Al segundo día ya hay bromas internas y planes improvisados.',
      },
      {
        question: '¿Puedo ir con un amigo/a?',
        answer: 'Sí, podéis reservar juntos. Pero no necesitas ir acompañado/a — la mayoría vienen solos y lo pasan increíble.',
      },
    ],
  },
  {
    id: 'globalFaq-seguro-cancelaciones',
    title: 'Seguro y cancelaciones',
    slug: 'seguro-cancelaciones',
    order: 3,
    pages: ['preguntas-frecuentes', 'como-funciona', 'trip-detail'],
    faqs: [
      {
        question: '¿Qué pasa si tengo que cancelar?',
        answer: 'Puedes cancelar tu viaje según nuestra política de cancelación. Consulta los Términos y Condiciones para conocer los plazos y condiciones de reembolso.',
      },
      {
        question: '¿Incluye seguro de viaje?',
        answer: 'No, el seguro de viaje no está incluido en el precio. Te recomendamos contratar uno por tu cuenta antes de viajar. Podemos orientarte sobre opciones recomendadas.',
      },
      {
        question: '¿Qué pasa si me pongo enfermo durante el viaje?',
        answer: 'Recomendamos encarecidamente contratar un seguro de viaje con cobertura médica. El coordinador facilita la gestión, pero la cobertura depende del seguro contratado por el viajero. Nunca estás solo ante un imprevisto.',
      },
      {
        question: '¿Qué pasa si Travel Hood cancela el viaje?',
        answer: 'Si no se alcanza el mínimo de participantes o por fuerza mayor, te ofrecemos cambiar a otra fecha o destino, o la devolución íntegra del importe.',
      },
    ],
  },
  {
    id: 'globalFaq-el-coordinador',
    title: 'El coordinador',
    slug: 'el-coordinador',
    order: 4,
    pages: ['preguntas-frecuentes', 'como-funciona'],
    faqs: [
      {
        question: '¿Quién es el coordinador?',
        answer: 'Un miembro del equipo Travel Hood con experiencia en el destino. No es un guía turístico: es alguien que viaja contigo, gestiona la logística, resuelve imprevistos y se asegura de que todo el mundo se sienta integrado. Conoce más en la sección Cómo funciona de nuestra web.',
      },
      {
        question: '¿El coordinador habla español?',
        answer: 'Sí. Todos nuestros coordinadores son hispanohablantes. Además, la mayoría hablan inglés y conocen bien el destino.',
      },
      {
        question: '¿El coordinador está disponible 24h?',
        answer: 'Durante el viaje, sí. El coordinador está accesible en todo momento para cualquier necesidad o imprevisto.',
      },
    ],
  },
]

async function seed() {
  console.log('🚀 Seeding global FAQ blocks...\n')

  const tx = client.transaction()

  for (const block of FAQ_BLOCKS) {
    console.log(`  📝 ${block.title} (${block.faqs.length} FAQs)`)
    tx.createOrReplace({
      _type: 'globalFaq',
      _id: block.id,
      title: block.title,
      slug: { _type: 'slug', current: block.slug },
      order: block.order,
      pages: block.pages,
      faqs: block.faqs.map((f) => ({
        _key: makeKey(),
        question: f.question,
        answer: f.answer,
      })),
    })
  }

  const result = await tx.commit()
  console.log(`\n✅ Done! ${result.results.length} globalFaq documents created/updated.`)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
