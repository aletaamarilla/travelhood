# Colaboradores

- Página: /colaboradores/.
- Accesos: bloque de la home después de «Sobre nosotros», desplegable «Travel Hood» en el header, enlace secundario en el menú móvil y enlace en el footer.
- Sanity Studio: **Colaboradores**, documento único collaboratorsPage. El contenido inicial de IATI y Nomadcamper aparece al abrirlo por primera vez; publicar el documento para gestionar los cambios desde el CMS.
- Página y home usan el mismo proveedor de datos. Sin documento publicado se utiliza shared/collaborators.ts; una lista publicada vacía u oculta no recupera colaboradores del fallback.
- Se pueden editar los textos, enlaces completos, logos, fotografía, ventaja y condiciones, visibilidad y orden. Al retirar una ventaja, vaciar su campo. Los cambios en Sanity requieren reconstruir/publicar la web estática, como el resto del sitio.
- Actualizar/publicar el Studio para disponer del nuevo esquema. No es necesario ejecutar el seed general para añadir colaboradores.
- Ningún viaje de Travelhood incluye seguro de viaje: se contrata aparte y se muestra siempre en «No incluye». La corrección dirigida del contenido existente se revisa con `npm run fix:travel-insurance`; `--apply` guarda una copia previa y actualiza solo los campos afectados, comprobando la revisión de cada documento.

## Medición

Se emite collaborator_click a dataLayer solamente con consentimiento de analítica:
- partner_id: identificador del colaborador; all para el acceso general.
- source: home, footer, header, mobile_menu o collaborators_page.
- link_type: discovery para navegación interna, outbound para el enlace externo.

El evento no envía el enlace de afiliación, identificadores del contrato ni datos personales.
En GTM, usar un disparador de evento personalizado collaborator_click y enviar esos tres parámetros al destino de analítica configurado. Añadir el código no crea una etiqueta en el contenedor GTM.

## Recursos iniciales

Consultados el 8 de septiembre de 2026:
- IATI, SVG de su web oficial: https://cdn.sanity.io/images/mkg24y51/production/6ee8bc8bfe71b5deef34af639605dc44ab7214e8-109x60.svg
- Nomadcamper, logo original: https://nomadcamper.es/images/logo.png
- Nomadcamper, fotografía de Van Brisa publicada en su web: https://cdn.sanity.io/images/bm2h184q/production/aadf8c927a1cb61f2b306d7cc1f867269525e197-2000x1333.jpg
- Descuento habitual de IATI: https://www.iatiseguros.com/descuento-iati/; la captura aportada por el cliente muestra una rebaja del 5 %.

Los recursos se sirven localmente en public/images/collaborators/. Los bitmaps están optimizados para web. El enlace de IATI conserva exactamente el parámetro facilitado por el cliente y usa rel="sponsored noopener".

## Comprobaciones

- npm run test:collaborators
- npm run astro -- check
- npm run build
- npm run check:visibility -- http://localhost:4329
- npm run check:favicons
- npm --prefix studio run build
