import { Button } from "@/components/ui/button";
import { Clock, Menu, User, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { useMapState } from "@/contexts/MapStateContext";
import { PopupManager } from "./PopupManager";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const { showHistory, setShowHistory, showFavorites, setShowFavorites } = useMapState();
  const isMobile = useIsMobile();

  // Reset menus visibility when app starts
  useEffect(() => {
    setShowProfile(false);
    setShowHistory(false);
    setShowFavorites(false);
  }, []);

  const handleTabChange = (tab: string) => {
    // Save current tab for comparison
    const prevTab = activeTab;
    
    // Always set active tab first
    setActiveTab(tab);
    
    // If clicking on the same tab that's already active, toggle its content
    if (prevTab === tab) {
      switch(tab) {
        case "profile":
          setShowProfile(!showProfile);
          break;
        case "charging":
          // Using the current state from context
          setShowHistory(!showHistory);
          break;
        case "favorites":
          // Using the current state from context
          setShowFavorites(!showFavorites);
          break;
      }
    } else {
      // Different tab - reset all and show only the selected one
      setShowProfile(false);
      setShowHistory(false);
      setShowFavorites(false);
      
      // Then show only the content for the selected tab
      switch(tab) {
        case "profile":
          setShowProfile(true);
          break;
        case "charging":
          setShowHistory(true);
          break;
        case "favorites":
          setShowFavorites(true);
          break;
      }
    }

    if (navigator.vibrate && isMobile) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-20">
        <div className="flex items-center justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,16px))]">
          <NavButton 
            icon={<Menu className="h-5 w-5" />} 
            label="Serviços" 
            isActive={activeTab === "map"} 
            onClick={() => handleTabChange("map")} 
          />
          
          <NavButton 
            icon={<Clock className="h-5 w-5" />} 
            label="Atividade" 
            isActive={activeTab === "charging"} 
            onClick={() => handleTabChange("charging")} 
          />
          
          <NavButton 
            icon={<Bookmark className="h-5 w-5" />} 
            label="Salvos" 
            isActive={activeTab === "favorites"} 
            onClick={() => handleTabChange("favorites")} 
          />
          
          <NavButton 
            icon={<User className="h-5 w-5" />} 
            label="Conta" 
            isActive={activeTab === "profile"} 
            onClick={() => handleTabChange("profile")} 
          />
        </div>
      </div>

      <PopupManager 
        activeTab={activeTab}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
    </>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({ icon, label, isActive, onClick }: NavButtonProps) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center px-1 py-1 h-auto gap-1 bg-transparent hover:bg-transparent min-w-0 max-w-[75px]",
      isActive 
        ? "text-green-400" 
        : "text-gray-400 hover:text-gray-300"
    )}
  >
    {icon}
    <span className="text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
  </Button>
);
