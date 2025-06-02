import { useRef } from "react";
import mapboxgl from "mapbox-gl";
import { ChargingStation } from "@/types/station";
import { MapContainer } from "./MapContainer";
import { MapControls } from "./MapControls";
import { MapLegend } from "./MapLegend";
import { MapSearch } from "./MapSearch";
import { BottomNav } from "./BottomNav";
import { StationDetailsPopup } from "../charging/StationDetailsPopup";
import { ConnectorFilters } from "./ConnectorFilters";
import { MapFilters } from "./MapFilters";
import { useStationSearch } from "./useStationSearch";
import { PopupManager } from "./PopupManager";

interface MapUIContentProps {
  isDayMode: boolean;
  filteredStations: ChargingStation[] | undefined;
  selectedStation: ChargingStation | null;
  setSelectedStation: (station: ChargingStation | null) => void;
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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
}

export const MapUIContent = ({
  isDayMode,
  filteredStations,
  selectedStation,
  setSelectedStation,
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
  activeTab,
  setActiveTab,
  isLoading
}: MapUIContentProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  const { handleSearch } = useStationSearch({
    stations: filteredStations,
    setSelectedStation,
    mapRef
  });

  const handleShowFilters = () => {
    setShowConnectorFilters(true);
  };

  const handleShowMoreFilters = () => {
    setShowMoreFilters(true);
  };

  const handleCloseSelectedStation = () => {
    setSelectedStation(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando mapa...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {filteredStations && (
        <MapContainer
          stations={filteredStations}
          isDayMode={isDayMode}
          onStationSelect={setSelectedStation}
          mapRef={mapRef}
        />
      )}
      
      <MapSearch 
        onSearch={handleSearch}
        onShowFilters={handleShowFilters}
        mapRef={mapRef}
      />

      {showConnectorFilters && (
        <ConnectorFilters
          selectedConnectors={selectedConnectors}
          setSelectedConnectors={setSelectedConnectors}
          onClose={() => setShowConnectorFilters(false)}
        />
      )}

      {showMoreFilters && (
        <MapFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          showMoreFilters={showMoreFilters}
          setShowMoreFilters={setShowMoreFilters}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
          onClose={() => setShowMoreFilters(false)}
        />
      )}

      <MapLegend />
      
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {selectedStation && (
        <StationDetailsPopup 
          station={selectedStation} 
          onClose={handleCloseSelectedStation}
          mapRef={mapRef}
        />
      )}
    </div>
  );
};
