import { useState } from "react";
import mapboxgl from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { Navigation, X } from "lucide-react";
import { MapDirections } from "./MapDirections";
import { ChargingStation } from "@/types/station";

interface NavigationPanelProps {
  station: ChargingStation;
  map: mapboxgl.Map;
  onClose: () => void;
}

export const NavigationPanel = ({ station, map, onClose }: NavigationPanelProps) => {
  const [showDirections, setShowDirections] = useState(false);
  
  const handleStartNavigation = () => {
    setShowDirections(true);
  };
  
  const handleCloseDirections = () => {
    setShowDirections(false);
  };
  
  return (
    <div className="absolute bottom-24 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-30">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Navegação</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm mb-4">Navegando para: {station.name}</p>
      
      {!showDirections ? (
        <Button 
          onClick={handleStartNavigation} 
          className="flex items-center gap-2"
          size="sm"
        >
          <Navigation className="h-4 w-4" />
          Iniciar navegação
        </Button>
      ) : (
        <MapDirections 
          map={map} 
          destination={station.lngLat as [number, number]} 
          onClose={handleCloseDirections} 
        />
      )}
    </div>
  );
};
