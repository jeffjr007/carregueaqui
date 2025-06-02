
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  extractErrorMessage, 
  showErrorToast, 
  showSuccessToast, 
  successResult, 
  errorResult, 
  OperationResult 
} from "@/lib/error-utils";
import { isValidEmail, isValidPassword, isValidName } from "@/lib/validation";

export const useRegister = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string, name: string): Promise<OperationResult> => {
    // Validação robusta dos dados de entrada
    if (!isValidEmail(email)) {
      const errorMessage = "Email inválido";
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro no formato");
      return errorResult(new Error(errorMessage));
    }
    
    if (!isValidPassword(password, 6)) {
      const errorMessage = "A senha deve ter pelo menos 6 caracteres e incluir números e letras";
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro de validação");
      return errorResult(new Error(errorMessage));
    }
    
    if (!isValidName(name)) {
      const errorMessage = "Nome inválido (entre 2 e 100 caracteres, sem caracteres especiais)";
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro de validação");
      return errorResult(new Error(errorMessage));
    }
    
    setError(null);
    setLoading(true);

    try {
      // Sanitização das entradas
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = name.trim();
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            username: sanitizedName,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data.user) {
        showSuccessToast(
          "Cadastro realizado com sucesso!",
          "Verifique seu email para confirmar o cadastro."
        );
        return successResult();
      }
      
      return errorResult("Erro desconhecido ao cadastrar");
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage = extractErrorMessage(error, "Erro ao fazer cadastro");
      
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro no cadastro");
      
      return errorResult(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error
  };
};
