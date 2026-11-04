// Service worker do Aeris (substitui o next-pwa).
// Estratégias de cache em tempo de execução, sem dependências de build:
// - /_next/static (arquivos com hash, imutáveis): cache primeiro
// - imagens, ícones e fontes: usa o cache e atualiza em segundo plano
// - páginas: rede primeiro, com fallback para o cache quando offline
// APIs, requisições de outras origens (Supabase) e payloads RSC nunca são cacheados.

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `aeris-static-${CACHE_VERSION}`;
const ASSET_CACHE = `aeris-assets-${CACHE_VERSION}`;
const PAGE_CACHE = `aeris-pages-${CACHE_VERSION}`;
const CURRENT_CACHES = [STATIC_CACHE, ASSET_CACHE, PAGE_CACHE];
const MAX_ENTRIES = 100;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Remove as entradas mais antigas para o cache não crescer indefinidamente
async function trimCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES)).map((key) => cache.delete(key)));
}

async function putInCache(cacheName, request, response) {
  if (!response || !response.ok || response.type !== 'basic') return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  await trimCache(cacheName);
}

async function cacheFirst(event, cacheName) {
  const cached = await caches.match(event.request);
  if (cached) return cached;
  const response = await fetch(event.request);
  event.waitUntil(putInCache(cacheName, event.request, response.clone()));
  return response;
}

async function staleWhileRevalidate(event, cacheName) {
  const cached = await caches.match(event.request);
  const network = fetch(event.request).then((response) => {
    event.waitUntil(putInCache(cacheName, event.request, response.clone()));
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => undefined));
    return cached;
  }
  return network;
}

async function networkFirst(event, cacheName) {
  try {
    const response = await fetch(event.request);
    event.waitUntil(putInCache(cacheName, event.request, response.clone()));
    return response;
  } catch (error) {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  if (request.headers.get('RSC') || url.searchParams.has('_rsc')) return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event, STATIC_CACHE));
  } else if (
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(event, ASSET_CACHE));
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirst(event, PAGE_CACHE));
  }
});
