
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let mapboxToken = Deno.env.get("API_MAPA_PRINCIPAL");
    
    if (!mapboxToken) {
      throw new Error("Por favor, configure uma chave do Mapbox nas configurações de secrets do Supabase");
    }

    // Validate that it's a public token
    if (!mapboxToken.startsWith("pk.")) {
      console.warn("Aviso: O token deve ser um token público do Mapbox (começando com pk.)");
    }

    console.log("Token do Mapbox recuperado com sucesso");
    
    return new Response(
      JSON.stringify({ token: mapboxToken }),
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
        message: "Configure uma chave do Mapbox válida nas configurações de secrets do Supabase" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

