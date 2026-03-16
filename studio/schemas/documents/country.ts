import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'country',
  title: 'País',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Nombre del país (ej: Brasil, Japón, Marruecos).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Se genera automáticamente. URL: /pais/brasil/. ⚠️ No cambiar después de publicar.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'continent',
      title: 'Continente',
      type: 'reference',
      to: [{type: 'continent'}],
      description: '¿A qué continente pertenece este país?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flag',
      title: 'Código de bandera',
      type: 'string',
      description:
        'Código ISO de 2 letras del país en MAYÚSCULAS (ej: BR, JP, MA). Se usa para mostrar la bandera.',
      validation: (Rule) =>
        Rule.required()
          .uppercase()
          .length(2)
          .error('Debe ser un código ISO de exactamente 2 letras en MAYÚSCULAS.'),
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      description: 'Moneda local con código (ej: "Real brasileño (BRL)"). Se muestra en las guías de presupuesto.',
    }),
    defineField({
      name: 'currencyRate',
      title: 'Tipo de cambio',
      type: 'string',
      description: 'Tipo de cambio aproximado respecto al euro (ej: "1€ ≈ 5,5 BRL"). Actualizar periódicamente.',
    }),
    defineField({
      name: 'language',
      title: 'Idioma',
      type: 'string',
      description: 'Idiomas principales del país (ej: "Portugués"). Informativo para los viajeros.',
    }),
    defineField({
      name: 'timezone',
      title: 'Zona horaria',
      type: 'string',
      description: 'Zona horaria del país respecto a España (ej: "GMT-3 (4h menos que España)").',
    }),
    defineField({
      name: 'visaRequired',
      title: '¿Necesita visado?',
      type: 'boolean',
      description: '¿Necesitan visado los ciudadanos españoles? Marcar Sí o No.',
      initialValue: false,
    }),
    defineField({
      name: 'visaInfo',
      title: 'Información sobre visado',
      type: 'text',
      rows: 3,
      description:
        'Detalles sobre el visado: cómo obtenerlo, coste, duración permitida (ej: "Visa on arrival, 35 USD, 30 días"). Dejar vacío si no necesitan visa.',
    }),
    defineField({
      name: 'vaccinesRecommended',
      title: 'Vacunas recomendadas',
      type: 'text',
      rows: 3,
      description:
        'Vacunas recomendadas u obligatorias (ej: "Hepatitis A y B recomendadas. Fiebre amarilla obligatoria si vienes de país endémico"). Dejar vacío si no aplica.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'flag',
    },
  },
})
