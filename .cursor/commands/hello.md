---
description: "Muestra el flujo de trabajo IA disponible para este proyecto."
---

# hello

Este proyecto trabaja con un flujo determinista:

1. `/concept {slug} <brief>`: crea `concepts/CONCEPT_{slug}.md`.
2. `/roadmap {slug}`: crea `roadmaps/ROADMAP_{slug}.md` desde el concept aprobado.
3. `/next {slug}`: ejecuta la primera tarea `[PENDING]` y se detiene.
4. `/autopilot {slug}`: ejecuta todo el roadmap en orden, delegando por `Effort` y `Focus`.

Skills clave:

- `.cursor/skills/workflow-state/SKILL.md`: estado del flujo.
- `.cursor/skills/roadmap-spec/SKILL.md`: formato obligatorio de tareas.
- `.cursor/skills/growth-standards/SKILL.md`: mobile-first, conversión, SEO y GEO para todo lo visible por cliente final.

Para empezar: `/concept miFeature Describe aquí la intención, restricciones y resultado esperado`.
