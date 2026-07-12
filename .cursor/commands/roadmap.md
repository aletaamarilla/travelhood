---
description: "Fase 2: genera roadmap en /roadmaps con desglose detallado, Effort obligatorio, uso de skills y paso final de revisión."
---

# roadmap

Actúa como Tech Lead. Te voy a dar un texto que empieza con un identificador corto, seguido opcionalmente de instrucciones específicas para la planificación.

Tu tarea:

1. Extrae la primera palabra de `{input}` como `{slug}`.
2. Lee el resto de `{input}` como instrucciones extra o restricciones.
3. Abre y lee `concepts/CONCEPT_{slug}.md`. Asume que ha sido aprobado.
4. Lee `.cursor/skills/workflow-state/SKILL.md` y `.cursor/skills/roadmap-spec/SKILL.md`.
5. Si el concept afecta a una página, web, landing, formulario, copy o flujo de cara al usuario, lee `.cursor/skills/growth-standards/SKILL.md`.
6. Genera `roadmaps/ROADMAP_{slug}.md` y crea el directorio si no existe.
7. Divide la implementación en tareas secuenciales, todas con `[PENDING]`.
8. Usa el formato obligatorio de `roadmap-spec` para cada tarea.
9. Abre `roadmaps/WIP_ROADMAPS.md` (créalo si no existe) y añade la línea `- [ ] ROADMAP_{slug}.md` al final de la lista.
10. Abre `concepts/WIP_CONCEPTS.md` y elimina la línea `- [ ] {slug}`, ya que el concepto queda promovido a roadmap.
11. RESTRICCIÓN: no escribas código funcional en este paso.

Si la feature es una página/web de cara al usuario, incluye tareas explícitas de:

- SEO técnico: title/meta, OG/Twitter, canonical, sitemap y robots cuando aplique.
- Datos estructurados schema.org: FAQPage, Product, LocalBusiness, Breadcrumb u otros según intención.
- Presupuesto de rendimiento: LCP, CLS, INP, imágenes responsivas y JS mínimo.
- `llms.txt`: resumen del sitio o actualización de enlaces clave para agentes/IA.
- Medición de conversión: eventos, embudo, CTA principal y QA de tracking.

La última tarea SIEMPRE debe ser `[PENDING] Revisión General y Optimización`, con `Effort: high` y validación completa contra `concepts/CONCEPT_{slug}.md`.

Termina respondiendo EXACTAMENTE esto:

```text
✅ Roadmap generado en `roadmaps/ROADMAP_{slug}.md` y registrado. Por favor, limpia el contexto abriendo un nuevo chat y ejecuta `/autopilot {slug}` (o `/next {slug}` si prefieres modo paso a paso).
```
