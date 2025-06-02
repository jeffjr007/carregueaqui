
import { AlertTriangle } from "lucide-react";

interface MapLoadingStateProps {
  isLoading: boolean;
  error: string | null;
}

export const MapLoadingState = ({ isLoading, error }: MapLoadingStateProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse">Carregando mapa...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Erro ao carregar o mapa</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">{error}</p>
        <p className="text-xs mt-4 text-gray-400">Certifique-se de configurar um token público do Mapbox (pk.*) nas configurações do projeto.</p>
      </div>
    );
  }

  return null;
};
