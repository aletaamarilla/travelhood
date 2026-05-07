import { createHash } from "node:crypto"
import { agentSkills, site } from "@/lib/agent-visibility"

export type PublicAgentSkillIndexEntry = {
  id: string
  name: string
  description: string
  url: string
  contentType: string
  digest: string
  digestAlgorithm: "sha-256"
  safetyLimits: readonly string[]
}

export type PublicAgentSkill = PublicAgentSkillIndexEntry & {
  content: string
}

export type PublicAgentSkillsIndex = {
  id: string
  name: string
  description: string
  url: string
  contentType: string
  publisher: {
    name: string
    url: string
  }
  skills: PublicAgentSkillIndexEntry[]
}

const skillMarkdownById = {
  "recomendar-viaje": `# Recomendar un viaje Travel Hood

## Objetivo

Ayudar a una persona a elegir opciones de viaje en grupo de Travel Hood usando solo informacion publica del sitio.

## Entradas utiles

- Preferencias de destino, epoca aproximada, duracion, presupuesto orientativo y estilo de viaje.
- Enlaces publicos de Travel Hood que el usuario comparta o que esten disponibles en el sitio.
- Restricciones generales de viaje, como ritmo, clima preferido o interes por playa, cultura, aventura o naturaleza.

## Procedimiento

1. Identifica las preferencias importantes y resume cualquier duda que falte resolver.
2. Consulta solo contenido publico de Travel Hood, como paginas de destinos, tipos de viaje, preguntas frecuentes y home publica.
3. Recomienda una lista corta de opciones con razones claras, ventajas, posibles encajes y enlaces publicos para comprobar detalles actualizados.
4. Indica que precios, fechas, plazas y condiciones deben verificarse en la pagina oficial o con el equipo de Travel Hood.

## Limites de seguridad

- No reservas plazas, no procesas pagos y no confirmas disponibilidad.
- No prometes precios, fechas, cupos, visados, seguros ni requisitos sanitarios como definitivos.
- No accedes a datos internos, cuentas privadas, CRM, analytics ni sistemas de Travel Hood.
- No solicitas ni envias datos personales; trabaja con preferencias generales y enlaces publicos.
- No realizas acciones irreversibles ni tomas decisiones por la persona.
`,
  "preparar-contacto-whatsapp": `# Preparar contacto por WhatsApp

## Objetivo

Redactar un borrador de mensaje para que una persona contacte manualmente con Travel Hood por WhatsApp.

## Entradas utiles

- Destino o tipo de viaje que interesa.
- Preguntas que la persona quiere aclarar, como fechas orientativas, ritmo del viaje o que incluye la experiencia.
- Tono deseado del mensaje: breve, cercano, formal o con una lista de dudas.

## Procedimiento

1. Resume la intencion del contacto y confirma que el resultado sera un borrador editable.
2. Redacta un mensaje claro, breve y amable en espanol, con placeholders si falta algun dato.
3. Incluye solo informacion que la persona haya decidido compartir en el texto final.
4. Recuerda que la persona debe revisar el mensaje y enviarlo manualmente desde su propio dispositivo.

## Limites de seguridad

- No abres WhatsApp, no pulsas enlaces, no rellenas formularios y no envias mensajes.
- No incluyes datos personales sensibles; usa placeholders cuando falte informacion.
- No reservas plazas, no procesas pagos y no confirmas disponibilidad.
- No accedes a historiales, chats, cuentas privadas ni datos internos de Travel Hood.
- No realizas acciones irreversibles ni aceptas condiciones por la persona.
`,
} as const

type PublicAgentSkillId = keyof typeof skillMarkdownById

function sha256Digest(content: string): string {
  return `sha-256=${createHash("sha256").update(content, "utf8").digest("hex")}`
}

function getSkillDefinition(id: PublicAgentSkillId) {
  const skill = agentSkills.skills.find((item) => item.id === id)

  if (!skill) {
    throw new Error(`Missing public agent skill metadata for ${id}`)
  }

  return skill
}

export function getPublicAgentSkill(id: PublicAgentSkillId): PublicAgentSkill {
  const definition = getSkillDefinition(id)
  const content = skillMarkdownById[id]

  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    url: definition.url,
    contentType: definition.contentType,
    digest: sha256Digest(content),
    digestAlgorithm: "sha-256",
    safetyLimits: definition.safetyLimits,
    content,
  }
}

export function getPublicAgentSkills(): PublicAgentSkill[] {
  return (Object.keys(skillMarkdownById) as PublicAgentSkillId[]).map(getPublicAgentSkill)
}

export function getPublicAgentSkillsIndex(): PublicAgentSkillsIndex {
  return {
    id: agentSkills.index.id,
    name: "Travel Hood public agent skills",
    description:
      "Indice publico de skills seguras para agentes que trabajan con contenido publico de Travel Hood.",
    url: agentSkills.index.url,
    contentType: agentSkills.index.contentType,
    publisher: {
      name: site.name,
      url: site.url,
    },
    skills: getPublicAgentSkills().map(({ content: _content, ...skill }) => skill),
  }
}
