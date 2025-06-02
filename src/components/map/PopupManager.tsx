
import { useMapState } from "@/contexts/MapStateContext";
import { UserProfile } from "./UserProfile";
import { FavoriteStations } from "../charging/FavoriteStations";
import { ChargingHistoryComponent } from "../charging/ChargingHistory";
import { userCars } from "@/data/userCars";
import { useQuery } from "@tanstack/react-query";
import { fetchFavoriteStations } from "@/utils/stationUtils";
import { fetchChargingHistory } from "@/utils/chargingHistoryUtils";
import { useEffect, useState } from "react";
import { ChargingStation } from "@/types/station";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "../admin/AdminPanel";
import { Shield } from "lucide-react";
import { isCurrentUserAdmin } from "@/utils/adminUtils";

interface PopupManagerProps {
  activeTab: string;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

export const PopupManager = ({ 
  activeTab, 
  showProfile,
  setShowProfile
}: PopupManagerProps) => {
  const { 
    showHistory, 
    setShowHistory, 
    showFavorites, 
    setShowFavorites,
    setSelectedStation
  } = useMapState();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      setUserId(data.session.user.id);
      
      // Check if user is admin
      try {
        const adminStatus = await isCurrentUserAdmin();
        setIsAdmin(adminStatus);
        
        if (adminStatus) {
          console.log("User is admin, admin features enabled");
          toast({
            title: "Acesso de Administrador",
            description: "Você tem acesso às funcionalidades de administrador",
          });
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  // Query favorite stations
  const { 
    data: favoriteStations = [], 
    isLoading: favoritesLoading,
    isError: favoritesError,
    refetch: refetchFavorites
  } = useQuery({
    queryKey: ['favoriteStations', userId],
    queryFn: () => fetchFavoriteStations(userId || ''),
    enabled: !!userId && showFavorites,
    staleTime: 30000, // 30 seconds
  });

  // Query charging history
  const { 
    data: chargingHistory = [],
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['chargingHistory', userId],
    queryFn: () => fetchChargingHistory(userId || ''),
    enabled: !!userId && showHistory,
    staleTime: 60000, // 1 minute
  });

  // Refresh favorites when the modal is opened
  useEffect(() => {
    if (showFavorites && userId) {
      refetchFavorites();
    }
  }, [showFavorites, userId, refetchFavorites]);

  // Handle errors in favorite stations loading
  useEffect(() => {
    if (favoritesError) {
      toast({
        title: "Erro ao carregar favoritos",
        description: "Não foi possível carregar suas estações favoritas.",
        variant: "destructive"
      });
    }
  }, [favoritesError, toast]);

  const handleNavigateToStation = (station: ChargingStation) => {
    setSelectedStation(station);
    setShowFavorites(false);
  };

  const openAdminPanel = () => {
    setShowAdmin(true);
    setShowProfile(false);
  };

  return (
    <>
      {showProfile && (
        <UserProfile
          userCars={userCars}
          chargingHistory={chargingHistory}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showFavorites && (
        <FavoriteStations
          stations={favoriteStations}
          onClose={() => setShowFavorites(false)}
          onNavigate={handleNavigateToStation}
        />
      )}

      {showHistory && (
        <ChargingHistoryComponent
          history={chargingHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showAdmin && (
        <AdminPanel />
      )}

      {isAdmin && (
        <div className={`fixed ${showProfile ? 'bottom-24' : 'bottom-16'} right-4 z-[60]`}>
          <button
            onClick={openAdminPanel}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <Shield className="mr-2 h-4 w-4" />
            Painel de Admin
          </button>
        </div>
      )}
    </>
  );
};
