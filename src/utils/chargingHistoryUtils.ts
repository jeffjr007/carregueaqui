
import { supabase } from "@/integrations/supabase/client";
import { ChargingHistory } from "@/types/station";

export const fetchChargingHistory = async (userId: string): Promise<ChargingHistory[]> => {
  try {
    if (!userId) {
      console.log('Usuário não autenticado, retornando histórico vazio');
      return [];
    }
    
    const { data, error } = await supabase
      .from('charging_history')
      .select(`
        *,
        charging_stations (
          name
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar histórico de carregamento:', error);
      throw error;
    }

    return data.map(record => ({
      id: record.id,
      stationId: record.station_id,
      stationName: record.charging_stations?.name || 'Estação desconhecida',
      date: new Date(record.date).toLocaleDateString('pt-BR'),
      duration: record.duration,
      energy: record.energy,
      cost: record.cost
    }));
  } catch (error) {
    console.error('Erro ao buscar histórico de carregamento:', error);
    return [];
  }
};
