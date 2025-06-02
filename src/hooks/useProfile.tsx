
import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ErrorResponse, UserProfile } from "@/types/user";

interface UseProfileReturn {
  // Core profile data
  username: string;
  name: string;
  avatarUrl: string;
  
  // Loading states
  loading: boolean;
  initialLoading: boolean;
  
  // Functions
  fetchProfile: () => Promise<void>;
}

interface ProfileData {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile(): UseProfileReturn {
  // State variables
  const [username, setUsername] = useState("Usuário");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const user = useUser();
  const { toast } = useToast();
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get current session directly to ensure we have the latest
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      if (!currentUser) {
        console.log("No user found in session, aborting profile fetch");
        setLoading(false);
        setInitialLoading(false);
        return;
      }
      
      // Update user ID state
      setCurrentUserId(currentUser.id);
      console.log("Fetching profile for user:", currentUser.id);
      
      // Try to get profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (profile) {
        console.log("Profile found:", profile);
        const profileData = profile as ProfileData;
        
        // Set username and name to the same value (to satisfy both hook APIs)
        const displayName = profileData.username || 'Usuário';
        setUsername(displayName);
        setName(displayName);
        
        if (profileData.avatar_url) {
          // If the avatar URL starts with http, it's likely from a third-party provider
          if (profileData.avatar_url.startsWith('http')) {
            setAvatarUrl(profileData.avatar_url);
          } else {
            // Get the avatar from Supabase Storage
            try {
              const { data } = await supabase.storage
                .from('avatars')
                .download(profileData.avatar_url);
              
              if (data) {
                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
              }
            } catch (downloadErr) {
              console.error('Error downloading avatar:', downloadErr);
            }
          }
        }
      } else if (currentUser) {
        // If we don't have a profile yet but have user info from auth
        const displayName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Usuário';
        setUsername(displayName);
        setName(displayName);
        
        // Use Google/OAuth avatar if available
        if (currentUser.user_metadata?.avatar_url) {
          setAvatarUrl(currentUser.user_metadata.avatar_url);
        }
        
        // Create a profile if none exists
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: currentUser.id,
            username: displayName,
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString(),
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      }
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  
  // Função para confirmar a sessão atual
  const confirmSession = async () => {
    try {
      // Obter a sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se não houver sessão, não há o que confirmar
      if (!session) {
        console.log("Não há sessão para confirmar");
        return;
      }
      
      // Tentar renovar a sessão
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Erro ao renovar sessão:", error);
      } else if (data.session) {
        console.log("Sessão renovada com sucesso:", data.session.user.id);
      }
    } catch (error) {
      console.error("Erro ao confirmar sessão:", error);
    }
  };
  
  useEffect(() => {
    // Confirmar a sessão ao montar o componente
    confirmSession();
    
    // On component mount, check if user is available and fetch profile
    // Also set up a listener for auth changes
    const setupAuth = async () => {
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          if (session) {
            // If we get a session, fetch the profile
            setTimeout(() => {
              fetchProfile();
            }, 0);
          } else {
            // If session is null, reset profile data
            setUsername("Usuário");
            setName("");
            setAvatarUrl("/placeholder.svg");
            setInitialLoading(false);
          }
        }
      );
      
      // Then check for existing session
      fetchProfile();
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
    
    // Configurar um intervalo para confirmar a sessão periodicamente
    const sessionRefreshInterval = setInterval(confirmSession, 60000); // A cada 1 minuto
    
    return () => {
      clearInterval(sessionRefreshInterval);
    };
  }, []);

  return {
    // Core data
    username,
    name,
    avatarUrl,
    
    // Loading states
    loading,
    initialLoading,
    
    // Functions
    fetchProfile
  };
}
