import { resources } from "@/lib/agent-visibility"
import { estimateMarkdownTokens, renderHomeMarkdown } from "@/lib/home-markdown"

export async function GET() {
  const markdown = await renderHomeMarkdown()

  return new Response(markdown, {
    headers: {
      "Content-Type": resources.homeMarkdown.contentType,
      "Cache-Control": "public, max-age=3600",
      "Vary": "Accept",
      "X-Markdown-Tokens": String(estimateMarkdownTokens(markdown)),
    },
  })
}
