/**
 * Migration script: Scrapes WordPress blog posts and outputs them as BlogPost entries
 * for blog-data.ts in the Astro project.
 *
 * Usage: npx tsx scripts/migrate-wp-blogs.ts
 */

const WP_POSTS = [
  {
    wpUrl: "https://travelhood.es/top-5-destinos-2025/",
    newSlug: "top-destinos-tendencia-viaje-grupo",
    category: "Inspiración",
    relatedDestinations: ["brasil", "egipto", "filipinas-verano", "islandia"],
    tags: ["destinos tendencia", "viajes en grupo", "viajes para jóvenes"],
  },
  {
    wpUrl: "https://travelhood.es/por-que-elegir-un-viaje-en-grupo-reducido/",
    newSlug: "por-que-elegir-viaje-grupo-reducido",
    category: "Inspiración",
    relatedDestinations: [],
    tags: ["viajes en grupo", "grupo reducido", "viajes organizados"],
  },
  {
    wpUrl: "https://travelhood.es/templos-en-tailandia-que-no-puedes-perderte-tradicion-arquitectura-y-espiritualidad/",
    newSlug: "templos-tailandia-imprescindibles",
    category: "Guías",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["tailandia", "templos", "cultura", "guía de viaje"],
  },
  {
    wpUrl: "https://travelhood.es/maldivas-en-grupo-reducido-la-experiencia-de-lujo-compartida-con-otros-jovenes-viajeros/",
    newSlug: "maldivas-grupo-reducido-experiencia",
    category: "Destinos",
    relatedDestinations: ["maldivas"],
    tags: ["maldivas", "viaje de lujo", "grupo reducido", "snorkel"],
  },
  {
    wpUrl: "https://travelhood.es/viajar-a-tailandia-en-grupo-reducido-cultura-aventura-y-templos-para-autenticos-travelhooders/",
    newSlug: "viajar-tailandia-grupo-reducido",
    category: "Destinos",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["tailandia", "viajes en grupo", "aventura", "templos"],
  },
  {
    wpUrl: "https://travelhood.es/como-llevar-y-cambiar-dinero-en-tailandia/",
    newSlug: "como-cambiar-dinero-tailandia",
    category: "Consejos",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["tailandia", "dinero", "consejos prácticos", "presupuesto"],
  },
  {
    wpUrl: "https://travelhood.es/bangkok-desde-las-alturas-rooftops-imprescindibles-para-los-autenticos-travelhooders/",
    newSlug: "bangkok-mejores-rooftops",
    category: "Guías",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["bangkok", "rooftops", "tailandia", "vida nocturna"],
  },
  {
    wpUrl: "https://travelhood.es/guia-definitiva-para-viajar-a-tailandia-con-travel-hood-%f0%9f%8f%9d%ef%b8%8f/",
    newSlug: "guia-definitiva-tailandia",
    category: "Guías",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["tailandia", "guía completa", "qué llevar", "seguridad"],
  },
  {
    wpUrl: "https://travelhood.es/vacunas-y-salud-para-viajar-a-tailandia-lo-que-debes-saber-%f0%9f%a9%ba%f0%9f%8c%b4/",
    newSlug: "vacunas-salud-viajar-tailandia",
    category: "Consejos",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["tailandia", "vacunas", "salud", "preparación viaje"],
  },
  {
    wpUrl: "https://travelhood.es/es-necesario-un-seguro-de-viaje-para-tailandia-tu-guia-completa-para-viajar-con-tranquilidad/",
    newSlug: "seguro-viaje-tailandia-guia",
    category: "Consejos",
    relatedDestinations: ["tailandia-verano", "tailandia-invierno"],
    tags: ["tailandia", "seguro de viaje", "seguridad", "consejos"],
  },
  {
    wpUrl: "https://travelhood.es/6835-2/",
    newSlug: "tren-sri-lanka-ruta-magica",
    category: "Destinos",
    relatedDestinations: ["sri-lanka-verano", "sri-lanka-invierno"],
    tags: ["sri lanka", "tren", "ruta panorámica", "aventura"],
  },
];

interface Section {
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
}

interface MigratedPost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  image: string;
  imageAlt: string;
  date: string;
  dateISO: string;
  readTime: string;
  featured: boolean;
  author: { name: string; role: string };
  relatedDestinations: string[];
  relatedSlugs: string[];
  tags: string[];
  sections: Section[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\u202f/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractSections(html: string): Section[] {
  const sections: Section[] = [];
  const headingRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;

  const headings: { index: number; heading: string }[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const heading = stripHtml(match[1]).trim();
    if (heading && heading !== "Contacto rápido" && heading !== "Contacto útil" &&
        heading !== "Enlaces útiles de Travel Hood" && heading !== "Enlaces útiles para preparar tu viaje" &&
        !heading.startsWith("📲") && heading !== "Tabla de Contenidos :") {
      headings.push({ index: match.index, heading });
    }
  }

  if (headings.length === 0) {
    const body = stripHtml(html);
    if (body.length > 50) {
      sections.push({ heading: "", body });
    }
    return sections;
  }

  // Extract intro before first heading
  const introHtml = html.substring(0, headings[0].index);
  const introText = stripHtml(introHtml);
  if (introText.length > 50) {
    sections.push({ heading: "", body: introText });
  }

  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : html.length;
    const sectionHtml = html.substring(start, end);

    // Extract images from this section
    const imgMatch = sectionHtml.match(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/i)
      || sectionHtml.match(/<img[^>]+src="([^"]+)"[^>]*/i);

    const body = stripHtml(sectionHtml.replace(/<h[2-3][^>]*>.*?<\/h[2-3]>/i, ""));

    if (body.length > 20) {
      sections.push({
        heading: headings[i].heading,
        body,
        ...(imgMatch ? { image: imgMatch[1], imageAlt: imgMatch[2] || "" } : {}),
      });
    }
  }

  return sections;
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

async function scrapePost(wpUrl: string): Promise<{
  title: string;
  content: string;
  date: string;
  image: string;
}> {
  const res = await fetch(wpUrl);
  const html = await res.text();

  const titleMatch = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)<\/h1>/s)
    || html.match(/<title>(.*?)\s*-\s*Travel Hood<\/title>/);
  const title = titleMatch ? stripHtml(titleMatch[1]).trim() : "Sin título";

  const contentMatch = html.match(/class="entry-content">(.*?)<\/div>\s*<\/article>/s)
    || html.match(/<article[^>]*>(.*?)<\/article>/s);
  const content = contentMatch ? contentMatch[1] : "";

  const dateMatch = html.match(/(\d{2}\/\d{2}\/\d{4})/);
  const date = dateMatch ? dateMatch[1] : "01/01/2025";

  const imgMatch = html.match(/class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i)
    || html.match(/<article[^>]*>.*?<img[^>]+src="([^"]+)"/s);
  const image = imgMatch ? imgMatch[1] : "";

  return { title, content, date, image };
}

async function main() {
  const results: MigratedPost[] = [];

  for (const post of WP_POSTS) {
    console.log(`Scraping: ${post.wpUrl}`);
    try {
      const { title, content, date, image } = await scrapePost(post.wpUrl);
      const sections = extractSections(content);
      const allText = sections.map((s) => s.body).join(" ");
      const readTime = estimateReadTime(allText);
      const words = allText.split(/\s+/).length;

      const dateParts = date.split("/");
      const dateISO = dateParts.length === 3
        ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        : "2025-01-01";

      const excerpt = allText.substring(0, 200).replace(/\n/g, " ").trim() + "...";

      results.push({
        slug: post.newSlug,
        title: title.replace(/🏝️|🩺|🌴/g, "").trim(),
        excerpt,
        metaDescription: excerpt.substring(0, 160),
        category: post.category,
        image: image || "/images/hero-main.jpg",
        imageAlt: `${title} — Travel Hood`,
        date,
        dateISO,
        readTime,
        featured: false,
        author: { name: "Travel Hood", role: "Equipo editorial" },
        relatedDestinations: post.relatedDestinations,
        relatedSlugs: [],
        tags: post.tags,
        sections: sections.map((s) => ({
          heading: s.heading,
          body: s.body,
          ...(s.image ? { image: s.image, imageAlt: s.imageAlt } : {}),
        })),
      });

      console.log(`  -> "${title}" (${words} words, ${sections.length} sections)`);
    } catch (e) {
      console.error(`  ERROR scraping ${post.wpUrl}:`, e);
    }
  }

  // Output as TypeScript
  const output = results
    .map((p) => {
      const sectionsStr = p.sections
        .map((s) => {
          const parts = [`      heading: ${JSON.stringify(s.heading)}`, `      body: ${JSON.stringify(s.body)}`];
          if (s.image) parts.push(`      image: ${JSON.stringify(s.image)}`);
          if (s.imageAlt) parts.push(`      imageAlt: ${JSON.stringify(s.imageAlt)}`);
          return `    {\n${parts.join(",\n")}\n    }`;
        })
        .join(",\n");

      return `  {
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt)},
    metaDescription: ${JSON.stringify(p.metaDescription)},
    category: ${JSON.stringify(p.category)},
    image: ${JSON.stringify(p.image)},
    imageAlt: ${JSON.stringify(p.imageAlt)},
    date: ${JSON.stringify(p.date)},
    dateISO: ${JSON.stringify(p.dateISO)},
    readTime: ${JSON.stringify(p.readTime)},
    featured: false,
    author: { name: "Travel Hood", role: "Equipo editorial" },
    relatedDestinations: ${JSON.stringify(p.relatedDestinations)},
    relatedSlugs: [],
    tags: ${JSON.stringify(p.tags)},
    sections: [
${sectionsStr}
    ],
  }`;
    })
    .join(",\n");

  const finalOutput = `
// ═══════════════════════════════════════════════════════════
// MIGRATED FROM WORDPRESS — ${new Date().toISOString().split("T")[0]}
// These posts were automatically extracted from travelhood.es (WordPress)
// ═══════════════════════════════════════════════════════════

export const migratedBlogPosts: BlogPost[] = [
${output}
];
`;

  const fs = await import("fs");
  fs.writeFileSync("scripts/migrated-blog-posts.ts", finalOutput);
  console.log(`\nDone! ${results.length} posts exported to scripts/migrated-blog-posts.ts`);
  console.log("Next step: Copy the entries into src/lib/blog-data.ts");
}

main().catch(console.error);
