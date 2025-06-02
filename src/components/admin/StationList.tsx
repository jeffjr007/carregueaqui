
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash } from "lucide-react";
import { ChargingStation } from "@/types/station";

interface StationListProps {
  stations: ChargingStation[];
  onEdit: (station: ChargingStation) => void;
  onDelete: (id: string | undefined) => void;
}

export const StationList = ({ stations, onEdit, onDelete }: StationListProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operadora</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{station.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap max-w-xs truncate">{station.address}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      station.status === 'Disponível' ? 'bg-green-100 text-green-800' :
                      station.status === 'Ocupado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {station.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{station.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{station.brand || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(station)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDelete(station.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
