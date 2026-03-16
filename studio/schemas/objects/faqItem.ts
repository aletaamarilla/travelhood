import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'Pregunta frecuente',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      description: 'La pregunta tal como la haría un viajero (ej: "¿Necesito pasaporte para viajar por Europa?").',
      validation: (Rule) => Rule.required().error('La pregunta es obligatoria.'),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'text',
      rows: 4,
      description: 'Respuesta clara y directa. Sin rodeos. 2-4 líneas máximo.',
      validation: (Rule) => Rule.required().error('La respuesta es obligatoria.'),
    }),
  ],
  preview: {
    select: {title: 'question'},
  },
})
