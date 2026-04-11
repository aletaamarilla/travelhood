import { SITE_URL } from "@/lib/config"

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /redireccion-whatsapp/

Sitemap: ${SITE_URL}/sitemap-index.xml
`
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
