# Informes de cliente — configuración real, 24/10/2026

**Configurados y guardados en GA4; conciliación con datos procesados pendiente.** La fase 1 sigue abierta: reliable_from=null, businessReportReady=false. Fuente publicada 012f5295, base 000c264bf6278ba84f2ded9e0803938ab07a7942; los 35 archivos del manifiesto siguen iguales y están guardados en el commit 42e873b83947ac52abe34ac1aab578d46e3928bd, main remoto y despliegue Git de producción. Esta ampliación cambia configuración de reporting, documentación y evidencias; no cambia etiquetas, web, filtros, eventos clave, audiencias ni Meta.

## Abrir y exportar

[Travelhood | Informe mensual web](https://analytics.google.com/analytics/web/#/analysis/a266541621p498178258/edit/slaZLoktRh-iWrXm_1w-LQ), propiedad 498178258/G-XQMPJG8B08. Exploración privada guardada en la sesión autenticada actual; aparece en Explorar. No se ha compartido públicamente ni enviado a nadie.

| Pestaña guardada | Qué muestra | Unidad |
| --- | --- | --- |
| 01 Resumen | Por fecha: sesiones medidas v1, con contacto comercial y con salida al portal | Sesiones por segmento, no contactos recibidos |
| 02 Canales | Las mismas métricas por grupo de canales predeterminado de la sesión | Sesiones |
| 03 Fuentes y campañas | Fuente/medio y campaña de la sesión | Sesiones |
| 04 Interés por destino | destination_view, destination_dates_price_interaction, destination_pdf_download, destination_booking_click por destino | Acciones separadas por evento |
| 05 Contactos por destino | destination_whatsapp_click por destino y ubicación comercial | Clics, no sesiones ni personas |
| 06 Privados - sesiones | Sesiones con private_trip_landing_view y con private_trip_whatsapp_click por fecha | Sesiones |
| 07 Privados - botones | private_trip_whatsapp_click por cta: hero/final/sticky_mobile cuando haya datos | Clics |
| 08 Entradas y dispositivos | Página de destino y dispositivo, con los tres segmentos del resumen | Sesiones |
| 09 Otros WhatsApp de destino | Comunidad, espera, cuándo viajar y ubicaciones sin clasificar | Clics separados del numerador comercial |

Periodo guardado: **Este mes**. Cada tabla muestra hasta 50 filas; comprobar filas/grupos y totales antes de exportar un periodo largo o muchos destinos. La fecha en Variables afecta a las nueve pestañas.

Para una entrega mensual:

1. Abrir el enlace con la cuenta actual y seleccionar El mes pasado.
2. Comprobar cobertura, procesamiento y las pestañas.
3. Usar Exportar datos → PDF (todas las pestañas). También hay CSV, TSV y PDF individual.

La opción de PDF conjunto se observó; **la descarga no está confirmada**: la espera del navegador terminó sin artefacto observable. Esto no demuestra un fallo del servicio de exportación de Google.

El primer periodo desde el 24/10/2026 será parcial. No entregar las tablas actuales vacías como cero negocio. Las dimensiones nuevas no reconstruyen automáticamente el histórico. Su fecha de creación es referencia de cobertura, no una fecha ya declarada fiable.

La entrega al cliente debe incluir explicación mensual y acciones sustentadas en los datos. No hay envíos programados ni panel público. La tasa de contacto está definida, pero **no se ha automatizado la división entre columnas de segmentos**: no sustituirla por una tasa de eventos clave ajena.

## Campos creados y comprobados

La auditoría anterior de 0 dimensiones a 17:39:20.899Z se conserva en [reporting-readiness](evidence/reporting-readiness/ga4-custom-definitions.json). Después se crearon 10 dimensiones de evento y se comprobaron tras recargar a 17:53:06.108Z:

| Nombre GA4 | Parámetro existente |
| --- | --- |
| TH Destino | destination_slug |
| TH Ubicación del botón | cta_location |
| TH Botón de privados | cta |
| TH Proveedor de reserva | booking_provider |
| TH Versión de medición | measurement_version |
| TH Tipo de tráfico | traffic_type |
| TH Origen de interacción | source |
| TH Modo de destino | destination_mode |
| TH Modo de fecha | date_mode |
| TH Fecha de interés | date_value |

source del evento describe la ubicación funcional del buscador; **la adquisición usa los campos nativos de sesión**. No se registraron mensajes, datos de contacto, identificadores de persona, URLs de WhatsApp ni UTM libres. Que una dimensión pueda seleccionarse no prueba que sus valores ya estén en las tablas procesadas.

## Criterios comerciales y coherencia

Los 5 segmentos guardados exigen measurement_version=1. La condición funcional y la versión deben satisfacerse **en el mismo evento**, confirmado al reabrir el selector de ámbito. El segmento base contiene sesiones con algún evento v1; esas sesiones pueden contener también otros eventos.

Contacto comercial, dentro del mismo grupo de evento:

    version1
    AND (destination_whatsapp_click OR private_trip_whatsapp_click)
    AND (ubicacion_comercial OR private_trip_whatsapp_click)

Regex anclada de ubicaciones comerciales:

    ^(departures_modal_reserve|bottom_cta_no_dates|bottom_cta_whatsapp|sidebar_no_dates|sidebar_doubts|mobile_bottom_bar_no_dates|mobile_bottom_bar_whatsapp|private_trip_section|presupuesto_bottom_cta)$

Comunidad (bottom_cta_community/sidebar_community/departures_modal_community) y espera (bottom_cta_waitlist/departures_modal_waitlist) no satisfacen el criterio. Una sesión que también tenga un contacto válido sí cuenta. Los no_dates son interés comercial sin fecha, no oportunidades cualificadas.



Revisión de todos los consumidores: TripDetailPage.tsx y las páginas destino/[slug].astro, presupuesto/[slug].astro y cuando-viajar-a/[slug].astro. private_trip_section (pedir viaje para mi grupo) y presupuesto_bottom_cta (resolver dudas de precio) están incluidos en las 9 ubicaciones comerciales. El fallback destination_page no lo emite actualmente ningún enlace existente y queda sin clasificar.

cuando_viajar_bottom_cta sirve para preguntar por salidas y también para avisos cuando no hay disponibilidad; el parámetro actual no permite separarlos. Se conserva en la pestaña 09 de otros clics, sin atribuirle consulta comercial ni oportunidad cualificada. Esa pestaña filtra versión 1, destination_whatsapp_click y ubicación NO coincidente con la regex comercial. Incluye comunidad, espera, cuándo viajar y valores no clasificados. No prometer distinción hero/bottom en estas páginas: el fallback de ubicación es compartido.

Los otros segmentos exigen destination_booking_click, private_trip_landing_view o private_trip_whatsapp_click, respectivamente, además de versión 1. Un segmento de sesión conserva todos los eventos de las sesiones seleccionadas: **Número de eventos no equivale a contactos**. Las pestañas de sesiones usan Sesiones; las de acciones filtran los propios eventos.

La pestaña 04 filtra versión 1 y los 4 nombres del contrato; la 05 filtra versión 1, destination_whatsapp_click y ubicación comercial; la 07 filtra versión 1 y private_trip_whatsapp_click. No tienen segmentos de sesión heredados. La pestaña 09 también usa filtros de evento, sin segmentos.

- Tasa global: sesiones con contacto comercial / sesiones medidas v1 × 100, mismo rango y cobertura. No usar clics/usuarios.
- Tasa privada: sesiones que vieron privados y contactaron / sesiones que vieron privados × 100. Antes de calcular, verificar intersección/cobertura del numerador; la tabla 06 muestra los dos conteos, no una división validada.
- Salida al portal no es reserva ni cobro. El fallback WhatsApp del modal cuenta como contacto sin inventar otro evento de reserva.
- Sesiones por destino, día o segmentos solapados no se suman para obtener personas o un total único.
- Abrir precios no es obligatorio para contactar; aterrizar en una ficha es una ruta válida.
- Consulta recibida, oportunidad cualificada, reserva, viajeros, cobro, ingresos y ROAS: **No disponible** hasta contar con sus fuentes operativas.

## Verificación y evidencia

| Criterio | Prueba | Entorno | Resultado | Evidencia |
| --- | --- | --- | --- | --- |
| Campos configurables | Crear 10 dimensiones y recargar | GA4 real | Persisten 10 sin faltantes | dimensions-persisted.json/PNG |
| Informe reutilizable | Crear, salir a Explorar y reabrir 9 pestañas | GA4 real | Guardado, privado | exploration-saved-home.png, tabs-readback.json |
| Sesiones coherentes y comunidad separada | Reabrir 5 segmentos: operadores, regex, versión, ámbito | GA4 real + revisión lógica | Versión 1/MISMO EVENTO en 5 | segments-persisted-readback.json |
| Compatibilidad | Contrastar filtros con EVENT_FIELDS y ubicaciones de TripDetailPage | Repositorio + configuración GA4 observada | PASS, corregidos 2 nombres iniciales | contract-crosscheck.json, destinations-filter-corrected.png |
| Exportación | Abrir menú y solicitar PDF conjunto | GA4 real/navegador | Opción presente; descarga no confirmada | export-options.txt, setup-result.json |
| Tablas completas | Conciliar eventos y parámetros procesados v1 | GA4 real | PENDIENTE; tablas finales sin datos disponibles | tabs-readback.json |
| SEO | Abrir Search Console con sesión disponible | Google real | Bienvenida; sin propiedad verificada visible | search-console-access.txt/PNG |
| Preservar fuente | Hash de los 35 archivos contra manifiesto publicado | Local | PASS, ninguno cambiado | contract-crosscheck.json |

Evidencias de esta tabla en docs/analytics/evidence/reporting-setup/. Pruebas locales anteriores en [README](README.md). Build, tipos, check:visibility, check:favicons y pruebas no se repitieron en esta ampliación de configuración/documentación: los 35 archivos de la candidata comprobada siguen idénticos. No aporta validación nueva de red productiva, consentimiento ni deduplicados.

Un diagnóstico antes de filtrar versión 1 mostró una sesión de contacto en Hoy. No se utiliza como conciliación final, porque su cobertura era distinta. Los nombres iniciales de precios y PDF se corrigieron contrastando código; el filtro final se recargó y volvió a leer. La revisión independiente detectó además dos ubicaciones comerciales omitidas de otros consumidores: corregidas en el segmento compartido y la pestaña 05, con comprobación al reabrir. Se añadió la pestaña 09 para los otros clics.

## Pendientes y continuidad

1. Con datos posteriores al registro, conciliar parámetros obligatorios, conteos, zona horaria y periodos en las tablas finales. Google indica 24–48 h para dimensiones nuevas; verificar, sin prometer plazo ni retroactividad.
2. Validar fuente/medio/campaña con enlace de prueba permitido y atribución procesada. La minimización de URL/referrer obliga a comprobarla.
3. Comprobar la descarga PDF; el control de esta sesión no obtuvo archivo.
4. SEO: abrir Travelhood desde una cuenta con acceso a Search Console, o dar acceso mínimo al usuario actual mediante el procedimiento normal. No se creó propiedad ni se solicitó acceso a terceros. Después exportar Rendimiento: clics, impresiones, CTR, posición, consultas y páginas. Clics GSC no equivalen a sesiones GA4.
5. Siguen pendientes primera visita limpia y silencio de red tras retirar consentimiento, conciliación procesada y atribución. La traza de un contacto ya se confirmó en producción: una acción, una fila en Tag Assistant y una recepción en DebugView a las 20:47:24 Europe/Madrid, con parámetros correctos; no equivale a deduplicación global ni a informe procesado. Retirada/persistencia UI comprobada, sin traza de red. Véase evidence/phase1-closure.md. Filtros QA/internal en Prueba por decisión del titular.
6. Fase 2: respuesta de Mygocu sobre capacidades/continuidad y fuente receptora de consultas con estados comerciales para reservas/cobros. La solicitud no se ha enviado.

Las tasas requieren cálculo/intersección aparte; no se ha prometido un informe de tasa ya automatizado. Revisión independiente de este añadido en evidence/reporting-setup-review.md. La implementación base está publicada y las pruebas locales anteriores aprobadas en su alcance; **reporting guardado, validación con datos y verificación externa integral pendientes**.

## Reversión y fuentes

Para retirar este añadido, dejar de usar la exploración/segmentos nuevos o recuperar la configuración anterior. No borrar histórico ni dimensiones para resolver tablas vacías; archivar requiere valorar impacto y límites de GA4. Las definiciones nuevas no cambian los eventos enviados. No revertir GTM/web ni tocar Meta para retirar un informe.

Fuentes oficiales consultadas 24/10/2026: [Exploraciones/exportación](https://support.google.com/analytics/answer/7579450?hl=en), [segmentos](https://support.google.com/analytics/answer/9304353?hl=en), [dimensiones](https://support.google.com/analytics/answer/14239696?hl=es), [adquisición](https://support.google.com/analytics/answer/12923437?hl=es), [procesamiento](https://support.google.com/analytics/answer/11198161?hl=en), [Search Console](https://support.google.com/webmasters/answer/7576553?hl=es).

## Actualización posterior del cierre

La configuración de nueve pestañas no se modificó durante la comprobación posterior. La reapertura del resumen con versión 1 siguió mostrando «No hay datos disponibles» (evidence/phase1-closure/processed-report-result.json, captura operativa processed-summary-final.txt/PNG). No es un resultado comercial de cero. El commit y despliegue Git posteriores sólo conservan la misma fuente publicada; no convierten DebugView en conciliación de informes. Estado vigente y matriz: [phase1-closure](evidence/phase1-closure.md).
