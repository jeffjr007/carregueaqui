
-- Tabela para registrar logs de backup
CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  tables_included TEXT[] NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'success',
  error_message TEXT
);

-- Comentários para documentação
COMMENT ON TABLE public.backup_logs IS 'Registros de operações de backup do banco de dados';
COMMENT ON COLUMN public.backup_logs.file_name IS 'Nome do arquivo de backup gerado';
COMMENT ON COLUMN public.backup_logs.tables_included IS 'Lista de tabelas incluídas no backup';
COMMENT ON COLUMN public.backup_logs.file_size_bytes IS 'Tamanho do arquivo de backup em bytes';
COMMENT ON COLUMN public.backup_logs.created_at IS 'Data e hora da criação do backup';
COMMENT ON COLUMN public.backup_logs.status IS 'Status da operação de backup (success/error)';
COMMENT ON COLUMN public.backup_logs.error_message IS 'Mensagem de erro em caso de falha';

-- Políticas de segurança da tabela
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- Apenas administradores podem visualizar os logs de backup
CREATE POLICY "Somente administradores podem ver logs de backup" ON public.backup_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Apenas a função de backup pode inserir logs
CREATE POLICY "Apenas sistema pode inserir logs de backup" ON public.backup_logs
  FOR INSERT
  WITH CHECK (
    -- Permitir inserções da função de backup ou administradores
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Função para configurar job de backup diário
-- Requer extensões pg_cron e pg_net
SELECT cron.schedule(
  'daily-database-backup',
  '0 3 * * *', -- Todos os dias às 03:00 UTC
  $$
  SELECT
    net.http_post(
      url:='https://pmegtynmywosnjtlieyf.supabase.co/functions/v1/database-backup',
      headers:='{"Content-Type": "application/json", "X-Supabase-Cron": "true"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Função para configurar job de backup semanal completo
SELECT cron.schedule(
  'weekly-complete-backup',
  '0 5 * * 0', -- Todos os domingos às 05:00 UTC
  $$
  SELECT
    net.http_post(
      url:='https://pmegtynmywosnjtlieyf.supabase.co/functions/v1/database-backup',
      headers:='{"Content-Type": "application/json", "X-Supabase-Cron": "true"}'::jsonb, 
      body:='{"type": "full"}'::jsonb
    ) as request_id;
  $$
);
