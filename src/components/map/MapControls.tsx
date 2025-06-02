import { Button } from "@/components/ui/button";
import { Filter, Layers, MapPin, SunMoon, Maximize2 } from "lucide-react";
import { memo, MutableRefObject } from "react";
import { useMapState } from "@/contexts/MapStateContext";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';

interface MapControlsProps {
  onShowFilters: () => void;
  onShowMoreFilters: () => void;
  mapRef: MutableRefObject<mapboxgl.Map | null>;
}

export const MapControls = memo(({ onShowFilters, onShowMoreFilters, mapRef }: MapControlsProps) => {
  const { isDayMode, setIsDayMode } = useMapState();
  const { toast } = useToast();

  return (
    <div className="absolute right-4 z-10 flex flex-col gap-2 mt-32 md:mt-0 md:top-20 md:flex md:flex-col md:gap-2 md:right-4 md:top-20 sm:flex sm:flex-row sm:gap-2 sm:bottom-4 sm:right-1 sm:top-auto sm:left-1/2 sm:-translate-x-1/2">
      <Button
        variant="outline"
        size="icon"
        onClick={onShowFilters}
        className="bg-white/95 backdrop-blur-sm shadow-md hover:bg-gray-100 h-10 w-10"
      >
        <Filter className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onShowMoreFilters}
        className="bg-white/95 backdrop-blur-sm shadow-md hover:bg-gray-100 h-10 w-10"
      >
        <Layers className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDayMode(!isDayMode)}
        className="bg-white/95 backdrop-blur-sm shadow-md hover:bg-gray-100 h-10 w-10"
      >
        <SunMoon className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          navigator.geolocation?.getCurrentPosition(
            (position) => {
              if (mapRef.current) {
                mapRef.current.flyTo({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 15,
                  essential: true
                });
              }
            },
            (err) => {
              console.error("Error getting user location:", err);
              toast({
                title: "Erro de localização",
                description: "Não foi possível acessar sua localização",
                variant: "destructive",
              });
            }
          );
        }}
        className="bg-white/95 backdrop-blur-sm shadow-md hover:bg-gray-100 h-10 w-10"
      >
        <MapPin className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [-37.0685, -10.9162], // Coordenadas padrão
              zoom: 12,
              essential: true
            });
            toast({
              title: "Visualização resetada",
              description: "Mapa retornou à visualização padrão",
            });
          }
        }}
        className="bg-white/95 backdrop-blur-sm shadow-md hover:bg-gray-100 h-10 w-10"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>
    </div>
  );
});

MapControls.displayName = "MapControls";
