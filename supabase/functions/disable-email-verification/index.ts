import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Required environment variables are not set.");
    }

    // Initialize Supabase Admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Confirm email for admin user
    const { data: adminData, error: adminError } = await supabase.auth.admin
      .getUserByEmail("admin@voltsync.com.br");

    if (adminError) {
      throw adminError;
    }

    if (!adminData?.user) {
      throw new Error("Admin user not found");
    }

    // Update user to confirm email if not already confirmed
    if (!adminData.user.email_confirmed_at) {
      const { error: updateError } = await supabase.auth.admin
        .updateUserById(adminData.user.id, {
          email_confirmed_at: new Date().toISOString(),
        });

      if (updateError) {
        throw updateError;
      }
    }

    // Confirm email for Lucas user if exists
    const { data: lucasData, error: lucasError } = await supabase.auth.admin
      .getUserByEmail("lucas.f.nunes6@aluno.senai.br");

    if (!lucasError && lucasData?.user) {
      if (!lucasData.user.email_confirmed_at) {
        await supabase.auth.admin
          .updateUserById(lucasData.user.id, {
            email_confirmed_at: new Date().toISOString(),
          });
      }
    }

    // Get auth settings for the site
    const { data: settings, error: settingsError } = await supabase
      .from("auth_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError && settingsError.code !== "PGRST116") {
      throw settingsError;
    }

    // Update auth settings if needed
    if (!settings || settings.email_confirmation_required) {
      const table = "auth_settings";
      const schema = "auth";
      
      // This is a hacky way since we can't directly update auth.auth_settings
      // This depends on having the right permissions, which requires service_role
      // Execute a raw SQL query to update the settings
      const { error: configError } = await supabase.rpc("set_auth_settings", {
        email_confirmation_required: false,
      });

      if (configError) {
        throw configError;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Email confirmations disabled and users confirmed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
