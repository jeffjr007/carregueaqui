import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLogout } from "@/hooks/auth/useLogout";
import { useMapState } from "@/contexts/MapStateContext";
import AdminPanel from "../admin/AdminPanel";
import { ChargingHistory } from "@/types/station";
import { UserCar } from "@/types/user";

// Import components used in tabs
import { ProfileForm } from "../profile/ProfileForm";
import { ChargingHistoryList } from "../profile/ChargingHistoryList";
import { UserCars } from "../profile/UserCars";
import { UserSettings } from "../profile/UserSettings";
import { UserProfileFooter } from "../profile/UserProfileFooter";
import { PaymentMethods } from "../profile/PaymentMethods";
import { NotificationSettings } from "../profile/NotificationSettings";
import { CreditCard, Bell, Bolt, CarFront } from "lucide-react";
import { X, Settings } from "lucide-react";
import { AddCarForm } from "../profile/AddCarForm";

interface UserProfileProps {
  userCars: UserCar[];
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
  const [activeTab, setActiveTab] = useState("profile"); // Default tab
  const [showAddCarForm, setShowAddCarForm] = useState(false); // State to control visibility of add car form

  const handleLogout = async () => {
    await logout();
  };

  const handleOpenAdminPanel = () => {
    setShowAdmin(true);
    onClose();
  };

  // Function to toggle the add car form visibility
  const handleAddCarClick = () => {
    setShowAddCarForm(true);
  };

  // Function to close the add car form
  const handleCloseAddCarForm = () => {
    setShowAddCarForm(false);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[51] overflow-hidden flex flex-col w-full">
      {/* Header Profile Section */}
      <div className="px-4 pt-6 pb-4 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center mb-2">
          <Avatar className="h-16 w-16 mr-3">
            <AvatarFallback className="bg-gray-200">{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            <AvatarImage src={avatarUrl} />
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{username || 'Usuário'}</h1>
            {/* Add 'Motorista Elétrico' description if applicable */}
            <p className="text-gray-500 text-sm">Motorista Elétrico</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-xl p-2">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <Separator className="my-4" />
        {/* Always show Edit Profile button */}
        <div className="flex justify-between">
           <Button variant="outline" className="flex-1 mr-2 rounded-md" onClick={() => setActiveTab('profile')}>
             <span>Editar Perfil</span> {/* This button now just switches to the profile tab */}
           </Button>
        </div>
      </div>

      {/* Tabs for Content Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
        {/* TabsList is always visible */}
           <TabsList className="w-full grid grid-cols-3 px-4">
            {/* Adjust grid columns if necessary */}
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="cars">Veículos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>


        {/* Content Sections (TabsContent) */}
          <div className="flex-1 px-4 pb-4 overflow-y-auto">
            {/* Profile Tab Content */}
            <TabsContent value="profile" className="mt-4 space-y-6">
               <div className="pb-4">
                 {/* ProfileForm is always rendered here */}
                 <ProfileForm
                   initialName={username}
                   loading={loading}
                   setLoading={() => {}} // Pass empty function as setLoading is handled inside ProfileForm
                   onSaveSuccess={() => {}} // Keep this for potential future use or remove if not needed
                 />
               </div>

              {/* Últimos Carregamentos Section */}
              <div>
                <div className="flex items-center mb-3">
                  <Bolt className="text-gray-700 mr-2" />
                  <h2 className="text-lg font-medium">Últimos Carregamentos</h2>
                </div>
                {chargingHistory && chargingHistory.length > 0 ? (
                  <ChargingHistoryList history={chargingHistory} />
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum carregamento registrado</p>
                )}
              </div>

              {/* Métodos de Pagamento Section */}
              <div>
                <div className="flex items-center mb-3">
                  <CreditCard className="text-gray-700 mr-2" />
                  <h2 className="text-lg font-medium">Métodos de Pagamento</h2>
                </div>
                {/* Integrate PaymentMethods here */}
                <PaymentMethods />
              </div>

              {/* Notification Settings */}
              <div>
                <div className="flex items-center mb-3">
                  <Bell className="text-gray-700 mr-2" />
                  <h2 className="text-lg font-medium">Notificações</h2>
                </div>
                {/* Integrate NotificationSettings here */}
                <NotificationSettings />
              </div>

              {/* Legal Links and Logout/Delete Account Buttons */}
              <UserProfileFooter onLogout={handleLogout} onAdminPanel={handleOpenAdminPanel} />
            </TabsContent>

            {/* Cars Tab Content */}
             <TabsContent value="cars" className="mt-4 space-y-6">
                {showAddCarForm ? (
                  <div>
                    <AddCarForm onCancel={handleCloseAddCarForm} />
                  </div>
                ) : (
                  <div>
                  {/* The UserCars component should handle its own title and add button */}
                  <UserCars cars={userCars} onAddCar={handleAddCarClick} />
                  </div>
                )}
             </TabsContent>

            {/* Settings Tab Content */}
             <TabsContent value="settings" className="mt-4 space-y-6">
               <UserSettings onClose={onClose} />
             </TabsContent>
          </div>
      </Tabs>

      {/* Admin Panel (if shown) */}
      {showAdmin && <AdminPanel />}
    </div>
  );
};
