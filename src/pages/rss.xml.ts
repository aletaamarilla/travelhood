import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { blogPosts } from "@/lib/blog-data";
import { SITE_URL, FALLBACK_SITE_NAME } from "@/lib/config";

export function GET(context: APIContext) {
  return rss({
    title: `${FALLBACK_SITE_NAME} — Blog`,
    description:
      "Guías, consejos y destinos para viajes en grupo de jóvenes de 20-35 años. Artículos sobre Tailandia, Maldivas, Sri Lanka y más.",
    site: context.site?.toString() ?? SITE_URL,
    trailingSlash: true,
    items: blogPosts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.dateISO),
      description: post.metaDescription || post.excerpt,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>es</language>`,
  });
}
