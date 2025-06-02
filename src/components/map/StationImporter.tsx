
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@supabase/auth-helpers-react";
import { realStationData } from "@/data/realStationData"; 

interface StationImporterProps {
  onImportComplete: () => void;
}

export const StationImporter = ({ onImportComplete }: StationImporterProps) => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const user = useUser();

  // Import real station data
  const importRealStations = async () => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para importar estações",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      // Clear existing stations if needed
      // Uncomment this if you want to replace all existing stations
      // const { error: clearError } = await supabase.from('charging_stations').delete().neq('id', '0');
      // if (clearError) throw clearError;

      // Check if stations already exist
      const { count, error: countError } = await supabase
        .from('charging_stations')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw countError;
      }

      if ((count || 0) > 0) {
        console.log(`${count} stations already exist in database, will proceed to update them with new data`);
        // Optional: You can decide to stop here or update existing stations
      }

      // Prepare station data for import
      const stationsToImport = realStationData.map(station => ({
        name: station.name,
        lat: station.lngLat[1],
        lng: station.lngLat[0],
        status: station.status,
        type: station.type,
        power: station.power,
        connectors: station.connectors,
        connector_types: station.connectorTypes,
        address: station.address,
        hours: station.hours,
        brand: station.brand,
        amenities: {
          restaurant: station.amenities.restaurant,
          wifi: station.amenities.wifi,
          bathroom: station.amenities.bathroom,
          parking: station.amenities.parking,
          shop: station.amenities.shop,
        },
      }));

      // Use upsert to insert or update stations based on address (as a unique identifier)
      // This way we won't create duplicates
      for (const station of stationsToImport) {
        const { error } = await supabase
          .from('charging_stations')
          .upsert(station, { onConflict: 'address' });
          
        if (error) {
          console.error("Error upserting station:", station.name, error);
          throw error;
        }
      }

      toast({
        title: "Importação concluída",
        description: `${stationsToImport.length} estações importadas ou atualizadas com sucesso.`,
      });

      onImportComplete();
    } catch (error) {
      console.error("Erro na importação:", error);
      toast({
        title: "Erro na importação",
        description: "Falha ao importar estações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  // For backward compatibility
  const importCarregueAquiStations = async () => {
    return importRealStations();
  };

  return {
    importing,
    importRealStations,
    importCarregueAquiStations,
  };
};
