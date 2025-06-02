
// IndexedDB configuration and helper functions

const DB_NAME = 'ev-charging-offline-db';
const DB_VERSION = 1;
const STORES = {
  RATINGS: 'offlineRatings',
  FAVORITES: 'offlineFavorites'
};

// Open the IndexedDB database
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.RATINGS)) {
        db.createObjectStore(STORES.RATINGS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
        db.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
      }
    };
  });
};

// Add an item to an object store
export const addItem = async (storeName: string, item: any): Promise<void> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.add({
      ...item,
      id: item.id || crypto.randomUUID(),
      timestamp: new Date().toISOString()
    });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error(`Failed to add item to ${storeName}`));
    
    transaction.oncomplete = () => db.close();
  });
};

// Get all items from an object store
export const getAllItems = async (storeName: string): Promise<any[]> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error(`Failed to get items from ${storeName}`));
    
    transaction.oncomplete = () => db.close();
  });
};

// Delete an item from an object store
export const deleteItem = async (storeName: string, id: string): Promise<void> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error(`Failed to delete item from ${storeName}`));
    
    transaction.oncomplete = () => db.close();
  });
};

// Clear all items from an object store
export const clearStore = async (storeName: string): Promise<void> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
    
    transaction.oncomplete = () => db.close();
  });
};
