
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PlugZap, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useAdminStations } from "@/hooks/admin/useAdminStations";
import { StationsManager } from "./StationsManager";
import { UsersPanel } from "./UsersPanel";
import { AccessDenied } from "./AccessDenied";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider 
} from "@/components/ui/sidebar";

const AdminPanel = () => {
  const { isAdmin, isLoading, adminMessage } = useAdminAuth();
  const { stations, isLoading: stationsLoading, fetchStations } = useAdminStations();

  if (isLoading || stationsLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
    return <AccessDenied message={adminMessage} />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar className="bg-gray-100 border-r">
          <SidebarHeader>
            <h2 className="text-xl font-bold flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5" /> Painel de Administração
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <div className="py-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => window.history.back()}
              >
                <PlugZap className="mr-2 h-5 w-5" /> Voltar ao Mapa
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 container mx-auto py-8 px-4">
          <Tabs defaultValue="stations">
            <TabsList className="mb-4">
              <TabsTrigger value="stations">Estações de Carregamento</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stations">
              <StationsManager 
                stations={stations}
                fetchStations={fetchStations}
              />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersPanel adminMessage={adminMessage} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
