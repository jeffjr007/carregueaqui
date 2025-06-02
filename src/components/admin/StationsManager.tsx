
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChargingStation } from "@/types/station";
import { Plus } from "lucide-react";
import { StationList } from "./StationList";
import { StationForm } from "./StationForm";

interface StationsManagerProps {
  stations: ChargingStation[];
  fetchStations: () => Promise<void>;
}

export const StationsManager = ({ stations, fetchStations }: StationsManagerProps) => {
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (station: ChargingStation) => {
    setSelectedStation(station);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedStation({
      lngLat: [-37.0685, -10.9162], // Default location (Aracaju)
      name: "",
      status: "Disponível",
      type: "AC",
      power: "7.4kW",
      rating: 0,
      reviews: 0,
      connectors: 1,
      connectorTypes: ["Tipo 2 (AC)"],
      address: "",
      hours: "09:00 - 21:00",
      brand: "",
      amenities: {
        restaurant: false,
        wifi: false,
        bathroom: false,
        parking: false,
        shop: false
      }
    });
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    if (!confirm("Tem certeza que deseja excluir esta estação?")) return;
    
    try {
      const { error } = await supabase
        .from('charging_stations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Estação excluída com sucesso",
      });
      
      fetchStations();
    } catch (error) {
      console.error("Erro ao excluir estação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a estação",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!selectedStation) return;
    
    try {
      // Extract coordinates from lngLat array
      const [lng, lat] = selectedStation.lngLat;
      
      // Prepare data for Supabase
      const stationData = {
        name: selectedStation.name,
        lng,
        lat,
        status: selectedStation.status,
        type: selectedStation.type,
        power: selectedStation.power,
        connectors: selectedStation.connectors,
        connector_types: selectedStation.connectorTypes,
        address: selectedStation.address,
        hours: selectedStation.hours,
        brand: selectedStation.brand,
        amenities: selectedStation.amenities
      };
      
      if (isCreating) {
        // Create new station
        const { error } = await supabase
          .from('charging_stations')
          .insert([stationData]);
          
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Estação criada com sucesso",
        });
      } else {
        // Update existing station
        const { error } = await supabase
          .from('charging_stations')
          .update(stationData)
          .eq('id', selectedStation.id);
          
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Estação atualizada com sucesso",
        });
      }
      
      // Reset state and fetch updated stations
      setIsEditing(false);
      setIsCreating(false);
      setSelectedStation(null);
      fetchStations();
    } catch (error) {
      console.error("Erro ao salvar estação:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${isCreating ? 'criar' : 'atualizar'} a estação`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedStation(null);
  };

  const handleInputChange = (field: string, value: any) => {
    if (!selectedStation) return;
    
    if (field === 'lng' || field === 'lat') {
      // Update lngLat array for coordinates
      const newLngLat = [...selectedStation.lngLat];
      if (field === 'lng') {
        newLngLat[0] = parseFloat(value) || 0;
      } else {
        newLngLat[1] = parseFloat(value) || 0;
      }
      setSelectedStation({ ...selectedStation, lngLat: newLngLat as [number, number] });
    } else if (field.startsWith('amenities.')) {
      // Update amenities object
      const amenityName = field.split('.')[1];
      setSelectedStation({
        ...selectedStation,
        amenities: {
          ...selectedStation.amenities,
          [amenityName]: value
        }
      });
    } else {
      // Update other fields
      setSelectedStation({ ...selectedStation, [field]: value });
    }
  };

  return (
    <>
      {(isEditing || isCreating) && selectedStation ? (
        <StationForm 
          station={selectedStation}
          isCreating={isCreating}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gerenciar Estações</h2>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Nova Estação
            </Button>
          </div>
          <StationList 
            stations={stations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};
