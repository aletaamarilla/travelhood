# Guia Manual de Produccion — Paso a Paso

> Estas son las 8 tareas que necesitas hacer TU a mano porque requieren acceso a paneles de control (Vercel, Hostinger, Google, etc.) donde yo no puedo entrar.
>
> Estan ordenadas. Haz una detras de otra. No te saltes ninguna.

---

## Tarea 2. Verificar documentos legales en Sanity

### Que es esto y por que importa

La ley espanola (LSSI y RGPD) obliga a que tu web tenga 4 paginas legales visibles y con contenido real. Si falta alguna o esta vacia, te pueden multar. Las 4 paginas son:

1. **Aviso Legal** — dice quien eres, tu CIF, direccion, etc.
2. **Politica de Privacidad** — explica que datos recoges y como los tratas.
3. **Terminos y Condiciones** — las reglas de reserva, cancelacion, etc.
4. **Politica de Cookies** — que cookies usa la web y para que.

### Pasos

#### Paso 1: Abre Sanity Studio

1. Abre tu navegador.
2. Ve a la URL de tu Sanity Studio (normalmente algo como `https://travelhood.sanity.studio` o el que uses localmente con `cd studio && npm run dev`).
3. Inicia sesion si te lo pide.

#### Paso 2: Busca los documentos legales

1. En el menu lateral izquierdo de Sanity Studio, busca una seccion que diga **"Paginas Legales"** o **"Legal Pages"**.
2. Haz clic ahi. Deberias ver una lista de documentos.

#### Paso 3: Comprueba que estan los 4

Tienes que ver estos 4 documentos exactos:

| Titulo esperado | Slug (la URL) |
|---|---|
| Aviso Legal | `aviso-legal` |
| Politica de Privacidad | `politica-de-privacidad` |
| Terminos y Condiciones | `terminos-y-condiciones` |
| Politica de Cookies | `politica-de-cookies` |

- Si **falta algun documento**, apuntalo. Lo crearemos en el siguiente paso.
- Si estan los 4, sigue al paso 4.

#### Paso 4: Comprueba que tienen contenido REAL

Haz clic en cada documento y comprueba:

- Que tiene un **titulo**.
- Que el **body** (cuerpo del texto) tiene parrafos de verdad con informacion legal real.
- Que **NO** dice "Este documento esta siendo preparado" ni nada parecido a un placeholder.
- Que los datos (CIF, direccion, nombre de la empresa) son los correctos de Travel Hood.

#### Paso 5: Si falta la Politica de Cookies

Si no esta, ejecuta esto en tu terminal (desde la raiz del proyecto):

```bash
npx tsx scripts/upload-cookie-policy.ts
```

Deberia imprimir: `Politica de cookies subida a Sanity correctamente.`

#### Paso 6: Si falta otro documento legal

Los otros 3 (aviso legal, privacidad, terminos) deben tener contenido escrito por ti o por un abogado. No se pueden generar automaticamente porque contienen datos legales especificos de tu empresa.

Opciones:
- Si tienes un script `scripts/upload-legal.ts`, revisalo y ejecutalo.
- Si no, entra en Sanity Studio y crea cada documento manualmente con el contenido legal que ya tengas preparado.

#### Paso 7: Comprueba las paginas en la web

1. Ejecuta `npm run build && npm run preview` en tu terminal.
2. Abre el navegador y ve a cada una de estas URLs:
   - `http://localhost:4321/legal/aviso-legal/`
   - `http://localhost:4321/legal/politica-de-privacidad/`
   - `http://localhost:4321/legal/terminos-y-condiciones/`
   - `http://localhost:4321/legal/politica-de-cookies/`
3. En **cada una**, comprueba:
   - Que carga contenido real (no dice "Este documento esta siendo preparado").
   - Que tiene titulos, parrafos y listas formateados correctamente.
   - Que no hay errores en la consola del navegador (F12 > Console).

#### Paso 8: Comprueba los enlaces del footer

1. Baja hasta el pie de pagina (footer) de cualquier pagina.
2. Haz clic en cada enlace legal: "Aviso legal", "Politica de privacidad", "Terminos y condiciones", "Politica de cookies".
3. Cada uno debe llevar a su pagina correcta con contenido real.

### Como se que esta bien hecho

- [ ] Los 4 documentos existen en Sanity con contenido real.
- [ ] Las 4 paginas web cargan contenido real (no placeholder).
- [ ] Los enlaces del footer funcionan y llevan a la pagina correcta.

---

## Tarea 9. Configurar variables de entorno en Vercel

### Que es esto y por que importa

Vercel necesita "conocer" ciertos datos para construir tu web correctamente: el ID de tu proyecto en Sanity, el ID de Google Tag Manager, la URL del sitio, etc. Estos datos se llaman "variables de entorno". Sin ellos, la web no se construira bien o le faltaran funcionalidades.

### Pasos

#### Paso 1: Abre el Dashboard de Vercel

1. Abre tu navegador.
2. Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard).
3. Inicia sesion con tu cuenta.

#### Paso 2: Entra en tu proyecto

1. Busca tu proyecto en la lista (probablemente se llama `travelhoodsystem` o similar).
2. Haz clic en el.

#### Paso 3: Ve a Settings > Environment Variables

1. En el menu superior del proyecto, haz clic en **"Settings"** (Ajustes).
2. En el menu lateral izquierdo, haz clic en **"Environment Variables"**.

#### Paso 4: Anade estas variables (una por una)

Para cada variable de la tabla, haz clic en el boton **"Add New"** y rellena:

| Nombre de la variable | Valor que poner | En que entorno |
|---|---|---|
| `SANITY_PROJECT_ID` | Tu ID real de proyecto Sanity (lo encuentras en tu `.env` local) | Production, Preview, Development |
| `SANITY_DATASET` | `production` | Production, Preview, Development |
| `SANITY_API_VERSION` | `2026-03-16` | Production, Preview, Development |
| `PUBLIC_SITE_URL` | `https://travelhood.es` | Production |
| `PUBLIC_GTM_ID` | Tu ID de GTM (formato `GTM-XXXXXXX`, lo encuentras en tu cuenta de Google Tag Manager) | Production |

**DONDE ENCONTRAR LOS VALORES:**
- Abre tu archivo `.env` local (en la raiz del proyecto) con cualquier editor de texto.
- Ahi estan todos los valores reales. Copialos y pegalos en Vercel.

#### Paso 5: Comprueba que NO esta SANITY_TOKEN

1. Mira la lista de variables que ya tienes en Vercel.
2. Si ves `SANITY_TOKEN`, **eliminala**. No debe estar en Vercel.
3. El token de Sanity solo se usa en tu ordenador para ejecutar scripts. En Vercel la web no lo necesita.

#### Paso 6: Guarda los cambios

Vercel guarda automaticamente cuando creas cada variable, pero asegurate de que todas aparecen en la lista con el valor correcto.

### Como se que esta bien hecho

- [ ] Las 5 variables de la tabla estan creadas en Vercel para el entorno Production.
- [ ] `SANITY_TOKEN` NO aparece en la lista de variables de Vercel.
- [ ] Los valores coinciden con los de tu `.env` local.

---

## Tarea 10. Deploy a Vercel en produccion

### Que es esto y por que importa

Hasta ahora la web solo funciona en tu ordenador. Este paso la publica en internet para que cualquier persona pueda verla. Primero la publicaremos en una direccion temporal que da Vercel (tipo `travelhoodsystem.vercel.app`) para comprobar que todo funciona antes de conectar el dominio real `travelhood.es`.

### Pasos

#### Paso 1: Sube los cambios a Git

Primero, todos los cambios que hemos hecho deben estar en tu repositorio. En tu terminal:

```bash
git add .
git commit -m "chore: pre-production audit — claims softened, images migrated, cookies fixed, edge cases cleaned"
git push origin main
```

#### Paso 2: Mira el deploy en Vercel

1. Abre [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Entra en tu proyecto.
3. Haz clic en **"Deployments"** en el menu superior.
4. Deberia aparecer un nuevo deploy en progreso (si tienes auto-deploy configurado con GitHub).
5. Si no se ha iniciado automaticamente, haz clic en **"Redeploy"** en el ultimo deploy, o ejecuta en terminal: `vercel --prod`.

#### Paso 3: Espera a que termine el build

1. Veras una barra de progreso o un log en tiempo real.
2. Espera hasta que diga **"Ready"** o muestre un tick verde.
3. Si falla (muestra error rojo), haz clic en el deploy para ver los logs y entender que fallo.

#### Paso 4: Abre la web en el dominio temporal

1. Cuando el deploy este listo, Vercel te dara una URL temporal (tipo `travelhoodsystem.vercel.app` o `travelhoodsystem-XXXXX.vercel.app`).
2. Haz clic en esa URL para abrir la web.

#### Paso 5: Revisa las paginas principales

Abre cada una de estas paginas y comprueba que cargan bien (no hay errores, las imagenes se ven, el texto es correcto):

| Pagina | URL a probar |
|---|---|
| Inicio | `/` |
| Viajes | `/viajes/` |
| Como funciona | `/como-funciona/` |
| Opiniones | `/opiniones/` |
| Preguntas frecuentes | `/preguntas-frecuentes/` |
| Viajar sola | `/viajar-sola/` |
| Viajes para mujeres | `/viajes-para-mujeres/` |
| Travel Hood | `/travelhood/` |
| Blog | `/blog/` |
| Ofertas | `/ofertas/` |
| Aviso legal | `/legal/aviso-legal/` |
| Politica de privacidad | `/legal/politica-de-privacidad/` |
| Terminos y condiciones | `/legal/terminos-y-condiciones/` |
| Politica de cookies | `/legal/politica-de-cookies/` |
| Al menos 2 destinos | `/destino/tailandia-verano/` y `/destino/egipto/` |
| Al menos 2 posts blog | `/blog/guia-definitiva-tailandia/` y otro |

#### Paso 6: Revisa los headers de seguridad

1. En cualquier pagina, pulsa **F12** (o clic derecho > Inspeccionar).
2. Ve a la pestana **"Network"** (Red).
3. Recarga la pagina con Ctrl+R.
4. Haz clic en la primera peticion de la lista (el HTML de la pagina).
5. En el panel derecho, busca **"Response Headers"**.
6. Comprueba que ves estos headers:

| Header | Valor esperado |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` | Un texto largo que empieza por `default-src 'self'...` |

Si los ves todos, los headers de seguridad estan funcionando.

#### Paso 7: Prueba los redirects de WordPress

Abre estas URLs antiguas en el navegador (anadiendo el dominio temporal delante). Cada una debe **redirigir** a la pagina nueva (no mostrar 404):

| URL antigua | Debe redirigir a |
|---|---|
| `/trip/tailandia` | `/destino/tailandia-verano/` |
| `/destinations/filipinas` | `/destino/filipinas-verano/` |
| `/shop/reserva-viajes-travelhood/reserva-a-egipto` | `/destino/egipto/` |
| `/aviso-legal` | `/legal/aviso-legal/` |

#### Paso 8: Prueba el Cookie Banner

1. Abre la web en una ventana de **incognito** (Ctrl+Shift+N en Chrome).
2. Deberia aparecer el banner de cookies abajo.
3. Haz clic en **"Aceptar todas"**. El banner desaparece.
4. Baja hasta el footer y haz clic en **"Gestionar cookies"**.
5. El banner debe volver a aparecer con los toggles activados (porque ya aceptaste).
6. Desactiva "Analiticas" y pulsa "Guardar preferencias".
7. El banner desaparece. Si vuelves a abrir "Gestionar cookies", "Analiticas" debe aparecer desactivada.

#### Paso 9: Comprueba las imagenes

1. Ve a `/blog/` y abre 2-3 articulos.
2. Comprueba que las imagenes de portada se ven correctamente (no estan rotas).
3. Si alguna imagen no carga (icono de imagen rota), apuntala.

### Como se que esta bien hecho

- [ ] El deploy en Vercel termino sin errores (marca verde).
- [ ] Todas las paginas principales cargan correctamente.
- [ ] Los headers de seguridad estan presentes.
- [ ] Al menos 4 redirects de WordPress funcionan.
- [ ] El cookie banner funciona: aparece, se puede gestionar, se reabren las preferencias.
- [ ] Las imagenes del blog cargan sin errores.
- [ ] Las paginas legales muestran contenido real.

---

## Tarea 11. Configurar DNS y conectar dominio travelhood.es

### Que es esto y por que importa

Ahora mismo la web funciona en una URL temporal de Vercel (tipo `travelhoodsystem.vercel.app`). Este paso conecta tu dominio real `travelhood.es` para que los visitantes lleguen a la nueva web cuando escriban esa direccion. Es como cambiar el cartel de una tienda de un sitio a otro.

**ATENCION:** Este paso hace que la web nueva sea la que ven los usuarios. Asegurate de que la tarea anterior (deploy) esta completada y todo funciona bien antes de continuar.

### Pasos

#### Paso 1: Anade el dominio en Vercel

1. Abre tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard).
2. Ve a **Settings** > **Domains**.
3. Escribe `travelhood.es` en el campo de texto y haz clic en **"Add"**.
4. Vercel te mostrara una pantalla con instrucciones. **No la cierres**. La necesitaras en el paso 3.
5. Repite lo mismo para `www.travelhood.es`.
6. Cuando anadiste `www.travelhood.es`, Vercel te preguntara si quieres redirigir `www` a la version sin `www` (o viceversa). Elige **redirigir `www.travelhood.es` a `travelhood.es`** (recomendado).

#### Paso 2: Apunta los registros DNS que te da Vercel

Vercel te dira exactamente que registros DNS necesitas. Normalmente son:

**Para `travelhood.es` (dominio raiz):**
| Tipo | Nombre | Valor |
|---|---|---|
| `A` | `@` | `76.76.21.21` |

**Para `www.travelhood.es`:**
| Tipo | Nombre | Valor |
|---|---|---|
| `CNAME` | `www` | `cname.vercel-dns.com` |

> Los valores exactos los da Vercel en la pantalla del paso anterior. Usa los que te muestre Vercel, no estos de ejemplo.

#### Paso 3: Cambia los DNS en tu registrador de dominios (Hostinger)

1. Abre [https://www.hostinger.es](https://www.hostinger.es) (o donde tengas registrado el dominio).
2. Inicia sesion.
3. Ve a **Dominios** > **travelhood.es** > **DNS / Zona DNS**.
4. Busca el registro `A` actual que apunta al servidor de WordPress (tendra una IP diferente, tipo `xxx.xxx.xxx.xxx`).
5. **Editalo** y cambia la IP por la que te dio Vercel (normalmente `76.76.21.21`).
6. Busca si hay un registro `CNAME` para `www`. Si existe, editalo para que apunte a `cname.vercel-dns.com`. Si no existe, crealo.
7. Guarda los cambios.

**IMPORTANTE:** No toques los registros `MX` (correo) ni los `TXT` (verificacion de Google, SPF, etc.). Solo cambia el `A` y el `CNAME www`.

#### Paso 4: Espera la propagacion

Los cambios de DNS pueden tardar entre 5 minutos y 48 horas en propagarse por todo internet. Lo normal es que tarde entre 15 minutos y 2 horas.

Para comprobar si ya se ha propagado, puedes:

**Opcion A — Desde tu terminal:**
```bash
dig travelhood.es +short
```
Si devuelve `76.76.21.21` (o la IP que te dio Vercel), ya esta propagado.

**Opcion B — Desde una web:**
Ve a [https://dnschecker.org](https://dnschecker.org), escribe `travelhood.es` y pulsa "Search". Te mostrara un mapa con checks verdes cuando este propagado en cada region.

#### Paso 5: Verifica que Vercel genero el certificado SSL

1. Vuelve a **Vercel Dashboard** > **Settings** > **Domains**.
2. Al lado de `travelhood.es` deberia aparecer un icono verde o "Valid Configuration".
3. Vercel genera automaticamente un certificado SSL de Let's Encrypt. Puede tardar unos minutos despues de la propagacion DNS.

#### Paso 6: Comprueba que todo funciona

1. Abre `https://travelhood.es` en tu navegador.
2. Comprueba que:
   - Carga la web nueva (no la de WordPress).
   - El candado verde (HTTPS) aparece en la barra de direcciones.
   - No hay advertencias de seguridad.
3. Abre `https://www.travelhood.es`.
4. Comprueba que **redirige automaticamente** a `https://travelhood.es` (sin `www`).

#### Paso 7: Verifica HSTS (opcional pero recomendado)

1. Ve a [https://hstspreload.org](https://hstspreload.org).
2. Escribe `travelhood.es`.
3. Haz clic en "Check HSTS preload status".
4. Si dice que es elegible, puedes enviarlo para preload (esto hace que los navegadores siempre usen HTTPS para tu dominio).

### Como se que esta bien hecho

- [ ] `https://travelhood.es` carga la nueva web desde Vercel.
- [ ] `https://www.travelhood.es` redirige a `https://travelhood.es`.
- [ ] El candado verde (HTTPS) aparece sin advertencias.
- [ ] En Vercel Dashboard, el dominio muestra "Valid Configuration".
- [ ] La web antigua de WordPress ya NO es accesible desde travelhood.es.

---

## Tarea 12. Configurar Google Search Console y enviar sitemap

### Que es esto y por que importa

Google Search Console (GSC) es la herramienta gratuita de Google que te dice como ve Google tu web: que paginas ha encontrado, si hay errores, y como apareces en los resultados de busqueda. Necesitas decirle a Google que tu web ha cambiado y darle un "mapa" de todas las paginas para que las indexe rapidamente.

### Pasos

#### Paso 1: Abre Google Search Console

1. Ve a [https://search.google.com/search-console](https://search.google.com/search-console).
2. Inicia sesion con la cuenta de Google de Travel Hood.

#### Paso 2: Verifica la propiedad del dominio (si no esta ya)

1. Si `travelhood.es` ya aparece en tu lista de propiedades y esta verificado, salta al paso 3.
2. Si no esta, haz clic en **"Anadir propiedad"**.
3. Elige **"Propiedad de dominio"** y escribe `travelhood.es`.
4. Google te pedira que anadad un **registro TXT** en tus DNS para verificar. Te dara algo como: `google-site-verification=XXXXXXXXXXXXXXXX`.
5. Ve a tu registrador de dominios (Hostinger):
   - Ve a DNS > Zona DNS.
   - Crea un nuevo registro **TXT**.
   - Nombre: `@`
   - Valor: el texto que te dio Google (`google-site-verification=...`)
   - TTL: dejar el valor por defecto.
   - Guarda.
6. Vuelve a Google Search Console y haz clic en **"Verificar"**.
7. Puede tardar unos minutos. Si no funciona a la primera, espera 10-15 minutos y reintenta.

#### Paso 3: Envia el sitemap

1. En Google Search Console, en el menu lateral izquierdo, haz clic en **"Sitemaps"**.
2. En el campo "Anadir un nuevo sitemap", escribe:
   ```
   https://travelhood.es/sitemap-index.xml
   ```
3. Haz clic en **"Enviar"**.
4. Google dira "Sitemap enviado". Puede tardar unos minutos en procesarlo.
5. Cuando lo procese, deberia mostrar un estado **"Correcto"** y la cantidad de URLs descubiertas.

#### Paso 4: Pide la indexacion de las paginas principales

Esto no es obligatorio, pero acelera mucho que Google indexe tus paginas importantes:

1. En el menu lateral, haz clic en **"Inspeccion de URLs"** (o usa la barra de busqueda arriba).
2. Escribe (o pega) la URL de la primera pagina: `https://travelhood.es/`
3. Haz clic en "Intro". Google analizara la URL.
4. Haz clic en **"Solicitar indexacion"**.
5. Espera a que termine (puede tardar 1-2 minutos por URL).
6. Repite para estas URLs (una por una):

| Pagina | URL |
|---|---|
| Viajes | `https://travelhood.es/viajes/` |
| Tailandia verano | `https://travelhood.es/destinos/asia/` |
| Destino Tailandia | `https://travelhood.es/destino/tailandia-verano/` |
| Blog | `https://travelhood.es/blog/` |
| Como funciona | `https://travelhood.es/como-funciona/` |
| Preguntas frecuentes | `https://travelhood.es/preguntas-frecuentes/` |
| Opiniones | `https://travelhood.es/opiniones/` |
| Viajar sola | `https://travelhood.es/viajar-sola/` |
| Viajes para mujeres | `https://travelhood.es/viajes-para-mujeres/` |

> Google tiene un limite de solicitudes de indexacion por dia (unas 10-20). Si te dice "Limite alcanzado", continua al dia siguiente.

#### Paso 5: Comprueba redirects antiguos

1. En la misma herramienta de Inspeccion de URLs, prueba algunas URLs antiguas del WordPress:
   - `https://travelhood.es/trip/tailandia`
   - `https://travelhood.es/shop/reserva-viajes-travelhood/reserva-a-egipto`
   - `https://travelhood.es/aviso-legal`
2. Google deberia mostrarte que estas URLs tienen un **redirect 301** hacia la nueva.
3. Si alguna no redirige, anotala para investigar.

### Como se que esta bien hecho

- [ ] La propiedad `travelhood.es` esta verificada en GSC.
- [ ] El sitemap `sitemap-index.xml` esta enviado y muestra estado "Correcto".
- [ ] He solicitado indexacion para las 10 paginas principales.
- [ ] Las URLs antiguas muestran redirects 301 en la inspeccion.

---

## Tarea 13. Verificar GTM, GA4 y Consent Mode en produccion

### Que es esto y por que importa

Google Tag Manager (GTM) y Google Analytics 4 (GA4) son las herramientas que cuentan cuanta gente visita tu web, que paginas ven, de donde vienen, etc. Pero por ley (RGPD), **solo pueden activarse cuando el usuario da su permiso** (acepta cookies de analiticas). Si se activan sin permiso, puedes recibir una multa. Si no se activan nunca, no tendras datos sobre tus visitas.

### Pasos

#### Paso 1: Abre la web en modo incognito

1. Abre Chrome (o tu navegador).
2. Pulsa **Ctrl+Shift+N** para abrir una ventana de incognito.
3. Ve a `https://travelhood.es`.

#### Paso 2: Comprueba SIN aceptar cookies

1. **NO** toques el banner de cookies todavia.
2. Pulsa **F12** para abrir DevTools.
3. Ve a la pestana **"Network"** (Red).
4. En el campo de filtro escribe `google` para ver solo las peticiones a Google.
5. Recarga la pagina con **Ctrl+R**.
6. Deberia aparecer la peticion a `gtm.js` (eso es GTM cargando). Eso esta bien.
7. **NO deberian** aparecer peticiones a `google-analytics.com` ni hits de GA4. Si las ves, algo esta mal con el Consent Mode.
8. Ahora ve a la pestana **"Console"** (Consola).
9. Escribe `dataLayer` y pulsa Enter.
10. Busca un objeto que diga `consent` con `default` y comprueba que `analytics_storage` dice `denied`. Eso significa que GA4 esta bloqueado por defecto (correcto).

#### Paso 3: Acepta cookies de analiticas

1. Haz clic en **"Aceptar todas"** en el banner de cookies.
2. Mira la pestana **"Network"** (filtrando por `google`).
3. Ahora **SI deberian** aparecer peticiones a `google-analytics.com` (eventos `page_view`).
4. En la **Console**, escribe `dataLayer` de nuevo.
5. Busca un objeto `consent` con `update` y comprueba que `analytics_storage` ahora dice `granted`.

#### Paso 4: Revoca el consentimiento

1. Baja al footer y haz clic en **"Gestionar cookies"**.
2. Desactiva el toggle de **"Analiticas"**.
3. Haz clic en **"Guardar preferencias"**.
4. En la pestana **"Network"**, ya **NO deberian** aparecer nuevas peticiones a GA4.

#### Paso 5: Comprueba en GA4 que llegan datos

1. Abre [https://analytics.google.com](https://analytics.google.com) en otra pestana.
2. Selecciona la propiedad de Travel Hood.
3. Ve a **"Informes"** > **"Tiempo real"** (o "Realtime").
4. Deberia mostrar al menos 1 usuario activo (tu).
5. Si no ves nada, espera 1-2 minutos y recarga.

#### Paso 6: Comprueba GTM Dashboard

1. Abre [https://tagmanager.google.com](https://tagmanager.google.com).
2. Selecciona el contenedor de Travel Hood.
3. Comprueba que el contenedor esta **publicado** (no en borrador). En la esquina superior derecha deberia decir algo como "Live version: X".
4. Opcionalmente, usa el **"Preview Mode"** (boton "Preview" arriba a la derecha) para depurar en tiempo real:
   - Escribe la URL de tu web y haz clic en "Connect".
   - Se abrira tu web con un panel de debug de GTM en la parte inferior.
   - Verifica que los tags de GA4 se disparan con los triggers correctos.

### Como se que esta bien hecho

- [ ] GTM carga en todas las paginas (peticion a `gtm.js` visible en Network).
- [ ] GA4 NO envia hits cuando no se han aceptado cookies.
- [ ] GA4 SI envia hits despues de aceptar cookies de analiticas.
- [ ] Al revocar el consentimiento, GA4 deja de enviar hits.
- [ ] En GA4 > Tiempo Real aparecen datos de visitas.
- [ ] El contenedor GTM esta publicado (no en borrador).

---

## Tarea 14. Monitorizacion post-launch — Primera semana

### Que es esto y por que importa

La primera semana despues de lanzar una web nueva es la mas importante. Google esta "entendiendo" tu nueva web, y si hay problemas (errores 404, paginas rotas, contenido duplicado), cuanto antes los detectes, menos dano haran a tu posicionamiento en Google.

### Que hacer CADA DIA durante 7 dias

Pon una alarma o recordatorio diario. Cada dia tienes que hacer estas 4 cosas:

#### Chequeo 1: Google Search Console — Errores de rastreo (5 min)

1. Abre [Google Search Console](https://search.google.com/search-console).
2. Ve a **"Paginas"** (en el menu lateral izquierdo, seccion "Indexacion").
3. Mira la grafica. Busca:
   - **Errores (rojo):** Paginas que Google no pudo cargar. Haz clic para ver cuales son.
   - **Excluidas:** Paginas que Google decidio no indexar. Revisa que no haya paginas importantes ahi.
   - **Soft 404:** Paginas que devuelven codigo 200 pero Google cree que estan vacias.
4. Si ves errores:
   - Si es una URL antigua de WordPress que falta en los redirects, anadela a `vercel.json`.
   - Si es una pagina nueva con error, investiga que pasa.
5. Apunta los numeros: cuantas paginas indexadas, cuantas con error.

#### Chequeo 2: Google Search Console — Rendimiento (5 min)

1. En GSC, ve a **"Rendimiento"** > **"Resultados de busqueda"**.
2. Mira estas metricas:
   - **Impresiones:** cuantas veces apareciste en resultados de busqueda.
   - **Clics:** cuantas veces hicieron clic en tu resultado.
   - **Posicion media:** en que posicion apareces de media.
3. Es **normal** que las impresiones bajen los primeros dias. Google esta re-indexando.
4. Si despues de 5-7 dias no recuperas posiciones, hay que investigar.

#### Chequeo 3: Busqueda manual en Google (2 min)

1. Abre Google.
2. Escribe: `site:travelhood.es`
3. Mira los resultados:
   - Deberian aparecer paginas de la web nueva (con las URLs nuevas).
   - **NO deberian** aparecer paginas de WordPress (con URLs antiguas tipo `/trip/...`).
   - Si aparecen URLs antiguas, es normal los primeros dias. Deberian desaparecer en 1-2 semanas.
4. Apunta cuantas paginas aparecen en total (Google lo muestra arriba de los resultados, tipo "Aproximadamente XXX resultados").

#### Chequeo 4: Vercel — Errores 404 (3 min)

1. Abre [Vercel Dashboard](https://vercel.com/dashboard) > tu proyecto.
2. Ve a **"Analytics"** (si esta habilitado) o a **"Deployments"** > ultimo deploy > **"Functions"** (si usas funciones).
3. Busca errores 404. Si hay URLs que dan 404 y son URLs antiguas de WordPress, necesitas anadir un redirect en `vercel.json`.
4. Para anadir un redirect: edita `vercel.json` en tu proyecto, anade una linea en la seccion `"redirects"` siguiendo el formato existente, y haz push a git para que se redespliegue.

### Tabla de seguimiento diario (copia y rellena)

| Dia | Fecha | Paginas indexadas | Errores GSC | Impresiones | Clics | URLs 404 nuevas | Notas |
|---|---|---|---|---|---|---|---|
| 1 | ___/___ | | | | | | |
| 2 | ___/___ | | | | | | |
| 3 | ___/___ | | | | | | |
| 4 | ___/___ | | | | | | |
| 5 | ___/___ | | | | | | |
| 6 | ___/___ | | | | | | |
| 7 | ___/___ | | | | | | |

### Como se que la primera semana ha ido bien

- [ ] No hay errores 404 inesperados (solo URLs antiguas menores que he anadido como redirects).
- [ ] Las paginas principales estan siendo indexadas (aparecen en `site:travelhood.es`).
- [ ] No hay una caida dramatica en impresiones/clics (cierta bajada es normal).
- [ ] He anadido redirects para cualquier URL 404 que haya detectado.

---

## Tarea 15. Planificar apagado de WordPress

### Que es esto y por que importa

El servidor antiguo de WordPress (en Hostinger) todavia esta encendido y te esta costando dinero cada mes. Pero no lo puedes apagar ya mismo porque necesitas asegurarte primero de que la nueva web ha "absorbido" todo el trafico y que Google ya no envia a nadie a WordPress. Si lo apagas demasiado pronto, podrias perder trafico.

### Cuando puedo apagarlo

**NO antes de 2-4 semanas despues del lanzamiento.** Y solo si se cumplen TODOS estos criterios:

| # | Criterio | Como comprobarlo |
|---|---|---|
| 1 | Las imagenes de blog estan migradas | Ya hecho (11 imagenes descargadas a `/public/images/blog/`) |
| 2 | No quedan referencias a `wp-content` en el codigo | Ya verificado (0 resultados en grep) |
| 3 | Los redirects 301 llevan al menos 2 semanas procesandose en GSC | Esperar y comprobar en GSC > Paginas > URLs con redirect |
| 4 | Las paginas principales de la nueva web estan indexadas | Buscar `site:travelhood.es` en Google y ver que aparecen |
| 5 | No hay caida significativa de trafico organico | Comparar impresiones/clics en GSC con el periodo anterior |

### Pasos para el apagado (cuando se cumplan los 5 criterios)

#### Paso 1: Haz un backup completo de WordPress

Antes de apagar nada, descarga una copia de seguridad:

1. Entra en tu panel de Hostinger.
2. Ve a **"Backups"** o **"Copias de seguridad"**.
3. Descarga un backup completo (base de datos + archivos).
4. Guardalo en un disco duro o carpeta segura. Este backup es tu red de seguridad.

#### Paso 2: Descarga la carpeta wp-content/uploads

Por si acaso hay alguna imagen que se nos haya escapado:

1. Conéctate por FTP a tu hosting (o usa el administrador de archivos de Hostinger).
2. Navega a la carpeta `wp-content/uploads/`.
3. Descarga toda la carpeta a tu ordenador.
4. Guardala junto al backup del paso 1.

#### Paso 3: Verifica una ultima vez

Ejecuta en tu terminal:

```bash
cd /home/amfernandez/personalProjects/travelhoodsystem
rg "wp-content" src/
```

Si no devuelve nada, estas limpio. Si devuelve algo, migra esas referencias antes de continuar.

#### Paso 4: Apaga WordPress

1. Entra en tu panel de Hostinger.
2. Ve a **"Hosting"** > plan actual.
3. Busca la opcion de **cancelar** o **desactivar** el hosting.
4. Si no quieres cancelar del todo, puedes simplemente **parar el servicio** o **no renovar** cuando expire.

#### Paso 5: Monitoriza durante 1 semana mas

Despues de apagar WordPress, haz los chequeos de la tarea 14 durante 1 semana mas:

1. Revisa GSC cada dia buscando nuevos errores 404.
2. Busca `site:travelhood.es` en Google para verificar que todo sigue bien.
3. Si detectas que algo se ha roto (imagenes que no cargan, URLs que dan 404), puedes restaurar WordPress temporalmente desde el backup.

### Como se que es seguro apagar

- [ ] Han pasado al menos 2 semanas desde el lanzamiento.
- [ ] Los 5 criterios de la tabla se cumplen.
- [ ] Tengo un backup completo descargado y guardado.
- [ ] Tengo la carpeta `wp-content/uploads/` descargada.
- [ ] He verificado que no quedan referencias a `wp-content` en el codigo.

---

## Tarea 16. Verificaciones de seguridad, RGPD y legal (no son codigo)

### Que es esto y por que importa

Hay varias comprobaciones legales y de cumplimiento RGPD que no se pueden hacer desde el codigo porque dependen de configuraciones en paneles de control de terceros (Vercel, Sanity, Google Tag Manager). Si no las haces, puedes recibir una sancion de la AEPD o una denuncia de un competidor/usuario.

---

### Verificacion 1: DPA (Data Processing Agreement) con Vercel

**Que es:** Un contrato obligatorio bajo el RGPD (art. 28) entre tu (responsable del tratamiento) y Vercel (encargado del tratamiento). Vercel procesa datos de tus visitantes (IPs, logs de acceso).

**Como comprobarlo:**

1. Abre [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Haz clic en tu **icono de equipo/cuenta** arriba a la izquierda.
3. Ve a **"Settings"** (ajustes de la cuenta, no del proyecto).
4. Busca la seccion **"Legal"** o **"Data Processing"** o **"DPA"**.
5. En Vercel Pro, el DPA suele estar disponible como un documento descargable o un acuerdo que puedes aceptar con un clic.
6. Si ves un boton para **"Accept DPA"** o **"Sign DPA"**, hazlo.
7. Si no encuentras la opcion, ve a [https://vercel.com/legal/dpa](https://vercel.com/legal/dpa) y descarga el documento. Enviales un email a privacy@vercel.com solicitando que lo firmen (con tu plan Pro deberian responder rapido).

**Como se que esta bien:**
- [ ] Tengo el DPA de Vercel aceptado o firmado.

---

### Verificacion 2: DPA (Data Processing Agreement) con Sanity

**Que es:** Lo mismo que con Vercel. Sanity almacena los datos de tu CMS (testimonios con nombres, ciudades, edades de viajeros) y puede procesar datos en servidores fuera de la UE.

**Como comprobarlo:**

1. Abre [https://www.sanity.io/manage](https://www.sanity.io/manage).
2. Selecciona tu proyecto.
3. Ve a **"Settings"** (ajustes).
4. Busca la seccion **"Legal"** o **"Data Processing Agreement"**.
5. Si hay un boton o enlace para aceptar el DPA, hazlo.
6. Si no aparece, ve a [https://www.sanity.io/legal/dpa](https://www.sanity.io/legal/dpa) y revisa el documento.
7. Sanity suele tener un DPA auto-aceptado al usar el servicio (esta en sus Terms of Service), pero es recomendable descargarlo y guardarlo.

**Como se que esta bien:**
- [ ] Tengo el DPA de Sanity revisado y aceptado.

---

### Verificacion 3: Revisar tags de GTM respetan Consent Mode

**Que es:** Tu web usa Google Consent Mode v2 (ya implementado en el codigo). Pero si alguien configuro tags en GTM que se disparan sin respetar el consentimiento, estarias trackeando sin permiso del usuario — multa RGPD.

**Como comprobarlo:**

1. Abre [https://tagmanager.google.com](https://tagmanager.google.com).
2. Selecciona el contenedor de Travel Hood.
3. En el menu lateral izquierdo, haz clic en **"Tags"** (Etiquetas).
4. Revisa **CADA tag** de la lista:
   - Haz clic en el tag.
   - Mira la seccion **"Consent Settings"** (Configuracion de consentimiento). Deberia estar visible en la parte inferior de la configuracion del tag.
   - Para tags de **Google Analytics / GA4**: debe requerir `analytics_storage`.
   - Para tags de **Google Ads / Conversion Tracking**: debe requerir `ad_storage`.
   - Si un tag dice **"No consent required"** o **"Not set"** y es un tag de analytics/marketing, eso es un problema.
5. Si encuentras un tag sin consent configurado:
   - Haz clic en **"Consent Settings"**.
   - Activa **"Require additional consent for tag to fire"**.
   - Anade `analytics_storage` (para tags de GA) o `ad_storage` (para tags de Ads).
   - Guarda.
6. Cuando hayas revisado todos los tags, haz clic en **"Submit"** (Enviar) arriba a la derecha para publicar los cambios.

**Truco rapido para verificar que funciona:**

1. En GTM, haz clic en **"Preview"** (Vista previa) arriba a la derecha.
2. Escribe la URL de tu web y haz clic en **"Connect"**.
3. Se abrira tu web con un panel de debug abajo.
4. **Sin aceptar cookies:** mira el panel. Los tags de GA4/Ads deberian aparecer como **"Not Fired"** (no disparados).
5. **Acepta cookies:** los tags deberian cambiar a **"Fired"** (disparados).

**Como se que esta bien:**
- [ ] Todos los tags de GA4 requieren `analytics_storage`.
- [ ] Todos los tags de Ads requieren `ad_storage`.
- [ ] En modo Preview: los tags NO se disparan sin consentimiento.
- [ ] En modo Preview: los tags SI se disparan despues de aceptar cookies.

---

### Verificacion 4: Politica de privacidad — Contenido completo en Sanity

**Que es:** La Politica de Privacidad que tienes subida a Sanity debe mencionar TODOS los servicios que procesan datos de tus visitantes. Si falta alguno, incumples el RGPD (art. 13 y 14).

**Como comprobarlo:**

1. Abre la politica de privacidad en tu web: `https://travelhood.es/legal/politica-de-privacidad/`
2. Lee el documento y comprueba que menciona **todos** estos puntos:

| Punto | Que debe decir |
|---|---|
| **Responsable** | TRAVEL HOOD, S.L.U., CIF B19950385, C/Melilla 20, 1 Delta, 04007 Almeria, contacta@travelhood.es |
| **Finalidad** | Para que recoges datos (ej: gestionar reservas via WhatsApp, analytics, marketing) |
| **Base legal** | Consentimiento (cookies), interes legitimo (analytics anonimas), ejecucion de contrato (reservas) |
| **Destinatarios** | Google (Analytics, Ads via GTM), Sanity.io (CMS), Vercel (hosting) |
| **Transferencias internacionales** | Google y Sanity pueden transferir datos a EE.UU. bajo el EU-US Data Privacy Framework |
| **Plazo de conservacion** | Cuanto tiempo guardas los datos (ej: cookies 1-2 anos, datos de reserva X anos) |
| **Derechos ARCO** | Derecho de acceso, rectificacion, cancelacion, oposicion, portabilidad, limitacion |
| **Como ejercerlos** | Email a contacta@travelhood.es |
| **Derecho de reclamacion** | Ante la AEPD: https://www.aepd.es |

3. Si falta alguno de estos puntos, editalo en Sanity Studio:
   - Abre Sanity Studio.
   - Ve a Paginas Legales > Politica de Privacidad.
   - Anade los apartados que falten.
   - Publica.

**Como se que esta bien:**
- [ ] La politica de privacidad menciona a Google, Sanity y Vercel como destinatarios.
- [ ] Menciona las transferencias internacionales a EE.UU.
- [ ] Incluye los derechos ARCO y como ejercerlos.
- [ ] Menciona el derecho a reclamar ante la AEPD.

---

### Verificacion 5: Numero de licencia de agencia de viajes

**Que es:** Si operas como agencia de viajes en Espana, necesitas una licencia del Registro de Turismo de tu comunidad autonoma (en Andalucia: REAT). Es obligatorio mostrar el numero en la web.

**Como comprobarlo:**

1. Consulta con la propietaria si Travel Hood tiene licencia de agencia de viajes activa en Andalucia.
2. Si la tiene, el numero sera algo como `REAT-AL/XXXXXX`.
3. Cuando tengas el numero:
   - Editalo en el footer: abre `src/components/Footer.astro`, busca la linea del copyright, y anade el numero.
   - Anadelo al aviso legal en Sanity: edita el documento "Aviso Legal" y anade en la seccion 1 (Datos identificativos): "Numero de registro de agencia de viajes: REAT-AL/XXXXXX".
4. Si **no** tiene licencia, no digas "agencia" en ningun sitio de la web. Actualmente ya se ha quitado del footer.

**Como se que esta bien:**
- [ ] Se que Travel Hood tiene (o no) licencia de agencia activa.
- [ ] Si la tiene, el numero esta visible en el footer y en el aviso legal.
- [ ] Si no la tiene, en ningun sitio de la web se dice "agencia registrada" ni similar.

---

### Verificacion 6: Imagenes de Pexels — Uso correcto

**Que es:** El blog usa imagenes descargadas de Pexels (licencia gratuita). Pexels no requiere atribucion, pero **prohibe** usar fotos de personas identificables para dar a entender que esas personas avalan tu producto o servicio.

**Como comprobarlo:**

1. Abre las 5 imagenes de Pexels que usas en el blog (estan en `/public/images/blog/` con nombres `pexels-...`).
2. Para cada imagen, comprueba:
   - Si muestra **personas reconocibles** (caras claramente visibles): asegurate de que no se usan en un contexto que sugiera que esas personas son viajeros de Travel Hood o avalan la marca.
   - Si son paisajes, edificios o escenas genericas: no hay problema.
3. Si alguna foto muestra personas reconocibles en contexto de aval, sustituyela por una foto generica o una propia.

**Como se que esta bien:**
- [ ] He revisado las imagenes de Pexels.
- [ ] Ninguna se usa para implicar endorsement falso de personas identificables.

---

## Checklist final — Resumen de TODO lo hecho

Marca cada item cuando este completado:

### Automatizado (ya hecho)
- [x] Boton "Gestionar cookies" anadido en el footer
- [x] Listener para reabrir cookie banner implementado
- [x] `.env` no trackeado en git
- [x] Claims de seguridad suavizados (8 archivos modificados)
- [x] Estadisticas con fuente o caveat
- [x] Seguro de viaje clarificado
- [x] Politica de cancelacion consistente en todos los archivos
- [x] 11 imagenes de blog migradas de wp-content
- [x] Leaflet CSS duplicado eliminado
- [x] Build completo sin errores (127 paginas)
- [x] Auditoria final limpia (0 console.log, 0 wp-content, 0 secrets)

### Manual (tienes que hacerlo tu)
- [ ] 4 documentos legales completos en Sanity (Tarea 2)
- [ ] Variables de entorno configuradas en Vercel (Tarea 9)
- [ ] Deploy exitoso a Vercel (Tarea 10)
- [ ] DNS configurados — travelhood.es apunta a Vercel (Tarea 11)
- [ ] Google Search Console verificado + sitemap enviado (Tarea 12)
- [ ] GTM + GA4 + Consent Mode verificados (Tarea 13)
- [ ] Monitorizacion diaria completada (7 dias) (Tarea 14)
- [ ] WordPress apagado de forma segura (Tarea 15)
- [ ] DPA con Vercel aceptado/firmado (Tarea 16.1)
- [ ] DPA con Sanity revisado (Tarea 16.2)
- [ ] Tags de GTM respetan Consent Mode (Tarea 16.3)
- [ ] Politica de privacidad completa con todos los destinatarios (Tarea 16.4)
- [ ] Numero de licencia de agencia resuelto (Tarea 16.5)
- [ ] Imagenes de Pexels revisadas (Tarea 16.6)
