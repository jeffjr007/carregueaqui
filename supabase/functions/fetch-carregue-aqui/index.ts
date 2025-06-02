
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to fetch charging stations data from Carregue Aqui API or public data for Sergipe
async function fetchCarregueAquiStations() {
  try {
    // This is a simulated fetch since the direct API isn't accessible
    // In a real implementation, you would make actual API calls to Carregue Aqui
    
    // Data for Sergipe charging stations from Carregue Aqui
    // Based on publicly available information for demonstration purposes
    const sergipeStations = [
      {
        name: "Posto Shell Jardins",
        lng: -37.0686,
        lat: -10.9493,
        address: "Av. Ministro Geraldo Barreto Sobral, 215 - Jardins, Aracaju - SE",
        status: "Disponível",
        type: "fast",
        power: "50kW",
        connector_types: ["CCS", "CHAdeMO", "Type2"],
        hours: "24 horas",
        brand: "Shell Recharge",
        connectors: 3,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Shopping Jardins - Carregue Aqui",
        lng: -37.0661,
        lat: -10.9511,
        address: "Av. Ministro Geraldo Barreto Sobral, 215 - Jardins, Aracaju - SE",
        status: "Disponível",
        type: "standard",
        power: "22kW",
        connector_types: ["Type2"],
        hours: "10:00 - 22:00",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Shopping Riomar Aracaju",
        lng: -37.0471,
        lat: -10.9676,
        address: "Av. Delmiro Gouveia, 400 - Coroa do Meio, Aracaju - SE",
        status: "Disponível",
        type: "fast",
        power: "50kW",
        connector_types: ["CCS", "CHAdeMO"],
        hours: "10:00 - 22:00",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Hotel Radisson Aracaju",
        lng: -37.0392,
        lat: -10.9768,
        address: "R. Dr. Bezerra de Menezes, 40 - Coroa do Meio, Aracaju - SE",
        status: "Ocupado",
        type: "standard",
        power: "22kW",
        connector_types: ["Type2"],
        hours: "24 horas",
        brand: "Carregue Aqui",
        connectors: 1,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: false
        }
      },
      {
        name: "Universidade Tiradentes - Campus Farolândia",
        lng: -37.0790,
        lat: -10.9709,
        address: "Av. Murilo Dantas, 300 - Farolândia, Aracaju - SE",
        status: "Disponível",
        type: "standard",
        power: "22kW",
        connector_types: ["Type2"],
        hours: "07:00 - 22:00",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: false
        }
      },
      {
        name: "Posto Ipiranga - Atalaia",
        lng: -37.0497,
        lat: -10.9878,
        address: "Av. Santos Dumont, 230 - Atalaia, Aracaju - SE",
        status: "Disponível",
        type: "fast",
        power: "50kW",
        connector_types: ["CCS", "CHAdeMO", "Type2"],
        hours: "24 horas",
        brand: "Ipiranga",
        connectors: 3,
        amenities: {
          restaurant: false,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Aracaju Parque Shopping",
        lng: -37.0959,
        lat: -10.9391,
        address: "Av. João Rodrigues, 200 - Industrial, Aracaju - SE",
        status: "Disponível",
        type: "standard",
        power: "22kW",
        connector_types: ["Type2"],
        hours: "10:00 - 22:00",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Estacionamento Praia de Atalaia",
        lng: -37.0408,
        lat: -10.9911,
        address: "Av. Santos Dumont, s/n - Atalaia, Aracaju - SE",
        status: "Manutenção",
        type: "standard",
        power: "11kW",
        connector_types: ["Type2"],
        hours: "08:00 - 18:00",
        brand: "Carregue Aqui",
        connectors: 1,
        amenities: {
          restaurant: false,
          wifi: false,
          bathroom: true,
          parking: true,
          shop: false
        }
      },
      {
        name: "Aeroporto de Aracaju",
        lng: -37.0727,
        lat: -10.9898,
        address: "Av. Sen. Júlio César Leite, s/n - Santa Maria, Aracaju - SE",
        status: "Disponível",
        type: "fast",
        power: "50kW",
        connector_types: ["CCS", "CHAdeMO"],
        hours: "24 horas",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Posto Petrobras - BR-101",
        lng: -37.1133,
        lat: -10.9125,
        address: "BR-101, km 92 - Aracaju - SE",
        status: "Disponível",
        type: "fast",
        power: "150kW",
        connector_types: ["CCS", "CHAdeMO"],
        hours: "24 horas",
        brand: "Petrobras",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      },
      {
        name: "Complexo Industrial de Sergipe",
        lng: -37.1329,
        lat: -10.8508,
        address: "Rod. SE-226, s/n - Nossa Senhora do Socorro - SE",
        status: "Disponível",
        type: "fast",
        power: "50kW",
        connector_types: ["CCS", "Type2"],
        hours: "08:00 - 18:00",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: false,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: false
        }
      },
      {
        name: "Terminal Rodoviário José Rollemberg Leite",
        lng: -37.0646,
        lat: -10.9120,
        address: "Av. Tancredo Neves, s/n - Capucho, Aracaju - SE",
        status: "Disponível",
        type: "standard",
        power: "22kW",
        connector_types: ["Type2"],
        hours: "05:00 - 23:00",
        brand: "Carregue Aqui",
        connectors: 2,
        amenities: {
          restaurant: true,
          wifi: true,
          bathroom: true,
          parking: true,
          shop: true
        }
      }
    ];

    return sergipeStations;
  } catch (error) {
    console.error("Error fetching Carregue Aqui stations:", error);
    throw error;
  }
}

// Function to synchronize stations with the database
async function syncStationsToDatabase(stations: any[], supabaseAdmin: any) {
  try {
    console.log(`Starting synchronization of ${stations.length} stations...`);
    
    // For each station, insert or update in the database
    for (const station of stations) {
      const stationData = {
        name: station.name,
        lng: station.lng,
        lat: station.lat,
        address: station.address,
        status: station.status,
        type: station.type,
        power: station.power,
        connector_types: station.connector_types,
        hours: station.hours,
        brand: station.brand,
        connectors: station.connectors,
        amenities: station.amenities
      };

      // Check if station exists (by name and location)
      const { data: existingStation } = await supabaseAdmin
        .from('charging_stations')
        .select('id')
        .eq('name', station.name)
        .eq('lng', station.lng)
        .eq('lat', station.lat)
        .maybeSingle();

      if (existingStation) {
        // Update existing station
        await supabaseAdmin
          .from('charging_stations')
          .update(stationData)
          .eq('id', existingStation.id);
        console.log(`Updated station: ${station.name}`);
      } else {
        // Insert new station
        await supabaseAdmin
          .from('charging_stations')
          .insert([stationData]);
        console.log(`Inserted new station: ${station.name}`);
      }
    }
    
    console.log("Synchronization complete.");
    return { success: true, message: "Stations synchronized successfully", count: stations.length };
  } catch (error) {
    console.error("Error synchronizing stations:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create admin supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const { action } = await req.json();

    let result;
    switch (action) {
      case "fetch":
        // Only fetch the stations
        result = await fetchCarregueAquiStations();
        break;
      case "sync":
        // Fetch and sync stations to the database
        const stations = await fetchCarregueAquiStations();
        result = await syncStationsToDatabase(stations, supabaseAdmin);
        break;
      default:
        throw new Error("Invalid action specified");
    }

    // Return the result
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
