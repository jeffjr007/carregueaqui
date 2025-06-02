
import { supabase } from "@/integrations/supabase/client";

/**
 * Sets a user as an administrator
 * @param email Email of the user to make admin
 * @returns Promise with operation result
 */
export const setUserAsAdmin = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // First, check if current user has admin privileges to do this operation
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return { 
        success: false, 
        message: "Você não tem permissão para definir administradores" 
      };
    }
    
    // Look up the user's ID from the profiles or auth tables
    // Note: We can't directly query auth.users due to permissions
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', email)
      .maybeSingle();
      
    if (userError) {
      console.error('Error finding user:', userError);
      return { 
        success: false, 
        message: `Erro ao encontrar usuário: ${userError.message}` 
      };
    }
    
    // If user not found, try to create
    if (!userData) {
      return {
        success: false,
        message: `Usuário com email ${email} não encontrado`
      };
    }
    
    const userId = userData.id;
    
    // Check if already admin
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (existingRole) {
      return { 
        success: true, 
        message: `Usuário ${email} já é administrador` 
      };
    }
    
    // Set as admin
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role: 'admin' }]);
      
    if (insertError) {
      throw insertError;
    }
    
    return { 
      success: true, 
      message: `Usuário ${email} definido como administrador com sucesso` 
    };
  } catch (error: any) {
    console.error('Error setting user as admin:', error);
    return { 
      success: false, 
      message: `Erro ao definir usuário como administrador: ${error?.message || error}` 
    };
  }
};

/**
 * Checks if the current logged in user is an admin
 * @returns Promise<boolean> True if current user is admin
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    // Get current session directly
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    if (!user) return false;
    
    console.log("Checking admin status for user ID:", user.id);
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Creates a dedicated admin user account for testing
 */
export const createDedicatedAdmin = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Create a dedicated admin user
    const adminEmail = "admin@voltsync.com.br";
    const adminPassword = "admin123"; // This would be more secure in production
    
    // Check if the admin account already exists
    const { data: { user: existingAdmin }, error: signInError } = await supabase.auth
      .signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
    
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.id);
      
      // Check if the admin already has the admin role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', existingAdmin.id)
        .eq('role', 'admin')
        .maybeSingle();
        
      // If admin doesn't have role, add it
      if (!existingRole) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: existingAdmin.id, role: 'admin' }]);
          
        if (insertError) {
          console.error("Error assigning admin role:", insertError);
          throw insertError;
        }
      }
      
      return { 
        success: true, 
        message: `Usuário admin já existe e tem privilégios de administrador. Email: ${adminEmail}, Senha: ${adminPassword}` 
      };
    }
    
    // Try to create the admin account if it doesn't exist
    if (signInError && signInError.message.includes("Invalid login credentials")) {
      const { data, error: createError } = await supabase.auth
        .signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            emailRedirectTo: window.location.origin, // Fixed: changed from emailRedirect to emailRedirectTo
            data: {
              name: "Admin VoltSync"
            }
          }
        });
      
      if (createError) {
        console.error("Error creating admin account:", createError);
        return { success: false, message: `Erro ao criar usuário admin: ${createError.message}` };
      }
      
      if (data.user) {
        console.log("Created admin user with ID:", data.user.id);
        
        // Add admin role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: data.user.id, role: 'admin' }]);
          
        if (insertError) {
          console.error("Error assigning admin role:", insertError);
          throw insertError;
        }
        
        return { 
          success: true, 
          message: `Usuário admin criado com sucesso. Email: ${adminEmail}, Senha: ${adminPassword}.` 
        };
      }
    }
    
    return { success: false, message: "Erro desconhecido ao criar usuário admin" };
  } catch (error: any) {
    console.error('Error creating dedicated admin:', error);
    return { success: false, message: `Erro ao criar usuário admin: ${error?.message || error}` };
  }
};

/**
 * Sets lucas.f.nunes6@aluno.senai.br as an admin (one-time operation)
 */
export const setLucasAsAdmin = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const lucasEmail = "lucas.f.nunes6@aluno.senai.br";
    
    // First check for Lucas's profile in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .or(`username.ilike.%Lucas%,username.eq.${lucasEmail}`)
      .maybeSingle();
      
    if (profileError) {
      console.error('Error finding Lucas profile:', profileError);
      return { success: false, message: 'Erro ao verificar perfil de Lucas' };
    }
    
    // If profile not found, try to look for email directly
    let userId = profileData?.id;
    
    if (!userId) {
      // Try signing up the user manually
      const { data, error: createError } = await supabase.auth
        .signUp({
          email: lucasEmail,
          password: "lucas123",
          options: {
            emailRedirectTo: window.location.origin, // Fixed: changed from emailRedirect to emailRedirectTo
            data: {
              name: "Lucas SENAI"
            }
          }
        });
        
      if (createError) {
        console.error("Error creating Lucas account:", createError);
        // If we get an error that the user already exists, try to get the ID via a manual lookup
        const { data: profiles, error: fetchError } = await supabase
          .from('profiles')
          .select('id, username');
          
        console.log("Available profiles:", profiles);
        
        if (fetchError) {
          console.error("Error fetching profiles:", fetchError);
          return { success: false, message: 'Erro ao buscar perfis' };
        }
        
        // Try to find user with a different approach
        try {
          // Fixed: This is not available in the client API
          // Let's use a different approach to find the user
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', lucasEmail)
            .maybeSingle();
          
          if (userError) {
            console.error("Error finding user by username:", userError);
          } else if (userData) {
            userId = userData.id;
            console.log("Found user ID via profiles query:", userId);
          }
        } catch (adminError) {
          console.error("Error finding user:", adminError);
        }
      } else if (data?.user) {
        userId = data.user.id;
      }
    }
    
    // If we still don't have a user ID, try one more approach
    if (!userId) {
      // Try to login as Lucas which is safer since we know the credentials
      try {
        const { data: loginData, error: loginError } = await supabase.auth
          .signInWithPassword({
            email: lucasEmail,
            password: "lucas123"
          });
          
        if (loginError) {
          console.error("Error logging in as Lucas:", loginError);
        } else if (loginData?.user) {
          userId = loginData.user.id;
          console.log("Found Lucas user ID via login:", userId);
        }
      } catch (loginError) {
        console.error("Exception during login attempt:", loginError);
      }
    }
    
    // If we still don't have a user ID, we can't proceed
    if (!userId) {
      return { success: false, message: `Usuário Lucas não encontrado nos perfis` };
    }
    
    console.log("Found Lucas user ID:", userId);
    
    // Check if already admin
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (roleError) {
      console.error('Error checking existing role:', roleError);
      return { success: false, message: 'Erro ao verificar papel de usuário' };
    }
    
    if (existingRole) {
      return { success: true, message: `Lucas já é administrador` };
    }
    
    // Set as admin
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role: 'admin' }]);
      
    if (insertError) {
      console.error('Error setting Lucas as admin:', insertError);
      return { success: false, message: 'Erro ao definir Lucas como administrador' };
    }
    
    return { success: true, message: `Lucas definido como administrador com sucesso` };
  } catch (error: any) {
    console.error('Error in setLucasAsAdmin:', error);
    return { success: false, message: `Erro inesperado ao definir Lucas como administrador: ${error?.message || error}` };
  }
};
