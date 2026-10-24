# Seguimiento manual y de informes — 24/10/2026

**Implementación publicada; fuente intacta; validación local anterior aprobada; verificación externa parcial. Fase 1 sigue abierta.** reliable_from=null y businessReportReady=false.

## Confirmación del titular

El titular respondió «comprobado, todo bien». Al distinguir navegador/cookies de informes/campaña/PDF, precisó: «Comprobé solo las pruebas del navegador y las cookies».

Se acepta como resultado manual comunicado de las pruebas de navegador y cookies indicadas previamente. No se transforma en una captura técnica realizada por el agente. No se aportaron conteos por escenario, dispositivo/navegador, hora exacta de ejecución o traza cruda; no se inventan ni se vuelve a exigir al titular que repita todo. La evidencia local y la traza enlazada de WhatsApp anteriores se conservan.

La confirmación no acredita informes procesados, atribución ni PDF. Las pruebas de consentimiento se refieren a Analytics; no amplían la validación del SDK Meta.

## Nueva comprobación real de GA4

En la propiedad oficial 498178258 / G-XQMPJG8B08:

- Se actualizó la exploración guardada, periodo Este mes 1–24 octubre 2026.
- 01 Resumen, 03 Fuentes y campañas y 07 Privados - botones muestran No hay datos disponibles, con las consultas terminadas. Se conservaron los segmentos y filtros v1; no se quitaron para rellenar tablas.
- El informe estándar Eventos, periodo Hoy 24–24 octubre 2026, ya contiene private_trip_whatsapp_click. Es recepción en un informe procesado real, además de DebugView. El agregado incluye posibles pruebas y otras sesiones del día, sin filtro de versión; no se atribuye a un clic concreto ni demuestra valores de cta/version/campaña conciliados.
- Se solicitó PDF (todas las pestañas). No se observó descarga dentro de una espera de 15000ms. No hubo archivo verificable o visor PDF nuevo en las pestañas disponibles. Esto no demuestra un fallo de exportación de Google.
- Se devolvió la sesión a 01 Resumen y se cerró la pestaña temporal del informe estándar. No se alteraron etiquetas, dimensiones, segmentos, filtros de tráfico, eventos clave, inversión o Meta.

Observaciones estructuradas y hashes de capturas locales: [manual-followup-2026-10-24.json](manual-followup-2026-10-24.json). Las capturas/AX y el conteo agregado permanecen en archivo operativo local; no se publican datos comerciales crudos en Git.

## Matriz de aceptación de este seguimiento

| Criterio | Prueba | Entorno | Resultado | Evidencia |
| --- | --- | --- | --- | --- |
| Registrar fielmente el alcance manual | Confirmación y respuesta a aclaración | Usuario, pruebas de navegador/cookies | PASS comunicado; sin conteos/traza aportados | userManualValidation en JSON |
| Distinguir recogida de reporte procesado | Abrir informe estándar Eventos, Hoy y localizar el nombre propio | GA4 real | Evento privado presente; agregado no conciliado por versión/acción | ga4Followup.standardProcessedReport y captura local |
| Informe v1 utilizable | Recargar y revisar resumen/campañas/botones, manteniendo filtros | GA4 real | PENDIENTE: No hay datos disponibles | ga4Followup.checkedTabs |
| Atribución correcta | Buscar la campaña de prueba en el informe guardado | GA4 real | PENDIENTE: no hay filas v1 para conciliar | pestaña03 y resultado JSON |
| PDF descargado y legible | Solicitar todas las pestañas y observar descarga con límite15s | GA4 real + controlador de navegador | NO CONFIRMADO; no artefacto, no fallo de servicio demostrado | ga4Followup.pdf |
| Fuente/cuentas preservadas | Identidad de los35 archivos; sólo navegación/exportación de lectura | Git local + UI GA4 | PASS en alcance comprobado; ninguna implementación/configuración modificada | manifiesto fuente, diff y seguimiento |
| Conservar la revisión anterior | Snapshot de README/production-status antes de actualizarlos | Git/documentación | Hashes del packet histórico preservados | phase1-closure-reviewed-docs/index.json |

## Versiones y comprobaciones

Base de este seguimiento: 9d5c6a62402371598a7819bcfa682e5de2f53d60. Commit de implementación 42e873b83947ac52abe34ac1aab578d46e3928bd, base original 000c264bf6278ba84f2ded9e0803938ab07a7942; fuente35 SHA012f52954928ce195beff1a007e3621a69c5ea316d7059c2a13f6baf048ddfb4 intacta.

Build, tipos, pruebas pertinentes, check:visibility y check:favicons aprobados previamente sobre la misma fuente. Este añadido sólo cambia documentación/evidencia; no se repiten tests funcionales para una lógica sin cambios. Se comprueban hashes, JSON, diff, formato y alcance de archivos nuevos. Los manifiestos anteriores se mantienen como históricos y se conservan snapshots de los dos documentos modificados. No atribuir al nuevo seguimiento la aprobación de una versión documental anterior.

## Qué falta y cómo se desbloquea

1. Cuando estén disponibles los campos y datos procesados v1, conciliar conteos, valores de destino/botón/versión y sesiones en las nueve pestañas; contrastar la campaña de prueba con fuente/medio y campaña de sesión. No inventar ceros ni quitar filtros para aparentar éxito. La mera espera no prueba recepción o atribución.
2. Obtener y abrir el PDF real del informe. El intento acotado no obtuvo artefacto; no se deja una espera indefinida. Mantenerlo separado de la conciliación de datos.
3. La confirmación manual de navegador/cookies queda aceptada con su procedencia; no se presenta como traza de red independiente archivada.
4. Search Console sigue dependiendo de acceso a su propiedad existente para el informe SEO. Mygocu depende de respuesta a la solicitud preparada y no enviada; continuidad y estados comerciales de reservas/cobros corresponden a la fase2. No convertir clics en consultas recibidas, reservas, viajeros o cobros.

No se modifica activación, rollback ni histórico. No se fija reliable_from hasta satisfacer y registrar las comprobaciones esenciales.
