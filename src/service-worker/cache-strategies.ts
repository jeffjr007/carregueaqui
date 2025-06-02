
import { CACHE_NAME, OFFLINE_URL } from './cache-config';

// Cache-first strategy: try cache, fall back to network
export async function cacheFirst(request: Request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache valid responses
    if (networkResponse.ok) {
      const clonedResponse = networkResponse.clone();
      cache.put(request, clonedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    // If both cache and network fail, serve the offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return await cache.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Network-first strategy: try network, fall back to cache
export async function networkFirst(request: Request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache valid responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      const clonedResponse = networkResponse.clone();
      cache.put(request, clonedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both network and cache fail, serve the offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return await cache.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Stale-while-revalidate strategy: return cached data immediately, then update cache
export async function staleWhileRevalidate(request: Request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Clone the request in case we need to make a fetch
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      // Clone the response so we can put it in the cache AND return it
      const clonedResponse = networkResponse.clone();
      cache.put(request, clonedResponse);
    }
    return networkResponse;
  }).catch(error => {
    console.error('Failed to fetch:', error);
    // Return a placeholder error response if possible
    return new Response(JSON.stringify({ error: 'Network error, using cached data' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  });
  
  // Return the cached response right away, or wait for the network if no cache
  return cachedResponse || fetchPromise;
}
