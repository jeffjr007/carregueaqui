
import { useState, useEffect, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLogout } from "@/hooks/auth"; // Updated import path
import { ProfileHeader } from "./ProfileHeader";
import { ProfileEditor } from "./ProfileEditor";
import { UserSettings } from "./UserSettings";
import { UserCars } from "./UserCars";
import { ChargingHistoryList } from "./ChargingHistoryList";
import { UserProfileActions } from "./UserProfileActions";
import { UserProfileFooter } from "./UserProfileFooter";
import { PaymentMethods } from "./PaymentMethods";
import { NotificationSettings } from "./NotificationSettings";
import { ChargingHistory } from "@/types/station";
import { UserCar } from "@/types/user";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { isCurrentUserAdmin } from "@/utils/adminUtils";

interface UserProfileContainerProps {
  userCars: UserCar[];
  chargingHistory: ChargingHistory[];
  onClose: () => void;
  children?: ReactNode; // Add children prop
}

export const UserProfileContainer = ({ 
  userCars, 
  chargingHistory, 
  onClose,
  children // Receive the children prop
}: UserProfileContainerProps) => {
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { username, avatarUrl, loading, fetchProfile } = useUserProfile();
  const { logout } = useLogout(); // Updated to match the hook's return value

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isCurrentUserAdmin();
      setIsAdmin(adminStatus);
    };
    
    checkAdmin();
  }, []);

  // Wrapper function to adapt the return type from Promise<OperationResult> to Promise<void>
  const handleLogout = async (): Promise<void> => {
    await logout();
    // No return value needed as the Promise<void> type doesn't expect a return value
  };

  return (
    <Card className="absolute left-0 top-0 w-full h-full md:left-4 md:top-16 md:w-80 p-4 z-20 bg-white/95 backdrop-blur-sm md:h-[calc(100vh-5rem)] overflow-y-auto rounded-none md:rounded-lg">
      {/* Render children if provided, otherwise render default content */}
      {children ? (
        children
      ) : (
        <>
          <ProfileHeader 
            username={username}
            avatarUrl={avatarUrl}
            loading={loading}
            onClose={onClose}
          />

          <Separator className="my-4" />

          <UserProfileActions 
            onEditProfile={() => setShowProfileEditor(true)}
            onShowSettings={() => setShowSettings(true)}
          />

          <div className="space-y-6">
            {isAdmin && (
              <div className="mt-4">
                <Link to="/admin">
                  <Button 
                    className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-600"
                    variant="default"
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Painel de Administração
                  </Button>
                </Link>
                <Separator className="my-4" />
              </div>
            )}
            
            <UserCars 
              cars={userCars} 
              onAddCar={() => {}} 
            />

            <ChargingHistoryList history={chargingHistory} />
            
            <PaymentMethods />
            
            <NotificationSettings />
          </div>

          <UserProfileFooter 
            onLogout={handleLogout}
          />

          {showProfileEditor && (
            <ProfileEditor onClose={() => {
              setShowProfileEditor(false);
              fetchProfile();
            }} />
          )}
          
          {showSettings && (
            <UserSettings onClose={() => setShowSettings(false)} />
          )}
        </>
      )}
    </Card>
  );
};
