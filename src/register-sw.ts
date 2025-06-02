
import { addItem } from './service-worker/db';
import { toast } from "./hooks/use-toast";
import { SyncNotification } from './service-worker/types';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for background sync support
          if ('sync' in registration) {
            console.log('Background sync is supported');
          }
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
        
      // Set up message listener for sync notifications from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const data = event.data as SyncNotification;
        
        if (data.type === 'SYNC_NOTIFICATION') {
          if (data.status === 'success') {
            toast({
              title: 'Sync Complete',
              description: data.message,
              variant: "default",
            });
          } else {
            toast({
              title: 'Sync Failed',
              description: data.message,
              variant: "destructive",
            });
          }
        }
      });
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      document.dispatchEvent(new CustomEvent('app-online'));
      console.log('App is online');
      
      // Show toast notification
      toast({
        title: 'Connection Restored',
        description: 'You are back online. Syncing pending data...',
      });
      
      // Trigger background sync when coming back online
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          try {
            // Use type assertion to inform TypeScript that 'sync' exists on registration
            const syncManager = (registration as SWRegistrationWithSync).sync;
            syncManager.register('sync-ratings').catch((err: Error) => 
              console.error('Error registering sync-ratings:', err)
            );
            syncManager.register('sync-favorites').catch((err: Error) => 
              console.error('Error registering sync-favorites:', err)
            );
          } catch (error) {
            console.error('Background sync error:', error);
          }
        }
      });
    });
    
    window.addEventListener('offline', () => {
      document.dispatchEvent(new CustomEvent('app-offline'));
      console.log('App is offline');
      
      // Show toast notification
      toast({
        title: 'You are offline',
        description: 'Changes will be synced when connection is restored.',
        variant: "destructive",
      });
    });
  }
}

// Interface for ServiceWorkerRegistration with sync
interface SWRegistrationWithSync extends ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  }
}

// Function to save an offline rating
export async function saveOfflineRating(rating: any) {
  try {
    await addItem('offlineRatings', rating);
    console.log('Rating saved for offline sync');
    
    // Show toast notification
    toast({
      title: 'Rating Saved Offline',
      description: 'Your rating will be synced when you reconnect.',
    });
    
    // Register sync if possible
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        // Use type assertion to inform TypeScript that 'sync' exists on registration
        const syncManager = (registration as SWRegistrationWithSync).sync;
        await syncManager.register('sync-ratings');
      }
    }
    return true;
  } catch (error) {
    console.error('Error saving offline rating:', error);
    
    // Show error toast
    toast({
      title: 'Error Saving Rating',
      description: 'Could not save your rating for offline use.',
      variant: "destructive",
    });
    
    return false;
  }
}

// Function to save an offline favorite
export async function saveOfflineFavorite(favorite: any) {
  try {
    await addItem('offlineFavorites', favorite);
    console.log('Favorite saved for offline sync');
    
    // Show toast notification
    toast({
      title: 'Favorite Saved Offline',
      description: 'Your favorite will be synced when you reconnect.',
    });
    
    // Register sync if possible
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        // Use type assertion to inform TypeScript that 'sync' exists on registration
        const syncManager = (registration as SWRegistrationWithSync).sync;
        await syncManager.register('sync-favorites');
      }
    }
    return true;
  } catch (error) {
    console.error('Error saving offline favorite:', error);
    
    // Show error toast
    toast({
      title: 'Error Saving Favorite',
      description: 'Could not save your favorite for offline use.',
      variant: "destructive",
    });
    
    return false;
  }
}

// Check if the app should use cache-first loading (for better performance)
export function setupOfflineDetection() {
  let offlineMode = !navigator.onLine;
  
  // Create an event for components to listen to offline status changes
  const updateOfflineStatus = () => {
    offlineMode = !navigator.onLine;
    document.dispatchEvent(
      new CustomEvent('offline-status', { detail: { offline: offlineMode } })
    );
  };
  
  window.addEventListener('online', updateOfflineStatus);
  window.addEventListener('offline', updateOfflineStatus);
  
  // Initial status
  updateOfflineStatus();
  
  return {
    isOffline: () => offlineMode
  };
}
