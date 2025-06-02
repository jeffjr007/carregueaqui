
import { ChargingStation } from "@/types/station";
import { useMemo } from "react";

export const useStationFilters = (
  stations: ChargingStation[] | undefined,
  activeFilter: string,
  selectedConnectors: string[],
  selectedAmenities: string[]
) => {
  return useMemo(() => {
    return stations?.filter(station => {
      // Filter by status
      if (activeFilter === "available" && station.status !== "available") {
        return false;
      }
      if (activeFilter === "fast" && station.type !== "fast") {
        return false;
      }

      // Filter by connector types
      if (selectedConnectors.length > 0) {
        const hasSelectedConnector = station.connectorTypes.some(type => 
          selectedConnectors.includes(type)
        );
        if (!hasSelectedConnector) return false;
      }

      // Filter by amenities
      if (selectedAmenities.length > 0) {
        const hasSelectedAmenities = selectedAmenities.every(amenity => 
          station.amenities[amenity as keyof typeof station.amenities]
        );
        if (!hasSelectedAmenities) return false;
      }

      return true;
    });
  }, [stations, activeFilter, selectedConnectors, selectedAmenities]);
};
