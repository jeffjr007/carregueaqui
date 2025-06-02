
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@supabase/auth-helpers-react";
import { MapNotifications } from "./MapNotifications";
import { useMapState } from "@/contexts/MapStateContext";
import { useFilters } from "./FilterContext";
import { useStationFilters } from "@/hooks/useStationFilters";
import { fetchChargingStations } from "@/utils/stationUtils";
import { StationImporter } from "./StationImporter";
import { MapUIContent } from "./MapUIContent";
import { useInitialStationImport } from "@/hooks/useInitialStationImport";
import { realStationData } from "@/data/realStationData";
import { supabase } from "@/integrations/supabase/client";
import { createDedicatedAdmin } from "@/utils/adminUtils";
import { useToast } from "@/hooks/use-toast";

export const MapUI = () => {
  const [activeTab, setActiveTab] = useState<string>("map");
  const { toast } = useToast();
  
  const user = useUser();
  const { sendNotification } = MapNotifications({ user });
  
  const {
    selectedStation,
    setSelectedStation,
    isDayMode,
  } = useMapState();

  const {
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
  } = useFilters();

  // Fetch charging stations
  const { 
    data: stations, 
    isLoading,
    refetch: refetchStations 
  } = useQuery({
    queryKey: ['chargingStations', user?.id],
    queryFn: () => fetchChargingStations(user?.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Station importer
  const { importCarregueAquiStations } = StationImporter({
    onImportComplete: refetchStations
  });

  // Check if stations need to be imported
  useEffect(() => {
    const importSampleStations = async () => {
      if (!stations || stations.length < 5) {
        // Import sample stations if there are fewer than 5 stations
        try {
          // Check if there are already stations in the database
          const { count, error } = await supabase
            .from('charging_stations')
            .select('*', { count: 'exact', head: true });
            
          if (error) throw error;
          
          if (count && count < 10) {
            console.log("Importing sample stations...");
            
            // Import sample stations from realStationData one by one
            for (const station of realStationData) {
              const { lng, lat } = { lng: station.lngLat[0], lat: station.lngLat[1] };
              
              // Check if station with same name and coordinates already exists
              const { data: existingStation } = await supabase
                .from('charging_stations')
                .select('*')
                .eq('name', station.name)
                .eq('lng', lng)
                .eq('lat', lat)
                .maybeSingle();
                
              if (existingStation) {
                console.log(`Station ${station.name} already exists, skipping`);
                continue;
              }
              
              // Insert new station
              const { error: insertError } = await supabase
                .from('charging_stations')
                .insert([{
                  name: station.name,
                  lng,
                  lat,
                  status: station.status,
                  type: station.type,
                  power: station.power,
                  rating: station.rating,
                  reviews: station.reviews,
                  connectors: station.connectors,
                  connector_types: station.connectorTypes,
                  address: station.address,
                  hours: station.hours,
                  brand: station.brand,
                  amenities: station.amenities
                }]);
                
              if (insertError) {
                console.error(`Error importing station ${station.name}:`, insertError);
              } else {
                console.log(`Imported station: ${station.name}`);
              }
            }
            
            // Refresh stations after import
            refetchStations();
            
            toast({
              title: "Estações importadas",
              description: "Estações de carregamento de amostra foram importadas para o mapa",
            });
          }
        } catch (error) {
          console.error("Error importing sample stations:", error);
        }
      }
    };
    
    importSampleStations();
    
    // Also ensure there's an admin user
    const ensureAdminExists = async () => {
      const result = await createDedicatedAdmin();
      console.log("Admin check result:", result);
    };
    
    ensureAdminExists();
  }, [stations, refetchStations, toast]);

  // Initial station import check
  useInitialStationImport({
    importStations: importCarregueAquiStations
  });

  // Apply filters to stations
  const filteredStations = useStationFilters(
    stations,
    activeFilter,
    selectedConnectors,
    selectedAmenities
  );

  return (
    <MapUIContent
      isDayMode={isDayMode}
      filteredStations={filteredStations}
      selectedStation={selectedStation}
      setSelectedStation={setSelectedStation}
      showConnectorFilters={showConnectorFilters}
      setShowConnectorFilters={setShowConnectorFilters}
      selectedConnectors={selectedConnectors}
      setSelectedConnectors={setSelectedConnectors}
      showMoreFilters={showMoreFilters}
      setShowMoreFilters={setShowMoreFilters}
      selectedAmenities={selectedAmenities}
      setSelectedAmenities={setSelectedAmenities}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLoading={isLoading}
    />
  );
};
