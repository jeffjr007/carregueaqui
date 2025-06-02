
import { useEffect, useRef, MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import { ChargingStation } from "@/types/station";
import { memo } from "react";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { MapLoadingState } from "./MapLoadingState";
import { createStationMarker } from "@/services/mapMarkerService";

interface MapContainerProps {
  stations: ChargingStation[];
  isDayMode: boolean;
  onStationSelect: (station: ChargingStation) => void;
  mapRef: MutableRefObject<mapboxgl.Map | null>;
}

export const MapContainer = memo(({ 
  stations, 
  isDayMode, 
  onStationSelect, 
  mapRef 
}: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { mapboxToken, isLoading, error } = useMapboxToken();

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isLoading) return;

    try {
      console.log("Inicializando mapa com token público:", mapboxToken.substring(0, 10) + "...");
      mapboxgl.accessToken = mapboxToken;
      
      // Definir o estilo do mapa com base no modo dia/noite
      const mapStyle = isDayMode 
        ? "mapbox://styles/mapbox/streets-v12"
        : "mapbox://styles/mapbox/dark-v11";
      
      // Se já existe um mapa, remova-o antes de criar um novo
      if (mapRef.current) {
        try {
          // Safely remove the existing map
          mapRef.current.remove();
        } catch (e) {
          console.warn("Error removing existing map:", e);
          // Continue even if removal fails
        }
      }
      
      // Criar um novo mapa com o estilo apropriado
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [-37.0685, -10.9162], // Aracaju coordinates
        zoom: 12,
        pitch: 45,
      });

      console.log("Mapa inicializado com sucesso no modo:", isDayMode ? "dia" : "noite");

      // Adicionar controles ao mapa
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      mapRef.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
      
      // Configuração melhorada do GeolocateControl para precisão
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 6000,  // 6 segundos para obter a posição
          maximumAge: 0    // Sempre usar a posição mais recente
        },
        trackUserLocation: true,
        showAccuracyCircle: true,
        showUserHeading: true
      });
      
      mapRef.current.addControl(geolocateControl);
      
      // Trigger localização automática após carregar o mapa
      mapRef.current.on('load', () => {
        console.log("Mapa carregado completamente. Iniciando localização...");
        setTimeout(() => {
          try {
            // Ativar a localização do usuário automaticamente
            geolocateControl.trigger();
          } catch (locError) {
            console.warn("Erro ao ativar localização automática:", locError);
          }
        }, 1500); // Tempo ligeiramente maior para garantir que o mapa esteja completamente renderizado
      });

      // Adicionar marcadores para as estações
      if (stations && Array.isArray(stations)) {
        console.log(`Adicionando ${stations.length} estações ao mapa`);
        stations.forEach(station => {
          createStationMarker(station, mapRef.current!, onStationSelect, toast);
        });
      }

      // Mostrar mensagem quando localização é encontrada
      geolocateControl.on('geolocate', (position) => {
        console.log("Localização encontrada:", position);
        toast({
          title: "Localização",
          description: "Sua localização foi encontrada com sucesso",
          duration: 3000, // Fechará automaticamente após 3 segundos
        });
      });
      
      // Mostrar erro se a localização falhar
      geolocateControl.on('error', (locError) => {
        console.error("Erro de localização:", locError);
        toast({
          title: "Erro de localização",
          description: "Não foi possível encontrar sua localização. Verifique se concedeu permissão de localização.",
          variant: "destructive",
          duration: 5000, // Fechará automaticamente após 5 segundos
        });
      });

    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o mapa. Por favor, tente novamente mais tarde.",
        variant: "destructive",
        duration: 5000, // Fechará automaticamente após 5 segundos
      });
    }

    return () => {
      if (mapRef.current) {
        try {
          console.log("Removendo mapa existente");
          mapRef.current.remove();
          mapRef.current = null;
        } catch (e) {
          console.error("Erro ao remover o mapa:", e);
          // Make sure to nullify the ref even if removal fails
          mapRef.current = null;
        }
      }
    };
  }, [toast, isDayMode, stations, onStationSelect, mapRef, mapboxToken, isLoading]);

  // Este useEffect garante que o estilo do mapa seja atualizado quando o modo dia/noite muda
  useEffect(() => {
    if (mapRef.current && mapboxToken) {
      try {
        const mapStyle = isDayMode 
          ? "mapbox://styles/mapbox/streets-v12"
          : "mapbox://styles/mapbox/dark-v11";
        
        console.log("Atualizando estilo do mapa para:", isDayMode ? "dia" : "noite");
        mapRef.current.setStyle(mapStyle);
      } catch (e) {
        console.warn("Error updating map style:", e);
      }
    }
  }, [isDayMode, mapboxToken, mapRef]);

  return (
    <>
      <MapLoadingState isLoading={isLoading} error={error} />
      {!isLoading && !error && (
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      )}
    </>
  );
});

MapContainer.displayName = "MapContainer";
