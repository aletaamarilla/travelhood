import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comparison',
  title: 'Comparativa',
  type: 'document',
  fields: [
    defineField({
      name: 'destinationA',
      title: 'Primer destino',
      type: 'reference',
      to: [{type: 'destination'}],
      description: 'Primer destino de la comparativa.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destinationB',
      title: 'Segundo destino',
      type: 'reference',
      to: [{type: 'destination'}],
      description: 'Segundo destino de la comparativa.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Se genera automáticamente: tailandia-vs-bali. ⚠️ No cambiar.',
    }),
    defineField({
      name: 'verdict',
      title: 'Veredicto',
      type: 'text',
      rows: 5,
      description:
        'Veredicto final de la comparativa. 3-5 frases explicando cuándo elegir cada uno. Tono Travelhood: directo y útil.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      destA: 'destinationA.name',
      destB: 'destinationB.name',
    },
    prepare({destA, destB}) {
      return {
        title: `${destA || '?'} vs ${destB || '?'}`,
      }
    },
  },
})
