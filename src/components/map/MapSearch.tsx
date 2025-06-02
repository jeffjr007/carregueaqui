import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Search, Filter, X, Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { VirtualList } from "@/components/ui/virtual-list";

interface SearchResult {
  id?: string;
  text: string;
  place_name?: string;
  center?: [number, number];
}

interface MapSearchProps {
  onSearch: (query: string) => void;
  onShowFilters: () => void;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
}

export const MapSearch = memo(({ onSearch, onShowFilters, mapRef }: MapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setIsSearching(true);
        onSearch(searchQuery);
        
        // If mapbox is available, use its geocoding API
        if (mapRef.current && mapboxgl.accessToken) {
          const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}&country=br&limit=5`;
          
          const response = await fetch(endpoint);
          const data = await response.json();
          
          if (data.features) {
            setSearchResults(data.features);
          }
        }
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsSearching(false);
      }
    }
  }, [searchQuery, onSearch, mapRef]);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (mapRef.current && result.center) {
      mapRef.current.flyTo({
        center: result.center,
        zoom: 15,
        essential: true
      });
      setSearchResults([]);
      setSearchQuery(result.place_name || result.text);
    }
  }, [mapRef]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    inputRef.current?.focus();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSearchResult = useCallback((result: SearchResult, index: number) => (
    <button
      key={result.id || index}
      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors text-sm flex items-start"
      onClick={() => handleResultClick(result)}
      type="button"
    >
      <Search className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-muted-foreground" />
      <div>
        <div className="font-medium">{result.text}</div>
        {result.place_name && (
          <div className="text-xs text-muted-foreground truncate max-w-[90%]">
            {result.place_name.replace(result.text + ", ", "")}
          </div>
        )}
      </div>
    </button>
  ), [handleResultClick]);

  return (
    <div className="absolute top-4 left-0 right-0 z-10 px-4 pr-16 md:px-6 max-w-full mx-auto md:max-w-md lg:max-w-lg">
      <form onSubmit={handleSearch} className="flex gap-2 relative">
        <div className="flex bg-white/95 backdrop-blur-sm rounded-full shadow-lg w-full">
          <Input
            ref={inputRef}
            placeholder="Buscar estação ou endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full pl-4 pr-3 py-2 w-full h-12"
          />
          {searchQuery && (
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={clearSearch}
              className="rounded-full h-12 w-12"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <Button 
            type="submit"
            size="icon" 
            variant="ghost" 
            className="rounded-full h-12 w-12"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Button 
          type="button"
          variant="ghost" 
          onClick={onShowFilters}
          className="bg-white/95 backdrop-blur-sm hover:bg-gray-100 rounded-full shadow-lg h-12 w-12 hidden md:flex"
          size="icon"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </form>

      {/* Search Results with Virtualization */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg z-20 max-h-64 overflow-hidden">
          <VirtualList
            items={searchResults}
            itemHeight={50}
            windowHeight={Math.min(searchResults.length * 50, 300)}
            renderItem={renderSearchResult}
            className="py-1"
          />
        </div>
      )}
    </div>
  );
});

MapSearch.displayName = "MapSearch";
