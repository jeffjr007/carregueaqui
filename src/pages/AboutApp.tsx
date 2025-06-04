import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AvatarCircles } from "@/components/magicui/avatar-circles";

export default function AboutApp() {
  const navigate = useNavigate();

  const avatarUrls = [
    {
      imageUrl: "https://cdn.simpleicons.org/github/black",
      profileUrl: "https://github.com/jeffjr007",
    },
    {
      imageUrl: "https://cdn.simpleicons.org/gmail/red",
      profileUrl: "mailto:jeffjr007z@gmail.com",
    },
    {
      imageUrl: "https://img.icons8.com/color/48/000000/linkedin.png",
      profileUrl: "https://www.linkedin.com/in/jeferson-junior-as",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Sobre o Aplicativo</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            O CarregueAqui é um aplicativo criado para facilitar o dia a dia de usuários de veículos elétricos, permitindo localizar, visualizar e gerenciar pontos de carregamento de forma simples, rápida e eficiente.
          </p>

          <p className="text-gray-700 mb-4">
            Desenvolvido por Jeferson Junior, o aplicativo faz parte do Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas no SENAI-SE.
          </p>

          <p className="text-gray-700 mb-4">
            A plataforma está disponível nas versões web e mobile, e foi construída utilizando tecnologias modernas como:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Frontend: React, TypeScript, Vite, Tailwind CSS e Mapbox GL;</li>
            <li>Mobile: React Native;</li>
            <li>Backend: Supabase (banco de dados PostgreSQL, autenticação, storage e Edge Functions).</li>
          </ul>

          <p className="text-gray-700 mb-4">
            Com foco em acessibilidade, usabilidade e sustentabilidade, o CarregueAqui busca contribuir para a evolução da mobilidade elétrica no Brasil, mesmo sendo um projeto acadêmico em fase de testes.
          </p>

          <h2 className="text-xl font-semibold mb-2">Contato</h2>
          <p className="text-gray-700 mb-4">
            Caso tenha dúvidas ou sugestões, entre em contato:
          </p>
          
          <div className="flex items-center gap-4">
            <p className="text-gray-700 mb-0">
              📧 jeffjr007z@gmail.com
            </p>
            <AvatarCircles avatarUrls={avatarUrls} />
          </div>

        </div>
      </Card>
    </div>
  );
} 