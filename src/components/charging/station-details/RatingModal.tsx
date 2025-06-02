
import { useState, useEffect } from "react";
import { Rating } from "@/components/charging/Rating";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@supabase/auth-helpers-react";

interface RatingModalProps {
  showRating: boolean;
  setShowRating: (show: boolean) => void;
  stationId?: string;
}

export const RatingModal = ({ showRating, setShowRating, stationId }: RatingModalProps) => {
  const { toast } = useToast();
  const user = useUser();

  if (!showRating) return null;

  const handleSubmit = (rating: { stars: number; comment: string }) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para avaliar esta estação.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Avaliação Enviada",
        description: "Obrigado por avaliar esta estação!",
      });
    }
    setShowRating(false);
  };

  return (
    <Rating
      stationId={stationId}
      userId={user?.id}
      onSubmit={handleSubmit}
      onClose={() => setShowRating(false)}
    />
  );
};
