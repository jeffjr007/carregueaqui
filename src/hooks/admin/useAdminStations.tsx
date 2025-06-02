
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChargingStation } from "@/types/station";

export function useAdminStations() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStations = async () => {
    try {
      const { data, error } = await supabase
        .from('charging_stations')
        .select('*');

      if (error) throw error;

      const mappedStations: ChargingStation[] = data.map(station => {
        // Safely cast the amenities JSON to our expected type with defaults if needed
        const amenitiesData = station.amenities as Record<string, boolean>;
        
        return {
          id: station.id,
          lngLat: [station.lng, station.lat] as [number, number],
          name: station.name,
          status: station.status,
          type: station.type,
          power: station.power,
          rating: station.rating || 0,
          reviews: station.reviews || 0,
          connectors: station.connectors,
          connectorTypes: station.connector_types,
          address: station.address,
          hours: station.hours,
          brand: station.brand,
          amenities: {
            restaurant: amenitiesData?.restaurant ?? false,
            wifi: amenitiesData?.wifi ?? false,
            bathroom: amenitiesData?.bathroom ?? false,
            parking: amenitiesData?.parking ?? false,
            shop: amenitiesData?.shop ?? false,
          },
        };
      });

      setStations(mappedStations);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar estações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estações de carregamento",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return {
    stations,
    isLoading,
    fetchStations
  };
}
