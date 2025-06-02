
import mapboxgl from "mapbox-gl";
import { ChargingStation } from "@/types/station";
import { useToast } from "@/hooks/use-toast";

export const createStationMarker = (
  station: ChargingStation,
  map: mapboxgl.Map,
  onStationSelect: (station: ChargingStation) => void,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const el = document.createElement("div");
  el.className = `w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
    station.status === "Disponível" ? "bg-primary" :
    station.status === "Ocupado" ? "bg-yellow-500" :
    "bg-red-500"
  }`;
  el.innerHTML = "⚡";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontSize = "20px";

  // Determine coordinates
  let lngLat: [number, number];
  
  if (Array.isArray(station.lngLat) && station.lngLat.length === 2) {
    // Use lngLat if available
    lngLat = [station.lngLat[0], station.lngLat[1]];
  } else if (typeof station.lng === 'number' && typeof station.lat === 'number') {
    // Use separate lng and lat if lngLat not available
    lngLat = [station.lng, station.lat];
  } else {
    // Default coordinates if invalid
    console.warn(`Invalid coordinates for station ${station.name}, using default`);
    lngLat = [-37.0685, -10.9162]; // Default to Aracaju center
  }

  try {
    const marker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .addTo(map);

    el.addEventListener("click", () => {
      onStationSelect(station);
      toast({
        title: "Carregador selecionado",
        description: `${station.name} - ${station.status}`,
        duration: 3000, // Auto-close after 3 seconds
      });
    });
  } catch (markerError) {
    console.error(`Erro ao adicionar marcador para ${station.name}:`, markerError);
  }
};
