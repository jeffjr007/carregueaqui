
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProfileLoadingStateProps {
  message?: string;
}

export const ProfileLoadingState = ({ message = "Carregando..." }: ProfileLoadingStateProps) => {
  return (
    <Card className="absolute left-4 top-16 w-80 p-4 z-30 bg-white/95 backdrop-blur-sm">
      <div className="flex justify-center items-center h-40">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>
      </div>
    </Card>
  );
};
