
// Define o escopo global do Service Worker
export interface ServiceWorkerGlobalScope extends ServiceWorkerGlobalScopeBase {
  // Adiciona propriedades personalizadas ao escopo global
  __WB_MANIFEST: Array<{
    url: string;
    revision: string | null;
  }>;
  
  skipWaiting(): Promise<void>;
}

export interface ServiceWorkerGlobalScopeBase {
  caches: CacheStorage;
  clients: Clients;
  registration: ServiceWorkerRegistration;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
  fetch(request: Request | string): Promise<Response>;
  waitUntil<T>(promise: Promise<T>): void;
}

// Tipos para eventos do service worker
export interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

export interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}

export interface SyncEvent extends ExtendableEvent {
  tag: string;
}

// Tipo para notificações de sincronização
export interface SyncNotification {
  type: string;
  status: 'success' | 'error' | 'info';
  operation: string;
  message: string;
  count?: number;
  id?: string;
  title?: string;
  timestamp?: number;
}

// Tipos para estratégias de cache
export type CacheStrategy = 
  | 'cacheFirst'
  | 'networkFirst'
  | 'staleWhileRevalidate'
  | 'networkOnly'
  | 'cacheOnly';

// Configuração de rotas para cache
export interface CacheConfig {
  routes: RouteConfig[];
}

// Configuração específica de rota para cache
export interface RouteConfig {
  pattern: RegExp | string;
  strategy: CacheStrategy;
  cacheName?: string;
  expiration?: {
    maxEntries?: number;
    maxAgeSeconds?: number;
  };
}
