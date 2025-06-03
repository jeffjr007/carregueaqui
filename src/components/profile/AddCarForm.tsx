import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarFront } from "lucide-react";

interface AddCarFormProps {
  onCancel: () => void;
  // Add onSaveSuccess prop later
}

export const AddCarForm = ({ onCancel }: AddCarFormProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [chargeType, setChargeType] = useState("");
  // Add loading state

  const handleSaveCar = () => {
    // Implement car saving logic here
    console.log("Saving car:", { brand, model, year, chargeType });
    // onSaveSuccess(); // Call onSaveSuccess after successful save
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
         <CarFront className="mr-2 h-6 w-6" /> Adicionar Novo Carro
      </h2>
      
      <div className="space-y-2">
        <Label htmlFor="brand">Marca</Label>
        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: Tesla" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Modelo</Label>
        <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex: Model 3" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Ano</Label>
        <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex: 2023" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chargeType">Tipo de Conector</Label>
         {/* Populate select options with common connector types */}
        <Select onValueChange={setChargeType} value={chargeType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Type 2">Type 2</SelectItem>
            <SelectItem value="CCS">CCS</SelectItem>
            <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
            {/* Add more options as needed */}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1" onClick={handleSaveCar}>
          Salvar Carro
        </Button>
      </div>
    </div>
  );
}; 