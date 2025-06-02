
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChargingStation } from "@/types/station";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { FavoriteStationsHeader } from "./favorites/FavoriteStationsHeader";
import { FavoriteTabsHeader } from "./favorites/FavoriteTabsHeader";
import { FavoriteStationsList } from "./favorites/FavoriteStationsList";
import { EmptyRecentState } from "./favorites/EmptyRecentState";

interface FavoriteStationsProps {
  stations: ChargingStation[];
  recentStations?: ChargingStation[];
  onClose: () => void;
  onNavigate: (station: ChargingStation) => void;
}

export const FavoriteStations = ({ 
  stations, 
  recentStations = [], 
  onClose, 
  onNavigate 
}: FavoriteStationsProps) => {
  const [activeTab, setActiveTab] = useState("favorites");
  const containerRef = useRef<HTMLDivElement>(null);

  // Use touch gestures hook
  useTouchGestures(containerRef, {
    onSwipeLeft: () => {
      if (activeTab === "favorites") {
        setActiveTab("recent");
      }
    },
    onSwipeRight: () => {
      if (activeTab === "recent") {
        setActiveTab("favorites");
      }
    },
    onSwipeDown: onClose
  }, { preventScrollOnSwipe: true });

  return (
    <Card 
      ref={containerRef}
      className={cn(
        "fixed inset-x-0 bottom-0 md:inset-x-4 md:bottom-20 md:left-auto md:right-4 md:w-96",
        "bg-white/95 backdrop-blur-sm z-50 rounded-none md:rounded-lg shadow-lg",
        "max-h-[80vh] flex flex-col overflow-hidden modal-mobile-full"
      )}
    >
      <FavoriteStationsHeader onClose={onClose} />
      <FavoriteTabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollArea className="flex-1 px-4 pb-4">
        {activeTab === "favorites" && (
          <FavoriteStationsList 
            stations={stations} 
            onClose={onClose} 
            onNavigate={onNavigate} 
          />
        )}
        
        {activeTab === "recent" && (
          <EmptyRecentState onClose={onClose} />
        )}
      </ScrollArea>
    </Card>
  );
};
