
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { checkMixedContent } from "./middlewares/security";

// Verificar conteúdo misto em modo HTTPS
checkMixedContent();

// Verificar se estamos sendo carregados via HTTP em produção
if (
  typeof window !== 'undefined' && 
  window.location.protocol === 'http:' && 
  !window.location.hostname.includes('localhost') && 
  !window.location.hostname.includes('127.0.0.1')
) {
  window.location.href = window.location.href.replace('http:', 'https:');
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
