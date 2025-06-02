
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { isValidEmail } from "@/lib/validation";

interface UseLoginOptions {
  redirectTo?: string;
}

export const useLogin = (options: UseLoginOptions = {}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { redirectTo = "/map" } = options;

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<OperationResult> => {
    // Validação dos dados de entrada
    if (!isValidEmail(email)) {
      const errorMessage = "Email inválido";
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro no formato");
      return errorResult(new Error(errorMessage));
    }
    
    if (!password || password.length === 0) {
      const errorMessage = "Senha não pode estar vazia";
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro de validação");
      return errorResult(new Error(errorMessage));
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Sanitização da entrada
      const sanitizedEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) throw error;

      showSuccessToast(
        "Login realizado com sucesso!",
        "Redirecionando..."
      );
      
      if (data.session) {
        // Se o usuário escolheu "lembrar-me", definimos a persistência da sessão
        if (rememberMe) {
          try {
            localStorage.setItem('rememberMe', 'true');
          } catch (e) {
            console.error("Erro ao salvar preferência de sessão:", e);
          }
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        navigate(redirectTo);
      }
      
      return successResult();
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = extractErrorMessage(error, "Ocorreu um erro durante o login");
      
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro ao fazer login");
      
      return errorResult(error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<OperationResult> => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`
        }
      });

      if (error) throw error;
      
      return successResult();
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = extractErrorMessage(error, "Ocorreu um erro durante o login com Google");
      
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro ao fazer login com Google");
      setLoading(false);
      
      return errorResult(error);
    }
  };

  return {
    login,
    loginWithGoogle,
    loading,
    error,
  };
};
