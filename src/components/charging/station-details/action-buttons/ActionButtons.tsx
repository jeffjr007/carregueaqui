
import { Button } from "@/components/ui/button";
import { Star, Zap, ZapOff, Heart, Share2, Navigation, Loader2 } from "lucide-react";
import { useFavoriteStation } from "@/hooks/useFavoriteStation";

interface ActionButtonsProps {
  onShowRating: () => void;
  onStartCharging?: () => void;
  onCompleteCharging?: () => void;
  isCharging?: boolean;
  stationId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (isFavorite: boolean) => void;
  onShare?: () => void;
  onNavigate?: () => void;
}

export const ActionButtons = ({
  onShowRating,
  onStartCharging,
  onCompleteCharging,
  isCharging,
  stationId,
  isFavorite = false,
  onToggleFavorite,
  onShare,
  onNavigate
}: ActionButtonsProps) => {
  const {
    favoriteStatus,
    loading,
    initialLoading,
    handleToggleFavorite
  } = useFavoriteStation(stationId, isFavorite);

  const handleFavoriteClick = async () => {
    const newState = await handleToggleFavorite();
    if (onToggleFavorite && typeof newState === 'boolean') {
      onToggleFavorite(newState);
    }
  };

  return (
    <div className="grid grid-cols-2 md:flex gap-2 flex-wrap w-full md:w-auto">
      <Button 
        variant="outline" 
        onClick={onShowRating}
        className="flex items-center text-xs md:text-sm"
        size="sm"
      >
        <Star className="w-4 h-4 mr-1 md:mr-2" />
        Avaliar
      </Button>
      
      <Button
        variant="outline"
        onClick={handleFavoriteClick}
        className={`flex items-center text-xs md:text-sm ${favoriteStatus ? 'text-red-500' : ''}`}
        size="sm"
        disabled={loading || initialLoading}
      >
        {loading || initialLoading ? (
          <Loader2 className="w-4 h-4 mr-1 md:mr-2 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 mr-1 md:mr-2 ${favoriteStatus ? 'fill-current' : ''}`} />
        )}
        {favoriteStatus ? 'Favoritado' : 'Favoritar'}
      </Button>
      
      <Button
        variant="outline"
        onClick={onShare}
        className="flex items-center text-xs md:text-sm"
        size="sm"
      >
        <Share2 className="w-4 h-4 mr-1 md:mr-2" />
        Compartilhar
      </Button>
      
      <Button
        variant="outline"
        onClick={onNavigate}
        className="flex items-center text-xs md:text-sm"
        size="sm"
      >
        <Navigation className="w-4 h-4 mr-1 md:mr-2" />
        Navegar
      </Button>
    
      {!isCharging ? (
        <Button 
          onClick={onStartCharging}
          className="flex items-center text-xs md:text-sm col-span-2"
          size="sm"
        >
          <Zap className="w-4 h-4 mr-1 md:mr-2" />
          Iniciar Carregamento
        </Button>
      ) : (
        <Button 
          onClick={onCompleteCharging}
          variant="destructive"
          className="flex items-center text-xs md:text-sm col-span-2"
          size="sm"
        >
          <ZapOff className="w-4 h-4 mr-1 md:mr-2" />
          Finalizar Carregamento
        </Button>
      )}
    </div>
  );
};
