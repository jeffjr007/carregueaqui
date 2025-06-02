
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Navigation, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showErrorToast } from "@/lib/error-utils";

interface MapDirectionsProps {
  map: mapboxgl.Map | null;
  destination: [number, number];
  onClose: () => void;
}

export const MapDirections = ({ map, destination, onClose }: MapDirectionsProps) => {
  const [route, setRoute] = useState<any>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Buscar token do Mapbox
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        if (!data?.token) throw new Error('No token returned');
        
        setMapboxToken(data.token);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        setError('Não foi possível carregar o token do mapa para navegação');
        showErrorToast(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapboxToken();
  }, [toast]);

  // Calculate route when we have both a map, destination and token
  useEffect(() => {
    if (!map || !destination || !mapboxToken || isLoading) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const origin = [position.coords.longitude, position.coords.latitude];
        
        try {
          // Garantir HTTPS para a solicitação da API
          const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
          
          const query = await fetch(directionsUrl, {
            headers: {
              'Referrer-Policy': 'strict-origin-when-cross-origin'
            }
          });
          
          const json = await query.json();
          
          if (json.routes && json.routes[0]) {
            const data = json.routes[0];
            const route = data.geometry.coordinates;
            const duration = Math.round(data.duration / 60);
            
            setRoute(route);
            setDuration(duration);

            // Check if map and source exist before trying to remove
            if (map && map.getSource('route')) {
              try {
                map.removeLayer('route');
                map.removeSource('route');
              } catch (e) {
                console.warn("Error removing existing route:", e);
              }
            }

            // Make sure map still exists before adding the route
            if (map) {
              try {
                // Add the route to the map
                map.addSource('route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: route
                    }
                  }
                });

                map.addLayer({
                  id: 'route',
                  type: 'line',
                  source: 'route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': '#3b82f6',
                    'line-width': 4,
                    'line-opacity': 0.75
                  }
                });

                // Fit the map to the route
                const bounds = new mapboxgl.LngLatBounds();
                route.forEach((coord: number[]) => {
                  bounds.extend(coord as [number, number]);
                });
                map.fitBounds(bounds, { padding: 50 });
              } catch (e) {
                console.error("Error adding route to map:", e);
              }
            }

            toast({
              title: "Rota calculada",
              description: `Tempo estimado: ${duration} minutos`,
            });
          }
        } catch (error) {
          console.error('Error fetching directions:', error);
          setError('Não foi possível calcular a rota');
          toast({
            title: "Erro ao calcular rota",
            description: "Não foi possível calcular a rota até o carregador.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error('Error getting current position:', error);
        setError('Não foi possível obter sua localização atual');
        toast({
          title: "Erro de localização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive",
        });
      }
    );

    return () => {
      if (map) {
        try {
          if (map.getLayer('route')) {
            map.removeLayer('route');
          }
          if (map.getSource('route')) {
            map.removeSource('route');
          }
        } catch (e) {
          console.warn("Error cleaning up route:", e);
        }
      }
    };
  }, [map, destination, mapboxToken, toast, isLoading]);

  if (isLoading) {
    return (
      <div className="absolute bottom-24 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="text-sm">Carregando direções...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute bottom-24 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-yellow-500 h-4 w-4" />
          <span className="text-sm text-red-500">{error}</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-24 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <Navigation className="text-primary" />
        {duration && (
          <span className="text-sm font-medium">
            Tempo estimado: {duration} minutos
          </span>
        )}
        <Button variant="outline" size="sm" onClick={onClose}>
          Fechar rota
        </Button>
      </div>
    </div>
  );
};
