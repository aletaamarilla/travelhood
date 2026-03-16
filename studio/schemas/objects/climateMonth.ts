import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'climateMonth',
  title: 'Clima mensual',
  type: 'object',
  fields: [
    defineField({
      name: 'month',
      title: 'Mes',
      type: 'string',
      description: 'Mes del año.',
      options: {
        list: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avgTemp',
      title: 'Temperatura media',
      type: 'string',
      description: 'Temperatura media (ej: "28°C"). Si hay mucha variación, poner rango (ej: "15-25°C").',
    }),
    defineField({
      name: 'rainfall',
      title: 'Nivel de lluvia',
      type: 'string',
      description: 'Nivel de lluvia: "Baja", "Media", "Alta". Orientativo.',
      options: {
        list: [
          {title: 'Baja', value: 'Baja'},
          {title: 'Media', value: 'Media'},
          {title: 'Alta', value: 'Alta'},
        ],
      },
    }),
    defineField({
      name: 'recommendation',
      title: 'Recomendación',
      type: 'string',
      description:
        '¿Es buen mes para visitar? "Ideal" = mejor época. "No recomendado" = monzón, frío extremo, etc.',
      options: {
        list: [
          {title: 'Ideal', value: 'Ideal'},
          {title: 'Buena', value: 'Buena'},
          {title: 'Aceptable', value: 'Aceptable'},
          {title: 'No recomendado', value: 'No recomendado'},
        ],
      },
    }),
    defineField({
      name: 'note',
      title: 'Nota',
      type: 'string',
      description: 'Nota breve opcional (ej: "Temporada de cerezos", "Monzón", "Gran Migración").',
    }),
  ],
  preview: {
    select: {title: 'month', subtitle: 'recommendation'},
  },
})
