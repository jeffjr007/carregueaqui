
# Documentação de Backup e Recuperação de Dados

Este documento descreve as estratégias de backup e os procedimentos de recuperação implementados para garantir a resiliência de dados e a continuidade de negócio da aplicação.

## Estratégia de Backup

### Backups Automatizados

1. **Backups Diários do Banco de Dados**
   - Frequência: Diário às 03:00 UTC
   - Retenção: 7 dias
   - Conteúdo: Todas as tabelas do banco de dados
   - Armazenamento: Bucket seguro no Supabase Storage (`database_backups`)

2. **Backups Semanais Completos**
   - Frequência: Domingo às 05:00 UTC
   - Retenção: 4 semanas
   - Conteúdo: Banco de dados completo + arquivos de usuários (avatares, etc.)
   - Armazenamento: Bucket seguro no Supabase Storage e cópia externa

3. **Snapshots do Supabase**
   - O Supabase mantém snapshots automáticos do projeto de acordo com o plano contratado
   - Recomenda-se manter o plano que inclui backups diários por pelo menos 7 dias

### Backups Manuais

Administradores podem iniciar backups manuais a qualquer momento através do endpoint:
```
POST https://pmegtynmywosnjtlieyf.supabase.co/functions/v1/database-backup
```

Este endpoint requer autenticação com um token JWT de um usuário com função de administrador.

## Procedimentos de Recuperação

### Recuperação de Tabelas Específicas

1. Acesse o console de administração
2. Navegue até a seção "Backup e Recuperação"
3. Selecione o backup desejado na lista
4. Escolha a opção "Restaurar tabelas específicas"
5. Selecione as tabelas a serem restauradas
6. Confirme a operação

**Importante**: A restauração de tabelas individuais pode causar inconsistências se houver relações entre elas. Certifique-se de restaurar todas as tabelas relacionadas em conjunto.

### Recuperação Completa

Em caso de falha catastrófica ou corrupção de dados:

1. Configure um novo projeto Supabase (se necessário)
2. Acesse o backup mais recente do bucket `database_backups`
3. Use a ferramenta de linha de comando do Supabase para restaurar o banco de dados:

```bash
# Baixar o arquivo de backup
supabase storage download database_backups/backup-yyyy-MM-dd-THH-mm-ss.json

# Restaurar o banco de dados
supabase db restore --db-url=$SUPABASE_DB_URL backup-yyyy-MM-dd-THH-mm-ss.json
```

4. Verifique a integridade dos dados após a restauração
5. Reestabeleça quaisquer conexões ou configurações adicionais necessárias

## Monitoramento de Backups

Todos os backups são registrados na tabela `backup_logs` com as seguintes informações:
- Nome do arquivo
- Data e hora da criação
- Tabelas incluídas
- Tamanho do backup
- Status (sucesso/falha)

É recomendado verificar regularmente o status dos backups e realizar testes de recuperação periódicos para garantir que os procedimentos funcionem conforme esperado.

## Considerações sobre Dados Offline

A aplicação implementa um sistema de armazenamento local usando IndexedDB que permite aos usuários continuar usando funções básicas mesmo offline. Estes dados são sincronizados automaticamente quando a conexão é restabelecida.

Este mecanismo não substitui o sistema de backup, mas complementa a estratégia de resiliência de dados.

## Em Caso de Falhas

Se ocorrerem falhas no processo de backup ou dúvidas sobre os procedimentos de recuperação, entre em contato com a equipe técnica imediatamente pelo email suporte@aplicativo.com ou pelo canal de emergência no Slack.
