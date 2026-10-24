# Revisión independiente de configuración de reporting — 24/10/2026

Revisor: browser_restart_review. Lectura de código, consumidores, guía y evidencia archivada de GA4; sin operar cuentas/UI ni modificar implementación. Única escritura: este dictamen. No se reprodujeron las operaciones de configuración ni se reejecutaron builds/pruebas funcionales.

## Versión examinada

Base Git `000c264bf6278ba84f2ded9e0803938ab07a7942`; fuente publicada `012f52954928ce195beff1a007e3621a69c5ea316d7059c2a13f6baf048ddfb4`. Contraste independiente: 35/35 hashes del manifiesto sin discrepancias; git diff --check código 0.

Propiedad GA4 498178258 / G-XQMPJG8B08. Exploración privada `slaZLoktRh-iWrXm_1w-LQ`, Travelhood | Informe mensual web: nueve pestañas, diez dimensiones de evento y cinco segmentos de sesión. Se examinó la lectura persistida final, no sólo propuestas o capturas previas.

SHA-256 documentales/configuración:

- client-reporting.md: `caa23bb2be3293ef6cf96db47ee30e581aba1a672a0872c1be3fc55da8c3a51f`.
- README.md: `6c222a499bb79be33e2bc1f67ef4a93e5309c0f639587b625e5b69114c69b583`.
- production-status.json: `abb5771fc000a63cf4243f932b556e75d2ff5d0e84547c1ee6009cc160c22bba`.
- reporting-setup/tabs-readback.json: `b1b4f46a91a2f87932490c72f630c06b4c7714ad7abbc0c6ed7fe9f3b94a5392`.
- reporting-setup/segments-persisted-readback.json: `2b89cf042dde68201e776b25aa2b7097076951eeb686632a9e78928c9d9aca29`.

## Hallazgo resuelto

[P2] La primera lista comercial de siete ubicaciones omitía dos emisores reales: destino/[slug].astro:295, private_trip_section, y presupuesto/[slug].astro:266, presupuesto_bottom_cta. Escenario: una sesión contacta exclusivamente desde esos CTA; quedaba fuera del resumen/adquisición comercial y de la pestaña 05, infracontando contactos respecto al alcance anunciado. Evidencia: consumidores fuente y regex inicial de segmento/pestaña.

Resolución contrastada en lecturas finales: regex anclada de nueve ubicaciones idéntica en el segmento compartido y pestaña 05; contiene ambas ubicaciones. El grupo mantiene versión 1 y alcance MISMO EVENTO. El barrido de src identificó cuatro emisores: TripDetailPage y las páginas destino, presupuesto y cuándo viajar. No se limitó el contraste a un consumidor.

Cuándo viajar mezcla consulta de salidas y aviso sin fechas bajo la misma ubicación; su intención no puede desambiguarse con los campos actuales. La pestaña 09 separa ese valor, comunidad, espera y otros valores no comerciales, con evento exacto, versión 1 y regex comercial negada; sin segmentos de sesión heredados. Comunidad/espera del modal permanecen excluidas del numerador comercial. No se promete hero/bottom para ubicaciones compartidas de las páginas.

## Dictamen final

Sin defectos bloqueantes adicionales detectados en la configuración examinada. La CNF comercial dentro de MISMO EVENTO equivale a privado O (destino Y ubicación comercial), con versión 1 en ese evento. No excluye una sesión por haber tenido también comunidad/espera. Las pestañas de sesiones emplean Sesiones; las de acciones emplean Número de eventos con filtros del evento, evitando contar todos los eventos de una sesión como contactos.

El filtro final 04 coincide con los cuatro nombres reales destination_view, destination_dates_price_interaction, destination_pdf_download y destination_booking_click. Las tablas de adquisición usan dimensiones nativas de sesión, sin confundir source funcional propio. La guía no convierte clics en consultas recibidas, reservas, cobros o ingresos.

La tasa privada requiere verificar la intersección entre sesiones con vista y contacto; la pestaña muestra conteos, no una tasa ya validada. Las tasas no están automatizadas. Los segmentos sólo requieren algún evento v1 y conservan otros eventos de esas sesiones; no representan sesiones exclusivamente v1.

## Límites de aceptación

Configuración creada/persistida no equivale a reporting conciliado. Las tablas v1 sin datos no se interpretan como cero negocio. Quedan pendientes disponibilidad y validación de dimensiones/procesado, atribución de adquisición, intersecciones/denominadores y conciliación de cifras. No se atribuye el vacío a indexación con certeza ni se promete retroactividad.

PDF conjunto: opción visible, descarga no confirmada; no se acredita exportación obtenida. Search Console: bienvenida sin propiedad verificada visible para esta cuenta; no acredita ausencia global de una propiedad. SEO no está configurado como informe operativo.

Permanecen los pendientes productivos previos de consentimiento/red/deduplicación y fase 2. reliable_from=null y businessReportReady=false son correctos. No se amplía esta revisión al SDK Meta, a informes comerciales fiables o a todos los datos reales. La reversión del reporting debe separarse de GTM/web y no sobrescribir Meta ni borrar histórico.

## Manifiesto final de evidencia

Contrastado reporting-setup-manifest.json, SHA-256 `5c18fdcccaf2c579bcd22a5a9dd0d0fe8daeb44776236107d2fd94a70619291c`: sus 30 archivos archivados coinciden independientemente con sus hashes, sin discrepancias. Identifica nueve pestañas y nueve ubicaciones comerciales; hash compuesto de evidencia de configuración registrado: `0be35e3ef21047cac0f20720cb529ca372adee89af0208e192843df97f817591`. Esta adenda identifica el manifiesto final posterior a las correcciones; no modifica el dictamen ni acredita conciliación de datos.
