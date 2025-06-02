
import { MapPin, Clock, Car, CreditCard } from "lucide-react";

interface StationInfoProps {
  address: string;
  hours: string;
  brand: string;
  connectors: number;
}

export const StationInfo = ({ address, hours, brand, connectors }: StationInfoProps) => {
  return (
    <div className="space-y-2 text-sm md:text-base">
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="flex-1">{address}</span>
      </div>
      <div className="flex items-start gap-2">
        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="flex-1">{hours}</span>
      </div>
      <div className="flex items-start gap-2">
        <Car className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="flex-1">{brand} - {connectors} conectores</span>
      </div>
      <div className="flex items-start gap-2">
        <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="flex-1">R$ 4,50/hora (Estacionamento)</span>
      </div>
    </div>
  );
};
