
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { toggleFavoriteStation, checkFavoriteStatus } from "@/utils/stationUtils";
import { useUser } from "@supabase/auth-helpers-react";

export const useFavoriteStation = (stationId?: string, initialFavorite = false) => {
  const { toast } = useToast();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(initialFavorite);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (stationId && user) {
      checkFavoriteStatus(stationId, user.id)
        .then(status => {
          setFavoriteStatus(status);
        })
        .catch(error => {
          console.error("Erro ao verificar status de favorito:", error);
        })
        .finally(() => {
          setInitialLoading(false);
        });
    } else {
      setInitialLoading(false);
    }
  }, [stationId, user]);

  const handleToggleFavorite = async () => {
    if (!stationId || !user) {
      toast({
        title: "É necessário estar logado",
        description: "Faça login para adicionar estações aos favoritos.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newFavoriteState = await toggleFavoriteStation(stationId, user.id);
      
      toast({
        title: newFavoriteState ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: newFavoriteState 
          ? "Estação adicionada aos seus favoritos." 
          : "Estação removida dos seus favoritos.",
      });
      
      setFavoriteStatus(newFavoriteState);
      return newFavoriteState;
      
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de favorito.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    favoriteStatus,
    loading,
    initialLoading,
    handleToggleFavorite
  };
};
