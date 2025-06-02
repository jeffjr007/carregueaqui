
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
import { isValidEmail } from "@/lib/validation";

export const usePasswordReset = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string): Promise<OperationResult> => {
    if (!isValidEmail(email)) {
      const errorMessage = "Email inválido";
      showErrorToast(errorMessage, "Erro no formato");
      return errorResult(new Error(errorMessage));
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      showSuccessToast(
        "Email de recuperação enviado",
        "Verifique sua caixa de entrada e siga as instruções"
      );
      
      return successResult();
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage = extractErrorMessage(error, "Erro ao enviar email de recuperação");
      
      setError(errorMessage);
      showErrorToast(errorMessage, "Erro ao recuperar senha");
      
      return errorResult(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    error
  };
};
