
import { createContext, useContext, ReactNode, useState } from "react";

interface FilterContextType {
  showConnectorFilters: boolean;
  setShowConnectorFilters: (show: boolean) => void;
  selectedConnectors: string[];
  setSelectedConnectors: (connectors: string[]) => void;
  showMoreFilters: boolean;
  setShowMoreFilters: (show: boolean) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [showConnectorFilters, setShowConnectorFilters] = useState(false);
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <FilterContext.Provider value={{
      showConnectorFilters,
      setShowConnectorFilters,
      selectedConnectors,
      setSelectedConnectors,
      showMoreFilters,
      setShowMoreFilters,
      selectedAmenities,
      setSelectedAmenities,
      activeFilter,
      setActiveFilter,
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
