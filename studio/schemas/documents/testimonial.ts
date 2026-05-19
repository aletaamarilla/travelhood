import {defineField, defineType} from 'sanity'

const verificationStatusOptions = [
  {title: 'Enlace individual Trustpilot', value: 'individual-link'},
  {title: 'Enlace al perfil Trustpilot', value: 'profile-link'},
  {title: 'Pendiente de revisión editorial', value: 'pending-review'},
  {title: 'Retirada', value: 'retired'},
]

export default defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Solo el nombre de pila del viajero/a (ej: "Laura"). No apellidos por privacidad.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'age',
      title: 'Edad',
      type: 'number',
      description:
        'Opcional por privacidad. Edad del viajero/a en el momento del viaje; no rellenar si no es necesario publicarla.',
      validation: (Rule) => Rule.min(16).max(99),
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      description:
        'Opcional por privacidad. Ciudad de origen aproximada (ej: "Madrid", "Barcelona"); evitar datos demasiado identificables.',
    }),
    defineField({
      name: 'destination',
      title: 'Destino',
      type: 'reference',
      to: [{type: 'destination'}],
      description:
        'Opcional. Úsalo solo si la opinión habla claramente de un destino concreto; si es una opinión general sobre Travel Hood, déjalo vacío.',
    }),
    defineField({
      name: 'quote',
      title: 'Testimonio',
      type: 'text',
      rows: 4,
      description:
        'Testimonio del viajero/a. Debe ser textual, en primera persona (ej: "Fui sin conocer a nadie. Volví con gente que ya considero amigos."). Máx. 2-3 frases.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Valoración',
      type: 'number',
      description: 'Valoración de 1 a 5 estrellas. Normalmente 5.',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'source',
      title: 'Fuente',
      type: 'string',
      description:
        'Fuente de la opinión. Usar Trustpilot solo cuando exista evidencia trazable; usar Editorial para testimonios recopilados directamente por Travel Hood (no se mostrará la atribución de Trustpilot ni enlace externo).',
      initialValue: 'editorial',
      options: {
        list: [
          {title: 'Trustpilot (con trazabilidad)', value: 'trustpilot'},
          {title: 'Editorial (recopilado por Travel Hood)', value: 'editorial'},
        ],
        layout: 'radio',
      },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value === 'trustpilot' || value === 'editorial'
            ? true
            : 'Selecciona una fuente válida.',
        ),
    }),
    defineField({
      name: 'verificationStatus',
      title: 'Estado editorial',
      type: 'string',
      description:
        'Estado interno para saber si hay enlace individual, solo perfil, revisión pendiente o si la opinión debe retirarse.',
      initialValue: 'pending-review',
      options: {
        list: verificationStatusOptions,
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          ['individual-link', 'profile-link', 'pending-review', 'retired'].includes(value ?? '')
            ? true
            : 'Selecciona un estado editorial válido.',
        ),
    }),
    defineField({
      name: 'externalReviewUrl',
      title: 'URL de la opinión externa',
      type: 'url',
      description:
        'Enlace público a la opinión individual en Trustpilot cuando exista. No usar logos, widgets, badges ni claims de verificación de Trustpilot.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'sourceProfileUrl',
      title: 'URL del perfil de la fuente',
      type: 'url',
      description:
        'Enlace al perfil público de Travel Hood en Trustpilot para casos sin enlace individual. No debe sustituir una revisión editorial.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'experienceDateLabel',
      title: 'Etiqueta de fecha de experiencia',
      type: 'string',
      description:
        'Texto opcional tal y como aparece en Trustpilot (ej: "Fecha de la experiencia: junio de 2025"). Evitar datos personales.',
    }),
    defineField({
      name: 'experienceDate',
      title: 'Fecha de experiencia',
      type: 'date',
      description:
        'Fecha estructurada de la experiencia si se conoce con seguridad. Usar la etiqueta anterior si solo hay texto aproximado.',
    }),
    defineField({
      name: 'editorialReviewedAt',
      title: 'Fecha de revisión editorial',
      type: 'datetime',
      description:
        'Fecha interna en la que se revisó la opinión para comprobar fuente, privacidad y enlace externo.',
    }),
    defineField({
      name: 'editorialEvidenceRef',
      title: 'Referencia de evidencia editorial',
      type: 'string',
      description:
        'Referencia interna no pública para trazabilidad editorial (captura, ticket o nota). No incluir datos personales sensibles.',
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible en la web',
      type: 'boolean',
      description:
        'Control editorial para publicar u ocultar el testimonio sin borrar la trazabilidad. Desactivar si el estado es retirado.',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden manual',
      type: 'number',
      description: 'Número opcional para priorizar testimonios visibles en la web. Menor número aparece antes.',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      description:
        'Foto del viajero/a. Opcional por privacidad. Si hay, usar foto real del viaje y evitar imágenes identificables sin permiso.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo de la foto',
      type: 'string',
      description: 'Texto alternativo de la foto.',
    }),
    defineField({
      name: 'featured',
      title: '¿Destacado en home?',
      type: 'boolean',
      description: '¿Mostrar este testimonio en la home? Marcar solo los mejores (3-6 máximo).',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'image',
    },
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle ? `📍 ${subtitle}` : ''}
    },
  },
})
