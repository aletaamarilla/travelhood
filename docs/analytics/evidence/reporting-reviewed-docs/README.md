# Analítica Travelhood — estado actual

Actualizado el 24/10/2026. **Implementación publicada; validación local aprobada; verificación externa parcial. Fase 1 todavía no validada.**

La versión GTM 6 y la candidata web `012f5295…` están activas desde las 17:36 del 24/10/2026 (Europe/Madrid). Este registro sustituye los estados «sin publicar/sin desplegar» de los documentos previos; sus contratos y evidencias se conservan. No hay todavía fecha de medición comercial fiable (`reliable_from=null`). La comprobación adicional confirma preferencias/recorridos responsive y recepción agregada de search_started con versión1 y tráfico external. La recepción del contacto privado se confirmó después: GA4 muestra hero1 y final1, con versión1, URL canónica y tráfico external para ambos. El clic humano anterior no se identifica individualmente; siguen abiertas la traza completa de retirada/unicidad y los informes procesados.

- [Informe mensual guardado en GA4: nueve tablas, campos y validación pendiente](client-reporting.md).
- [Última comprobación: WhatsApp privado recibido en GA4, parámetros y límites](evidence/whatsapp-production-validation.md).
- [Matriz general de producción y pendientes](evidence/production-recheck.md).
- [Cierre de publicación y reversión](evidence/production-validation.md).
- [Inventario, definiciones comerciales y contrato de eventos](phase-1.md) — su párrafo de estado es anterior a la publicación; usar el cierre enlazado arriba.
- [Validación anterior a publicar](evidence/shared-bootstrap-validation.md), [revisión independiente](evidence/shared-bootstrap-review.md) y [manifiesto de los 35 archivos revisados/desplegados](evidence/shared-bootstrap-manifest.json).
- [Solicitud técnica para Mygocu, preparada y no enviada](mygocu-request.md).

Se mantienen la propiedad oficial G-XQMPJG8B08, su histórico y la configuración de Meta. Los filtros de tráfico interno/desarrollador permanecen en Prueba por decisión expresa del titular; las pocas visitas QA pueden entrar en informes comerciales.

Publicación por CLI desde un release aislado, sin commit/push. Antes de otro despliegue Git hay que incorporar la candidata revisada: main remoto aún no contiene estos cambios.
