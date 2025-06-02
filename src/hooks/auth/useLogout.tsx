
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  showErrorToast, 
  successResult, 
  errorResult, 
  OperationResult 
} from "@/lib/error-utils";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const logout = async (): Promise<OperationResult> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar preferência de "lembrar-me"
      localStorage.removeItem('rememberMe');
      
      // Clear any cached data
      localStorage.removeItem('mapboxToken');
      localStorage.removeItem('selectedStation');
      
      navigate("/login");
      
      return successResult();
    } catch (error) {
      showErrorToast(error, "Erro ao sair");
      return errorResult(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading
  };
};
