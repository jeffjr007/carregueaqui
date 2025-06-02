
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteTabsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const FavoriteTabsHeader = ({ activeTab, setActiveTab }: FavoriteTabsHeaderProps) => {
  return (
    <div className="p-4">
      <div className="bg-gray-100 rounded-full p-1 flex mb-2">
        <Button 
          variant={activeTab === "favorites" ? "default" : "ghost"} 
          className={cn(
            "flex-1 rounded-full",
            activeTab === "favorites" ? "bg-white shadow-sm" : "bg-transparent"
          )}
          onClick={() => setActiveTab("favorites")}
        >
          <Star className="h-4 w-4 text-yellow-400 mr-2" />
          Favoritos
        </Button>
        <Button 
          variant={activeTab === "recent" ? "default" : "ghost"} 
          className={cn(
            "flex-1 rounded-full",
            activeTab === "recent" ? "bg-white shadow-sm" : "bg-transparent"
          )}
          onClick={() => setActiveTab("recent")}
        >
          <Clock className="h-4 w-4 text-gray-500 mr-2" />
          Recentes
        </Button>
      </div>
      
      <p className="text-xs text-center text-gray-500 mb-4">
        Deslize para alternar entre abas
      </p>
    </div>
  );
};
