# WhatsApp privado — recepción productiva comprobada, 24/10/2026

**Confirmada la recepción en GA4 real de private_trip_whatsapp_click y de los parámetros inspeccionados.** En la ventana consultada se observan dos eventos: cta=hero, uno, y cta=final, uno. La segunda acción controlada, sobre un CTA distinto, se observa como un nuevo valor final=1 conservando hero=1. Esto acredita los resultados representativos descritos; el agregado no identifica una persona/documento ni garantiza ausencia general de duplicados. La fase 1 completa sigue abierta, reliable_from=null.

## Versión y autorización

Base `000c264bf6278ba84f2ded9e0803938ab07a7942`. Fuente publicada SHA256 `012f52954928ce195beff1a007e3621a69c5ea316d7059c2a13f6baf048ddfb4`; los 35 hashes del manifiesto permanecen intactos. Deployment dpl_Ga8t8AHeEnHxFiajvf22GQiENBbw. GTM-TB7F773D v6 Analytics v1 - 012f5295 sigue publicada; propiedad GA4 498178258 / G-XQMPJG8B08.

El usuario pidió validar WhatsApp, sin enviar mensajes. No se modificaron código funcional, contenedor, configuración GA4, Meta, filtros, inversión ni despliegue. Se revisaron AGENTS.md, guías domain/growth y la comprobación anterior. Se conserva todo el trabajo Git previo; sin commit/push. Cambios de este turno: README, production-status.json, este informe y nuevas evidencias/revisión/manifiesto.

## Acciones y observaciones (UTC; sumar 2h para Europe/Madrid)

- 17:13:47–49: Tiempo real muestra todas sus páginas, sin private_trip_whatsapp_click. Preferencias visibles en el documento de prueba: analítica1, marketing0. No se modificaron para probar este contacto.
- 17:13:54.739–55.283: una activación Enter del enlace nativo Pedir propuesta por WhatsApp (hero) en https://travelhood.es/viajes-privados/. Abre WhatsApp Travel Hood SLU; no se pulsa Abrir aplicación, Continuar ni Enviar.
- 17:14:40–42: los intentos automáticos de paginación no cambian de página; realtime-after.json contiene cinco lecturas repetidas de la primera página. **No es una lectura completa ni prueba de ausencia del contacto.** Posteriormente se muestra el informe visible, se colapsa la navegación y se desplaza el contenido para poder paginar. No se identifica el motivo de los intentos fallidos como defecto del producto.
- 17:18:54: la última página visible de Tiempo real muestra private_trip_whatsapp_click=1. Abrirlo y sus parámetros confirma hero=1, context=private_trip, measurement_version=1, page=viajes_privados, page_location canónica, traffic_type=external y has_utm=false.
- 17:20:42.406–42.528: una segunda acción deliberada, Enter sobre Escribirnos por WhatsApp (final), en el mismo documento. Es una nueva acción, no una repetición accidental de hero. Abre otro destino WhatsApp; no se envía mensaje.
- 17:21:19.108: al abrir cta en el mismo evento GA4 se observan final=1 y hero=1, total2. Antes de esta segunda acción el único valor observado era hero=1. La secuencia y el CTA distinto son evidencia de correlación temporal; no se capturó un identificador por evento/documento ni se excluye tráfico concurrente por inferencia.
- 17:21:47–57: los dos contactos comparten measurement_version=1, URL canónica sin query/fragmento y traffic_type=external, con conteo2 para cada valor.

La prueba humana de las16:55:21Z anterior no se puede atribuir individualmente al valor hero observado: comparte CTA y página con esta prueba y no tiene identificador. Se confirma ahora la recepción del tipo de evento y sus parámetros; no se identifica retrospectivamente qué persona lo originó.

## Matriz de aceptación de esta comprobación

| Criterio | Prueba | Entorno | Resultado | Evidencia |
| --- | --- | --- | --- | --- |
| Mantener versión, navegación y consentimiento | UI GTMv6, 35hashes; preferencias y dos enlaces nativos | Producción real / fuente local | PASS en alcance: misma fuente, analítica1/marketing0, WhatsApp se abre sin envío | [consentimiento](whatsapp-production/consent-before.json), [captura](whatsapp-production/consent-before.png), [apertura](whatsapp-production/whatsapp-opened.png), manifiesto de este añadido |
| Recibir el nombre exacto en GA4 | Abrir private_trip_whatsapp_click desde Tiempo real | GA4 oficial real | PASS: observado1 inicialmente y2 tras nueva acción final. No confundir con destination_whatsapp_click ni con dataLayer/red | [tabla visible](whatsapp-production/realtime-visible-pages.json), [evento recibido](whatsapp-production/ga4-contact-received-two.png) |
| Parámetros correctos y sin mensaje/PII en lo inspeccionado | Abrir sólo claves permitidas | GA4 oficial real | PASS: hero/private_trip/versión1/viajes_privados/URL canónica/external/has_utm=false. No se guardaron valores de identificadores de cliente o sesión | [parámetros](whatsapp-production/ga4-contact-parameters.json), [dos acciones](whatsapp-production/ga4-two-actions-parameters.json) |
| Una nueva acción distingue su CTA y conserva conteos esperados | Baselinehero1; activar final una vez; abrir cta | Producción + GA4 Tiempo real real | PASS observado para este contraste: final1, hero1, total2. No certifica deduplicación general por documento o tráfico concurrente | [acción hero](whatsapp-production/controlled-click.json), [acción final](whatsapp-production/controlled-final-cta.json), [recuentos](whatsapp-production/ga4-contact-two-ctas.json), [captura](whatsapp-production/ga4-contact-two-ctas.png) |
| Confirmación DebugView vinculada al contacto | Revisar sesión de depuración GTMv6 | GA4/Tag Assistant reales | NO ACREDITADA: DebugView muestra page_view y landing de sesión Preview, sin contacto en esa traza. No sustituye la recepción positiva de Tiempo real | Límite documentado aquí; sin atribuir la pestaña26 a la ventana no gestionada de Tag Assistant |
| Informes comerciales y fase completa | Contrastar registro anterior y pendientes | Última consulta previa del informe estándar | PENDIENTE: esta sesión no revalida el informe procesado. Tiempo real no demuestra su procesamiento correcto | [comprobación anterior](production-recheck.md), [estado](production-status.json) |

## Revisión y compatibilidad

El subagente browser_restart_review recibió requisitos, base/candidata, consumidores, alcance y evidencias para revisar sin modificar implementación ni operar cuentas. Su revisión específica no detectó un defecto estático accionable: los tres enlaces hero/final/sticky_mobile llevan el atributo esperado; el listener registra el evento con campos admitidos; el trigger GTM incluye el nombre exacto y el tag es ONCE_PER_EVENT. No hay una regla que suprima contacto después de landing. No se cambió navegación, consentimiento o frecuencia por la falta de evidencia inicial. La apertura de WhatsApp por sí sola no se usó como prueba de ejecución del handler.

El dictamen final del añadido y los hashes documentales se guardan en whatsapp-production-review.md. Es una revisión de la implementación intacta y de las conclusiones/evidencias; no una reproducción independiente de navegador ni garantía de todos los eventos.

## Estado y pendientes

- Implementación: publicada y sin cambios funcionales en esta sesión. No hay que importar un nuevo JSON ni volver a publicar para este resultado.
- Local: build167, tipos98/0errores, runtime19 y pruebas de consumidores aprobadas previamente para la misma fuente. No se reejecutaron por una comprobación externa/documental sin cambios de código. check:visibility y check:favicons/HTTP aprobados en la comprobación anterior; no se presentan como ejecutados otra vez aquí.
- Externa: recepción del contacto privado y parámetros representativos confirmada en GA4 Tiempo real. Conteos observados compatibles con una acción por CTA probado; asociación al documento inferida por secuencia, no demostrada por identificador/traza integral.
- Permanecen abiertos primera visita productiva limpia, red tras retirada/reconcesión, deduplicación completa por documento, contacto en DebugView vinculado y contraste del informe procesado. El tercer CTA sticky_mobile no se activó en esta comprobación. Las preferencias responsive y recorridos móviles anteriores son evidencia separada.
- Para Mygocu/fase2, sigue preparada y no enviada la solicitud técnica sobre tenant, consentimiento/linker, estados y deduplicación sin PII. No se midió una consulta recibida, reserva o cobro desde estos clics.
- activated_at sigue2026-10-24T15:36:39Z; reliable_from=null y phaseValidated=false. QA no se excluye por decisión del titular. Antes del siguiente deploy Git incorporar de forma revisada los35archivos: la publicación actual fue CLI, main remoto aún es la base. Reversión en [cierre de publicación](production-validation.md#reversión-concreta-no-ejecutada).

Este añadido actualiza el pendiente de recepción del tipo de contacto; conserva sin modificar la evidencia histórica que no lo mostraba. Los manifiestos anteriores identifican sus instantáneas históricas, y el nuevo manifiesto identifica README/estado actuales y este añadido.
