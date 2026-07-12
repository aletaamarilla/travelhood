---
name: roadmap-spec
description: "Formato obligatorio de roadmaps del flujo concept→roadmap→next/autopilot. Úsala al generar o corregir cualquier ROADMAP_{slug}.md."
---

# Roadmap Spec

Cada roadmap vive en `roadmaps/ROADMAP_{slug}.md` y se ejecuta de arriba abajo.

## Formato obligatorio por tarea

```md
## [PENDING] <Título accionable>

Effort: low | mid | high
Work: auto | manual | hybrid
Focus: frontend | backend | fullstack | content | design | qa | ops

Objetivo: <resultado concreto>
Descripción humana: <qué se hará y por qué>
Detalles técnicos:
- <archivos, contratos, datos o decisiones relevantes>

Skills/reglas:
- <skills y reglas que deben leerse>

Validación:
- <checks verificables para dar la tarea por terminada>
```

## Criterios
- `Effort: low`: cambio acotado, bajo riesgo, normalmente un subagente rápido o ejecución directa.
- `Effort: mid`: varios archivos o decisiones locales, requiere revisión de contexto.
- `Effort: high`: arquitectura, UI compleja, migraciones, SEO amplio, rendimiento o riesgo alto.
- `Work: auto`: el agente puede ejecutarlo sin decisión humana.
- `Work: manual`: requiere input, aprobación, credenciales o acción humana.
- `Work: hybrid`: el agente avanza hasta un punto verificable y bloquea lo que dependa del usuario.

## Validación frontend obligatoria

Para toda tarea con `Focus: frontend`, el campo `Validación` debe incluir el checklist de `growth-standards`:
- Móvil real/mobile-first.
- CTA claro above-the-fold y sin fricción.
- Core Web Vitals: LCP, CLS e INP dentro de presupuesto.
- Title, meta description, OG/Twitter, H1 único, canonical y schema.org cuando aplique.
- Contenido answer-first, FAQ extraíble y `llms.txt` cuando aplique.
- Eventos de conversión/tracking instrumentados.

## Cierre obligatorio

La última tarea del roadmap debe ser una revisión general marcada como `Effort: high`, con validación de build, lint/checks relevantes, regresiones visuales, accesibilidad, tracking y estado final del roadmap.
