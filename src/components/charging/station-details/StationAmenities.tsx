import { Check } from "lucide-react";

interface AmenitiesProps {
  amenities: {
    restaurant: boolean;
    wifi: boolean;
    bathroom: boolean;
    parking: boolean;
    shop: boolean;
  };
}

export const StationAmenities = ({ amenities }: AmenitiesProps) => {
  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold mb-2">Comodidades</h3>
      <div className="grid grid-cols-2 gap-2">
        {amenities.restaurant && (
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Restaurante</span>
          </div>
        )}
        {amenities.wifi && (
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Wi-Fi</span>
          </div>
        )}
        {amenities.bathroom && (
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Banheiro</span>
          </div>
        )}
        {amenities.parking && (
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Estacionamento</span>
          </div>
        )}
        {amenities.shop && (
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Loja</span>
          </div>
        )}
      </div>
    </div>
  );
};