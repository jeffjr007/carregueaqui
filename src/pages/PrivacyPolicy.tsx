import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Política de Privacidade – CarregueAqui</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">Última atualização: 03/06/2025</p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">Sua privacidade é importante para nós.</h2>
          <p className="text-gray-700 mb-4">
            Esta Política de Privacidade explica como os dados dos usuários são coletados, usados e protegidos ao utilizar o aplicativo CarregueAqui.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">1. Sobre o CarregueAqui</h2>
          <p className="text-gray-700 mb-4">
            O CarregueAqui é um aplicativo desenvolvido por Jeferson Junior como parte do Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas no SENAI-SE.
            Seu objetivo é ajudar os usuários a localizar e gerenciar pontos de carregamento de veículos elétricos.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">2. Dados Coletados</h2>
          <p className="text-gray-700 mb-4">
            Ao utilizar o aplicativo, podemos coletar as seguintes informações:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Dados de cadastro: nome, e-mail, senha e informações do veículo;</li>
            <li>Dados de uso: histórico de carregamentos, favoritos e interações com o mapa;</li>
            <li>Localização (se autorizada): para exibir pontos de carregamento próximos.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-2 text-green-700">3. Finalidade da Coleta</h2>
          <p className="text-gray-700 mb-4">
            Os dados são coletados com os seguintes objetivos:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Permitir a criação e autenticação de contas;</li>
            <li>Exibir estações de carregamento próximas;</li>
            <li>Salvar preferências e histórico do usuário;</li>
            <li>Melhorar a experiência de navegação e usabilidade.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-2 text-green-700">4. Compartilhamento de Dados</h2>
          <p className="text-gray-700 mb-2">
            Nenhum dado é compartilhado com terceiros.
          </p>
          <p className="text-gray-700 mb-4">
            Todas as informações são utilizadas exclusivamente no funcionamento interno do aplicativo.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">5. Armazenamento e Segurança</h2>
          <p className="text-gray-700 mb-2">
            Os dados são armazenados com segurança na plataforma Supabase, que oferece criptografia e controle de acesso.
          </p>
          <p className="text-gray-700 mb-4">
            O aplicativo segue boas práticas para proteção contra acessos não autorizados e vazamento de informações.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">6. Direitos do Usuário</h2>
          <p className="text-gray-700 mb-4">
            Você tem o direito de:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Acessar e editar suas informações pessoais;</li>
            <li>Solicitar a exclusão da sua conta e dos seus dados;</li>
            <li>Revogar permissões, como o uso da localização, a qualquer momento.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-2 text-green-700">7. Retenção de Dados</h2>
          <p className="text-gray-700 mb-4">
            Os dados do usuário são mantidos enquanto a conta estiver ativa. Caso a conta seja excluída, os dados são removidos permanentemente dos nossos sistemas.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">8. Alterações nesta Política</h2>
          <p className="text-gray-700 mb-4">
            Esta política pode ser atualizada a qualquer momento para refletir melhorias ou mudanças no aplicativo.
            Recomendamos revisar esta página periodicamente. O uso contínuo do aplicativo implica concordância com a versão mais recente da política.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-green-700">9. Contato</h2>
          <p className="text-gray-700 mb-2">
            Em caso de dúvidas ou solicitações relacionadas à privacidade dos seus dados, entre em contato:
          </p>
          <p className="text-green-700">
            📧 jeffjr007z@gmail.com
          </p>
        </div>
      </Card>
    </div>
  );
} 