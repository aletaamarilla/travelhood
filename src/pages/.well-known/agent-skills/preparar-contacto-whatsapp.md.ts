import { getPublicAgentSkill } from "@/lib/agent-skills"

export function GET() {
  const skill = getPublicAgentSkill("preparar-contacto-whatsapp")

  return new Response(skill.content, {
    headers: {
      "Content-Type": skill.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
