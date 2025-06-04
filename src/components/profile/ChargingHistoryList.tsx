import { Battery, MapPin } from "lucide-react";
import { ChargingHistory } from "@/types/station";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChargingHistoryListProps {
  history: ChargingHistory[];
}

export const ChargingHistoryList = ({ history }: ChargingHistoryListProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center mb-3">
        <Battery className="mr-2 h-5 w-5" />
        <h3 className="font-medium">Últimos Carregamentos</h3>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-6 space-y-4">
          <p className="text-gray-500">
            Não há carregamentos recentes
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Ver carregadores
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((charge, index) => (
            <div key={index} className="bg-secondary/5 rounded-lg p-3">
              <div className="font-medium">{charge.stationName}</div>
              <div className="text-sm text-muted-foreground">
                {charge.date} - {charge.duration}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
