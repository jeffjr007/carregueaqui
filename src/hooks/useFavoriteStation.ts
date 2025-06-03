import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@supabase/auth-helpers-react";
import { useMapState } from "@/contexts/MapStateContext";

export const useFavoriteStation = (stationId?: string, initialFavorite = false) => {
  const { toast } = useToast();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(initialFavorite);
  const [initialLoading, setInitialLoading] = useState(true);

  const { isFavorite, toggleFavoriteStation: contextToggleFavorite } = useMapState();

  useEffect(() => {
    if (stationId) {
      const status = isFavorite(stationId);
      setFavoriteStatus(status);
      setInitialLoading(false);
    } else {
      setInitialLoading(false);
    }
  }, [stationId, isFavorite]);

  const handleToggleFavorite = async () => {
    if (!stationId) {
      console.warn("Cannot toggle favorite without stationId");
      return;
    }

    setLoading(true);
    try {
      const currentState = isFavorite(stationId);
      
      contextToggleFavorite(stationId);
      
      const newFavoriteStateAfterToggle = !currentState;

      toast({
        title: newFavoriteStateAfterToggle ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: newFavoriteStateAfterToggle 
          ? "Estação adicionada aos seus favoritos." 
          : "Estação removida dos seus favoritos.",
      });
      
      setFavoriteStatus(isFavorite(stationId));
      return isFavorite(stationId);
      
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de favorito.",
        variant: "destructive"
      });
      setLoading(false);
      throw error;
    }
  };

  return {
    favoriteStatus,
    loading,
    initialLoading,
    handleToggleFavorite
  };
};
