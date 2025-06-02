
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ChargingStation } from "@/types/station";

interface MapStateContextType {
  selectedStation: ChargingStation | null;
  setSelectedStation: (station: ChargingStation | null) => void;
  isDayMode: boolean;
  setIsDayMode: (mode: boolean) => void;
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
}

const MapStateContext = createContext<MapStateContextType | undefined>(undefined);

export const MapStateProvider = ({ children }: { children: ReactNode }) => {
  // Recuperar preferência de tema do localStorage
  const savedTheme = localStorage.getItem("userTheme");
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

  // Salvar preferência de tema no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("userTheme", isDayMode ? "light" : "dark");
  }, [isDayMode]);

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
