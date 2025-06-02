import { ChargingStation } from "@/types/station";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StationFormProps {
  station: ChargingStation;
  isCreating: boolean;
  onInputChange: (field: string, value: any) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export const StationForm = ({ 
  station, 
  isCreating, 
  onInputChange, 
  onSave, 
  onCancel 
}: StationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isCreating ? "Criar Nova Estação" : "Editar Estação"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                value={station.name} 
                onChange={(e) => onInputChange('name', e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                value={station.address} 
                onChange={(e) => onInputChange('address', e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Operadora/Marca</Label>
              <Input 
                id="brand" 
                value={station.brand} 
                onChange={(e) => onInputChange('brand', e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="hours">Horário de Funcionamento</Label>
              <Input 
                id="hours" 
                value={station.hours} 
                onChange={(e) => onInputChange('hours', e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={station.status} 
                onValueChange={(value) => onInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Ocupado">Ocupado</SelectItem>
                  <SelectItem value="Indisponível">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input 
                  id="lng" 
                  type="number"
                  step="0.0001"
                  value={station.lngLat[0]} 
                  onChange={(e) => onInputChange('lng', e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input 
                  id="lat" 
                  type="number"
                  step="0.0001"
                  value={station.lngLat[1]} 
                  onChange={(e) => onInputChange('lat', e.target.value)} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={station.type} 
                onValueChange={(value) => onInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="DC">DC</SelectItem>
                  <SelectItem value="DC/AC">DC/AC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="power">Potência</Label>
              <Input 
                id="power" 
                value={station.power} 
                onChange={(e) => onInputChange('power', e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="connectors">Número de Conectores</Label>
              <Input 
                id="connectors" 
                type="number"
                value={station.connectors} 
                onChange={(e) => onInputChange('connectors', parseInt(e.target.value) || 1)} 
              />
            </div>
            
            <div>
              <Label>Facilidades</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="restaurant" 
                    checked={station.amenities.restaurant}
                    onCheckedChange={(checked) => 
                      onInputChange('amenities.restaurant', checked === true)
                    }
                  />
                  <label htmlFor="restaurant">Restaurante</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="wifi" 
                    checked={station.amenities.wifi}
                    onCheckedChange={(checked) => 
                      onInputChange('amenities.wifi', checked === true)
                    }
                  />
                  <label htmlFor="wifi">Wi-Fi</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bathroom" 
                    checked={station.amenities.bathroom}
                    onCheckedChange={(checked) => 
                      onInputChange('amenities.bathroom', checked === true)
                    }
                  />
                  <label htmlFor="bathroom">Banheiro</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="parking" 
                    checked={station.amenities.parking}
                    onCheckedChange={(checked) => 
                      onInputChange('amenities.parking', checked === true)
                    }
                  />
                  <label htmlFor="parking">Estacionamento</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="shop" 
                    checked={station.amenities.shop}
                    onCheckedChange={(checked) => 
                      onInputChange('amenities.shop', checked === true)
                    }
                  />
                  <label htmlFor="shop">Loja</label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input 
                id="image_url" 
                value={station.image_url || ""} 
                onChange={(e) => onInputChange('image_url', e.target.value)} 
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}>{isCreating ? "Criar" : "Salvar"}</Button>
        </div>
      </CardContent>
    </Card>
  );
};
