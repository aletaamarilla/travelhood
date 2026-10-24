# Revisión de la actualización de acceso y cuenta — 2026-10-24

Subagente **browser_restart_review**, encargo inicial de solo lectura. No creó chats de usuario, editó implementación, inició servicios ni operó la sesión de Google.

Base Git `000c264bf6278ba84f2ded9e0803938ab07a7942`. Implementación revisada previamente `92f841642032b564285467f7806f8d7e094952898684e5e6a78d82292eeb960d`; sus31 hashes se contrastaron independientemente sin discrepancias y `git diff --check` terminó0. El revisor examinó el suplemento de auditoría MD/JSON y las adendas de reparación/estado. No detectó defectos accionables de reporte. No se inventan hallazgos para justificar la revisión.

Comprobó separación de lectura UI/importación frente a ejecución/recepción, que Preview sin dominio no acredita SDK, que filtros Prueba no excluyen, que el bootstrap Meta compartido sigue como dependencia, y que reliableFrom permanece null. Su revisión no reproduce el inventario autenticado ni sustituye Tag Assistant, DebugView o informes.

Primera versión examinada: MD SHA `b593cebcf7d462c9aa6e44b385d27ce1c57b217a6f53df1fe8880e8d8ca7a43c`; JSON SHA `1b68020ab5976f5e1c8e02bc94cac4b0432c717b626dc2d3d65cd513ed2247fd`. Posteriormente se registró el resultado de revisión y se precisó la condición base/candidata de carga GTM; no cambió fuente o configuración. Identidad final de estos dos reportes:

- `account-audit-2026-10-24.md`: SHA-256 `c8574f7ffbccfe5fa0738c01d18067a24fcb08503fb07338743da29aa8d4ea10`.
- `account-audit-2026-10-24.json`: SHA-256 `bee856c0f272231ba67a2bef7e2a4aac1fe15cec10674d5055b05f028f99bc1d`.

El mismo revisor confirmó la redacción final y ambos SHA anteriores, incluida la precisión del bloqueo de despliegue. No detectó defectos adicionales de reporte. Bloqueos de activación no resueltos: consentimiento/compatibilidad del contenedor compartido, filtros efectivos, capturas automáticas, SDK/recepción/reportes y despliegue coordinado. La reparación Browser sí tiene evidencia funcional directa; no se atribuye por ello éxito de la fase de medición.


## Contraste técnico adicional, sin implementación

Se pidió al mismo revisor evaluar restaurar el cargador GTM legado y limitar el gate a Google para preservar la gestión separada de Meta. No se aplicó esa alternativa. Su revisión concluyó que exige protección Google temprana antes de GTM, un único propietario de consentimiento, gate de emisión, comprobación real de retirada sin recarga global y convivencia del Google legado. Restaurar solo el cargador no satisface estos puntos.

Escenarios/impacto/ubicación contrastados:

- Base `src/layouts/Layout.astro` carga GTM de inmediato; candidata `src/lib/analytics.ts` lo supedita a analítica+gate. Desplegar gatefalse elimina también la carga compartida. Es un bloqueo conocido de despliegue, no resuelto por conservar el tag Meta del export.
- Mover carga a inline sin mover protección de cookie/bloqueo/ga-disable permitiría carrera antes del módulo diferido: podría ejecutarse Google con consentimiento antiguo cuya retirada no se pudo persistir. Alternativa requiere prueba específica.
- Eliminar el estado loaded rompe la condición de recarga de retirada actual; mantener o añadir recarga global vuelve a ejecutar contenedor/Meta. Detener listeners Google sin recarga requiere SDK real; las pruebas con stub no lo demuestran.
- Con candidata GTM publicada, Google5 solo es setup del tag nuevo; gatefalse no restablece su activador legado. No presentar el gate como rollback automático del contenedor. La versión de transición y la ventana de convivencia siguen necesarias.
- El Google5 legado bloqueado en Initialization por consentimiento adicional no vuelve a dispararse automáticamente al aceptar. No prometer cobertura intacta de esa transición al restaurar el cargador. Referencia primaria consultada por el revisor: [Google, etiquetas bloqueadas por comprobaciones adicionales](https://support.google.com/google-ads/answer/12962079?hl=en).

Conclusión limitada: no se aplicó una corrección apresurada ni se modificó Meta para forzar cierre. La alternativa requiere implementación, pruebas pertinentes y revisión sobre una nueva candidata identificada; la identidad31 actual permanece igual y sigue sin ser apta para despliegue por el bloqueo señalado.
