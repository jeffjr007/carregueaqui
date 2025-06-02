
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showErrorToast } from "@/lib/error-utils";

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Chamando edge function para obter token do Mapbox...");
        
        // We'll retry up to 3 times if there's an issue
        let attempts = 0;
        let success = false;
        
        while (attempts < 3 && !success) {
          try {
            const { data, error } = await supabase.functions.invoke('get-mapbox-token');
            
            if (error) {
              throw error;
            }
            
            if (!data?.token) {
              throw new Error('Nenhum token retornado');
            }
            
            console.log("Token público do Mapbox obtido com sucesso");
            setMapboxToken(data.token);
            success = true;
          } catch (err) {
            attempts++;
            console.error(`Tentativa ${attempts} falhou:`, err);
            if (attempts >= 3) throw err;
            // Delay before next attempt
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar token do Mapbox:', error);
        setError('Não foi possível carregar o token do mapa');
        showErrorToast(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapboxToken();
  }, [toast]);

  return { mapboxToken, isLoading, error };
};
