# Candidata GTM de fase 1 — preparar espacio de trabajo, sin publicar todavía

Actualización de alcance: 2026-10-24. Archivo: `travelhood-phase-1.import.json`. Original exacto: `source-export.json`.

El titular aportó un export de **workspace (containerVersionId=0)** de `GTM-TB7F773D`, exportTime `2026-10-23 18:12:42`. Las dos etiquetas coinciden en IDs, destinos y disparadores esenciales con el contenedor público versión 5. No se afirma identidad completa workspace/publicado. El original se conserva byte por byte y la candidata mantiene los metadatos de origen; la fecha del export corresponde al original, no a una exportación oficial posterior de esta candidata.

Por instrucción del titular, Meta se gestiona aparte y queda fuera de esta fase. La candidata es un **export parcial solo de Google Analytics**, en formato GTM v2 preparado localmente. Meta se omite del JSON para que una importación con **Combinar** no sobrescriba su configuración actual, aunque haya cambiado después del export original. Importada con Combinar en workspace 6 y compilada en Preview; no publicada. Export posterior y comparación en `../evidence/workspace-import-comparison.json`. La versión anterior importada fue corregida en el propio workspace: Google Tag con activador consentido/prioridad 100, GA4 Event sin setup y debug nativo numérico. Antes de reutilizar el JSON comparar export final; no reimportar la versión anterior. Las pruebas locales y la revisión independiente no sustituyen la aceptación del importador ni la recepción GA4.

## Diff esperado

| Entidad | Antes | Candidata |
| --- | --- | --- |
| Tag ID 3 `Pixel meta` | Configuración gestionada aparte | **Fuera del JSON**: no se pausa, importa, sobrescribe ni elimina al usar Combinar |
| Tag ID 5 `GA4- Configuracion` | `G-XQMPJG8B08`, Initialization, frecuencia por evento | Mismo nombre/ID/destino; activador consentido de los 19 eventos propios, prioridad 100, una vez por documento; `send_page_view=false`, ubicación/referrer de envelope, signals/personalización desactivados; exige `analytics_storage` |
| Nueva etiqueta GA4 Event | Ausente | `TH Phase 1 - GA4 events`, ID local 6; evento dinámico, 24 campos permitidos, sin setupTag asíncrono; Google Tag iniciado antes en el mismo evento por prioridad; una vez por evento y consentimiento analítico adicional |
| Variables nuevas | Ausentes | 27 con prefijo `TH Phase 1 - `: envelope DLV v1, nombre, guard y 24 parámetros |
| Activador nuevo | Ausente | `TH Phase 1 - owned events`: regex anclada de los 19 nombres del contrato y condición guard=true |
| Carpeta nueva | Ausente | `TH Phase 1 - measurement` |
| Entidades eliminadas | — | **Ninguna al usar Combinar**. Se conserva el contenedor y las cinco variables integradas |

El guard relee consentimiento, exige forma booleana válida, versión de contrato, nombre del evento actual y bloqueos de retirada. Los campos se toman del objeto completo `th_event` con versión 1, sin leer textos de DOM/formularios ni arrastrar parámetros de eventos anteriores. `th_page_view` se envía a GA4 con nombre `page_view`. Otros nombres se conservan.

## Importar únicamente para revisión

1. En `GTM-TB7F773D`, crear un **espacio de trabajo nuevo** (p. ej. `Travelhood fase 1 - revisión`). Mantener intacto el workspace de origen. Si el estado actual incluye etiquetas/cambios posteriores al export, reconciliarlos antes; no reemplazarlos.
2. **Administrar → Importar contenedor → Elegir archivo**: seleccionar `travelhood-phase-1.import.json`. Elegir el workspace nuevo.
3. Elegir **Combinar** y **sobrescribir las etiquetas, activadores y variables que entren en conflicto**. El único conflicto esperado es `GA4- Configuracion`. `Pixel meta` no debe aparecer entre los cambios. No usar renombrado automático: dejaría activas copias antiguas y podría duplicar vistas o duplicar etiquetas de Google. **Nunca usar Reemplazar**: al ser un export parcial, esa opción podría eliminar Meta y otras entidades ausentes del archivo.
4. En la vista previa de importación comprobar: un tag modificado de Google, un tag nuevo de Google, 27 variables nuevas, un trigger nuevo, una carpeta nueva; cero eliminaciones y cero copias renombradas. Revisar el diff detallado contra la tabla. Si hay discrepancias, detener la importación y conservar el resumen para reconciliar.
5. Confirmar importación en ese workspace **solo si el diff coincide**. No pulsar Enviar/Publicar. Si GTM rechaza esquema/parámetro o añade valores por defecto inesperados, aportar error/resumen o nuevo export del workspace; el resultado queda pendiente hasta corregirlo y revisarlo.

Importar en un workspace no publica la configuración. No se ha autorizado ni realizado publicación desde este trabajo. La confirmación del importador y un export posterior del workspace permitirán comprobar que GTM conserva `configSettingsTable`, `eventSettingsTable`, orden de inicio, consentimiento, guard y variables como se han definido.

## Dependencia del contenedor compartido

Excluir Meta del archivo preserva su configuración al Combinar, confirmado por el export posterior al import. El código web actualizado conserva el loader compartido asíncrono una vez por documento, independiente de la concesión analítica y del gate; retirada sin recarga ni nuevo DOMReady. La comprobación local usa un canary explícito: no acredita recepción o consentimiento del SDK Meta. No se resolverá una incidencia pausando Meta. Limpieza limitada a cookies GA, conserva `_fbp`/`_fbc`. TikTok/CSP mantienen el estado suspendido de la candidata anterior.

## Antes de Vista previa y publicación

- Revisar GA4 en el flujo **oficial `G-XQMPJG8B08`**: Enhanced Measurement desactivado para evitar vistas, formularios, outbound y descargas automáticas; Google Signals, datos de usuario y destinos vinculados revisados; eventos creados/modificados/key events sin duplicados ni clics tratados como compras. Estos ajustes de cuenta no viajan en el JSON.
- Filtros Exclude interno/desarrollador en Prueba, conservados por decisión expresa del titular; estas pocas visitas QA al flujo oficial están autorizadas sin exclusión. `developer`/`debug_mode` identifican las pruebas, no demuestran exclusión comercial.
- Probar el workspace con Tag Assistant sobre una **preview de la nueva web**, con `PUBLIC_GTM_ID=GTM-TB7F773D`, `PUBLIC_GA_ID=G-XQMPJG8B08`, `PUBLIC_GTM_PHASE1_READY=true`, `PUBLIC_ANALYTICS_ENV=test`. El código publicado antiguo carece de envelope: no sirve para validar el contrato nuevo.
- Matriz completa de consentimiento y retirada; una interacción/un evento; parámetro `trip_id` presente seguido de ausente sin herencia; vistas únicas; red sin PII/query/fragmento; ninguna etiqueta publicitaria nueva introducida por esta importación; navegación/contactos/reserva siguen usables. Confirmar recepción DebugView y después informe/exploración procesados. Conservar capturas sin PII.
- Publicar solo tras aprobación de un diff concreto, aceptación de GTM y evidencia esencial. Coordinar contenedor y despliegue web: publicar primero la candidata con la web antigua dejaría de recoger sus pageviews/eventos; el gate false preserva legado con v5, pero genera hueco si ya se publicó el Google Tag activado sólo por eventos propios; no usarlo como rollback aislado. Registrar horario del cambio y convivencia de pestañas/versiones. No se presupone despliegue simultáneo ni se garantiza ausencia de huecos: si el negocio exige continuidad estricta, hace falta una versión de transición compatible con documentos antiguos y nuevos, con pruebas y revisión propias antes de publicar esta candidata. Excluir la ventana mixta de los informes fiables. No asignar `reliable_from` hasta comprobar el resultado final.

Para el detalle del contrato y checks externos, ver `../phase-1.md` y `../gtm-setup.md`. Mygocu conserva su contenedor independiente; este archivo se importa únicamente en el contenedor web Travelhood.

## Reproducción y reversión

- `npm run prepare:analytics-gtm`: genera la candidata desde el original y `EVENT_FIELDS`, sin llamadas externas.
- `npm run check:analytics-gtm`, `npm run test:analytics-gtm`, `npm run check:analytics-tools`: reproducibilidad, semántica y tipos estrictos. Resultados en `../evidence/gtm-candidate-tests.json` / `gtm-types.log`.
- El generador rechaza otro contenedor o entidades adicionales sin revisar. No elimina trabajo para forzar una generación.
- Antes de publicar, abandonar el workspace nuevo revierte la preparación sin afectar producción. Conservar export publicado real y versión que se validen en cuenta. Si el export aportado es workspace 0, no llamarlo snapshot publicado para rollback.
- Después de una activación, aplicar el procedimiento de gate y reversión de `../phase-1.md`, coordinado con web/GA4. No sobrescribir Meta al revertir Analytics ni reintroducir vistas duplicadas; conservar el histórico.

Fuentes de estructura: [GTM export/import](https://support.google.com/tagmanager/answer/6106997?hl=es), [API Tag/setup/consent](https://developers.google.com/tag-platform/tag-manager/api/reference/rest/v2/accounts.containers.workspaces.tags), export real del titular y lectura de plantilla nativa Google-hosted documentada en `../evidence/gtm-source-analysis.json`. La compilación del workspace importado fue aceptada en Preview; verificación real completa y publicación siguen pendientes según la matriz vigente.
