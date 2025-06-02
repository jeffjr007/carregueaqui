
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const connectorTypes = [
  { id: "type2", label: "Tipo 2", icon: "🔌" },
  { id: "ccs", label: "CCS", icon: "⚡" },
  { id: "chademo", label: "CHAdeMO", icon: "🔋" },
  { id: "tesla", label: "Tesla", icon: "🚗" },
];

interface ConnectorFiltersProps {
  selectedConnectors: string[];
  setSelectedConnectors: (connectors: string[]) => void;
  onClose: () => void;
}

export const ConnectorFilters = ({
  selectedConnectors,
  setSelectedConnectors,
  onClose,
}: ConnectorFiltersProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="fixed top-20 left-0 right-0 mx-4 md:mx-auto md:w-72 md:right-4 md:left-auto p-4 z-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg animate-fade-in max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center">
            <span className="mr-2">🔌</span> Tipos de Conectores
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setExpanded(!expanded)} 
              className="h-8 w-8"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-8 w-8 hover:rotate-90 transition-transform duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-2">
            {connectorTypes.map((connector) => (
              <div 
                key={connector.id} 
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                  selectedConnectors.includes(connector.id) 
                    ? "bg-primary/10 hover:bg-primary/15" 
                    : "hover:bg-gray-50"
                }`}
              >
                <Checkbox
                  id={connector.id}
                  checked={selectedConnectors.includes(connector.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedConnectors([...selectedConnectors, connector.id]);
                    } else {
                      setSelectedConnectors(
                        selectedConnectors.filter((id) => id !== connector.id)
                      );
                    }
                  }}
                  className="transition-transform duration-200 data-[state=checked]:scale-105"
                />
                <div className="flex items-center w-full">
                  <span className="mr-2 text-xl">{connector.icon}</span>
                  <Label htmlFor={connector.id} className="cursor-pointer flex-grow">{connector.label}</Label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
