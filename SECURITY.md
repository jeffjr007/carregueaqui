
# Configurações de Segurança do Aplicativo

## HTTPS e Cabeçalhos de Segurança

Este aplicativo foi configurado para garantir comunicações seguras através de HTTPS. Abaixo estão as principais características de segurança implementadas:

### Redirecionamento HTTP para HTTPS

- Todo tráfego HTTP é automaticamente redirecionado para HTTPS em ambiente de produção.
- A aplicação verifica o protocolo atual e força a atualização para HTTPS quando necessário.

### Cabeçalhos HTTP de Segurança

Os seguintes cabeçalhos de segurança foram implementados:

1. **Strict-Transport-Security (HSTS)**
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - Força o navegador a usar HTTPS por 2 anos, incluindo subdomínios.

2. **Content-Security-Policy (CSP)**
   - Restringe fontes de conteúdo para evitar ataques XSS.
   - Configura políticas específicas para scripts, estilos, imagens e conexões.

3. **X-Content-Type-Options**
   - `X-Content-Type-Options: nosniff`
   - Impede o navegador de tentar adivinhar o tipo MIME de recursos.

4. **X-Frame-Options**
   - `X-Frame-Options: DENY`
   - Previne que o site seja aberto em frames, evitando clickjacking.

5. **Referrer-Policy**
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - Limita as informações do referenciador enviadas em requisições.

6. **Permissions-Policy**
   - Controla quais APIs do navegador podem ser usadas pela aplicação.

### Prevenção de Conteúdo Misto

- Implementamos detecção de conteúdo misto para alertar sobre recursos HTTP sendo carregados em páginas HTTPS.
- Todas as chamadas para APIs externas (como Mapbox) são forçadas a usar HTTPS.

## Configuração de HTTPS para Desenvolvimento

Para testar com HTTPS em ambiente local:

1. Instale o mkcert para criar certificados localmente confiáveis:
   ```
   npm install -g mkcert
   ```

2. Gere certificados para localhost:
   ```
   mkcert -install
   mkcert localhost 127.0.0.1 ::1
   ```

3. Renomeie os certificados para `localhost.pem` e `localhost-key.pem`

4. Execute a aplicação com HTTPS habilitado:
   ```
   HTTPS=true npm run dev
   ```

## Configuração de HTTPS para Produção

Em produção, recomendamos:

1. Usar um servidor de frontend com suporte a HTTPS (Netlify, Vercel, etc.)
2. Ou configurar um proxy reverso como Nginx com Let's Encrypt para SSL/TLS
3. Garantir que o Supabase esteja configurado para aceitar apenas conexões HTTPS

## Testes de Segurança

Para verificar a conformidade com as melhores práticas de segurança, recomendamos executar regularmente:

1. [Mozilla Observatory](https://observatory.mozilla.org/)
2. [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
3. [Security Headers](https://securityheaders.com/)

## Contato de Segurança

Se você identificar problemas de segurança, por favor reporte imediatamente ao administrador do sistema.
