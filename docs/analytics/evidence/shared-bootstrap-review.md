# Revisión independiente final

Fecha: 24/10/2026. Revisor: subagente `browser_restart_review`, encargo de sólo lectura; no modificó implementación, no operó cuentas ni reejecutó builds/tests.

Base: `000c264bf6278ba84f2ded9e0803938ab07a7942`. Candidata final sin commit: `012f52954928ce195beff1a007e3621a69c5ea316d7059c2a13f6baf048ddfb4`, 35 archivos de implementación/documentación, todos los hashes recalculados sin discrepancias. JSON parcial GTM `33a908fee7b15a91c89d1f0b0b814df55f19610f947f3f4165ca49fa58bc5b4c`; export oficial final `f2515c8568f1a3eecfcbec768e97cf607a719a3366e112b5c72438026030e614`.

Se entregaron requisitos, restricciones (Meta aparte, filtros pospuestos, sin publicación), base/diff, contrato, consumidores, archivos nuevos, manifiesto, logs y capturas reales. El revisor contrastó la fuente y evidencia, sin aceptar la conclusión del implementador como sustituto de esas comprobaciones.

## Hallazgo bloqueante resuelto

Escenario: al abrir privados con consentimiento nuevo o persistido se emiten page_view y landing consecutivamente. Impacto: se sustituía el primer evento por el último y se duplicaba landing en vez de contar correctamente la vista de página. Ubicación: secuencia setupTag de `scripts/prepare-analytics-gtm.ts`, Google Tag 5 y GA4 Event 35 del workspace 6. Evidencia anterior: `shared-bootstrap-browser/1792853022039-ayelwx.json` y contraste de Variables frente a valores de etiqueta/hit en Tag Assistant. El revisor descartó que el parser batch reutilizara objetos; no dio por hecho la causa antes del contraste real.

Resolución: Google Tag inicia sobre eventos propios consentidos, prioridad 100, una vez por documento y send_page_view=false; la etiqueta dinámica ya no espera un setup asíncrono. Se mantienen guard y analytics_storage en ambas. Resultado posterior: SDK con nombres distintos para primera concesión y consentimiento persistido, contacto correcto; DebugView recibe page_view/landing/contacto. Controles de configuración, tipos y generación repetidos PASS.

## Precisiones incorporadas

- El loader conserva su ciclo compartido; no se afirma identidad de todo Layout con la base ni validación del SDK Meta. Meta tag3 del export final coincide exactamente con el original.
- Gate false no recupera por sí solo la medición tras publicar Google Tag sobre eventos propios; reversión coordinada documentada.
- Totales DebugView 3/3/2 pertenecen a varios documentos durante 30 minutos; unicidad por documento mediante snapshots.
- Debug true anterior también llegó con retraso; 1 es normalización del adaptador nativo, no prueba de que true nunca funcione.
- Sin exclusión real de QA: filtros Exclude/Prueba conservados por decisión expresa del titular.

## Conclusión del revisor

Sin defectos accionables bloqueantes detectados dentro del alcance final revisado. Confirmó 35/35 hashes, git diff --check satisfactorio, JSON/export y consumidores compatibles. Capturas inspeccionadas confirman contacto con cta=hero y measurement_version=1. No extender esta conclusión a SDK Meta, los 19 nombres recibidos en servicios reales o producción.

Pendientes esenciales: publicación/despliegue coordinados, validación en producción móvil/escritorio e informe procesado. La fase no se declara validada ni se asigna reliable_from.
