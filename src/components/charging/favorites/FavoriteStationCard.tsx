
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Route, Info, Navigation, Trash2 } from "lucide-react";
import { ChargingStation } from "@/types/station";
import { cn } from "@/lib/utils";

interface FavoriteStationCardProps {
  station: ChargingStation;
  onNavigate: (station: ChargingStation) => void;
  onDetails: (station: ChargingStation) => void;
  onRemove: (station: ChargingStation) => void;
}

export const FavoriteStationCard = ({ 
  station, 
  onNavigate,
  onDetails,
  onRemove
}: FavoriteStationCardProps) => {
  // Format connector types for display
  const formatConnectors = (connectorTypes: string[]) => {
    return connectorTypes.map(type => {
      const simplified = type
        .replace("Type2", "Tipo 2")
        .replace("CCS", "CCS")
        .replace("CHAdeMO", "CHAdeMO");
      return simplified;
    });
  };

  return (
    <Card key={station.id} className="border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{station.name}</h3>
        <Star className="h-5 w-5 text-yellow-400 flex-shrink-0" />
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span className="line-clamp-1">{station.address}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
        <Route className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span>{Math.round(Math.random() * 10 * 10) / 10} km</span>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            station.status === "Disponível" ? "bg-green-500" : 
            station.status === "Ocupado" ? "bg-orange-500" : "bg-red-500"
          )}></div>
          <span className={cn(
            "text-sm font-medium",
            station.status === "Disponível" ? "text-green-600" : 
            station.status === "Ocupado" ? "text-orange-600" : "text-red-600"
          )}>
            {station.status} ({station.connectors}/4)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">{station.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {formatConnectors(station.connectorTypes).map((connector, index) => (
          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {connector}
          </Badge>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        Último carregamento: {new Date().toLocaleDateString('pt-BR')}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 rounded-md" 
          onClick={() => onNavigate(station)}
        >
          <Navigation className="h-4 w-4 text-blue-600 mr-2" />
          Navegar
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 rounded-md"
          onClick={() => onDetails(station)}
        >
          <Info className="h-4 w-4 text-gray-600 mr-2" />
          Detalhes
        </Button>
        <Button 
          variant="outline" 
          className="w-10 rounded-md" 
          onClick={() => onRemove(station)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
};
