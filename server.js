
#!/usr/bin/env node
const { createServer } = require('vite');
const path = require('path');
const fs = require('fs');

async function startServer() {
  try {
    // Determinar se devemos usar HTTPS
    const useHttps = process.env.HTTPS === 'true';

    // Configurar HTTPS se necessário
    const httpsOptions = useHttps ? {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    } : undefined;
    
    // Criar servidor Vite
    const server = await createServer({
      // Configurações Vite base
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      server: {
        https: httpsOptions,
        port: parseInt(process.env.PORT || '8080'),
        host: '::',
      },
    });

    // Importar e usar o middleware de segurança
    // Após inicializar o servidor para garantir que o middleware esteja disponível
    import('./dist/middlewares/security.js')
      .then(({ setupSecurityMiddleware }) => {
        setupSecurityMiddleware(server);
        console.log('✅ Middleware de segurança configurado com sucesso');
      })
      .catch(err => {
        console.warn('⚠️ Não foi possível carregar o middleware de segurança:', err);
      });

    // Iniciar o servidor
    await server.listen();
    
    const info = server.config.logger.info;
    
    info(`\n  🚀 Servidor rodando em ${useHttps ? 'HTTPS' : 'HTTP'}`);
    info(`  Modo: ${server.config.mode}`);
    
    server.printUrls();
    
    if (!useHttps && process.env.NODE_ENV === 'production') {
      info('\n  ⚠️ AVISO: Rodando em produção sem HTTPS. Isso não é recomendado!');
      info('  Configure HTTPS=true ou use um proxy reverso com HTTPS\n');
    }

  } catch (e) {
    console.error('Erro ao iniciar o servidor:', e);
    process.exit(1);
  }
}

startServer();
