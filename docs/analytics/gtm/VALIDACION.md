> Registro histórico de candidata anterior. Estado vigente y límites de la evidencia: [validación actual](../evidence/shared-bootstrap-validation.md). La arquitectura de GTM condicionado por analítica y retirada con recarga fue sustituida; no atribuir las pruebas antiguas a la versión nueva.

# Validación de la candidata GTM recibida/generada

> **Estado actualizado tras acceso real, 2026-10-24:** ver [../evidence/account-audit-2026-10-24.md](../evidence/account-audit-2026-10-24.md). Importación confirmada en workspace6 (31 cambios), publicada v5; propiedad498178258/flujoG-XQMPJG8B08 contrastados. Vista previa abrió Tag Assistant sin dominio conectado. SDK/DebugView/informes, filtros efectivos y compatibilidad del bootstrap compartido siguen pendientes. Las menciones de falta de acceso/importación de este registro son cortes anteriores. No hay fase validada.

Actualización de fase 1, 2026-10-24: Meta fuera del alcance por instrucción del titular. Base Git `000c264bf6278ba84f2ded9e0803938ab07a7942`. Cambios sin commit. Identidad final y scope en `../evidence/meta-exclusion-manifest.json`.

Se recibió export real del usuario. Es un snapshot de workspace 0, no un export certificado de versión publicada. El original queda intacto en `source-export.json`. La candidata preparada es `travelhood-phase-1.import.json`; no se ha importado, compilado ni publicado en GTM y no constituye integración operativa.

## Matriz

| Criterio | Prueba | Entorno | Resultado | Evidencia |
| --- | --- | --- | --- | --- |
| Original preservado, contenedor/flujo correctos | Comparación byte a byte/SHA y guardas de generación | Local, export real recibido | PASS | `gtm-source-analysis.json`, pruebas candidatas |
| Mismo Google Tag y Meta conservados | IDs/nombres de Google conservados; Meta ausente del export parcial y original intacto | Local estructural | PASS | `gtm-candidate-tests.json` |
| Eventos y parámetros del contrato, sin herencia | Ejecutar Custom JS realmente generado en VM; dos eventos con/sin trip_id; regex exacta19/nombres/mapeo24 | Local simulado; sin etiquetas nativas Google | PASS | Mismo JSON y `prepare-analytics-gtm.test.ts` |
| Consentimiento ausente, rechazo, solo marketing, solo analítica y completo; retirada | Cookie real de formato, guard generado, SDK opt-out y marca de persistencia fallida | VM local; no SDK externo | PASS dentro del alcance | Mismo JSON |
| Pageview único preparado | Google Tag once-per-load, send_page_view=false, un tag GA4 dinámico, th_page_view→page_view, setup con stopOnSetupFailure | Local estructural/semántico | PASS de configuración propuesta; conteo GA4 real pendiente | Mismo JSON y candidata |
| Generación reproducible y sin sobrescribir trabajo adicional | Regeneración exacta, ID extranjero/entidades adicionales rechazados | Local | PASS | `gtm-reproducibility.log`, pruebas candidatas |
| Tipos/build/visibilidad/favicons | check:analytics-tools, check:types, build, check:visibility con URL, check:favicons | Local | PASS según logs finales | `gtm-types.log`, `meta-exclusion-types.log`, `meta-exclusion-build-*.log`, `meta-exclusion-favicons.log`, `meta-exclusion-visibility.log` |
| Navegación web, móvil/escritorio | Nueva ejecución de 28 escenarios en 375×812/1440×1000 sobre la candidata corregida; verifica cookies GA borradas y cookies Meta sintéticas conservadas | Navegador local; GTM stub y MyGoQu fixture explícitos, sin SDK Meta; no valida seguimiento publicitario | Ver ejecución actual y su manifest; no demuestra carga o recepción reales de Meta | `browser-results.json`, manifest GTM |
| Importación/compilación y defaults de plantillas nativas | Importar en workspace nuevo, revisar diff y export posterior | GTM real | PENDIENTE de sesión del titular; no se ejecuta mediante VM | `IMPORTAR.md` |
| Recepción y duplicados reales, privacidad remota, filtros y compatibilidad con el GTM compartido | Tag Assistant/red, DebugView, informe procesado y exclusión comercial | GA4/GTM reales | PENDIENTE de aceptación/importación y configuración de cuenta | Guías GTM |
| Convivencia de versiones/fecha fiable | Plan de ventana o versión transitoria si se exige continuidad estricta | Despliegue externo | PENDIENTE; no se presupone simultaneidad ni hueco cero | `IMPORTAR.md`, `phase-1.md` |

Las rutas de logs/JSON sin prefijo están en `docs/analytics/evidence/`. Las comprobaciones no invocaron cuentas, APIs privadas, pagos, contactos o campañas. No se envió evento de prueba a GA4. Los tipos, tablas y secuenciación de plantillas propuestas se contrastaron con export del titular, documentación API y plantilla oficial Google-hosted, pero únicamente GTM puede confirmar aceptación/compilación efectiva.

## Comandos nuevos

- `npm run prepare:analytics-gtm`
- `npm run check:analytics-gtm`
- `npm run test:analytics-gtm`
- `npm run check:analytics-tools`

El generador conserva el original y produce el mismo JSON sin fecha artificial ni IDs nuevos aleatorios. Si cambia el export/contrato, hay que regenerar, probar, revisar y volver a verificar el diff de importación. El JSON conserva exportTime de la fuente; no se atribuye esa hora a publicación de la candidata.

## Estado

Implementación del artefacto y validación local: preparadas y comprobadas, dentro del alcance de la matriz. Revisión independiente: registro final en `../evidence/meta-exclusion-review.md`. Activación/importación verificada, publicación, DebugView e informes: pendientes. `reliable_from=null`; fase sin validar externamente.

No se activó el gate web. La guía exige workspace nuevo y **Combinar/sobrescribir conflictos** únicamente tras inspeccionar un tag de Google modificado, un tag nuevo de Google, 27 variables, un trigger y una carpeta, sin eliminaciones ni renombrado automático, y ningún cambio de Meta. Nunca usar Reemplazar. No publicar todavía: aprobación y validaciones esenciales siguen pendientes. La preparación de Mygocu de la fase anterior permanece sin cambios; este contenedor solo corresponde a la web.
