import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EmailNotificationRequest {
  userId: string;
  stationId: string;
  type: 'charging_complete' | 'charging_started' | 'charging_error';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, stationId, type }: EmailNotificationRequest = await req.json();

    // Get user profile and station details
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: station } = await supabase
      .from('charging_stations')
      .select('*')
      .eq('id', stationId)
      .single();

    if (!userProfile || !station) {
      throw new Error('User or station not found');
    }

    // Prepare email content based on notification type
    let subject = '';
    let content = '';

    switch (type) {
      case 'charging_complete':
        subject = 'Carregamento Concluído';
        content = `Olá ${userProfile.username},\n\nSeu carregamento na estação ${station.name} foi concluído com sucesso.`;
        break;
      case 'charging_started':
        subject = 'Carregamento Iniciado';
        content = `Olá ${userProfile.username},\n\nSeu carregamento na estação ${station.name} foi iniciado.`;
        break;
      case 'charging_error':
        subject = 'Erro no Carregamento';
        content = `Olá ${userProfile.username},\n\nHouve um erro durante seu carregamento na estação ${station.name}. Por favor, verifique o status do carregador.`;
        break;
    }

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: 'Carregadores <onboarding@resend.dev>',
      to: [userProfile.email || ''],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">${subject}</h1>
          <p style="color: #4a4a4a; line-height: 1.5;">${content}</p>
          <p style="color: #4a4a4a; line-height: 1.5;">
            Localização: ${station.address}<br>
            Status: ${station.status}<br>
            Potência: ${station.power}
          </p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eaeaea;">
            <p style="color: #666; font-size: 0.9em;">
              Este é um email automático, por favor não responda.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in charging-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});