import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'itineraryDay',
  title: 'Día del itinerario',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Día',
      type: 'number',
      description: 'Número del día (1, 2, 3...).',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Título corto del día (ej: "Tokio", "Chiang Mai — naturaleza").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'string',
      description:
        'Descripción de las actividades del día (ej: "Templos dorados, street food y clase de cocina thai"). 1-2 frases.',
    }),
    defineField({
      name: 'lat',
      title: 'Latitud',
      type: 'number',
      description: 'Latitud de la ubicación principal del día. Opcional. Para el mapa interactivo.',
    }),
    defineField({
      name: 'lng',
      title: 'Longitud',
      type: 'number',
      description: 'Longitud de la ubicación. Opcional. Puedes copiarla de Google Maps.',
    }),
  ],
  preview: {
    select: {title: 'title', day: 'day'},
    prepare({title, day}) {
      return {title: `Día ${day}: ${title || ''}`}
    },
  },
})
