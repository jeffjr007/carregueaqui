
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// Import service worker modules
import { 
  CACHE_NAME, 
  STATIC_CACHE_URLS, 
  OFFLINE_URL,
  DYNAMIC_CACHE_PATTERNS,
  API_CACHE_PATTERNS
} from './service-worker/cache-config';
import { 
  cacheFirst, 
  networkFirst, 
  staleWhileRevalidate 
} from './service-worker/cache-strategies';
import { 
  syncRatings, 
  syncFavorites 
} from './service-worker/sync-handlers';
import { 
  ExtendableEvent,
  FetchEvent,
  SyncEvent
} from './service-worker/types';
import { openDatabase } from './service-worker/db';

// Type assertion for 'self'
const sw = self as unknown as ServiceWorkerGlobalScope;

// Initialize IndexedDB when the service worker starts
openDatabase().then(() => {
  console.log('IndexedDB initialized for offline storage');
}).catch(error => {
  console.error('Failed to initialize IndexedDB:', error);
});

// Install handler: cache basic assets
sw.addEventListener('install', (event: ExtendableEvent) => {
  // Skip waiting to make the updated service worker activate immediately
  sw.skipWaiting();

  // Cache static resources
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_CACHE_URLS);
      
      // Fetch and cache offline page separately to ensure it's available
      try {
        const offlineResponse = await fetch(OFFLINE_URL);
        await cache.put(OFFLINE_URL, offlineResponse);
      } catch (error) {
        console.error('Failed to cache offline page:', error);
      }
    })()
  );
});

// Activate handler: clean up old caches
sw.addEventListener('activate', (event: ExtendableEvent) => {
  // Take control of all clients immediately
  sw.clients.claim();

  // Remove old caches
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      const oldCaches = cacheKeys.filter(key => key !== CACHE_NAME);
      await Promise.all(oldCaches.map(key => caches.delete(key)));
    })()
  );
});

// Fetch handler: serve from cache or network
sw.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache calls to the Supabase API that modify data
  if (
    (request.method !== 'GET' && request.method !== 'HEAD') ||
    // Skip non-GET requests or browser extension URLs
    request.url.includes('chrome-extension')
  ) {
    return;
  }

  // Handle API requests (stale-while-revalidate strategy)
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Handle static/dynamic asset requests
  if (
    url.origin === sw.location.origin ||
    DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url))
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default network-first strategy for all other requests
  event.respondWith(networkFirst(request));
});

// Background sync for offline operations
sw.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-ratings') {
    event.waitUntil(syncRatings());
  } else if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

export {};
