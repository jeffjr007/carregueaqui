
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChargingStation } from "@/types/station";
import { FavoriteStationCard } from "./FavoriteStationCard";
import { EmptyFavoriteState } from "./EmptyFavoriteState";
import { useToast } from "@/hooks/use-toast";
import { useFavoriteStation } from "@/hooks/useFavoriteStation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface FavoriteStationsListProps {
  stations: ChargingStation[];
  onClose: () => void;
  onNavigate: (station: ChargingStation) => void;
}

export const FavoriteStationsList = ({ 
  stations, 
  onClose, 
  onNavigate 
}: FavoriteStationsListProps) => {
  const [favorites, setFavorites] = useState<ChargingStation[]>(stations);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Update favorites when stations prop changes
  useEffect(() => {
    setFavorites(stations);
  }, [stations]);

  const removeFavorite = async (station: ChargingStation) => {
    if (!station.id) return;
    
    const { handleToggleFavorite } = useFavoriteStation(station.id, true);
    await handleToggleFavorite();
    
    setFavorites(prev => prev.filter(s => s.id !== station.id));
    
    toast({
      title: "Removido dos favoritos",
      description: `${station.name} foi removido dos seus favoritos.`,
    });
    
    // Provide haptic feedback if available
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(50);
    }
  };

  const handleDetails = (station: ChargingStation) => {
    onClose();
    onNavigate(station);
  };

  if (favorites.length === 0) {
    return <EmptyFavoriteState onClose={onClose} />;
  }

  return (
    <div className="space-y-4">
      {favorites.map((station) => (
        <FavoriteStationCard
          key={station.id}
          station={station}
          onNavigate={onNavigate}
          onDetails={handleDetails}
          onRemove={removeFavorite}
        />
      ))}
    </div>
  );
};
