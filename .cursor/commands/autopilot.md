---
description: "Fase 3A: main thread orquestador que ejecuta todo el roadmap delegando cada tarea en subagentes por Effort/Focus."
---

# autopilot

Actúa como Orquestador Principal. Vamos a ejecutar automáticamente la feature `{input}` de principio a fin.

Flujo inquebrantable:

1. Abre `roadmaps/ROADMAP_{input}.md`.
   - Si no existe, responde: `❌ No se encontró roadmaps/ROADMAP_{input}.md. Ejecuta /roadmap {input} primero.` y detente.
2. Lee `.cursor/skills/workflow-state/SKILL.md` y `.cursor/skills/roadmap-spec/SKILL.md`.
3. Recorre las tareas en orden. En cada iteración toma siempre la primera tarea `[PENDING]`.
4. Lee explícitamente `Effort` y `Focus`.
   - Si falta alguno, infiérelo desde la tarea, complétalo en el roadmap y continúa.
5. Si `Focus: frontend`, asegúrate de que el ejecutor lee `.cursor/skills/growth-standards/SKILL.md`.
6. Delega o ejecuta según esta guía:
   - `Effort: low`: ejecución directa o subagente rápido.
   - `Effort: mid`: subagente especializado por `Focus`.
   - `Effort: high`: subagente fuerte, revisión del main thread y validación completa.
7. Pasa al subagente el slug, el concept, la tarea literal, restricciones, skills requeridas y criterios de validación.
8. Al terminar cada tarea, verifica su `Validación`.
9. Si no queda completa/validada, reintenta una sola vez.
10. Si vuelve a fallar, detente y responde: `⚠️ Autopilot detenido en ROADMAP_{input}.md. La tarea actual no pudo completarse tras 2 intentos. Revisa el estado y relanza /autopilot {input}.`
11. Si pasa, cambia `[PENDING]` por `[DONE]`.
12. Si se bloquea por decisión humana, cambia `[PENDING]` por `[BLOCKED]`, resume el bloqueo y detente.
13. Continúa hasta que no queden tareas `[PENDING]`.
14. Si ya no quedan pendientes, abre `roadmaps/WIP_ROADMAPS.md` y elimina la línea `- [ ] ROADMAP_{input}.md`.
15. Termina respondiendo: `🎯 Autopilot completado para {input}. Todas las tareas del roadmap están en [DONE] y el roadmap fue retirado de WIP_ROADMAPS.md.`

Normas:

- No ejecutes tareas fuera de orden.
- No marques `[DONE]` sin validación.
- No reescribas decisiones aprobadas en el concept.
- Conserva cambios del usuario.
- Resume al final: tareas completadas, validación ejecutada, bloqueos y archivos tocados.
