
// Import the IndexedDB helper functions
import { getAllItems, deleteItem } from './db';
import { SyncNotification } from './types';

// Function to send notification to all clients
async function notifyClients(notification: SyncNotification) {
  try {
    // Correct way to access clients in service worker context
    const sw = self as unknown as ServiceWorkerGlobalScope;
    const clients = await sw.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage(notification);
    }
  } catch (error) {
    console.error('Error sending notification to clients:', error);
  }
}

// Function to sync pending ratings when back online
export async function syncRatings() {
  try {
    const pendingRatings = await getAllItems('offlineRatings');
    
    if (pendingRatings.length === 0) return;
    
    console.log(`Syncing ${pendingRatings.length} pending ratings`);
    let successCount = 0;
    let errorCount = 0;
    
    for (const rating of pendingRatings) {
      try {
        // Try to send the rating to the server
        const response = await fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rating),
        });
        
        if (response.ok) {
          // If successful, remove from pending
          await deleteItem('offlineRatings', rating.id);
          successCount++;
          console.log(`Successfully synced rating ${rating.id}`);
        } else {
          errorCount++;
          console.error(`Failed to sync rating ${rating.id}: Server responded with ${response.status}`);
        }
      } catch (error) {
        errorCount++;
        console.error('Failed to sync rating:', error);
      }
    }
    
    // Send notification about the sync result
    if (successCount > 0) {
      await notifyClients({
        type: 'SYNC_NOTIFICATION',
        status: 'success',
        operation: 'ratings',
        message: `Successfully synced ${successCount} ratings`,
        count: successCount
      });
    }
    
    if (errorCount > 0) {
      await notifyClients({
        type: 'SYNC_NOTIFICATION',
        status: 'error',
        operation: 'ratings',
        message: `Failed to sync ${errorCount} ratings`,
        count: errorCount
      });
    }
  } catch (error) {
    console.error('Error syncing ratings:', error);
    await notifyClients({
      type: 'SYNC_NOTIFICATION',
      status: 'error',
      operation: 'ratings',
      message: 'Error syncing ratings'
    });
  }
}

// Function to sync pending favorites when back online
export async function syncFavorites() {
  try {
    const pendingFavorites = await getAllItems('offlineFavorites');
    
    if (pendingFavorites.length === 0) return;
    
    console.log(`Syncing ${pendingFavorites.length} pending favorites`);
    let successCount = 0;
    let errorCount = 0;
    
    for (const favorite of pendingFavorites) {
      try {
        // Try to send the favorite to the server
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(favorite),
        });
        
        if (response.ok) {
          // If successful, remove from pending
          await deleteItem('offlineFavorites', favorite.id);
          successCount++;
          console.log(`Successfully synced favorite ${favorite.id}`);
        } else {
          errorCount++;
          console.error(`Failed to sync favorite ${favorite.id}: Server responded with ${response.status}`);
        }
      } catch (error) {
        errorCount++;
        console.error('Failed to sync favorite:', error);
      }
    }
    
    // Send notification about the sync result
    if (successCount > 0) {
      await notifyClients({
        type: 'SYNC_NOTIFICATION',
        status: 'success',
        operation: 'favorites',
        message: `Successfully synced ${successCount} favorites`,
        count: successCount
      });
    }
    
    if (errorCount > 0) {
      await notifyClients({
        type: 'SYNC_NOTIFICATION',
        status: 'error',
        operation: 'favorites',
        message: `Failed to sync ${errorCount} favorites`,
        count: errorCount
      });
    }
  } catch (error) {
    console.error('Error syncing favorites:', error);
    await notifyClients({
      type: 'SYNC_NOTIFICATION',
      status: 'error',
      operation: 'favorites',
      message: 'Error syncing favorites'
    });
  }
}

// Export the getPendingItems and removePendingItem functions for backwards compatibility
export async function getPendingItems(storeName: string) {
  return getAllItems(storeName);
}

// Helper function to remove a pending item from IndexedDB
export async function removePendingItem(storeName: string, itemId: string) {
  return deleteItem(storeName, itemId);
}
