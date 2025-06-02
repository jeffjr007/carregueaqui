
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, ChevronDown, ChevronUp, Wifi, ParkingSquare, Coffee, Bath } from "lucide-react";
import { useState } from "react";

interface MapFiltersProps {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  showMoreFilters: boolean;
  setShowMoreFilters: (value: boolean) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
  onClose: () => void;
}

export const MapFilters = ({
  activeFilter,
  setActiveFilter,
  showMoreFilters,
  setShowMoreFilters,
  selectedAmenities,
  setSelectedAmenities,
  onClose,
}: MapFiltersProps) => {
  const [expanded, setExpanded] = useState(true);

  const amenities = [
    { id: "wifi", label: "Wi-Fi Grátis", icon: <Wifi className="h-4 w-4 mr-2" /> },
    { id: "bathroom", label: "Banheiro", icon: <Bath className="h-4 w-4 mr-2" /> },
    { id: "parking", label: "Estacionamento", icon: <ParkingSquare className="h-4 w-4 mr-2" /> },
    { id: "restaurant", label: "Café/Restaurante", icon: <Coffee className="h-4 w-4 mr-2" /> },
  ];

  return (
    <Card className="absolute top-20 left-0 right-0 mx-4 md:left-auto md:right-4 md:w-72 p-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg animate-fade-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center">
            <Filter className="mr-2" /> Filtros
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setExpanded(!expanded)} 
              className="h-8 w-8"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-8 w-8 hover:rotate-90 transition-transform duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {expanded && (
          <>
            <div className="space-y-2 border-b pb-4">
              <h4 className="text-sm font-medium mb-2">Status da Estação</h4>
              <RadioGroup defaultValue={activeFilter} onValueChange={setActiveFilter} className="space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">Todas as Estações</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="available" id="available" />
                  <Label htmlFor="available" className="cursor-pointer">Disponíveis</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast" className="cursor-pointer">Carregamento Rápido</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-medium mb-2">Comodidades</h4>
              {amenities.map((amenity) => (
                <div 
                  key={amenity.id} 
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    selectedAmenities.includes(amenity.id) 
                      ? "bg-primary/10 hover:bg-primary/15" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Checkbox
                    id={amenity.id}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAmenities([...selectedAmenities, amenity.id]);
                      } else {
                        setSelectedAmenities(
                          selectedAmenities.filter((id) => id !== amenity.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={amenity.id} className="cursor-pointer flex items-center">
                    {amenity.icon}
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
