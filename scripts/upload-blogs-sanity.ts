/**
 * Uploads the 11 migrated WordPress blog posts to Sanity CMS.
 * Downloads images from WP, uploads them to Sanity, and creates blogPost documents.
 *
 * Usage: npx tsx scripts/upload-blogs-sanity.ts
 */

import { createClient } from "@sanity/client";
import { createReadStream, writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import "dotenv/config";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const TMP_DIR = join(process.cwd(), "scripts/.tmp-images");

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  date: string;
  dateISO: string;
  readTime: string;
  tags: string[];
  relatedDestinationSlugs: string[];
  sections: { heading: string; body: string }[];
}

const posts: PostData[] = [
  {
    slug: "top-destinos-tendencia-viaje-grupo",
    title: "Top 5 destinos tendencia 2025 para viajar en grupo reducido",
    excerpt: "El 2025 llega cargado de nuevas tendencias viajeras. Descubre los 5 destinos que más triunfan entre jóvenes de 20-35 años.",
    metaDescription: "Top 5 destinos tendencia 2025 para viajar en grupo reducido: México, Brasil, Egipto, Filipinas e Islandia. Descúbrelos con Travel Hood.",
    category: "Inspiración",
    imageUrl: "https://travelhood.es/wp-content/uploads/2022/03/be22da59-81cd-4093-bc5a-690dda04ebfa-scaled.jpg",
    imageAlt: "Top 5 destinos tendencia 2025 para viajar en grupo reducido — Travel Hood",
    date: "06/09/2025",
    dateISO: "2025-09-06",
    readTime: "5 min",
    tags: ["destinos tendencia", "viajes en grupo", "viajes para jóvenes"],
    relatedDestinationSlugs: ["brasil", "filipinas-verano"],
    sections: [],
  },
  {
    slug: "por-que-elegir-viaje-grupo-reducido",
    title: "¿Por qué elegir un viaje en grupo reducido?",
    excerpt: "Los viajes en grupo reducido se han convertido en la opción preferida de los jóvenes viajeros. Te contamos por qué.",
    metaDescription: "Descubre por qué los viajes en grupo reducido son la mejor forma de viajar para jóvenes de 20-35 años. Conexión, flexibilidad y autenticidad.",
    category: "Inspiración",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/07/eventosmusicales-scaled.jpg",
    imageAlt: "¿Por qué elegir un viaje en grupo reducido? — Travel Hood",
    date: "06/09/2025",
    dateISO: "2025-09-06",
    readTime: "3 min",
    tags: ["viajes en grupo", "grupo reducido", "viajes organizados"],
    relatedDestinationSlugs: [],
    sections: [],
  },
  {
    slug: "templos-tailandia-imprescindibles",
    title: "Templos en Tailandia que no puedes perderte",
    excerpt: "Los templos tailandeses son el alma del país. Descubre los imprescindibles: de Bangkok a Chiang Rai.",
    metaDescription: "Guía de los templos imprescindibles de Tailandia: Wat Phra Kaew, Wat Pho, Wat Arun, Templo Blanco y más. Tradición, arquitectura y espiritualidad.",
    category: "Guías",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/pexels-khanishaan-33297619-scaled.jpg",
    imageAlt: "Templos en Tailandia imprescindibles — Travel Hood",
    date: "07/08/2025",
    dateISO: "2025-08-07",
    readTime: "2 min",
    tags: ["tailandia", "templos", "cultura", "guía de viaje"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "maldivas-grupo-reducido-experiencia",
    title: "Maldivas en grupo reducido: lujo compartido",
    excerpt: "Las Maldivas también se pueden vivir en grupo reducido. Descubre la experiencia de lujo compartida con jóvenes viajeros.",
    metaDescription: "Maldivas en grupo reducido: snorkel, cenas bajo las estrellas y conexión con jóvenes viajeros. Lujo compartido con Travel Hood.",
    category: "Destinos",
    imageUrl: "https://travelhood.es/wp-content/uploads/2022/03/GOPR0550-scaled.jpg",
    imageAlt: "Maldivas en grupo reducido — Travel Hood",
    date: "06/09/2025",
    dateISO: "2025-09-06",
    readTime: "4 min",
    tags: ["maldivas", "viaje de lujo", "grupo reducido", "snorkel"],
    relatedDestinationSlugs: ["maldivas"],
    sections: [],
  },
  {
    slug: "viajar-tailandia-grupo-reducido",
    title: "Viajar a Tailandia en grupo reducido",
    excerpt: "Tailandia en grupo reducido: cultura, aventura y templos para auténticos travelhooders.",
    metaDescription: "Viajar a Tailandia en grupo reducido: cultura, aventura, templos y playas. La mejor forma de descubrir el país de las sonrisas.",
    category: "Destinos",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/2-scaled.jpg",
    imageAlt: "Viajar a Tailandia en grupo reducido — Travel Hood",
    date: "06/09/2025",
    dateISO: "2025-09-06",
    readTime: "4 min",
    tags: ["tailandia", "viajes en grupo", "aventura", "templos"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "como-cambiar-dinero-tailandia",
    title: "Cómo llevar y cambiar dinero en Tailandia",
    excerpt: "Guía práctica para gestionar tu dinero en Tailandia: euros, casas de cambio, tarjetas y cajeros.",
    metaDescription: "Cómo llevar y cambiar dinero en Tailandia: euros, casas de cambio, cajeros y tarjetas. Guía práctica para travelhooders.",
    category: "Consejos",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/ChatGPT-Image-7-ago-2025-16_44_18.png",
    imageAlt: "Cómo cambiar dinero en Tailandia — Travel Hood",
    date: "07/08/2025",
    dateISO: "2025-08-07",
    readTime: "2 min",
    tags: ["tailandia", "dinero", "consejos prácticos", "presupuesto"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "bangkok-mejores-rooftops",
    title: "Bangkok desde las alturas: rooftops imprescindibles",
    excerpt: "Los mejores rooftops de Bangkok: Sky Bar, Vertigo, Octave y más. Vistas, cócteles y ambiente.",
    metaDescription: "Los mejores rooftops de Bangkok para travelhooders: Sky Bar, Vertigo, Octave y más. Vistas panorámicas, cócteles y ambiente único.",
    category: "Guías",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/pexels-freestockpro-1031698-scaled.jpg",
    imageAlt: "Mejores rooftops de Bangkok — Travel Hood",
    date: "07/08/2025",
    dateISO: "2025-08-07",
    readTime: "4 min",
    tags: ["bangkok", "rooftops", "tailandia", "vida nocturna"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "guia-definitiva-tailandia",
    title: "Guía definitiva para viajar a Tailandia",
    excerpt: "Todo lo que necesitas saber para viajar a Tailandia: itinerario, qué llevar, seguridad y más.",
    metaDescription: "Guía definitiva para viajar a Tailandia con Travel Hood: 13 días, itinerario, qué llevar, seguridad y experiencias únicas.",
    category: "Guías",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/pexels-miroalt-176400-scaled.jpg",
    imageAlt: "Guía definitiva para viajar a Tailandia — Travel Hood",
    date: "07/08/2025",
    dateISO: "2025-08-07",
    readTime: "2 min",
    tags: ["tailandia", "guía completa", "qué llevar", "seguridad"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "vacunas-salud-viajar-tailandia",
    title: "Vacunas y salud para viajar a Tailandia",
    excerpt: "Qué vacunas necesitas para viajar a Tailandia, cuándo ponértelas y cómo prepararte.",
    metaDescription: "Vacunas y salud para viajar a Tailandia: hepatitis A/B, fiebre tifoidea, rabia y más. Guía completa para travelhooders.",
    category: "Consejos",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/pexels-te-lensfix-380994-1371360-scaled.jpg",
    imageAlt: "Vacunas y salud para viajar a Tailandia — Travel Hood",
    date: "07/08/2025",
    dateISO: "2025-08-07",
    readTime: "3 min",
    tags: ["tailandia", "vacunas", "salud", "preparación viaje"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "seguro-viaje-tailandia-guia",
    title: "¿Es necesario un seguro de viaje para Tailandia?",
    excerpt: "Por qué necesitas un seguro de viaje para Tailandia: coberturas, precios y recomendaciones.",
    metaDescription: "Seguro de viaje para Tailandia: por qué es necesario, qué coberturas elegir y cuánto cuesta. Guía completa para viajar tranquilo.",
    category: "Consejos",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/08/pexels-anetta-kolesnikova-2154382947-33271606-scaled.jpg",
    imageAlt: "Seguro de viaje para Tailandia — Travel Hood",
    date: "07/08/2025",
    dateISO: "2025-08-07",
    readTime: "3 min",
    tags: ["tailandia", "seguro de viaje", "seguridad", "consejos"],
    relatedDestinationSlugs: ["tailandia-verano", "tailandia-invierno"],
    sections: [],
  },
  {
    slug: "tren-sri-lanka-ruta-magica",
    title: "Tren de Sri Lanka: Un Viaje Mágico por la Isla",
    excerpt: "La ruta en tren de Kandy a Ella es una de las más bonitas del mundo. Descubre cómo vivirla.",
    metaDescription: "Tren de Sri Lanka: la ruta mágica de Kandy a Ella. Plantaciones de té, el Puente de Nueve Arcos y paisajes inolvidables.",
    category: "Destinos",
    imageUrl: "https://travelhood.es/wp-content/uploads/2025/06/IMG-20250123-WA0039.jpg",
    imageAlt: "Tren de Sri Lanka ruta mágica — Travel Hood",
    date: "07/07/2025",
    dateISO: "2025-07-07",
    readTime: "6 min",
    tags: ["sri lanka", "tren", "ruta panorámica", "aventura"],
    relatedDestinationSlugs: ["sri-lanka-verano", "sri-lanka-invierno"],
    sections: [],
  },
];

async function downloadImage(url: string, filename: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filepath = join(TMP_DIR, filename);
  writeFileSync(filepath, buffer);
  return filepath;
}

async function uploadImage(filepath: string, filename: string): Promise<string> {
  const asset = await client.assets.upload("image", createReadStream(filepath), {
    filename,
  });
  return asset._id;
}

async function resolveDestinationRefs(slugs: string[]): Promise<{ _type: "reference"; _ref: string; _key: string }[]> {
  if (slugs.length === 0) return [];
  const results = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "destination" && slug.current in $slugs]{_id, "slug": slug.current}`,
    { slugs }
  );
  return results.map((d, i) => ({
    _type: "reference" as const,
    _ref: d._id,
    _key: `dest-${i}`,
  }));
}

async function getSectionsForSlug(slug: string): Promise<{ heading: string; body: string }[]> {
  const json = await import("../scripts/migrated-posts-clean.json", { with: { type: "json" } });
  const post = json.default.find((p: any) => p.slug === slug);
  return post?.sections ?? [];
}

async function main() {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

  console.log("Checking existing blog posts in Sanity...");
  const existing = await client.fetch<string[]>(`*[_type == "blogPost"].slug.current`);
  console.log(`Found ${existing.length} existing posts in Sanity\n`);

  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    if (existing.includes(post.slug)) {
      console.log(`[SKIP] ${post.slug} (already exists)`);
      skipped++;
      continue;
    }

    console.log(`[UPLOAD] ${post.slug}`);

    // 1. Download & upload hero image
    const ext = post.imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const imgFilename = `${post.slug}.${ext}`;
    console.log(`  Downloading image...`);
    const imgPath = await downloadImage(post.imageUrl, imgFilename);
    console.log(`  Uploading to Sanity...`);
    const imageAssetId = await uploadImage(imgPath, imgFilename);
    unlinkSync(imgPath);

    // 2. Resolve destination references
    const destRefs = await resolveDestinationRefs(post.relatedDestinationSlugs);
    console.log(`  Resolved ${destRefs.length}/${post.relatedDestinationSlugs.length} destination refs`);

    // 3. Get sections from clean JSON
    const sections = await getSectionsForSlug(post.slug);
    console.log(`  ${sections.length} sections`);

    // 4. Create document
    const doc = {
      _type: "blogPost",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      category: post.category,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAssetId },
      },
      imageAlt: post.imageAlt,
      publishedAt: new Date(post.dateISO).toISOString(),
      readTime: post.readTime,
      featured: false,
      author: { name: "Travel Hood", role: "Equipo editorial" },
      tags: post.tags,
      sections: sections.map((s, i) => ({
        _type: "blogSection",
        _key: `section-${i}`,
        heading: s.heading || "(Introducción)",
        body: s.body,
      })),
      relatedDestinations: destRefs.length > 0 ? destRefs : undefined,
      seo: {
        _type: "blogSeo",
        metaDescription: post.metaDescription,
        keywords: post.tags.join(", "),
      },
    };

    await client.create(doc);
    console.log(`  Created!`);
    created++;
  }

  // Cleanup
  if (existsSync(TMP_DIR)) {
    const { readdirSync } = await import("fs");
    for (const f of readdirSync(TMP_DIR)) unlinkSync(join(TMP_DIR, f));
    const { rmdirSync } = await import("fs");
    rmdirSync(TMP_DIR);
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Total: ${posts.length}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
