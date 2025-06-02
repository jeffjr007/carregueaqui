
import { supabase } from "@/integrations/supabase/client";

// Método para iniciar uma sessão de carregamento
export const startChargingSession = async (stationId: string, userId: string) => {
  try {
    if (!userId) {
      console.log('Usuário não autenticado, impossível iniciar carregamento');
      return null;
    }
    
    const { data, error } = await supabase
      .from('charging_sessions')
      .insert([{ 
        station_id: stationId, 
        user_id: userId,
        status: 'in_progress',
        start_time: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao iniciar sessão de carregamento:', error);
    return null;
  }
};

// Método para finalizar uma sessão de carregamento
export const completeChargingSession = async (sessionId: string, energyConsumed: number) => {
  try {
    const { data, error } = await supabase
      .from('charging_sessions')
      .update({ 
        status: 'completed',
        end_time: new Date().toISOString(),
        energy_consumed: energyConsumed
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao finalizar sessão de carregamento:', error);
    return null;
  }
};

// Método para obter as sessões de carregamento ativas do usuário
export const getActiveChargingSessions = async (userId: string) => {
  try {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('charging_sessions')
      .select(`
        *,
        charging_stations (
          name, address
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'in_progress');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar sessões ativas:', error);
    return [];
  }
};
