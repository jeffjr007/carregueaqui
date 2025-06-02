
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Cabeçalhos de segurança
const securityHeaders = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=()",
  "Content-Type": "application/json"
};

// Tabelas que serão incluídas no backup
const TABLES_TO_BACKUP = [
  'profiles',
  'charging_stations',
  'charging_sessions',
  'charging_history',
  'favorite_stations',
  'station_ratings',
  'user_roles'
];

// Função para criar timestamp formatado para nomes de arquivo
function getFormattedTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

// Função para criar cliente Supabase com chave de serviço
function createSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Credenciais do Supabase não configuradas nas variáveis de ambiente');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Função para realizar backup de uma tabela
async function backupTable(supabase: any, tableName: string) {
  const { data, error } = await supabase.from(tableName).select('*');
  
  if (error) {
    throw new Error(`Erro ao fazer backup da tabela ${tableName}: ${error.message}`);
  }
  
  return data;
}

// Função para armazenar o backup no Storage
async function storeBackup(supabase: any, backupData: any, timestamp: string) {
  // Verificar se o bucket de backups existe, senão criar
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    throw new Error(`Erro ao listar buckets: ${bucketsError.message}`);
  }
  
  const backupBucket = "database_backups";
  if (!buckets.some(b => b.name === backupBucket)) {
    const { error: createBucketError } = await supabase.storage.createBucket(backupBucket, {
      public: false,
      allowedMimeTypes: ['application/json'],
      fileSizeLimit: 50000000 // 50MB
    });
    
    if (createBucketError) {
      throw new Error(`Erro ao criar bucket de backups: ${createBucketError.message}`);
    }
  }
  
  // Criar arquivo JSON com os dados do backup
  const backupFileName = `backup-${timestamp}.json`;
  const backupContent = JSON.stringify(backupData, null, 2);
  
  // Armazenar o arquivo no bucket
  const { error: uploadError } = await supabase.storage
    .from(backupBucket)
    .upload(backupFileName, backupContent, {
      contentType: 'application/json',
      cacheControl: 'max-age=31536000' // 1 ano
    });
    
  if (uploadError) {
    throw new Error(`Erro ao fazer upload do backup: ${uploadError.message}`);
  }
  
  return backupFileName;
}

// Função para registrar metadados do backup em uma tabela
async function logBackupOperation(supabase: any, fileName: string, tables: string[], size: number) {
  // Registrar backup em tabela de histórico de backups
  const { error } = await supabase
    .from('backup_logs')
    .insert([
      {
        file_name: fileName,
        tables_included: tables,
        file_size_bytes: size,
        created_at: new Date().toISOString()
      }
    ]);
    
  if (error) {
    console.error(`Erro ao registrar backup: ${error.message}`);
  }
}

serve(async (req) => {
  // Verificar se a solicitação está usando HTTPS em produção
  const url = new URL(req.url);
  if (Deno.env.get("ENVIRONMENT") === "production" && url.protocol !== "https:") {
    return new Response(
      JSON.stringify({
        error: "Protocolo inseguro",
        message: "Apenas HTTPS é permitido para esta requisição"
      }),
      {
        headers: securityHeaders,
        status: 403,
      }
    );
  }
  
  // Verificar autenticação (apenas usuários com função de administrador podem executar backups manualmente)
  const authHeader = req.headers.get('Authorization');
  let isAuthorized = false;
  let supabase;
  
  try {
    // Verifica se a solicitação veio do cron interno do Supabase
    const isCronRequest = req.headers.get('X-Supabase-Cron') === 'true';
    
    if (isCronRequest) {
      isAuthorized = true;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      supabase = createSupabaseAdmin();
      
      // Verificar se o token é válido e se o usuário tem permissão de admin
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError) {
        throw new Error(`Erro de autenticação: ${authError.message}`);
      }
      
      if (user) {
        // Verificar se o usuário tem função de administrador
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (!roleError && roleData && roleData.role === 'admin') {
          isAuthorized = true;
        }
      }
    }
    
    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          error: "Não autorizado",
          message: "Apenas administradores podem executar backups manualmente"
        }),
        {
          headers: securityHeaders,
          status: 401,
        }
      );
    }
    
    // Inicializar cliente Supabase se ainda não foi feito
    if (!supabase) {
      supabase = createSupabaseAdmin();
    }
    
    // Realizar backup de todas as tabelas configuradas
    const timestamp = getFormattedTimestamp();
    const backupData = {};
    
    for (const table of TABLES_TO_BACKUP) {
      try {
        backupData[table] = await backupTable(supabase, table);
        console.log(`Backup da tabela ${table} concluído com sucesso`);
      } catch (error) {
        console.error(`Erro no backup da tabela ${table}:`, error);
        // Continue com as outras tabelas mesmo se uma falhar
      }
    }
    
    // Salvar o backup
    const fileName = await storeBackup(supabase, backupData, timestamp);
    const backupSize = JSON.stringify(backupData).length;
    
    // Verificar se a tabela de logs de backup existe, senão criar
    try {
      await logBackupOperation(supabase, fileName, TABLES_TO_BACKUP, backupSize);
    } catch (error) {
      console.error("Erro ao registrar log de backup:", error);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Backup concluído com sucesso",
        details: {
          fileName,
          timestamp,
          tablesBackedUp: TABLES_TO_BACKUP,
          sizeInBytes: backupSize
        }
      }),
      {
        headers: securityHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro durante o backup:", error);
    
    return new Response(
      JSON.stringify({
        error: "Falha no backup",
        message: error.message
      }),
      {
        headers: securityHeaders,
        status: 500,
      }
    );
  }
});
