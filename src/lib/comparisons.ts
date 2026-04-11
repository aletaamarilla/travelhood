export interface Comparison {
  slugA: string
  slugB: string
  verdict: string
}

export function filterValidComparisons(comparisons: Comparison[], validSlugs: Set<string>): Comparison[] {
  return comparisons.filter((c) => {
    const valid = validSlugs.has(c.slugA) && validSlugs.has(c.slugB)
    if (!valid) {
      console.warn(`[comparisons] Par inválido: ${c.slugA} vs ${c.slugB}`)
    }
    return valid
  })
}

export const comparisons: Comparison[] = [
  {
    slugA: "islandia",
    slugB: "laponia",
    verdict: "Islandia es paisaje extremo: glaciares, cascadas, volcanes. Laponia es nieve, auroras boreales y huskies. Islandia para naturaleza dramática. Laponia para una experiencia ártica mágica, especialmente en Navidad.",
  },
  {
    slugA: "indonesia",
    slugB: "tailandia-verano",
    verdict: "Indonesia ofrece variedad total: templos, volcanes y playas. Tailandia combina cultura urbana con islas paradisíacas. Indonesia si buscas aventura y diversidad. Tailandia si prefieres gastronomía y vida nocturna.",
  },
  {
    slugA: "indonesia",
    slugB: "sri-lanka-verano",
    verdict: "Indonesia es playa y templos. Sri Lanka es safari, trenes panorámicos y cultura milenaria. Indonesia para surf y fiestas. Sri Lanka para naturaleza variada y precios más bajos.",
  },
  {
    slugA: "tailandia-verano",
    slugB: "filipinas-verano",
    verdict: "Tailandia tiene mejor infraestructura turística y gastronomía. Filipinas tiene playas más vírgenes y menos masificación. Tailandia para primeras experiencias en Asia. Filipinas para viajeras que buscan autenticidad.",
  },
  {
    slugA: "sri-lanka-verano",
    slugB: "filipinas-verano",
    verdict: "Sri Lanka combina safari, montaña y playa en un solo viaje. Filipinas es isla hopping puro y playas de postal. Sri Lanka para variedad total. Filipinas para relax y snorkel.",
  },
  {
    slugA: "egipto",
    slugB: "zanzibar",
    verdict: "Egipto es historia monumental y desierto. Zanzíbar es playa paradisíaca y cultura swahili. Egipto si te fascina la historia antigua. Zanzíbar si buscas playa y un destino africano auténtico.",
  },
  {
    slugA: "azores",
    slugB: "islandia",
    verdict: "Azores tiene lagos volcánicos, termas y clima templado. Islandia tiene glaciares, cascadas y paisajes extremos. Azores para naturaleza accesible y barata. Islandia para experiencias épicas.",
  },
  {
    slugA: "azores",
    slugB: "lofoten",
    verdict: "Azores es verde, volcánico y templado. Lofoten es fiordos, playas árticas y trekking. Azores para relax natural. Lofoten para aventura nórdica intensa.",
  },
  {
    slugA: "brasil",
    slugB: "puerto-rico",
    verdict: "Brasil tiene playas enormes, fiesta y naturaleza salvaje. Puerto Rico tiene cultura latina concentrada y Caribe auténtico. Brasil para viajes largos e intensos. Puerto Rico para escapadas caribeñas cortas.",
  },
  {
    slugA: "brasil",
    slugB: "colombia",
    verdict: "Brasil es playa y ritmo carioca. Colombia es café, Caribe y montaña. Brasil para fiesta y naturaleza costera. Colombia para variedad geográfica y cultural.",
  },
  {
    slugA: "maldivas",
    slugB: "zanzibar",
    verdict: "Maldivas es lujo minimalista y snorkel puro. Zanzíbar es cultura, especias y playas variadas. Maldivas para desconexión total. Zanzíbar para playa con aventura y cultura.",
  },
  {
    slugA: "laponia",
    slugB: "lofoten",
    verdict: "Laponia es auroras boreales, huskies y nieve. Lofoten es fiordos, trekking y pueblos pesqueros. Laponia para experiencia invernal mágica. Lofoten para aventura de verano nórdico.",
  },
]
