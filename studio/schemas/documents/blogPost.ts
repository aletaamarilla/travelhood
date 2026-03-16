import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Artículo de blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description:
        'Título del artículo. Debe ser atractivo y contener la keyword principal (ej: "Viajar sola sin miedo: la guía definitiva"). Máx. 70 caracteres.',
      validation: (Rule) => Rule.required().max(70).warning('El título no debe superar los 70 caracteres.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description:
        'URL del artículo: /blog/viajar-sola-sin-miedo/. Se genera desde el título. ⚠️ No cambiar después de publicar.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      description: 'Resumen corto del artículo para las cards del blog. 1-2 frases. Máx. 160 caracteres.',
      validation: (Rule) =>
        Rule.required().max(160).warning('El extracto no debe superar los 160 caracteres.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      description: 'Categoría del artículo. Se usa para filtrar en el blog.',
      options: {
        list: [
          {title: 'Inspiración', value: 'Inspiración'},
          {title: 'Destinos', value: 'Destinos'},
          {title: 'Guías', value: 'Guías'},
          {title: 'Comunidad', value: 'Comunidad'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
      description:
        'Imagen principal del artículo. Se muestra en el hero y en las cards. Mínimo 1200x630px.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo de la imagen',
      type: 'string',
      description:
        'Texto alternativo descriptivo de la imagen (ej: "Grupo de viajeras jóvenes en la playa de Zanzíbar").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      description: 'Fecha y hora de publicación. Se muestra en el artículo y se usa para ordenar.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Fecha de actualización',
      type: 'datetime',
      description:
        'Fecha de última actualización. Si se modifica el contenido, actualizar esta fecha. Google lo usa para el schema Article.',
    }),
    defineField({
      name: 'readTime',
      title: 'Tiempo de lectura',
      type: 'string',
      description: 'Tiempo de lectura estimado (ej: "6 min"). Calcúlalo contando ~200 palabras/minuto.',
    }),
    defineField({
      name: 'featured',
      title: '¿Artículo destacado?',
      type: 'boolean',
      description: '¿Mostrar este artículo destacado en la página del blog? Solo marcar los 4-6 mejores.',
      initialValue: false,
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Nombre',
          type: 'string',
          description: 'Nombre del autor (ej: "Travelhood").',
        }),
        defineField({
          name: 'role',
          title: 'Rol',
          type: 'string',
          description: 'Rol (ej: "Equipo editorial").',
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      of: [{type: 'blogSection'}],
      description:
        'Secciones del artículo. Cada sección tiene un título (H2) y un cuerpo de texto. Añadir opcionalmente imagen y botón CTA.',
    }),
    defineField({
      name: 'relatedDestinations',
      title: 'Destinos relacionados',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'destination'}]}],
      description:
        'Destinos relacionados con el artículo. Se usan para sugerir viajes al final del post.',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Artículos relacionados',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'blogPost'}]}],
      description: 'Artículos relacionados. Se muestran como sugerencias al final. Seleccionar 2-3.',
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Etiquetas del artículo para SEO y organización interna (ej: "viajar sola", "viajes en grupo").',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'blogSeo',
    }),
  ],
  orderings: [
    {
      title: 'Fecha de publicación (reciente)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
})
