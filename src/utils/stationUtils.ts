
import { supabase } from "@/integrations/supabase/client";
import { ChargingStation } from "@/types/station";
import { Json } from "@/integrations/supabase/types";

interface AmenitiesJson {
  restaurant: boolean;
  wifi: boolean;
  bathroom: boolean;
  parking: boolean;
  shop: boolean;
}

export const fetchChargingStations = async (userId?: string): Promise<ChargingStation[]> => {
  try {
    const { data, error } = await supabase
      .from('charging_stations')
      .select('*');

    if (error) {
      console.error('Erro ao buscar estações de carregamento:', error);
      throw error;
    }

    let favoriteStationsIds: string[] = [];
    
    if (userId) {
      // If a userId is provided, fetch favorite stations
      const { data: favorites } = await supabase
        .from('favorite_stations')
        .select('station_id')
        .eq('user_id', userId);
        
      if (favorites && favorites.length > 0) {
        favoriteStationsIds = favorites.map(fav => fav.station_id);
      }
    }

    return data.map(station => {
      // Safely cast the amenities JSON to our expected type
      const amenitiesData = station.amenities as unknown as AmenitiesJson;
      
      return {
        id: station.id,
        lngLat: [station.lng, station.lat] as [number, number],
        name: station.name,
        status: station.status,
        type: station.type,
        power: station.power,
        rating: station.rating || 0,
        reviews: station.reviews || 0,
        connectors: station.connectors,
        connectorTypes: station.connector_types,
        address: station.address,
        hours: station.hours,
        brand: station.brand,
        amenities: {
          restaurant: amenitiesData?.restaurant ?? false,
          wifi: amenitiesData?.wifi ?? false,
          bathroom: amenitiesData?.bathroom ?? false,
          parking: amenitiesData?.parking ?? false,
          shop: amenitiesData?.shop ?? false,
        },
        isFavorite: favoriteStationsIds.includes(station.id)
      };
    });
  } catch (error) {
    console.error('Erro ao buscar estações de carregamento:', error);
    return [];
  }
};

export const checkFavoriteStatus = async (stationId: string, userId: string): Promise<boolean> => {
  try {
    if (!userId || !stationId) return false;
    
    const { data, error } = await supabase
      .from('favorite_stations')
      .select()
      .eq('station_id', stationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar status de favorito:', error);
    return false;
  }
};

export const toggleFavoriteStation = async (stationId: string, userId: string) => {
  try {
    if (!userId) {
      console.log('Usuário não autenticado, impossível favoritar');
      return false;
    }
    
    const { data: existingFavorite } = await supabase
      .from('favorite_stations')
      .select()
      .eq('station_id', stationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingFavorite) {
      const { error } = await supabase
        .from('favorite_stations')
        .delete()
        .eq('station_id', stationId)
        .eq('user_id', userId);

      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('favorite_stations')
        .insert([{ station_id: stationId, user_id: userId }]);

      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return false;
  }
};

export const fetchFavoriteStations = async (userId: string): Promise<ChargingStation[]> => {
  try {
    if (!userId) {
      console.log('Usuário não autenticado, retornando favoritos vazios');
      return [];
    }
    
    const { data: favoriteIds, error: favError } = await supabase
      .from('favorite_stations')
      .select('station_id')
      .eq('user_id', userId);

    if (favError) {
      console.error('Erro ao buscar IDs de estações favoritas:', favError);
      throw favError;
    }

    if (!favoriteIds.length) return [];

    const stationIds = favoriteIds.map(fav => fav.station_id);
    
    const { data: stations, error: stationsError } = await supabase
      .from('charging_stations')
      .select('*')
      .in('id', stationIds);

    if (stationsError) {
      console.error('Erro ao buscar detalhes das estações favoritas:', stationsError);
      throw stationsError;
    }

    return stations.map(station => {
      const amenitiesData = station.amenities as unknown as AmenitiesJson;
      
      return {
        id: station.id,
        lngLat: [station.lng, station.lat] as [number, number],
        name: station.name,
        status: station.status,
        type: station.type,
        power: station.power,
        rating: station.rating || 0,
        reviews: station.reviews || 0,
        connectors: station.connectors,
        connectorTypes: station.connector_types,
        address: station.address,
        hours: station.hours,
        brand: station.brand,
        amenities: {
          restaurant: amenitiesData?.restaurant ?? false,
          wifi: amenitiesData?.wifi ?? false,
          bathroom: amenitiesData?.bathroom ?? false,
          parking: amenitiesData?.parking ?? false,
          shop: amenitiesData?.shop ?? false,
        },
        isFavorite: true
      };
    });
  } catch (error) {
    console.error('Erro ao buscar estações favoritas:', error);
    return [];
  }
};
