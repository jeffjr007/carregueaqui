import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Termos de Uso – CarregueAqui</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">Última atualização: 03/06/2025</p>

          <h2 className="text-xl font-semibold mb-2">Seja bem-vindo(a) ao CarregueAqui!</h2>
          <p className="text-gray-700 mb-4">
            Ao acessar e utilizar nosso aplicativo, você concorda com os termos e condições descritos abaixo. Leia com atenção.
          </p>

          <h2 className="text-xl font-semibold mb-2">1. Sobre o CarregueAqui</h2>
          <p className="text-gray-700 mb-4">
            O CarregueAqui é um aplicativo desenvolvido por Jeferson Junior, como parte do Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas no SENAI-SE.
            O objetivo da plataforma é ajudar usuários a localizar, visualizar e gerenciar pontos de carregamento para veículos elétricos de forma simples e eficiente.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. Uso do Aplicativo</h2>
          <p className="text-gray-700 mb-2">
            O uso do CarregueAqui é gratuito e destinado apenas para fins informativos e acadêmicos.
          </p>
          <p className="text-gray-700 mb-2">
            Ao utilizar o aplicativo, o usuário se compromete a fornecer informações corretas e verdadeiras ao se cadastrar e utilizar os serviços.
          </p>
          <p className="text-gray-700 mb-4">
            É proibido usar o app para atividades ilegais, ofensivas ou que violem direitos de terceiros.
          </p>

          <h2 className="text-xl font-semibold mb-2">3. Conta de Usuário</h2>
          <p className="text-gray-700 mb-2">
            Para acessar algumas funcionalidades, é necessário criar uma conta com e-mail e senha válidos.
          </p>
          <p className="text-gray-700 mb-2">
            O usuário é responsável por manter suas credenciais seguras e não deve compartilhá-las com terceiros.
          </p>
          <p className="text-gray-700 mb-4">
            O CarregueAqui reserva-se o direito de suspender ou excluir contas que violem estes termos.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Dados e Privacidade</h2>
          <p className="text-gray-700 mb-2">
            As informações fornecidas pelos usuários (como nome, e-mail, localização e dados do veículo) são utilizadas apenas para o funcionamento do aplicativo.
          </p>
          <p className="text-gray-700 mb-2">
            Nenhum dado é compartilhado com terceiros.
          </p>
          <p className="text-gray-700 mb-4">
            O aplicativo utiliza a plataforma Supabase, que garante segurança e criptografia no armazenamento e no tráfego de dados.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Limitações de Responsabilidade</h2>
          <p className="text-gray-700 mb-2">
            O CarregueAqui não se responsabiliza pela precisão, disponibilidade ou funcionamento das estações de carregamento listadas no mapa.
          </p>
          <p className="text-gray-700 mb-2">
            As informações podem ser fornecidas por terceiros e estão sujeitas a mudanças.
          </p>
          <p className="text-gray-700 mb-4">
            Como se trata de um projeto acadêmico, o aplicativo pode conter erros, instabilidades ou recursos em fase de testes.
          </p>

          <h2 className="text-xl font-semibold mb-2">6. Atualizações e Alterações</h2>
          <p className="text-gray-700 mb-4">
            Estes termos podem ser atualizados a qualquer momento para refletir melhorias ou mudanças no aplicativo.
            Ao continuar utilizando o CarregueAqui após alterações, o usuário concorda com os novos termos.
          </p>

          <h2 className="text-xl font-semibold mb-2">7. Contato</h2>
          <p className="text-gray-700 mb-2">
            Dúvidas, sugestões ou feedbacks podem ser enviados para:
          </p>
          <p className="text-blue-600">
            📧 jeffjr007z@gmail.com
          </p>
        </div>
      </Card>
    </div>
  );
} 