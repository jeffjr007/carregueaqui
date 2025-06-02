
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface UserProfileActionsProps {
  onEditProfile: () => void;
  onShowSettings: () => void;
}

export const UserProfileActions = ({ 
  onEditProfile, 
  onShowSettings 
}: UserProfileActionsProps) => {
  return (
    <div className="flex justify-between mb-6">
      <Button
        variant="outline"
        className="flex-1 mr-2"
        onClick={onEditProfile}
      >
        Editar Perfil
      </Button>
      <Button
        variant="outline"
        className="w-12 h-10"
        onClick={onShowSettings}
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};
