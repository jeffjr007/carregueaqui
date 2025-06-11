# ⚡ CarregueAqui

**CarregueAqui** é um aplicativo **web e mobile** desenvolvido como **Trabalho de Conclusão de Curso (TCC)** do curso Técnico em Desenvolvimento de Sistemas no **SENAI/SE**. O projeto tem como objetivo facilitar a vida de motoristas de veículos elétricos, permitindo que encontrem e gerenciem pontos de carregamento com praticidade e eficiência.

---

## ✅ Validação Técnica

Este projeto foi analisado por um avaliador técnico, que confirmou:

- Total alinhamento entre as tecnologias descritas e as realmente utilizadas.
- Estrutura de pastas bem organizada, com separação clara entre componentes, páginas, serviços, tipos e testes.
- Implementação fiel de funcionalidades modernas, como:
  - Mapas interativos com **Mapbox GL**
  - Autenticação segura via **Supabase Auth**
  - Integração em tempo real com banco de dados **PostgreSQL**
  - Suporte **mobile Android** com **React Native** e **Capacitor**
  - **Progressive Web App (PWA)** com `vite-plugin-pwa`
  - Suporte à **internacionalização (i18n)**

---

## 🧠 Tecnologias Utilizadas

### Web
- React + TypeScript
- Vite
- Tailwind CSS + Shadcn/UI
- Mapbox GL JS
- React Router
- TanStack Query
- i18next

### Backend
- Supabase (PostgreSQL, Auth, Edge Functions, Storage)

### Mobile
- React Native + Capacitor
- Android (via `@capacitor/android`)

### Outros Recursos
- i18n (internacionalização multilíngue)
- Testes automatizados (diretório `tests`)
- Arquitetura baseada em componentes
- Suporte a PWA
- Responsividade mobile

---

## 📱 Funcionalidades

- 🔍 Localização de estações de carregamento via mapa interativo  
- 🔐 Autenticação e gerenciamento de conta  
- 🚗 Cadastro e gerenciamento de veículos  
- ⭐ Favoritar estações  
- 🕓 Histórico de carregamentos  
- 🌐 Suporte multilíngue (i18n)  
- 📱 Acesso via navegador ou app Android  

---

## 💡 Funcionalidades Futuras

- 💳 Pagamento por carregamento
- 📅 Reserva antecipada de estações
- 👥 Avaliações e comentários entre usuários
- 🔔 Notificações personalizadas

---

## 👨‍💻 Desenvolvedor

Projeto desenvolvido por **Jeferson Júnior** como parte do **TCC do curso Técnico em Desenvolvimento de Sistemas** no **SENAI/SE**, sob orientação do professor **Neilton**.

---

## 🚀 Executando Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/carregueaqui.git
cd carregueaqui

# Instale as dependências
npm install

# Rode a aplicação
npm run dev
```

### 📱 Versão Mobile

Para executar a versão mobile, após instalar as dependências:

```bash
# Adiciona a plataforma Android
npx cap add android

# Sincroniza as alterações com o projeto Android
npx cap sync android

# Abre o projeto no Android Studio
npx cap open android
```

## Development

The development server will start at `