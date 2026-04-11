const CACHE_VERSION = 'v2';
const CACHE_NAME = `travelhood-${CACHE_VERSION}`;
const PRECACHE_URLS = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isCacheFirstPath(pathname) {
  return (
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/images/')
  );
}

function isHtmlNavigation(request) {
  return (
    request.method === 'GET' &&
    (request.mode === 'navigate' ||
      request.headers.get('accept')?.includes('text/html'))
  );
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return Response.error();
  }
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(event.request);
  const networkPromise = fetch(event.request).then((response) => {
    if (response.ok) cache.put(event.request, response.clone());
    return response;
  });

  if (cached) {
    event.waitUntil(networkPromise.catch(() => {}));
    return cached;
  }
  return networkPromise.catch(() => Response.error());
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.hostname === 'cdn.sanity.io') {
    event.respondWith(staleWhileRevalidate(event));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (isCacheFirstPath(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isHtmlNavigation(request)) {
    event.respondWith(networkFirst(request));
  }
});
