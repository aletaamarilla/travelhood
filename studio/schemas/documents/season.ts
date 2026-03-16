import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'season',
  title: 'Temporada',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Nombre de la temporada (ej: "Semana Santa", "Verano", "Navidad").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'URL: /temporada/verano/. ⚠️ No cambiar.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags de viajes',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Tags de viajes que pertenecen a esta temporada (ej: "semana-santa", "verano"). Deben coincidir con los tags de los viajes.',
      options: {
        list: [
          {title: 'Semana Santa', value: 'semana-santa'},
          {title: 'Puente de mayo', value: 'puente-mayo'},
          {title: 'Verano', value: 'verano'},
          {title: 'Septiembre', value: 'septiembre'},
          {title: 'Puente de octubre', value: 'puente-octubre'},
          {title: 'Puente de noviembre', value: 'puente-noviembre'},
          {title: 'Navidad', value: 'navidad'},
          {title: 'Fin de año', value: 'fin-de-anio'},
        ],
      },
    }),
    defineField({
      name: 'editorial',
      title: 'Texto editorial',
      type: 'text',
      rows: 6,
      description:
        'Texto editorial de la temporada. 150-250 palabras. Actualizar cada año con fechas y datos actuales.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen hero',
      type: 'image',
      description: 'Imagen principal de la temporada. Mínimo 1920x1080px.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Texto alternativo del hero',
      type: 'string',
      description: 'Texto alternativo del hero.',
    }),
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [{type: 'faqItem'}],
      description: 'Preguntas frecuentes sobre esta temporada. Mínimo 3. ⚠️ Actualizar fechas cada año.',
      validation: (Rule) => Rule.min(3).warning('Se recomiendan al menos 3 preguntas frecuentes.'),
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
      media: 'heroImage',
    },
  },
})
