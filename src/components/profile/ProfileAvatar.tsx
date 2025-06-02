
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { ErrorResponse } from "@/types/user";

interface ProfileAvatarProps {
  initialAvatarUrl: string;
  name: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const ProfileAvatar = ({ 
  initialAvatarUrl, 
  name, 
  loading, 
  setLoading 
}: ProfileAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const { toast } = useToast();
  const user = useUser();

  // Update local state when prop changes
  useEffect(() => {
    setAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Get current session directly instead of relying on user hook
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;
    
    if (!file || !currentUser) {
      if (!currentUser) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para atualizar sua foto.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setLoading(true);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Validate file size and type
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 2MB");
      }
      
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        throw new Error("Apenas imagens JPEG, PNG e GIF são aceitas");
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Fazendo upload da imagem:", fileName);
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw uploadError;
      }
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          avatar_url: fileName,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso!",
      });
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: errorResponse.message || "Não foi possível salvar sua foto de perfil.",
        variant: "destructive",
      });
      // Revert to original URL
      setAvatarUrl(initialAvatarUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};
