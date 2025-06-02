
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { isValidName, getNameErrorMessage } from "@/lib/validation";

interface ProfileFormProps {
  initialName: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSaveSuccess: () => void;
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
  const { toast } = useToast();
  const user = useUser();

  // Update local state when prop changes
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  // Validar quando o usuário envia o formulário ou muda o nome
  useEffect(() => {
    if (formSubmitted) {
      validateName();
    }
  }, [name, formSubmitted]);

  const validateName = () => {
    const error = getNameErrorMessage(name);
    setNameError(error);
    return !error;
  };

  // Função para confirmar a sessão atual
  const confirmSession = async () => {
    try {
      // Obter a sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se não houver sessão, não há o que confirmar
      if (!session) {
        console.log("Não há sessão para confirmar");
        return false;
      }
      
      // Tentar renovar a sessão
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Erro ao renovar sessão:", error);
        return false;
      } else if (data.session) {
        console.log("Sessão renovada com sucesso:", data.session.user.id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao confirmar sessão:", error);
      return false;
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
    
    try {
      setLoading(true);
      
      // Confirmar a sessão antes de salvar
      const sessionConfirmed = await confirmSession();
      
      // Verificar se o usuário ainda está logado
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      if (!currentUser) {
        console.log("Usuário não está logado. Tentando renovar sessão...");
        
        if (!sessionConfirmed) {
          toast({
            title: "Erro ao salvar perfil",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
            variant: "destructive",
          });
          return;
        }
        
        // Tentar obter sessão novamente após confirmar
        const { data: { session: refreshedSession } } = await supabase.auth.getSession();
        if (!refreshedSession?.user) {
          toast({
            title: "Erro ao salvar perfil",
            description: "Você precisa estar logado para atualizar seu perfil.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Sanitizar o nome antes de salvar
      const sanitizedName = name.trim();
      
      const userId = currentUser?.id || user?.id;
      
      if (!userId) {
        toast({
          title: "Erro ao salvar perfil",
          description: "Não foi possível identificar seu usuário.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Salvando perfil com ID:", userId, "Nome:", sanitizedName);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: sanitizedName,
          updated_at: new Date().toISOString(),
        });
        
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

  return (
    <>
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
        disabled={loading}
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
