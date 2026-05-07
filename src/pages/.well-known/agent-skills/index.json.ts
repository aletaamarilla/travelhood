import { agentSkills } from "@/lib/agent-visibility"
import { getPublicAgentSkillsIndex } from "@/lib/agent-skills"

export function GET() {
  return new Response(`${JSON.stringify(getPublicAgentSkillsIndex(), null, 2)}\n`, {
    headers: {
      "Content-Type": agentSkills.index.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
