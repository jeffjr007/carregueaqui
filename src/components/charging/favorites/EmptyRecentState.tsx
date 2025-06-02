
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface EmptyRecentStateProps {
  onClose: () => void;
}

export const EmptyRecentState = ({ onClose }: EmptyRecentStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Clock className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Nenhum carregador recente
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-xs">
        Aqui aparecerão as estações que você visitou recentemente
      </p>
      <Button className="rounded-full bg-green-500 hover:bg-green-600" onClick={onClose}>
        Ver mapa de carregadores
      </Button>
    </div>
  );
};
