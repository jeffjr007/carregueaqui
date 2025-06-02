
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface RatingProps {
  onSubmit: (rating: { stars: number; comment: string }) => void;
  onClose: () => void;
  stationId?: string;
  userId?: string;
}

export const Rating = ({ onSubmit, onClose, stationId, userId }: RatingProps) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmitRating = async () => {
    if (!stationId || !userId) {
      onSubmit({ stars, comment });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save rating to database if stationId and userId are provided
      // Using the any type to bypass the TypeScript error with the table name
      const { error } = await (supabase as any)
        .from('station_ratings')
        .upsert([{
          station_id: stationId,
          user_id: userId,
          rating: stars,
          comment,
        }], { onConflict: 'station_id,user_id' });

      if (error) throw error;

      // Also update the average rating on the charging_stations table
      await updateStationRating(stationId);

      onSubmit({ stars, comment });
      toast({
        title: "Avaliação enviada",
        description: "Obrigado pelo seu feedback!",
      });

    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStationRating = async (stationId: string) => {
    try {
      // Get all ratings for this station
      const { data: ratings, error } = await (supabase as any)
        .from('station_ratings')
        .select('rating')
        .eq('station_id', stationId);

      if (error) throw error;

      // Calculate average rating
      if (ratings && ratings.length > 0) {
        const avgRating = ratings.reduce((sum: number, item: {rating: number}) => sum + item.rating, 0) / ratings.length;
        
        // Update station with new average rating and increment reviews count
        await supabase
          .from('charging_stations')
          .update({ 
            rating: avgRating,
            reviews: ratings.length
          })
          .eq('id', stationId);
      }
    } catch (error) {
      console.error("Error updating station rating:", error);
    }
  };

  // Handle swipe gestures on mobile for star rating
  const handleStarTouch = (value: number) => {
    setStars(value);
    // Add haptic feedback if available
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(50); // Light vibration for feedback
    }
  };

  return (
    <Card className={`${isMobile ? 'fixed inset-4 z-50' : 'fixed inset-4 md:inset-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-96'} p-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg modal-mobile-full`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Avaliar Estação</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        <div className="space-y-2">
          <Label>Sua avaliação</Label>
          <div className="flex justify-center space-x-2 animate-fade-in">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setStars(value)}
                onMouseEnter={() => setHoveredStar(value)}
                onMouseLeave={() => setHoveredStar(0)}
                onTouchStart={() => handleStarTouch(value)}
                className="focus:outline-none transition-transform hover:scale-110 touch-manipulation"
                type="button"
                aria-label={`${value} estrelas`}
              >
                <Star
                  className={`w-8 h-8 transition-colors duration-300 ${
                    value <= (hoveredStar || stars)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Seu comentário</Label>
          <Textarea
            placeholder="Compartilhe sua experiência com esta estação..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitRating}
            disabled={stars === 0 || isSubmitting}
            className="relative overflow-hidden"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : (
              <span className={`transition-transform duration-200 ${stars === 0 ? 'opacity-50' : ''}`}>
                Enviar Avaliação
              </span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
