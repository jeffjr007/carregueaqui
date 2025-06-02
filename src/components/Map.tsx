
import { MapStateProvider } from "@/contexts/MapStateContext";
import { FilterProvider } from "./map/FilterContext";
import { MapUI } from "./map/MapUI";
import { Suspense } from "react";
import LoadingScreen from "./LoadingScreen";

const Map = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MapStateProvider>
        <FilterProvider>
          <MapUI />
        </FilterProvider>
      </MapStateProvider>
    </Suspense>
  );
};

export default Map;
