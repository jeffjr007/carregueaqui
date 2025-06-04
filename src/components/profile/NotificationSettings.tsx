import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const NotificationSettings = () => {
  const [chargingNotification, setChargingNotification] = useState(true);
  const [promotionsNotification, setPromotionsNotification] = useState(false);
  const [updatesNotification, setUpdatesNotification] = useState(true);
  
  return (
    <div>
      {/* Removed internal heading and icon */}
      {/* <div className="flex items-center mb-3"> */}
      {/*   <Bell className="mr-2 h-5 w-5" /> */}
      {/*   <h3 className="font-medium">Notificações</h3> */}
      {/* </div> */}
      
      <Card className="p-3 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium">Carregamento Concluído</h3>
            <p className="text-xs text-gray-500">Notificar quando o carregamento terminar</p>
          </div>
          <Switch 
            checked={chargingNotification} 
            onCheckedChange={setChargingNotification} 
          />
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium">Promoções</h3>
            <p className="text-xs text-gray-500">Receber ofertas e descontos</p>
          </div>
          <Switch 
            checked={promotionsNotification} 
            onCheckedChange={setPromotionsNotification} 
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Atualizações do App</h3>
            <p className="text-xs text-gray-500">Notificar sobre novas versões</p>
          </div>
          <Switch 
            checked={updatesNotification} 
            onCheckedChange={setUpdatesNotification} 
          />
        </div>
      </Card>
    </div>
  );
};
