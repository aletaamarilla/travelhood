import {defineField, defineType} from 'sanity'

const seasonTags = [
  {title: 'Semana Santa', value: 'semana-santa'},
  {title: 'Puente de mayo', value: 'puente-mayo'},
  {title: 'Verano', value: 'verano'},
  {title: 'Septiembre', value: 'septiembre'},
  {title: 'Puente de octubre', value: 'puente-octubre'},
  {title: 'Puente de noviembre', value: 'puente-noviembre'},
  {title: 'Navidad', value: 'navidad'},
  {title: 'Fin de año', value: 'fin-de-anio'},
]

export default defineType({
  name: 'trip',
  title: 'Viaje',
  type: 'document',
  fieldsets: [
    {name: 'dates', title: 'Fechas y precios', options: {collapsible: true, collapsed: false}},
    {name: 'places', title: 'Plazas', options: {collapsible: true, collapsed: false}},
    {name: 'promo', title: 'Promoción', options: {collapsible: true, collapsed: true}},
    {name: 'itineraryFieldset', title: 'Itinerario', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del viaje',
      type: 'string',
      description:
        'Nombre del viaje (ej: "Japón — Semana Santa 2026"). Se muestra en cards y la página del destino.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Se genera automáticamente desde el título. Se usa internamente.',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'destination',
      title: 'Destino',
      type: 'reference',
      to: [{type: 'destination'}],
      description: '¿A qué destino pertenece este viaje?',
      validation: (Rule) => Rule.required(),
    }),

    // --- Fechas y precios ---
    defineField({
      name: 'departureDate',
      title: 'Fecha de salida',
      type: 'date',
      fieldset: 'dates',
      description: 'Fecha de salida del viaje (ej: 2026-03-28).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'returnDate',
      title: 'Fecha de vuelta',
      type: 'date',
      fieldset: 'dates',
      description: 'Fecha de vuelta.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'durationDays',
      title: 'Duración (días)',
      type: 'number',
      fieldset: 'dates',
      description: 'Número total de días del viaje. Calcúlalo desde la fecha de salida a la de vuelta.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'priceFrom',
      title: 'Precio base (€)',
      type: 'number',
      fieldset: 'dates',
      description: 'Precio base por persona en euros, SIN vuelo (ej: 1290). No incluir el símbolo €.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'flightEstimate',
      title: 'Vuelo estimado (€)',
      type: 'number',
      fieldset: 'dates',
      description:
        'Precio estimado del vuelo ida/vuelta desde España en euros (ej: 650). Orientativo para el viajero.',
      validation: (Rule) => Rule.required().min(0),
    }),

    // --- Promoción ---
    defineField({
      name: 'promoPrice',
      title: 'Precio con descuento (€)',
      type: 'number',
      fieldset: 'promo',
      description: 'Precio con descuento, si hay promoción activa (ej: 1090). Dejar vacío si no hay promo.',
    }),
    defineField({
      name: 'promoLabel',
      title: 'Etiqueta de promo',
      type: 'string',
      fieldset: 'promo',
      description:
        'Texto de la etiqueta de promo (ej: "-15% Early Bird", "Oferta flash"). Dejar vacío si no hay promo.',
    }),

    // --- Plazas ---
    defineField({
      name: 'totalPlaces',
      title: 'Plazas totales',
      type: 'number',
      fieldset: 'places',
      description: 'Plazas totales del grupo (ej: 16). Normalmente entre 12 y 18.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'placesLeft',
      title: 'Plazas disponibles',
      type: 'number',
      fieldset: 'places',
      description: 'Plazas que quedan disponibles. ⚠️ Actualizar cuando se confirmen reservas.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      fieldset: 'places',
      description:
        'Estado del viaje: "open" = plazas disponibles, "almost-full" = últimas plazas (≤4), "full" = completo.',
      options: {
        list: [
          {title: 'Abierto', value: 'open'},
          {title: 'Últimas plazas', value: 'almost-full'},
          {title: 'Completo', value: 'full'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinator',
      title: 'Coordinador/a',
      type: 'reference',
      to: [{type: 'coordinator'}],
      description: '¿Qué coordinador/a lleva este viaje?',
      validation: (Rule) => Rule.required(),
    }),

    // --- Incluye / No incluye ---
    defineField({
      name: 'included',
      title: 'Incluye',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Lista de lo que incluye el viaje (ej: "Alojamiento", "Transporte interno"). Un elemento por línea.',
    }),
    defineField({
      name: 'notIncluded',
      title: 'No incluye',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Lista de lo que NO incluye (ej: "Vuelo internacional", "Comidas no especificadas"). Un elemento por línea.',
    }),

    // --- Itinerario ---
    defineField({
      name: 'itinerary',
      title: 'Itinerario',
      type: 'array',
      of: [{type: 'itineraryDay'}],
      fieldset: 'itineraryFieldset',
      description:
        'Itinerario día a día del viaje. Cada día con título, descripción y opcionalmente coordenadas para el mapa.',
    }),

    // --- Tags de temporada ---
    defineField({
      name: 'tags',
      title: 'Temporadas',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Temporadas a las que pertenece este viaje. Se usa para los filtros y las páginas de temporada.',
      options: {
        list: seasonTags,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      destination: 'destination.name',
    },
    prepare({title, subtitle, destination}) {
      const statusLabels: Record<string, string> = {
        open: '🟢 Abierto',
        'almost-full': '🟡 Últimas plazas',
        full: '🔴 Completo',
      }
      return {
        title,
        subtitle: `${destination || ''} — ${statusLabels[subtitle] || subtitle || ''}`,
      }
    },
  },
})
