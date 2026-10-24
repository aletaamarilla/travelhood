# Analítica Travelhood — estado actual

Actualizado el 24/10/2026. **Implementación publicada y guardada en Git; validación local aprobada en su alcance; verificación externa parcial. Fase 1 todavía no validada.**

La propiedad oficial es G-XQMPJG8B08 (498178258); GTM-TB7F773D versión 6 y la fuente 012f5295 están activas desde las 17:36 Europe/Madrid. Se conserva el histórico. El código publicado se incorporó sin cambios al commit 42e873b83947ac52abe34ac1aab578d46e3928bd, enviado a main; Vercel completó su despliegue Git y travelhood.es sirve esa versión. Ya no queda pendiente conservar la implementación en el remoto.

Una interacción controlada de WhatsApp a las 20:47:23.751–23.838 Europe/Madrid produjo un único private_trip_whatsapp_click en Tag Assistant y en GA4 DebugView a las 20:47:24, con cta=final, measurement_version=1 y URL canónica. La traza corresponde al despliegue CLI inicial; el despliegue Git posterior conserva los mismos 35 archivos y el mismo HTML comprobado. No se envió mensaje. También se comprobó retirada y persistencia de preferencias en la UI. Posteriormente el titular confirmó que las pruebas de navegador/cookies salieron bien; se registra como validación manual comunicada, sin traza de red archivada ni conteos individuales aportados.

No hay todavía fecha de medición comercial fiable: reliable_from=null y businessReportReady=false. El informe guardado tiene nueve pestañas y diez dimensiones; falta conciliar sus campos, conteos y atribución. El informe estándar de eventos ya contiene private_trip_whatsapp_click en el día 24/10/2026, pero las pestañas v1 01/03/07 siguen sin datos tras actualizar. Una tabla sin datos no significa cero negocio. La nueva petición de PDF conjunto no produjo una descarga observable dentro de 15 segundos; exportación no confirmada.

- [Último avance: comprobación manual del titular e informes procesados](evidence/manual-followup-2026-10-24.md).
- [Matriz anterior y cuatro puntos de cierre](evidence/phase1-closure.md).
- [Informe mensual guardado en GA4: uso, definiciones y pendientes](client-reporting.md).
- [Estado estructurado vigente](evidence/production-status.json).
- [Código guardado, revisión independiente y despliegue Git](evidence/phase1-git-review.md).
- [Recepción agregada anterior de WhatsApp](evidence/whatsapp-production-validation.md).
- [Matriz general de producción responsive](evidence/production-recheck.md).
- [Publicación inicial y reversión](evidence/production-validation.md).
- [Inventario, definiciones comerciales y contrato](phase-1.md).
- [Validación anterior a publicar](evidence/shared-bootstrap-validation.md), [revisión fuente](evidence/shared-bootstrap-review.md) y [manifiesto de los 35 archivos](evidence/shared-bootstrap-manifest.json).
- [Solicitud técnica para Mygocu, preparada y no enviada](mygocu-request.md).

Meta se gestiona aparte y se conserva. Los filtros interno/desarrollador permanecen en Prueba por decisión expresa del titular: las visitas QA pueden entrar en informes. No se tocaron campañas, inversión ni cobros.

Los documentos previos son registros históricos; sus frases «sin publicar» o «sin commit» no describen el estado actual. El manifiesto de reporting anterior conserva su versión: sus tres documentos de entonces se archivaron en evidence/reporting-reviewed-docs antes de actualizar los actuales. El paquete Git identifica pruebas textuales incluidas y capturas que permanecen sólo en el archivo operativo local; no se presenta como un archivo visual autocontenido.

Los dos documentos actuales del paquete histórico phase1-closure-packet se conservaron antes de esta actualización en evidence/phase1-closure-reviewed-docs; index.json relaciona rutas y hashes originales. El dictamen anterior no se atribuye a la documentación nueva. Implementación y configuración de cuentas intactas.
