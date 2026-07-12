---
description: "Fase 3B: ejecuta solo la siguiente tarea pendiente del roadmap y deja el estado actualizado."
---

# next

Ejecuta el siguiente paso de la feature `{input}`.

Flujo:

1. Abre `roadmaps/ROADMAP_{input}.md`.
   - Si no existe, responde: `❌ No se encontró roadmaps/ROADMAP_{input}.md. Ejecuta /roadmap {input} primero.` y detente.
2. Lee `.cursor/skills/workflow-state/SKILL.md` y `.cursor/skills/roadmap-spec/SKILL.md`.
3. Busca la primera tarea `[PENDING]`.
   - Si no hay tareas pendientes, resume el estado final y detente.
4. Lee `Effort`, `Work`, `Focus`, `Detalles técnicos`, `Skills/reglas` y `Validación`.
5. Si `Focus: frontend`, lee `.cursor/skills/growth-standards/SKILL.md`.
6. Ejecuta solo esa tarea, usando subagente si el `Effort` o el `Focus` lo justifican.
7. Verifica la `Validación`.
8. Si pasa, cambia la tarea a `[DONE]`.
9. Si falta una decisión humana, cambia la tarea a `[BLOCKED]` y explica qué decisión falta.
10. Si ya no quedan tareas `[PENDING]`, abre `roadmaps/WIP_ROADMAPS.md` y elimina la línea `- [ ] ROADMAP_{input}.md`.
11. Detente después de esa tarea.

Respuesta final:

- Tarea ejecutada.
- Estado nuevo: `[DONE]` o `[BLOCKED]`.
- Validación realizada.
- Siguiente tarea pendiente, si existe.
