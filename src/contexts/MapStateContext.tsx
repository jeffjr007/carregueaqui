import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ChargingStation } from "@/types/station";

interface MapStateContextType {
  selectedStation: ChargingStation | null;
  setSelectedStation: (station: ChargingStation | null) => void;
  isDayMode: boolean;
  setIsDayMode: (isDay: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  showRating: boolean;
  setShowRating: (show: boolean) => void;
  showConnectorFilters: boolean;
  setShowConnectorFilters: (show: boolean) => void;
  selectedConnectors: string[];
  setSelectedConnectors: (connectors: string[]) => void;
  showMoreFilters: boolean;
  setShowMoreFilters: (show: boolean) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  distanceUnit: string;
  setDistanceUnit: (unit: string) => void;
  favoriteStationIds: string[];
  toggleFavoriteStation: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

const MapStateContext = createContext<MapStateContextType | undefined>(undefined);

export const MapStateProvider = ({ children }: { children: ReactNode }) => {
  // Retrieve preferences from localStorage
  const savedTheme = localStorage.getItem("userTheme");
  const savedDistanceUnit = localStorage.getItem("distanceUnit") || "km";
  // Retrieve favorite station IDs from localStorage
  const savedFavorites = localStorage.getItem("favoriteStationIds");
  const initialFavoriteIds: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];

  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isDayMode, setIsDayMode] = useState(savedTheme ? savedTheme === "light" : true);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showConnectorFilters, setShowConnectorFilters] = useState(false);
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [distanceUnit, setDistanceUnit] = useState(savedDistanceUnit);
  // Initialize favoriteStationIds state
  const [favoriteStationIds, setFavoriteStationIds] = useState<string[]>(initialFavoriteIds);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("userTheme", isDayMode ? "light" : "dark");
  }, [isDayMode]);

  // Save distance unit preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("distanceUnit", distanceUnit);
  }, [distanceUnit]);

  // Save favoriteStationIds to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favoriteStationIds", JSON.stringify(favoriteStationIds));
  }, [favoriteStationIds]);

  // Function to toggle a station's favorite status
  const toggleFavoriteStation = (stationId: string) => {
    setFavoriteStationIds(prevIds => {
      if (prevIds.includes(stationId)) {
        // Remove if already favorited
        return prevIds.filter(id => id !== stationId);
      } else {
        // Add if not favorited
        return [...prevIds, stationId];
      }
    });
  };

  // Function to check if a station is favorited
  const isFavorite = (stationId: string) => {
    return favoriteStationIds.includes(stationId);
  };

  return (
    <MapStateContext.Provider value={{
      selectedStation,
      setSelectedStation,
      isDayMode,
      setIsDayMode,
      showHistory,
      setShowHistory,
      showFavorites,
      setShowFavorites,
      showRating,
      setShowRating,
      showConnectorFilters,
      setShowConnectorFilters,
      selectedConnectors,
      setSelectedConnectors,
      showMoreFilters,
      setShowMoreFilters,
      selectedAmenities,
      setSelectedAmenities,
      activeFilter,
      setActiveFilter,
      distanceUnit,
      setDistanceUnit,
      favoriteStationIds,
      toggleFavoriteStation,
      isFavorite,
    }}>
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapState = () => {
  const context = useContext(MapStateContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapStateProvider');
  }
  return context;
};
