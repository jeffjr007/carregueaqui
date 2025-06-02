
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseInitialStationImportProps {
  importStations: () => Promise<void>;
}

export const useInitialStationImport = ({ importStations }: UseInitialStationImportProps) => {
  // Import stations on first load if none exist
  useEffect(() => {
    const checkAndImportStations = async () => {
      try {
        const { count, error } = await supabase
          .from('charging_stations')
          .select('id', { count: 'exact', head: true });
        
        if (error) {
          console.error("Error checking stations count:", error);
          return;
        }
        
        if (count === 0) {
          await importStations();
        }
      } catch (error) {
        console.error("Error checking stations count:", error);
      }
    };
    
    checkAndImportStations();
  }, [importStations]);
};
