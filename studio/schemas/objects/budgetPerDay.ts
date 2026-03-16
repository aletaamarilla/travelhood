import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'budgetPerDay',
  title: 'Presupuesto diario',
  type: 'object',
  description: 'Datos de presupuesto diario en destino. Se usan en la página de presupuesto.',
  fields: [
    defineField({
      name: 'mealCostLow',
      title: 'Comida económica',
      type: 'string',
      description: 'Coste de una comida económica/callejera (ej: "1-3€").',
    }),
    defineField({
      name: 'mealCostMid',
      title: 'Restaurante medio',
      type: 'string',
      description: 'Coste de un restaurante medio (ej: "5-10€").',
    }),
    defineField({
      name: 'beerCost',
      title: 'Cerveza local',
      type: 'string',
      description: 'Precio de una cerveza local (ej: "1-2€").',
    }),
    defineField({
      name: 'dailyBudget',
      title: 'Presupuesto diario',
      type: 'string',
      description: 'Presupuesto diario recomendado en destino, sin incluir el viaje (ej: "20-30€/día").',
    }),
    defineField({
      name: 'totalExtras',
      title: 'Gastos extra totales',
      type: 'string',
      description: 'Gastos extra totales estimados para todo el viaje (ej: "250-350€ para 12 días").',
    }),
  ],
})
