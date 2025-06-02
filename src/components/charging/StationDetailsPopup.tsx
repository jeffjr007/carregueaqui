import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@supabase/auth-helpers-react";
import { fetchFavoriteStations } from "@/utils/stationUtils";
import { ChargingStation } from "@/types/station";
import { useMapState } from "@/contexts/MapStateContext";

import { StationHeader } from "./station-details/StationHeader";
import { StationInfo } from "./station-details/StationInfo";
import { StationAmenities } from "./station-details/StationAmenities";
import { StationPhotos } from "./station-details/StationPhotos";
import { StationActivity } from "./station-details/StationActivity";
import { StationQuestions } from "./station-details/StationQuestions";
import { StationActions } from "./station-details/StationActions";
import { RatingModal } from "./station-details/RatingModal";
import { useChargingSession } from "./station-details/ChargingSessionManager";
import { useShareManager } from "./station-details/ShareManager";
import { recentSessions, questions, stationPhotos } from "./station-details/sampleData";
import { NavigationPanel } from "../map/NavigationPanel";

interface StationDetailsProps {
  station: ChargingStation;
  onClose: () => void;
  onStartCharging?: () => void;
  onCompleteCharging?: () => void;
  mapRef?: React.MutableRefObject<mapboxgl.Map | null>;
}

export const StationDetailsPopup = ({ 
  station, 
  onClose,
  onStartCharging,
  onCompleteCharging,
  mapRef
}: StationDetailsProps) => {
  const [showRating, setShowRating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const user = useUser();
  
  const { activeSession, handleStartCharging, handleCompleteCharging, isCharging } = useChargingSession({
    stationId: station.id,
    userId: user?.id,
    onStartCharging,
    onCompleteCharging
  });

  const { handleShare } = useShareManager(station);

  const { data: favoriteStations = [] } = useQuery({
    queryKey: ['favoriteStations', user?.id],
    queryFn: () => fetchFavoriteStations(user?.id || ''),
    enabled: !!user,
  });

  // Atualiza o estado de favorito quando os dados são carregados
  useEffect(() => {
    if (favoriteStations.length > 0 && station.id) {
      const stationIds = favoriteStations.map(favStation => favStation.id);
      setIsFavorite(stationIds.includes(station.id));
    }
  }, [favoriteStations, station.id]);

  return (
    <>
      <Card className="fixed inset-x-4 bottom-20 md:bottom-24 md:left-auto md:right-4 md:w-[450px] lg:w-[500px] p-4 bg-white/95 backdrop-blur-sm z-50 rounded-lg shadow-lg max-h-[75vh] md:max-h-[85vh] overflow-y-auto scrollbar-hide">
        <div className="space-y-4">
          <StationHeader
            name={station.name}
            rating={station.rating}
            reviews={station.reviews}
            onClose={onClose}
          />

          <StationInfo
            address={station.address}
            hours={station.hours}
            brand={station.brand}
            connectors={station.connectors}
          />

          {station.amenities && (
            <StationAmenities amenities={station.amenities} />
          )}

          <StationPhotos photos={station.image_url ? [station.image_url, ...stationPhotos] : stationPhotos} />

          <StationActivity recentSessions={recentSessions} />

          <StationQuestions questions={questions} />

          <StationActions 
            onShowRating={() => setShowRating(true)}
            onStartCharging={handleStartCharging}
            onCompleteCharging={handleCompleteCharging}
            isCharging={isCharging}
            stationId={station.id}
            isFavorite={isFavorite}
            onToggleFavorite={setIsFavorite}
            onShare={handleShare}
            onNavigate={() => setShowNavigation(true)}
          />
        </div>

        <RatingModal 
          showRating={showRating}
          setShowRating={setShowRating}
          stationId={station.id}
        />
      </Card>

      {showNavigation && mapRef?.current && (
        <NavigationPanel 
          station={station} 
          map={mapRef.current}
          onClose={() => setShowNavigation(false)}
        />
      )}
    </>
  );
};
