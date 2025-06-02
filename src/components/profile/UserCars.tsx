
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarFront } from "lucide-react";
import { UserCar } from "@/types/user";

interface UserCarsProps {
  cars: UserCar[];
  onAddCar: () => void;
}

export const UserCars = ({ cars, onAddCar }: UserCarsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center">
          <CarFront className="mr-2 h-5 w-5" /> Meus Carros
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddCar}
        >
          Adicionar Carro
        </Button>
      </div>
      <div className="space-y-3">
        {cars.length > 0 ? cars.map((car, index) => (
          <Card key={index} className="bg-blue-50 p-3 border-none">
            <div className="font-medium">{car.model}</div>
            <div className="text-sm text-gray-600">
              Ano: {car.year} | Conector: {car.chargeType}
            </div>
          </Card>
        )) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            Nenhum carro registrado
          </div>
        )}
      </div>
    </div>
  );
};
