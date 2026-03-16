export interface Comparison {
  slugA: string
  slugB: string
  verdict: string
}

export const comparisons: Comparison[] = [
  {
    slugA: "tailandia",
    slugB: "bali",
    verdict: "Tailandia es más versátil y económica, ideal para un primer viaje a Asia. Bali es más espiritual y volcánica, perfecta si buscas una experiencia transformadora. Si solo puedes elegir uno: Tailandia para variedad, Bali para profundidad.",
  },
  {
    slugA: "marruecos",
    slugB: "egipto",
    verdict: "Marruecos es más cercano, económico y accesible desde España (2h de vuelo). Egipto ofrece monumentalidad histórica incomparable. Si tienes poco tiempo y presupuesto: Marruecos. Si quieres un viaje que te deje sin palabras: Egipto.",
  },
  {
    slugA: "japon",
    slugB: "tailandia",
    verdict: "Japón es cultural, tecnológico y ordenado. Tailandia es tropical, caótica y económica. Son experiencias complementarias, no sustitutas. Si es tu primer viaje a Asia: Tailandia. Si buscas algo único e irrepetible: Japón.",
  },
  {
    slugA: "grecia",
    slugB: "turquia",
    verdict: "Grecia es islas, playas y gastronomía mediterránea. Turquía es historia milenaria, bazares y contrastes entre oriente y occidente. Ambos son accesibles desde España. Grecia para relax y playa; Turquía para inmersión cultural.",
  },
  {
    slugA: "peru",
    slugB: "colombia",
    verdict: "Perú tiene Machu Picchu y una diversidad geográfica brutal. Colombia es música, color y naturaleza tropical. Perú para historia y aventura. Colombia para fiesta, naturaleza y autenticidad latinoamericana.",
  },
  {
    slugA: "costa-rica",
    slugB: "mexico",
    verdict: "Costa Rica es naturaleza pura: volcanes, selva, fauna. México es cultura, gastronomía y ruinas mayas. Costa Rica si priorizas aventura y naturaleza. México si quieres una experiencia cultural completa con playas de bonus.",
  },
  {
    slugA: "islandia",
    slugB: "laponia",
    verdict: "Islandia es paisaje extremo: glaciares, cascadas, volcanes. Laponia es nieve, auroras boreales y huskies. Islandia para naturaleza dramática. Laponia para una experiencia ártica mágica, especialmente en Navidad.",
  },
]
