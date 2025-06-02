
import { Battery } from "lucide-react";
import { ChargingHistory } from "@/types/station";

interface ChargingHistoryListProps {
  history: ChargingHistory[];
}

export const ChargingHistoryList = ({ history }: ChargingHistoryListProps) => {
  return (
    <div>
      <div className="flex items-center mb-3">
        <Battery className="mr-2 h-5 w-5" /> 
        <h3 className="font-medium">Últimos Carregamentos</h3>
      </div>
      
      {history.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Nenhum carregamento registrado
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
