
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface ChargingSessionManagerProps {
  stationId: string | undefined;
  userId: string | undefined;
  onStartCharging?: () => void;
  onCompleteCharging?: () => void;
}

export const useChargingSession = ({ 
  stationId, 
  userId,
  onStartCharging,
  onCompleteCharging 
}: ChargingSessionManagerProps) => {
  const { toast } = useToast();

  const { data: activeSession } = useQuery({
    queryKey: ['activeSession', stationId],
    queryFn: async () => {
      if (!userId || !stationId) return null;
      
      const { data, error } = await supabase
        .from('charging_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('station_id', stationId)
        .eq('status', 'in_progress')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!stationId,
  });

  const handleStartCharging = async () => {
    if (!userId || !stationId) return;

    try {
      const { error } = await supabase
        .from('charging_sessions')
        .insert([
          {
            user_id: userId,
            station_id: stationId,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Carregamento iniciado",
        description: "Sua sessão de carregamento começou com sucesso.",
      });

      onStartCharging?.();
    } catch (error) {
      console.error('Error starting charging session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o carregamento.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteCharging = async () => {
    if (!activeSession) return;

    try {
      const { error } = await supabase
        .from('charging_sessions')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          energy_consumed: Math.random() * 50 + 10, // Simulando consumo entre 10-60 kWh
        })
        .eq('id', activeSession.id);

      if (error) throw error;

      toast({
        title: "Carregamento finalizado",
        description: "Sua sessão foi finalizada com sucesso.",
      });

      onCompleteCharging?.();
    } catch (error) {
      console.error('Error completing charging session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível finalizar o carregamento.",
        variant: "destructive",
      });
    }
  };

  return {
    activeSession,
    handleStartCharging,
    handleCompleteCharging,
    isCharging: !!activeSession
  };
};
