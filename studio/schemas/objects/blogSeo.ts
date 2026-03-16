import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogSeo',
  title: 'SEO del artículo',
  type: 'object',
  fields: [
    defineField({
      name: 'metaDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
      description:
        'Descripción para Google. Máx. 155 caracteres. Debe incluir la keyword y un beneficio claro.',
      validation: (Rule) => Rule.max(155).warning('La meta descripción no debe superar los 155 caracteres.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Palabras clave',
      type: 'string',
      description: 'Palabras clave separadas por comas.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales',
      type: 'image',
      description: 'Imagen para redes sociales. Si vacío, se usa la imagen principal. 1200x630px.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: '¿Ocultar de Google?',
      type: 'boolean',
      description: '¿Ocultar de Google? Solo marcar si el artículo es temporal o de prueba.',
      initialValue: false,
    }),
  ],
})
