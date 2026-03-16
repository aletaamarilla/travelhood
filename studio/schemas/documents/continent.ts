import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'continent',
  title: 'Continente',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Nombre del continente (ej: Europa, Asia, África). Se muestra en la web y en las URLs.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Se genera automáticamente. Es la URL: /destinos/europa/. ⚠️ No cambiar después de publicar.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editorialIntro',
      title: 'Introducción editorial',
      type: 'text',
      rows: 6,
      description:
        'Texto largo editorial que describe el continente. Aparece en la página /destinos/[continente]/. Escribe en tono Travelhood: cercano, directo, inspiracional. 150-300 palabras ideal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen hero',
      type: 'image',
      description: 'Imagen principal del continente. Se muestra como fondo del hero. Tamaño mínimo: 1920x1080px. Subir foto real, no stock.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Texto alternativo del hero',
      type: 'string',
      description:
        'Describe lo que se ve en la foto para SEO y accesibilidad (ej: "Grupo de viajeros en las islas griegas").',
    }),
    defineField({
      name: 'bestMonths',
      title: 'Mejores meses',
      type: 'string',
      description:
        'Resumen de la mejor época por destino (ej: "Grecia: may-sep. Laponia: dic-mar"). Se muestra en la tabla de mejores meses.',
    }),
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [{type: 'faqItem'}],
      description:
        'Preguntas frecuentes sobre este continente. Se muestran en la página del continente y generan schema FAQ en Google. Mínimo 3 preguntas.',
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
