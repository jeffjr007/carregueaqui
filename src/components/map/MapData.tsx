
// This is now a barrel file that re-exports all functionality from the utility modules
import { userCars } from "@/data/userCars";
import { 
  fetchChargingStations, 
  checkFavoriteStatus, 
  toggleFavoriteStation, 
  fetchFavoriteStations 
} from "@/utils/stationUtils";
import { fetchChargingHistory } from "@/utils/chargingHistoryUtils";
import { 
  startChargingSession, 
  completeChargingSession, 
  getActiveChargingSessions 
} from "@/utils/chargingSessionUtils";

// Re-export everything for backward compatibility
export {
  userCars,
  fetchChargingStations,
  fetchChargingHistory,
  checkFavoriteStatus,
  toggleFavoriteStation,
  fetchFavoriteStations,
  startChargingSession,
  completeChargingSession,
  getActiveChargingSessions
};
