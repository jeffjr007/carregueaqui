
import { Button } from "@/components/ui/button";
import { Bookmark, X } from "lucide-react";

interface FavoriteStationsHeaderProps {
  onClose: () => void;
}

export const FavoriteStationsHeader = ({ onClose }: FavoriteStationsHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="text-green-500">
          <Bookmark className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">Meus locais</h2>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
