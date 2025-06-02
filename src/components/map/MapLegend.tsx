import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CarFront, X } from "lucide-react";
import { useState } from "react";

export const MapLegend = () => {
  const [isVisible, setIsVisible] = useState(true);

  const legendItems = [
    { icon: <MapPin className="text-primary" />, label: "Carregador Disponível" },
    { icon: <MapPin className="text-yellow-500" />, label: "Carregador Ocupado" },
    { icon: <CarFront className="text-gray-500" />, label: "Estacionamento" },
  ];

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-20 right-4 z-10"
        onClick={() => setIsVisible(true)}
      >
        Legenda
      </Button>
    );
  }

  return (
    <Card className="absolute bottom-20 right-4 p-4 z-10 bg-white/95 backdrop-blur-sm max-w-[200px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Legenda</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};