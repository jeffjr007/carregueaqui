
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface EmptyFavoriteStateProps {
  onClose: () => void;
}

export const EmptyFavoriteState = ({ onClose }: EmptyFavoriteStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Star className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Você ainda não tem carregadores favoritos
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-xs">
        Adicione estações à sua lista de favoritos para acessá-las rapidamente
      </p>
      <Button className="rounded-full bg-green-500 hover:bg-green-600" onClick={onClose}>
        Explorar estações próximas
      </Button>
    </div>
  );
};
