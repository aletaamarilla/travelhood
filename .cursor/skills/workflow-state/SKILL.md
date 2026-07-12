---
name: workflow-state
description: "Estado del flujo concept→roadmap→next/autopilot del proyecto. Úsala al crear, consultar o avanzar concepts, roadmaps o tareas [PENDING]/[DONE]/[BLOCKED]."
---

# Workflow State

El flujo del proyecto es determinista:

1. `/concept {slug} ...` crea `concepts/CONCEPT_{slug}.md`.
2. `/roadmap {slug} ...` lee el concept aprobado y crea `roadmaps/ROADMAP_{slug}.md`.
3. `/next {slug}` ejecuta la primera tarea `[PENDING]`.
4. `/autopilot {slug}` ejecuta todas las tareas `[PENDING]` en orden.

## Estado
- Usa `[PENDING]`, `[DONE]` y `[BLOCKED]` como estado de tareas.
- Cambia una tarea a `[DONE]` solo cuando su `Validación` esté cumplida.
- Cambia una tarea a `[BLOCKED]` si requiere una decisión humana o falta información.
- No saltes tareas: toma siempre la primera `[PENDING]`.

## Archivos esperados
- Concept: `concepts/CONCEPT_{slug}.md`.
- Roadmap: `roadmaps/ROADMAP_{slug}.md`.
- Registro de concepts: `concepts/WIP_CONCEPTS.md`.
- Registro de roadmaps: `roadmaps/WIP_ROADMAPS.md`.
- Evidencias opcionales: `QA_{slug}.md`, `INVENTORY_{slug}.md` o notas enlazadas desde el roadmap.

## Reglas de continuidad
- Si falta el concept, pide ejecutar `/concept {slug}`.
- Si falta el roadmap, pide ejecutar `/roadmap {slug}`.
- `/concept` añade `- [ ] {slug}` a `concepts/WIP_CONCEPTS.md`.
- `/roadmap` añade `- [ ] ROADMAP_{slug}.md` a `roadmaps/WIP_ROADMAPS.md` y elimina `- [ ] {slug}` de `concepts/WIP_CONCEPTS.md`.
- `/next` y `/autopilot` eliminan `- [ ] ROADMAP_{slug}.md` de `roadmaps/WIP_ROADMAPS.md` cuando no quedan tareas `[PENDING]`.
- Si una tarea no tiene `Effort` o `Focus`, infiérelo, escríbelo en el roadmap y continúa.
- Respeta cambios del usuario y no reescribas trabajo ya marcado como `[DONE]` salvo petición explícita.
