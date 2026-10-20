# Retirada de estimaciones de vuelos

Migración dirigida al proyecto Sanity `73m9u2gt`, dataset `production`.

- Elimina `flightEstimate` de todos los documentos, incluidos borradores.
- Sustituye seis copias publicadas que mostraban importes o hablaban de un vuelo estimado y tres consejos cualitativos sobre precios de vuelos.
- Conserva la información de negocio «vuelos internacionales no incluidos» sin publicar una cifra.
- Comprueba revisiones antes de escribir y ejecuta todas las modificaciones en una transacción.
- Guarda el plan, la copia previa y el resultado verificado en esta carpeta.

La previsualización es el modo predeterminado. La escritura requiere `--apply`.
