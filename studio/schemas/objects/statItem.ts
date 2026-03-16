import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'statItem',
  title: 'Dato estadístico',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Valor',
      type: 'string',
      description: 'Valor del dato (ej: "70%", "98%", "14").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      description: 'Etiqueta del dato (ej: "de los viajeros reservan solos").',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'value', subtitle: 'label'},
  },
})
