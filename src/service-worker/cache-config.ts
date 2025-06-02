
export const CACHE_NAME = 'ev-charging-cache-v1';
export const OFFLINE_URL = '/offline.html';

// Cached resources for offline use
export const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/main.js',
  '/static/css/main.css',
  // Add more static assets as needed
];

// Assets that will be cached during runtime when accessed
export const DYNAMIC_CACHE_PATTERNS = [
  /\.(?:js|css|woff2|png|svg|jpg|jpeg|gif|webp)$/,
  /^https:\/\/api\.mapbox\.com\//,
];

// API responses to cache
export const API_CACHE_PATTERNS = [
  /^https:\/\/.*?\/charging_stations/,
  /^https:\/\/.*?\/station_ratings/,
];
