
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";

interface StationHeaderProps {
  name: string;
  rating: number;
  reviews: number;
  onClose: () => void;
}

export const StationHeader = ({ name, rating, reviews, onClose }: StationHeaderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h2 className="text-xl md:text-2xl font-bold pr-2">{name}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xl h-8 w-8 p-0">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Star className="text-yellow-500 h-4 w-4" />
        <span className="text-sm">{rating} ({reviews} avaliações)</span>
      </div>
    </div>
  );
};
