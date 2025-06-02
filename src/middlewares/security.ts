
// Middleware de segurança para garantir HTTPS e adicionar cabeçalhos de segurança

/**
 * Função para adicionar cabeçalhos de segurança em todas as respostas
 * e redirecionar HTTP para HTTPS em produção
 */
export function setupSecurityMiddleware(server: any) {
  // Apenas em ambiente de produção
  if (process.env.NODE_ENV === 'production') {
    // Middleware para redirecionar HTTP para HTTPS
    server.middlewares.use((req: any, res: any, next: () => void) => {
      // Verificar se é HTTP
      const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure;
      
      // Se não for HTTPS e não for localhost, redirecionar para HTTPS
      if (!isHttps && req.hostname !== 'localhost' && !req.hostname.includes('127.0.0.1')) {
        const redirectUrl = `https://${req.headers.host}${req.url}`;
        res.writeHead(301, { Location: redirectUrl });
        res.end();
        return;
      }
      
      // Adicionar cabeçalhos de segurança em todas as respostas
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
      
      // CSP adequado para aplicação React com Mapbox
      res.setHeader('Content-Security-Policy', `
        default-src 'self';
        connect-src 'self' https://*.mapbox.com https://*.supabase.co https://sentry.io;
        img-src 'self' https://*.mapbox.com data:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.mapbox.com https://cdn.gpteng.co;
        style-src 'self' 'unsafe-inline' https://*.mapbox.com;
        font-src 'self' data:;
        frame-src 'self';
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim());
      
      next();
    });
  }
}

/**
 * Verifica recursos para problemas de conteúdo misto
 * Ajuda a identificar chamadas HTTP em páginas HTTPS
 */
export function checkMixedContent() {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // Adicionar detector de conteúdo misto no ambiente do cliente
    console.log('🔒 Verificando conteúdo misto em modo HTTPS');
    
    // Capturar solicitações de recursos não HTTPS
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function(tagName: string) {
      const element = originalCreateElement(tagName);
      
      if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'link' || tagName.toLowerCase() === 'img') {
        const originalSetAttribute = element.setAttribute.bind(element);
        element.setAttribute = function(name: string, value: string) {
          if ((name === 'src' || name === 'href') && 
              value && 
              value.startsWith('http:') && 
              !value.includes('localhost') && 
              !value.includes('127.0.0.1')) {
            console.warn('⚠️ Conteúdo misto detectado:', value);
          }
          return originalSetAttribute(name, value);
        };
      }
      
      return element;
    };
  }
}

export function createCSPMeta(): HTMLMetaElement {
  const meta = document.createElement('meta');
  meta.setAttribute('http-equiv', 'Content-Security-Policy');
  meta.setAttribute('content', `
    default-src 'self';
    connect-src 'self' https://*.mapbox.com https://*.supabase.co https://sentry.io;
    img-src 'self' https://*.mapbox.com data:;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.mapbox.com https://cdn.gpteng.co;
    style-src 'self' 'unsafe-inline' https://*.mapbox.com;
    font-src 'self' data:;
    frame-src 'self';
    worker-src 'self' blob:;
  `.replace(/\s+/g, ' ').trim());
  return meta;
}
