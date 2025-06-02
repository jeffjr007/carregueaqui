
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import { ProfileLoadingState } from "./ProfileLoadingState";
import { useProfileData } from "@/hooks/useProfileData";

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor = ({ onClose }: ProfileEditorProps) => {
  const [loading, setLoading] = useState(false);
  const { profileData, initialLoading, fetchProfile } = useProfileData();
  const { name, avatarUrl } = profileData;

  const handleSaveSuccess = useCallback(() => {
    fetchProfile();
    onClose();
  }, [fetchProfile, onClose]);

  if (initialLoading) {
    return <ProfileLoadingState message="Carregando perfil..." />;
  }

  return (
    <Card className="absolute left-4 top-16 w-80 p-4 z-30 bg-white/95 backdrop-blur-sm max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Editar Perfil</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <ProfileAvatar 
          initialAvatarUrl={avatarUrl} 
          name={name} 
          loading={loading} 
          setLoading={setLoading} 
        />

        <ProfileForm 
          initialName={name} 
          loading={loading} 
          setLoading={setLoading} 
          onSaveSuccess={handleSaveSuccess} 
        />
      </div>
    </Card>
  );
};
