import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddCarModalProps {
  onClose: () => void;
}

export const AddCarModal = ({ onClose }: AddCarModalProps) => {
  const { toast } = useToast();

  return (
    <Card className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 z-30 bg-white/95 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Adicionar Novo Carro</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" placeholder="Ex: Tesla Model 3" />
        </div>
        <div>
          <Label htmlFor="year">Ano</Label>
          <Input id="year" placeholder="Ex: 2023" />
        </div>
        <div>
          <Label htmlFor="chargeType">Tipo de Carregador</Label>
          <Input id="chargeType" placeholder="Ex: Tipo 2" />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => {
            toast({
              title: "Carro Adicionado",
              description: "Seu carro foi adicionado com sucesso!",
            });
            onClose();
          }}>
            Adicionar
          </Button>
        </div>
      </div>
    </Card>
  );
};