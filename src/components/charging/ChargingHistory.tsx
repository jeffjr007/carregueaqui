import { ChargingHistory } from "@/types/station";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Battery, DollarSign } from "lucide-react";

interface ChargingHistoryComponentProps {
  history: ChargingHistory[];
  onClose: () => void;
}

export const ChargingHistoryComponent = ({ history, onClose }: ChargingHistoryComponentProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Histórico de Carregamentos</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
        </div>
        
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{item.stationName}</h3>
                <span className="text-sm text-muted-foreground">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.duration}
                </div>
                <div className="flex items-center">
                  <Battery className="w-4 h-4 mr-1" />
                  {item.energy} kWh
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  R$ {item.cost.toFixed(2)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};