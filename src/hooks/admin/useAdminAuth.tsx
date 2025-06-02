
import { useState, useEffect } from "react";
import { isCurrentUserAdmin, setLucasAsAdmin, createDedicatedAdmin } from "@/utils/adminUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get the current session and check if user is admin
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log("No user in session, cannot check admin status");
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      console.log("Checking admin status for:", session.user.id, session.user.email);
      const adminStatus = await isCurrentUserAdmin();
      console.log("Admin status result:", adminStatus);
      
      if (adminStatus) {
        toast({
          title: "Acesso de Administrador",
          description: "Você tem acesso às funcionalidades de administrador",
        });
      }
      
      setIsAdmin(adminStatus);
      setIsLoading(false);
    };
    
    checkAdmin();
    
    // Set up auth listener to recheck admin status when auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      // Wait a moment to ensure database has updated
      setTimeout(async () => {
        await checkAdmin();
      }, 500);
    });
    
    // Set Lucas as admin and create dedicated admin account (one-time operations)
    const setupAdmin = async () => {
      // First, try setting Lucas as admin
      const lucasResult = await setLucasAsAdmin();
      
      // Then create a dedicated admin account
      const adminResult = await createDedicatedAdmin();
      
      if (adminResult.success) {
        setAdminMessage(adminResult.message);
      } else if (lucasResult.success) {
        setAdminMessage(lucasResult.message);
      } else {
        setAdminMessage("Não foi possível configurar administrador. Verifique os logs para mais detalhes.");
      }
      
      console.log("Admin operations results:", { lucas: lucasResult, admin: adminResult });
      
      // Recheck admin status after setup
      checkAdmin();
    };
    
    setupAdmin();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return {
    isAdmin,
    isLoading,
    adminMessage
  };
}
