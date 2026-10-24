# Fase 1 — Base fiable de medición

Actualización: 2026-10-24 (Europe/Madrid). Base: `000c264bf6278ba84f2ded9e0803938ab07a7942`.
Estado: implementación candidata sin commit; validación local ejecutada y recepción real parcial en DebugView. GTM permanece en workspace de revisión, sin publicar; código sin desplegar. **No hay fecha de inicio de medición fiable todavía.** Se desactivó la medición mejorada del flujo oficial con autorización expresa del titular; Meta, inversión, pagos, filtros y Mygocu no se modificaron. Estado y matriz vigentes: [validación del bootstrap compartido](evidence/shared-bootstrap-validation.md); sustituye las limitaciones históricas de acceso y la arquitectura anterior de carga/recarga.

## Criterios de aceptación y comportamiento preservado

1. Sin elección, con rechazo, cookie inválida o solo marketing: cero eventos analíticos propios; opt-out de Google anterior a GTM. El contenedor compartido conserva su carga asíncrona única e independiente de estas elecciones y del gate para no alterar el ciclo de Meta. Solo analítica y aceptación completa: envío de eventos propios si el gate está activo.
2. Preferencias guardadas y retirada efectivas sin recargar ni repetir la inicialización de GTM; no repetir clics anteriores al consentimiento. Vista de página y vista de destino/landing como máximo una por documento. Una nueva navegación o recarga es un nuevo documento.
3. Un clic produce un evento de su acción, con parámetros de catálogo y ubicación. Un envío del buscador conserva sus dos eventos distintos (envío + resultado), que no son dos conversiones.
4. Sin nombres, email, teléfono, mensajes, texto de formularios, URLs de WhatsApp/reserva, parámetros de consulta, fragmentos ni UTMs libres en los eventos. No introducir nuevas herramientas o capturas publicitarias desde esta fase. Se conserva la configuración de Meta y el ciclo del loader compartido; no se valida su SDK ni su consentimiento en esta fase.
5. Un fallo o bloqueo de instrumentación no impide hidratar buscador/ficha, navegar, contactar ni reservar. Preservar href de reserva, fallback WhatsApp, disponibilidad pública, filtros y mensaje WhatsApp existente.
6. Tráfico de prueba/interno identificable y filtrable. El titular acepta expresamente el 24/10 no activar exclusiones para estas pocas pruebas: no se afirma separación efectiva de informes.
7. Contrastar interacción → evento → etiqueta → solicitud → DebugView → informe procesado. Los tres últimos pasos requieren configuración y acceso de cuenta.

## Fuentes contrastadas e inventario

Se leyeron `AGENTS.md`, guías `.cursor/skills/domain/SKILL.md` y `growth-standards/SKILL.md`, reglas de frontend/tokens, contratos de buscador/destino/colaboradores, roadmap de viajes privados y referencia técnica Stripe de septiembre. El roadmap anterior pedía UTMs en dataLayer: esta fase restringe expresamente ese punto por privacidad; conserva `has_utm` y la navegación/mensaje comercial previo. La guía de dominio describe WhatsApp como reserva actual, pero el código vigente ya permite MyGoQu: se contrastó `booking.ts`, `shared/booking.ts` y el modal.

| Ámbito | Confirmado por código o recurso público | Lo que NO acredita |
| --- | --- | --- |
| Web `travelhood.es` | HTML publicado carga `GTM-TB7F773D`; recurso público versión 5 configura Google Tag `G-XQMPJG8B08` con `analytics_storage` y Meta Pixel `2395026450933296` en HTML personalizado sin condición de consentimiento propia | Titularidad, nombre/ID numérico de propiedad, permisos, filtros, recepción, informes o borradores GTM |
| Portal `reservas.travelhood.es` | HTML publicado carga `GTM-TXS7NBZ2`; recurso público versión 23 contiene `G-ZMQN5FJE4X`, eventos Typeform, Google Ads, conversion linker y plantillas de consentimiento. Los dominios del linker incluyen otras marcas | Aislamiento efectivo del tenant, si una etiqueta se ejecuta en una ruta concreta, capacidades de cambios por Travelhood o idoneidad del flujo para esta marca |
| TikTok | `PUBLIC_TIKTOK_PIXEL_ID=D9CFSPBC77UBS5FSE3HG` en ejemplo y HTML publicado; el script previo intentaba cargar antes de elegir. CSP local y publicada no permite `analytics.tiktok.com` | Recepción efectiva o configuración privada del píxel, automatic matching/autocapture |
| Eventos propios | 18 nombres existentes de buscador, destino, privados, colaboradores y coordinador; solo dataLayer. Recurso público de GTM web contiene dos etiquetas y no contiene un tag de envío de esos eventos a GA4 | Una anotación previa de QA de dataLayer NO demuestra recepción en GA4 |
| Privados | Script base no comprobaba consentimiento y copiaba UTMs arbitrarias a dataLayer | No inferir consultas recibidas desde clics |
| Variables anteriores | `PUBLIC_GTM_ID`, `PUBLIC_TIKTOK_PIXEL_ID`, `PUBLIC_SITE_URL`; Sanity consume datos, no identifica propiedad GA | Variables efectivas de todos los entornos Vercel; no se han cambiado ni expuesto secretos |
| Variables nuevas | `PUBLIC_GTM_PHASE1_READY=false`, `PUBLIC_GA_ID` existente, documentado vacío en ejemplo, `PUBLIC_ANALYTICS_ENV=test` por defecto | Un `.env.example` configurado NO activa una integración |

Evidencia reproducible: [recursos públicos y sus hashes](evidence/public-containers.json). Se descargaron HTML y JS públicos sin ejecutar conversiones ni enviar eventos de prueba a cuentas reales. El recurso GTM público permite inferir etiquetas publicadas, no sustituye una exportación administrativa ni auditoría de cuenta.

**Propiedad oficial contrastada en la cuenta:** Travel Hood, cuenta `266541621`, propiedad `498178258`, flujo web `11539767268`, `https://travelhood.es`, medición `G-XQMPJG8B08` (alias Google Tag `GT-5TJM442J`). Moneda EUR, zona España GMT+02 en la fecha de revisión. Se conserva la propiedad y su histórico. GTM web: cuenta `6305630418`, contenedor `225870368`, público `GTM-TB7F773D`, workspace `6`; publicada v5 (11/04/2026 16:04:39 según UI). La candidata Google fue importada con Combinar: 31 cambios, 1 modificado, 30 añadidos, 0 eliminados. Meta conserva el export posterior. Inventario privado: [auditoría de cuenta](evidence/account-audit-2026-10-24.md), [comparación del import](evidence/workspace-import-comparison.json). Search Console no es dependencia.

La tabla pública anterior recoge la auditoría inicial; no representa el estado posterior de borradores o DebugView. La medición mejorada estaba activa con las siete familias; se desactivó con autorización el 24/10 y se comprobó persistencia tras recargar a las 16:36:54 Europe/Madrid (hora exacta de guardado no capturada). Google Signals y datos aportados por usuarios estaban apagados; email redactado; sin eventos creados/modificados, Ads vinculado ni multidominio configurado. Key events existentes `close_convert_lead`, `purchase`, `qualify_lead` se conservan. Los dos filtros Exclude siguen en **Prueba**, por decisión del titular. Se verificó en DebugView recepción de eventos propios de home; resto del alcance y limitaciones en la matriz vigente.

## Definiciones comerciales iniciales

| Concepto | Definición y evidencia exigida | Conteo / pendiente |
| --- | --- | --- |
| Clic de contacto | Acción consentida sobre CTA de WhatsApp/contacto; evidencia del navegador. Incluye lista de espera/comunidad según `cta_location` | Acciones, no personas ni consultas. Separar comunidad de intención de viaje en informes |
| Consulta recibida | Entrada efectiva de una conversación o solicitud en el canal operativo; requiere fuente receptora (WhatsApp/CRM/formulario) | No observable hoy en esta web. Pendiente ventana/regla de deduplicación de consultas y catálogo de estados |
| Oportunidad cualificada | Consulta revisada con interés, destino/salida o fechas y encaje comercial confirmados por el equipo | Propuesta operativa pendiente de aprobar criterios, responsable y motivos de descarte; no inferir de un clic |
| Reserva | Registro único aceptado por proveedor/sistema con salida, plazas y estado verificable | Pendiente mapa de estados Mygocu y regla de confirmación (retención, señal, cancelación). No emitir `purchase` al abrir el portal |
| Viajero | Una plaza/participante confirmado en una salida; una reserva puede contener varios viajeros | Contar plazas y reservas por separado; pendiente cancelaciones/cambios/acompañantes. Identidades quedan en operación, fuera de analítica |
| Cobro | Movimiento financiero confirmado y reconciliable, importe y moneda; señal y saldo son cobros distintos | No equivale a viajero ni reserva. Futuro ID de transacción opaco estable, idempotencia, reembolsos y sin duplicar web/servidor |

No se implementan `generate_lead`, cualificación, reserva confirmada, `purchase` ni cobro desde clics. Esas fuentes son dependencias de fase 2.

## Contrato v1

Fuente ejecutable de nombres/campos permitidos: `src/lib/analytics.ts` (`EVENT_FIELDS`). Artefacto configurable: [gtm-recipe.json](gtm-recipe.json); instrucciones: [gtm-setup.md](gtm-setup.md). La receta sigue siendo especificación; la candidata nativa basada en el export está en `gtm/travelhood-phase-1.import.json` con guía `gtm/IMPORTAR.md`. La importación ya fue aceptada y compilada en Preview. El workspace no está publicado y la cobertura completa del contrato real sigue pendiente; no confundir el JSON con la integración desplegada.

| Eventos conservados | Disparador / parámetros propios |
| --- | --- |
| `search_started` | Inicio interacción buscador / `source` |
| `destination_any_selected`, `destination_specific_selected`, `date_any_selected` | Selección estructurada / `source`, modos, slug de catálogo, fecha estructurada según evento |
| `home_search_submitted` | Envío del hero / anteriores + `resolved_target`, `resolved_href` |
| `destination_direct_navigation`, `search_results_navigation`, `search_option_404_prevented` | Resultado de navegación / mismos campos. El último es diagnóstico, no conversión |
| `destination_view` | Ficha hidratada y consentimiento / `destination_slug`, `trip_id` opcional; una por destino/documento |
| `destination_dates_price_interaction` | Apertura de salidas/precios / slug, `cta_location` |
| `destination_pdf_download` | Clic PDF (no acredita descarga completada) / slug, ubicación, `pdf_url` sin query/fragmento, solo dominio propio o Sanity |
| `destination_whatsapp_click` | Clic contacto, reserva fallback, espera/comunidad / slug, `trip_id` opcional, ubicación |
| `destination_booking_click` | Salida hacia MyGoQu / slug, `trip_id`, ubicación, `booking_provider=mygoqu`; no equivale a reserva |
| `private_trip_landing_view` | Vista consentida de privados / `page=viajes_privados`, `context=private_trip`; una por documento |
| `private_trip_whatsapp_click` | CTA privados / anteriores + `cta`, `has_utm` booleano |
| `private_trip_secondary_cta_click` | CTA de ideas/enlaces secundarios / anteriores + `cta`, `href` solo ruta, `has_utm` |
| `collaborator_click` | Enlace colaborador / `partner_id`, `source`, `link_type`; sin URL afiliada en analítica |
| `coordinator_cta_click` | CTA coordinador / `action`, `source`; sin datos personales de contacto |
| **Nuevo** `th_page_view` → GA4 `page_view` | Primera concesión analítica o carga con consentimiento válido; una por documento |

Cada push conserva `event` y campos permitidos en nivel superior para consumidores anteriores. Con `PUBLIC_GTM_PHASE1_READY=true` añade `th_event={name, parameters}` completo; con gate false mantiene los campos anteriores consentidos y escribe `th_event:null`, sin el nuevo page_view, para no heredar un envelope antiguo; GTM debe leer este objeto con DLV **versión 1**, para evitar heredar `trip_id`, slug o ubicación de otro evento. Parámetros comunes: `measurement_version=1`, `page_location` de canonical generado sin query/fragmento, `page_referrer` solo origen, `traffic_type=external|developer|internal`; `debug_mode=true` solo pruebas/interno. No registrar `trip_id` ni URL como dimensiones de alta cardinalidad sin necesidad.

Cambios deliberados del contrato por minimización: no se copian UTMs libres; `resolved_href`/`href` pierden query/fragmento; valores inválidos se omiten. Filtros y URLs de navegación conservan sus valores originales. Debe migrarse cualquier consumidor privado de los campos retirados antes de activar. No se guardan clicks sin permiso para reenviarlos después. No se crea un `user_id` ni fingerprint.

## Consentimiento y marketing

`consent.ts` es la fuente de persistencia/lectura, con parser puro compartido `parseConsentCookie`. Se mantienen cookie `th_cookie_consent`, formato booleano y duración anual. Analítica y marketing son independientes; solo marketing no autoriza Google Analytics. Cookies inválidas o incompletas solicitan elección nueva.

`analytics-bootstrap.ts` se serializa inline antes del GTM compartido: un único dueño de default/update Consent Mode v2 y `ga-disable-G-XQMPJG8B08`, incluso si falla el módulo diferido. El contenedor se carga una vez, asíncronamente con `PUBLIC_GTM_ID` válido; no depende del gate ni de la concesión analítica. Se retiran listeners/cargas/reloads de Google duplicados del módulo diferido. No se restaura iframe noscript ni TikTok de la base. El gate sólo autoriza el contrato nuevo, no protege por sí solo frente a tags de terceros ajenos al contrato.

Al retirar analítica se activa opt-out antes de actualizar Consent Mode y se borran sólo cookies accesibles `_ga*`, `_gid`, `_gat*`; se conservan `_fbp`/`_fbc`. No se recarga, reejecuta GTM ni reenvían acciones anteriores. Cambios entre pestañas se releen por storage y focus. No puede borrar cookies de terceros/HttpOnly. Una escritura fallida deniega en memoria y trata de persistir bloqueo técnico; el lector inline sigue denegando aunque falle el módulo. Si cookie y localStorage están inutilizables, el bloqueo sólo dura ese documento.

Meta se gestiona aparte: no se pausa, sobrescribe ni elimina su tag y no se cambia inversión. La candidata parcial Google conserva esa separación; el loader ya no supedita su DOMReady a aceptar analítica ni recarga al retirar. El canary local demuestra ciclo único del contenedor, **no ejecución, recepción o consentimiento del SDK Meta**. El export posterior al import confirma su tag intacto. TikTok directo conserva el estado suspendido de la candidata anterior por la discrepancia real con CSP; no se amplían dominios CSP ni se reactiva publicidad. La CSP no sustituye consentimiento; la revisión de marketing del proveedor/Meta queda fuera del alcance autorizado.

## Separación de pruebas e internos

`PUBLIC_ANALYTICS_ENV=production` solo en dominio comercial. Si falta, cualquier preview/localhost/otro dominio queda `developer` y `debug_mode=true`. Para operadores internos, con analítica consentida, establecer cookie técnica `th_analytics_internal=1; path=/; SameSite=Lax; Secure` desde consola y recargar. Quitarla para volver a tráfico externo. No detectar personas por email ni inventar IPs.

El titular decidió el 24/10 mantener sin activar las exclusiones: filtros `Internal Traffic` y desarrollador `Travel hood pruebas` siguen Exclude/Prueba. Ya se enviaron unos eventos QA consentidos al flujo oficial, etiquetados developer/debug; **pueden aparecer en informes comerciales**. No se afirma exclusión ni se necesita una nueva decisión para continuar estas pruebas autorizadas. Para separarlos después, comprobar primero el alcance en Prueba y activar sólo con autorización expresa, guardando fecha/configuración; no inventar IPs ni personas. El modo de depuración por sí solo no acredita exclusión comercial.

## Activación, reversión y fecha fiable

1. Conservar export publicado real y versión anterior v5; el export de workspace 0 no es un snapshot oficial publicado. Registrar diferencias de cuenta, propiedad y contenedor. No reimportar archivos antiguos sobre cambios ajenos.
2. Revisar el workspace concreto y la candidata identificada, sin tocar Meta. Probar sobre build QA con IDs oficiales, gate true y `PUBLIC_ANALYTICS_ENV=test`. El loader compartido queda activo con gate false y preserva la convivencia con v5; el gate no sustituye una revisión de etiquetas GTM.
3. Medición mejorada del flujo oficial ya desactivada con autorización. Esto reduce desde ese momento la cobertura automática de la web todavía v5: no esperar scroll/outbound/formulario/vídeo/descarga/búsqueda automáticos. Los pageviews básicos de la v5 pueden continuar. La ventana de transición no se declara fiable. Signals/datos de usuario se mantienen apagados; key events e histórico no se cambian.
4. **Publicación GTM y despliegue Vercel aún pendientes de aprobación final.** Revisar diff final, evidencia SDK y cualquier bloqueo antes. Coordinar web nueva con gate true/entorno production e IDs oficiales y Google Tag sin pageview automático. Publicar la candidata Google primero sobre web antigua puede dejar hueco de pageviews; desplegar gate true sobre v5 puede duplicarlos. No asumir simultaneidad. Registrar intervalo/versiones mixtas y excluirlo de la fecha fiable. Si se exige continuidad estricta sin ventana, preparar y revisar una versión de transición antes de publicar.
5. Tras activación, verificar navegador móvil/escritorio, Tag Assistant y DebugView en producción; después informe/exploración procesada por fecha/evento con los conteos esperados. Decisión vigente: pruebas identificadas pero sin filtros de exclusión activos. Revisar HTML network-first/service worker, pestañas antiguas y offline; no atribuir versiones mixtas al contrato nuevo.
6. Fijar `reliable_from` sólo al satisfacer todas las comprobaciones esenciales: fecha/hora Europe/Madrid, commit desplegado, versión GTM, propiedad/flujo, decisión de filtros, recepción y reporte procesado, responsable. **Actualmente `reliable_from=null`.** Mantener histórico previo con advertencia de cobertura y sin reconstruir conversiones ficticias.

Reversión: coordinar el cambio Google en GTM con la web. Gate false elimina el contrato nuevo, **no restaura por sí solo Analytics después de publicar el Google Tag activado sólo por eventos propios**, ni detiene el contenedor o Meta. Restaurar la configuración Google anterior verificada y la web compatible, sin sobrescribir Meta; registrar el posible hueco/duplicados y recargar documentos antiguos. Si se restaura medición mejorada, usar el registro anterior de siete familias, historial y claves `q,s,search,query,keyword`, sin campos adicionales; encendido maestro puede perder los ajustes anteriores, por lo que hay que revisarlos. No borrar histórico ni recrear propiedad. No es posible retirar datos ya recibidos mediante opt-out local.

## Evidencia y continuidad

Matriz completa y revisión: [validation.md](validation.md). Solicitud preparada para proveedor, aún no enviada: [mygocu-request.md](mygocu-request.md). La evidencia histórica con GTM simulado sigue etiquetada como tal; la matriz vigente distingue el canary local de SDK Google real, DebugView y comprobación procesada pendiente.

Para fase 2: permisos sobre el flujo oficial confirmado; fuentes operativas de consultas/cualificación; estados y aislamiento del proveedor; identificadores opacos de reserva/salida/transacción; idempotencia y reconciliación de cobros/reembolsos; atribución consentida y pérdida admisible; capacidades reales de linker y callbacks. No conectar un contenedor compartido entre marcas sin confirmar aislamiento por tenant.

Fuentes técnicas consultadas: [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [referencias no deseadas](https://support.google.com/analytics/answer/10327750), [TikTok consentimiento](https://business-api.tiktok.com/portal/docs/pixel-cookie-consent-mode/v1.3). Aplicación concreta local en este documento; los cambios de cuenta siguen pendientes.
