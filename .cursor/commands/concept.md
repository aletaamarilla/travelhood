---
description: "Fase 1: genera el mapa conceptual aprobado para una feature antes de desglosarla en roadmap."
---

# concept

Actúa como un Staff Engineer. Te voy a dar un texto que empieza con un identificador corto (el slug) seguido de toda la explicación detallada de la feature.

Flujo:

1. Extrae la PRIMERA PALABRA de `{input}` como `{slug}`.
2. Lee todo el RESTO de `{input}` como contexto, requerimientos de negocio y restricciones.
3. Si afecta a dominio, datos o negocio, lee `.cursor/skills/domain/SKILL.md`.
4. Si afecta a marca, copy, UI o experiencia visible, lee `.cursor/skills/brand/SKILL.md`.
5. Si cualquier parte será visible para cliente final, consulta `.cursor/skills/growth-standards/SKILL.md`.
6. Crea `concepts/CONCEPT_{slug}.md` con un mapa conceptual claro y accionable.
7. Abre `concepts/WIP_CONCEPTS.md` (créalo si no existe) y añade la línea `- [ ] {slug}` al final de la lista.
8. REGLA CRÍTICA: no escribas código funcional ni dividas el trabajo en tareas todavía.

La solución y la arquitectura propuestas DEBEN nacer mobile-first, orientadas a conversión y preparadas para SEO+GEO: SSR/SSG cuando aplique, contenido indexable, datos estructurados, rendimiento y medición desde el inicio.

Formato del concept:

```md
# Concept: {slug}

## Objetivo

## Usuario e intención

## Propuesta de solución

## Arquitectura propuesta

## Mobile-first, conversión, SEO y GEO

## Datos, integraciones y tracking

## Riesgos, decisiones y bloqueos

## Fuera de alcance

## Criterios de aceptación
```

Si faltan decisiones imprescindibles, marca una sección `Bloqueos` y pregunta antes de continuar.

Termina respondiendo EXACTAMENTE esto:

```text
✅ Mapa conceptual generado en `concepts/CONCEPT_{slug}.md`. Por favor, revísalo y cuando lo apruebes, limpia el contexto y ejecuta `/roadmap {slug}`.
```
