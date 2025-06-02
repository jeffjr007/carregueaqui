
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { User } from "lucide-react";
import { UserProfileFooter } from "../profile/UserProfileFooter";
import { UserProfileContainer } from "../profile/UserProfileContainer";
import { ProfileHeader } from "../profile/ProfileHeader";
import { ProfileForm } from "../profile/ProfileForm";
import { ChargingHistoryList } from "../profile/ChargingHistoryList";
import { UserCars } from "../profile/UserCars";
import { UserSettings } from "../profile/UserSettings";
import { ChargingHistory } from "@/types/station";
import { userCars } from "@/data/userCars";
import { useState } from "react";
import { useLogout } from "@/hooks/auth/useLogout";
import { useMapState } from "@/contexts/MapStateContext";
import AdminPanel from "../admin/AdminPanel";
import { useUserProfile } from "@/hooks/useUserProfile";

interface UserProfileProps {
  userCars: typeof userCars;
  chargingHistory?: ChargingHistory[];
  onClose: () => void;
}

export const UserProfile = ({ 
  userCars, 
  chargingHistory = [],
  onClose 
}: UserProfileProps) => {
  const { username, avatarUrl, loading } = useUserProfile();
  const { logout } = useLogout();
  const [showAdmin, setShowAdmin] = useState(false);
  const { setSelectedStation } = useMapState();

  const handleLogout = async () => {
    await logout();
  };

  const handleOpenAdminPanel = () => {
    setShowAdmin(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[51] overflow-y-auto">
      <UserProfileContainer 
        userCars={userCars}
        chargingHistory={chargingHistory}
        onClose={onClose}
      >
        <ProfileHeader 
          username={username}
          avatarUrl={avatarUrl}
          loading={loading}
          onClose={onClose}
        />
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="cars">Veículos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileForm 
              initialName={username}
              loading={loading} 
              setLoading={() => {}} 
              onSaveSuccess={() => {}}
            />
            
            <ChargingHistoryList history={chargingHistory} />
            
            <UserProfileFooter 
              onLogout={handleLogout} 
              onAdminPanel={handleOpenAdminPanel} 
            />
          </TabsContent>
          
          <TabsContent value="cars">
            <UserCars 
              cars={userCars} 
              onAddCar={() => {}}
            />
            
            <div className="mt-4">
              <UserProfileFooter 
                onLogout={handleLogout} 
                onAdminPanel={handleOpenAdminPanel} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <UserSettings onClose={onClose} />
            
            <div className="mt-4">
              <UserProfileFooter 
                onLogout={handleLogout} 
                onAdminPanel={handleOpenAdminPanel} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </UserProfileContainer>
      
      {showAdmin && <AdminPanel />}
    </div>
  );
};
