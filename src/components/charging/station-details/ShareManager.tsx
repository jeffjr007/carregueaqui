
import { useToast } from "@/hooks/use-toast";
import { ChargingStation } from "@/types/station";

export const useShareManager = (station: ChargingStation) => {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: station.name,
        text: `Confira esta estação de carregamento: ${station.name} - ${station.address}`,
        url: window.location.href
      }).catch(err => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      toast({
        title: "Compartilhamento não suportado",
        description: "Seu navegador não suporta compartilhamento.",
      });
    }
  };

  return { handleShare };
};
