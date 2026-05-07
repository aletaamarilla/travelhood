import { contentSignals } from "@/lib/agent-visibility"
import { SITE_URL } from "@/lib/config"

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /redireccion-whatsapp/
${contentSignals.robotsDirective}: ${contentSignals.value}

Sitemap: ${SITE_URL}/sitemap-index.xml
`
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
