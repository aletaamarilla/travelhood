import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'destinationSeo',
  title: 'SEO del destino',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título SEO',
      type: 'string',
      description: 'Título SEO de la página del destino. Máx. 60 caracteres. Incluir "Travelhood".',
      validation: (Rule) => Rule.max(60).warning('El título SEO no debe superar los 60 caracteres.'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción SEO',
      type: 'text',
      rows: 3,
      description: 'Descripción SEO. Máx. 155 caracteres. Incluir precio y beneficio.',
      validation: (Rule) => Rule.max(155).warning('La descripción SEO no debe superar los 155 caracteres.'),
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
      description: 'Imagen para redes sociales. Si vacío, se usa el hero. 1200x630px.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'cuandoViajarTitle',
      title: 'SEO: Título "Cuándo viajar"',
      type: 'string',
      description: 'Título SEO para la página "Cuándo viajar a [destino]". Máx. 60 caracteres.',
      validation: (Rule) => Rule.max(60).warning('Máximo 60 caracteres.'),
    }),
    defineField({
      name: 'cuandoViajarDescription',
      title: 'SEO: Descripción "Cuándo viajar"',
      type: 'text',
      rows: 3,
      description: 'Descripción SEO para "Cuándo viajar". Máx. 155 caracteres.',
      validation: (Rule) => Rule.max(155).warning('Máximo 155 caracteres.'),
    }),
    defineField({
      name: 'presupuestoTitle',
      title: 'SEO: Título "Presupuesto"',
      type: 'string',
      description: 'Título SEO para la página "Presupuesto [destino]". Máx. 60 caracteres.',
      validation: (Rule) => Rule.max(60).warning('Máximo 60 caracteres.'),
    }),
    defineField({
      name: 'presupuestoDescription',
      title: 'SEO: Descripción "Presupuesto"',
      type: 'text',
      rows: 3,
      description: 'Descripción SEO para "Presupuesto". Máx. 155 caracteres.',
      validation: (Rule) => Rule.max(155).warning('Máximo 155 caracteres.'),
    }),
  ],
})
