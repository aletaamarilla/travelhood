import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título SEO',
      type: 'string',
      description:
        'Título que aparece en Google. Máximo 60 caracteres. Incluir "Travelhood" al final.',
      validation: (Rule) => Rule.max(60).warning('El título SEO no debe superar los 60 caracteres.'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción SEO',
      type: 'text',
      rows: 3,
      description:
        'Descripción que aparece en Google debajo del título. Máximo 155 caracteres. Incluir precio y beneficio clave.',
      validation: (Rule) =>
        Rule.max(155).warning('La descripción SEO no debe superar los 155 caracteres.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Palabras clave',
      type: 'string',
      description: 'Palabras clave separadas por comas (ej: "viajes europa jóvenes, viajes grupo europa").',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales',
      type: 'image',
      description:
        'Imagen que se muestra al compartir en redes sociales. Si no se pone, se usa la imagen hero. Tamaño ideal: 1200x630px.',
      options: {hotspot: true},
    }),
  ],
})
