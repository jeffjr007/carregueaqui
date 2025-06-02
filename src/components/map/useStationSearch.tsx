
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChargingStation } from "@/types/station";
import mapboxgl from "mapbox-gl";

interface UseStationSearchProps {
  stations: ChargingStation[] | undefined;
  setSelectedStation: (station: ChargingStation | null) => void;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
}

export const useStationSearch = ({ 
  stations, 
  setSelectedStation, 
  mapRef 
}: UseStationSearchProps) => {
  const { toast } = useToast();

  const handleSearch = useCallback((query: string) => {
    console.log("Searching for:", query);
    
    // Try to find a matching station by name or address
    if (stations && stations.length > 0) {
      const matchingStation = stations.find(station => 
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.address.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingStation) {
        setSelectedStation(matchingStation);
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: matchingStation.lngLat,
            zoom: 15,
            essential: true
          });
        }
        
        toast({
          title: "Estação encontrada",
          description: `${matchingStation.name}`,
        });
      } else {
        toast({
          title: "Busca",
          description: `Buscando por: ${query}`,
        });
      }
    } else {
      toast({
        title: "Busca",
        description: `Buscando por: ${query}`,
      });
    }
  }, [stations, setSelectedStation, mapRef, toast]);

  return { handleSearch };
};
