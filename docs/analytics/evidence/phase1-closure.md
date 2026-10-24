# Fase 1 — avance de cierre, 24/10/2026

**Implementación publicada y conservada en Git. Validación local aprobada en el alcance documentado. Verificación externa parcial; fase todavía no validada.** reliable_from=null; businessReportReady=false.

## Los cuatro puntos

1. **Consentimiento de producción: parcial.** Preferencias responsive y recorridos antes comprobados. A las 19:04 UTC se retiró Analytics, se guardó y se reabrió la UI: necesarias sí, analítica no, marketing no, sin recarga. Esto acredita estado/persistencia UI; no demuestra silencio de red. Falta sesión inicial limpia controlable y captura de tráfico antes de consentir y después de retirar.
2. **Interacción hasta GA4: confirmado en un caso representativo.** Una pulsación de Enter en el enlace final de WhatsApp a las 18:47:23.751–23.838 UTC; una fila de contacto en Tag Assistant Publicada y recepción única en DebugView a las 20:47:24 Europe/Madrid. Parámetros abiertos: cta=final, context=private_trip, measurement_version=1, page=viajes_privados, page_location=https://travelhood.es/viajes-privados/, traffic_type=external, has_utm=false, debug_mode=1. Sin mensaje. No es una garantía global de todos los eventos ni conciliación comercial.
3. **Informes procesados: pendiente.** Nueve pestañas guardadas; al reabrir el resumen v1 todavía «No hay datos disponibles». No quitar versión/filtros para aparentar datos. Falta conciliar contactos, vistas, destinos y adquisición de sesión; también descarga PDF real. El acceso actual a Search Console sólo muestra bienvenida.
4. **Conservar publicación en Git: resuelto.** Commit fuente 42e873b83947ac52abe34ac1aab578d46e3928bd en main remoto; despliegue Git Ready y dominio confirmado. Exactos 35 contenidos de la candidata 012f5295, sin trabajo ajeno.

## Versiones, cronología y compatibilidad

Base: 000c264bf6278ba84f2ded9e0803938ab07a7942. Candidata fuente SHA256: 012f52954928ce195beff1a007e3621a69c5ea316d7059c2a13f6baf048ddfb4. Árbol revisado: c596870994ff4b742bd53411394a106e72f4ed17. Commit fuente: 42e873b83947ac52abe34ac1aab578d46e3928bd.

GTM v6 y primera web CLI activos desde 15:36 UTC. El clic enlazado se hizo a 18:47 UTC en esa publicación. Después se envió Git a 18:52:17 UTC; build real completado a 18:54:07 UTC; dominio comprobado a 18:54:44 UTC sobre dpl_EaDzd9bcJ48mJ8oC7DqXF3xtcKoz, travelhood-nwklifbm0-travelhood.vercel.app. La comprobación HTTP posterior de apex/www confirma 200, IDs oficiales, bootstrap único, gate activo y el mismo SHA de HTML privado que la publicación CLI: 9d8fbf7c0ffa48db6ee73cbe63ecc4052b79ae8e2dbf1de22c8bd1625bcffe02. No atribuir el clic anterior a un despliegue Git aún no activo.

La sesión DebugView contiene tres cargas conocidas, dos del arranque/reinicio de Tag Assistant y una del documento controlado. Sus totales page_view=3/landing=3 no prueban duplicado por documento. En el documento enlazado de Tag Assistant: config1, eventTag2 inicial (page_view + landing); tras el clic, eventTag3 y una fila private_trip_whatsapp_click. El total observado de contactos en DebugView es 1. El emparejamiento usa contexto enlazado, acción y hora, sin identificar persona ni guardar ID de sesión.

No cambió código entre la publicación revisada y su incorporación a Git. Se conservan 18 eventos propios existentes y page_view controlado, consentimiento, href de contacto/reserva, GA4 e histórico. Meta/tag3 se mantiene; no se valida su SDK por inferencia de esta prueba. No se cambiaron filtros, campañas, inversión, eventos clave, reservas ni cobros. QA puede entrar en informes por decisión del titular.

## Matriz de aceptación vigente

| Criterio | Prueba | Entorno | Resultado | Evidencia |
| --- | --- | --- | --- | --- |
| Propiedad/contrato/histórico conservados | Auditoría real e identidad exacta de 35 contenidos | GA4/GTM reales + Git | PASS en alcance inspeccionado | account-audit-2026-10-24.json; shared-bootstrap-manifest.json; phase1-git-review.md |
| Ausente, rechazo, sólo analítica, sólo marketing, aceptación | Matriz de runtime y preferencias responsive | Local canary explícito + SDK Google representativo; UI producción | PASS local/UI; falta ausencia de red inicial en producción limpia | shared-bootstrap-validation.md; production-recheck.md |
| Cambio/retirada/reanudación | Runtime/SDK local previo y retirada UI productiva | Local real SDK + UI producción | PASS previo local y persistencia UI productiva; silencio de red productivo pendiente | shared-bootstrap-native-results.json; phase1-closure/withdrawal-ui-result.json |
| Una acción de contacto → un evento | Enter final una vez, Tag Assistant Publicada, DebugView | Producción real, publicación CLI 012f5295 | PASS caso enlazado: contacto1; sin mensaje | phase1-closure/controlled-contact.json; linked-debugview-receipt.json |
| Parámetros correctos/minimización | Abrir sólo parámetros permitidos en DebugView; allowlist y pruebas fuente | GA4 real + tests locales previos | PASS en campos inspeccionados; no se abrió/guardó ID de sesión ni mensaje | phase1-closure/debugview-parameter-observations.json; shared-bootstrap-unit.log |
| Vista/config únicas por documento | Documento Tag Assistant enlazado antes/después de contacto | Producción real | Config1; una vista + landing del documento controlado; no afirmar unicidad global | linked-debugview-receipt.json; archivo local linked-live-baseline.txt/PNG y linked-contact-event.txt |
| Fallos de analítica no rompen navegar/contactar/reservar | Fallos inyectados y href; recorrido rechazado y portal cargado | Local simulado + navegación externa real sin transacción | PASS casos documentados | shared-bootstrap-runtime.log; production-recheck.md |
| Build/tipos/tests pertinentes | Build normal/QA, tipos, runtime y consumidores sobre fuente idéntica | Local previo + nuevo build Git Vercel | PASS previo local; nuevo build Git PASS; no nueva lógica que exija repetir todos los tests | shared-bootstrap-validation.md; phase1-git-build-result.json; phase1-git-build.log |
| check:visibility | Script contra travelhood.es después del despliegue Git | Producción HTTP real | PASS 7 checks, negociación requerida | phase1-git-visibility-result.json; phase1-git-visibility.log |
| check:favicons | Script vigente del repositorio | Local WSL | PASS; no sustituye prueba visual en dispositivo físico | phase1-git-favicons-result.json; phase1-git-favicons.log |
| Publicación reproducible | Git índice35, commit, push, build Ready, alias/HTTP | GitHub/Vercel reales | PASS; trabajo ajeno fuera del commit | phase1-git-push.json; phase1-git-deployment.json; phase1-git-public-release.json |
| Informe reutilizable | Guardar/reabrir dimensiones10, segmentos5, pestañas9 | GA4 real | Configuración persistente; datos NO conciliados | ../client-reporting.md; reporting-setup/tabs-readback.json; reporting-setup/segments-persisted-readback.json |
| Recepción y reporte procesado son distintos | DebugView sí; resumen v1 sin datos al reabrir | GA4 real | Recepción PASS representativa; reporte/atribución PENDIENTES | linked-debugview-receipt.json; phase1-closure/processed-report-result.json; captura local processed-summary-final.txt/PNG |
| Continuidad Mygocu y estados comerciales | Solicitud concreta, sin envío ni capacidad presupuesta | Documento | Preparado; integración externa pendiente | ../mygocu-request.md; ../phase-1.md |

Los enlaces cortos de evidencia se resuelven desde este directorio. La matriz remite a registros previos cuando la prueba no se repitió. Los escenarios canary son simulación identificada, no integración operativa. Los metadatos técnicos estándar que GA4 añade con consentimiento no se confunden con parámetros propios sin datos personales.

## Pendientes concretos y desbloqueo

- Obtener una sesión inicial realmente limpia y controlable y captura permitida de red para no consentimiento/rechazo y retirada. El controlador disponible no consiguió esa captura; no se sortearon restricciones del navegador ni se usó la desconexión de Tag Assistant como prueba de ausencia. La UI retirada sí quedó comprobada. No es necesario que el titular encuentre la pestaña anterior para conservar el avance.
- Volver al informe cuando aparezcan datos v1 posteriores al registro de dimensiones y conciliar los valores y conteos de los eventos, vistas, periodo/zona horaria y atribución nativa. La disponibilidad depende del procesamiento de GA4, sin esperar indefinidamente. Repetir prueba de adquisición con un enlace de campaña permitido; no inferir campaña a partir de source del evento.
- Confirmar descarga PDF. Search Console requiere una cuenta con acceso a la propiedad existente; no crear otra propiedad ni cambiar permisos sin necesidad.
- QA/internal excluidos fue pospuesto expresamente, no una nueva condición impuesta. Mantener visible la posible contaminación, sin anunciar informes limpios.
- Fase 2: respuesta de Mygocu sobre tenant, dominios, consentimiento/linker, sandbox y estados/webhooks; la solicitud sigue preparada y no enviada. Fuente receptora de consultas y decisiones de cualificación, reserva, viajeros y cobro pendientes. Un clic no es consulta recibida ni venta.

## Activación y reversión

La activación ya se hizo y el histórico permanece. No se fija fecha comercial fiable sólo por publicar, enviar, ver DebugView o crear tablas. Fijar reliable_from cuando se satisfagan y registren las comprobaciones esenciales pendientes; documentar cobertura parcial del 24/10/2026.

Reversión coordinada inicial: GTM v5 (export published-v5-before-activation.json) y despliegue web anterior dpl_DVsZXFwuSz1D9QnSjDmUcqFfydEf / travelhood-a88ir2jwm-travelhood.vercel.app; revisar además Enhanced Measurement con el registro previo. Gate false aislado no restaura el contrato anterior. Véase production-validation.md y phase-1.md para evitar ventana mixta. Incorporar la candidata en Git no altera este procedimiento; revertir el commit sin coordinar GTM tampoco basta. Reversión no ejecutada.

## Revisión y conservación de evidencias

El revisor independiente browser_restart_review contrastó fuente, consumidores e índice35 sin modificar implementación. Dictamen en phase1-git-review.md; la versión fuente es exacta. La revisión de informes anterior resolvió dos ubicaciones comerciales omitidas en otros consumidores, reabiertas y corregidas: private_trip_section y presupuesto_bottom_cta; la ubicación mixta cuándo-viajar sigue separada. Esa aprobación anterior no se extiende por inferencia a esta nueva documentación/traza.

Los tres documentos actuales del manifiesto histórico reporting-setup-manifest.json se conservaron byte a byte en reporting-reviewed-docs antes de actualizarlos. El manifiesto original no se reescribe para aparentar aprobación de una versión posterior. La identidad del nuevo paquete se registra aparte. La revisión posterior detectó dos JSON crudos con URLs de WhatsApp y texto predefinido de contacto: se excluyeron de Git, conservando los originales locales y sus hashes en local-archive-index.json. No se cambió la implementación.

Sólo se preparan para Git observaciones estructuradas permitidas, contratos, exports y registros textuales pertinentes escaneados. Capturas y textos crudos de navegador permanecen en el archivo operativo local; phase1-closure/local-archive-index.json identifica ubicación, hashes y qué archivos están incluidos. No todas las pruebas visuales se publican en Git ni se promete que el paquete sea autocontenido. No se incorporan secretos de Preview, cookies, IDs de sesión, mensajes, HTML crudo ni cambios ajenos. La lista exacta de documentación nueva se conserva en phase1-closure-packet.json.

Formato de evidencia: el check de whitespace completo señala espacios finales y líneas vacías que producen los logs CLI nativos. Se conservan sus bytes como evidencia. La comprobación de documentación/JSON y demás archivos no log pasa; no se presenta el check completo de logs como PASS. Véase phase1-closure-doc-check.json. Revisión posterior del paquete en phase1-closure-review.md.
