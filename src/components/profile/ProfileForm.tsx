import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { isValidName, getNameErrorMessage } from "@/lib/validation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface ProfileFormProps {
  initialName: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSaveSuccess: () => void;
}

// Define the expected structure of the profile data from Supabase
interface ProfileData {
  username: string | null;
  avatar_url?: string | null;
}

export const ProfileForm = ({
  initialName,
  loading,
  setLoading,
  onSaveSuccess
}: ProfileFormProps) => {
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined | null>(undefined);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!user) return;

      // Fetch profile data (including avatar_url if it exists)
      const { data: profileData, error: profileError }: PostgrestSingleResponse<ProfileData> = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile data:", profileError);
      }

      if (profileData) {
        setName(profileData.username || '');
        setAvatarUrl(profileData.avatar_url || undefined);
      }

      setCreatedAt(user.created_at);
    };

    fetchUserProfileData();
  }, [user]);

  // Update local name state when initialName prop changes
  useEffect(() => {
    if (initialName !== name) {
       setName(initialName);
    }
  }, [initialName, name]);

  // Validate when the user submits the form or changes the name
  useEffect(() => {
    if (formSubmitted || (name !== initialName && name.trim() !== '')) {
      validateName();
    }
  }, [name, formSubmitted, initialName]);

  const validateName = () => {
    const error = getNameErrorMessage(name);
    setNameError(error);
    return !error;
  };

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setFormSubmitted(true);

    if (!validateName()) {
      toast({
        title: "Erro de validação",
        description: nameError,
        variant: "destructive",
      });
      return;
    }

    const isNameChanged = name.trim() !== initialName.trim();
    const isAvatarChanged = avatarFile !== null || (avatarUrl === null && user?.user_metadata?.avatar_url !== null);

    if (!isNameChanged && !isAvatarChanged) {
       toast({
         title: "Nenhuma alteração",
         description: "Não há alterações para salvar.",
         variant: "default",
       });
       setLoading(false);
       onSaveSuccess();
       return;
    }

    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (!currentUser) {
        toast({
          title: "Erro ao salvar perfil",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
          variant: "destructive",
        });
        return;
      }

      const sanitizedName = name.trim();
      const userId = currentUser.id;

      console.log("Salvando perfil com ID:", userId, "Nome:", sanitizedName);

      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        // TODO: Implement avatar upload and get the new avatar_url
        console.log("Avatar upload logic needs to be implemented.", avatarFile);
         toast({
           title: "Upload de Avatar Pendente",
           description: "A funcionalidade de upload de avatar ainda não está implementada.",
           variant: "default",
         });
         newAvatarUrl = avatarUrl; // Keep the old URL or null if it was removed

      } else if (avatarUrl === null && user?.user_metadata?.avatar_url !== null) {
          // TODO: Implement avatar deletion from storage
           console.log("Avatar removal from storage logic needs to be implemented.");
            toast({
              title: "Remoção de Avatar Pendente",
              description: "A funcionalidade de remoção de avatar no storage ainda não está implementada.",
              variant: "default",
            });
             newAvatarUrl = null;
      }

      const updates: { id: string; username?: string; avatar_url?: string | null; updated_at: string } = {
         id: userId,
         updated_at: new Date().toISOString(),
      };

      if (isNameChanged) {
         updates.username = sanitizedName;
      }

      if (avatarFile) {
         // updates.avatar_url = newAvatarUrl;
      } else if (avatarUrl === null) {
         updates.avatar_url = null;
      } else if (avatarUrl !== undefined && user?.user_metadata?.avatar_url === undefined) {
         if (avatarUrl !== null) {
             updates.avatar_url = avatarUrl;
         }
      }

      if (!isNameChanged && !isAvatarChanged) {
         setLoading(false);
         onSaveSuccess();
         return;
      }


      const { error } = await supabase
        .from('profiles')
        .upsert(
           updates,
           { onConflict: 'id' }
         );

      if (error) {
        console.error("Erro no Supabase:", error);
        throw error;
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!",
      });
      onSaveSuccess();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro ao salvar perfil",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';

  return (
    <>
      {createdAt && (
        <div className="text-sm text-gray-500 mb-4">
          Membro desde {formattedCreatedAt}
        </div>
      )}

      <div className="space-y-2 mb-4">
        <Label htmlFor="avatar">Foto de Perfil</Label>
        <div className="flex items-center space-x-4">
           <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarFallback className="bg-gray-200">{name ? name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar Preview" className="object-cover" />}
          </Avatar>
          <div className="flex-1">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <div className="space-y-1">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            disabled={loading}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{nameError}</span>
            </div>
          )}
        </div>
      </div>

      <Button
        className="w-full mt-4"
        onClick={handleSaveProfile}
        disabled={loading || nameError !== null}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
          </>
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </>
  );
};
