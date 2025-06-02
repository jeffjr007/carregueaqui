
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface MapNotificationsProps {
  user: User | null;
}

export const MapNotifications = ({ user }: MapNotificationsProps) => {
  const { toast } = useToast();

  const sendNotification = async (type: 'charging_started' | 'charging_complete' | 'charging_error', stationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('charging-notifications', {
        body: {
          userId: user.id,
          stationId: stationId,
          type: type
        }
      });

      if (error) throw error;

      toast({
        title: "Notificação enviada",
        description: "Você receberá um email com os detalhes.",
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação.",
        variant: "destructive",
      });
    }
  };

  return { sendNotification };
};
