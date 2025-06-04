import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { AvatarCircles } from "./magicui/avatar-circles"

interface ProjectDetailsProps {
  onClose: () => void;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
}

export function ProjectDetails({
  onClose,
  githubUrl,
  linkedinUrl,
  email,
}: ProjectDetailsProps) {
  const avatarUrls = [
    {
      imageUrl: "https://cdn.simpleicons.org/github/black",
      profileUrl: githubUrl,
    },
    {
      imageUrl: "https://cdn.simpleicons.org/gmail/red",
      profileUrl: `mailto:${email}`,
    },
    {
      imageUrl: "https://img.icons8.com/color/48/000000/linkedin.png",
      profileUrl: linkedinUrl,
    },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl my-4 sm:my-8"
      >
        <Card className="relative">
          {/* Close button - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg hover:shadow-xl z-10 hidden sm:flex"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Close button - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 left-2 bg-white rounded-full shadow-lg hover:shadow-xl z-10 flex sm:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <CardHeader className="px-6 py-4 sm:pt-6 pt-12">
            <CardTitle className="text-xl sm:text-2xl text-center sm:text-left">Sobre o Projeto e Desenvolvedor</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 py-4 prose max-w-none">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Sobre o Projeto</h2>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              O CarregueAqui é um aplicativo criado para facilitar o dia a dia de usuários de veículos elétricos, permitindo localizar, visualizar e gerenciar pontos de carregamento de forma simples, rápida e eficiente. Atualmente, os dados de carregadores disponíveis são referentes aos estados de Sergipe e Bahia.
            </p>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              A plataforma está disponível nas versões web e mobile, e foi construída utilizando tecnologias modernas como:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 text-sm sm:text-base">
              <li>Frontend: React, TypeScript, Vite, Tailwind CSS e Mapbox GL;</li>
              <li>Mobile: React Native;</li>
              <li>Backend: Supabase (banco de dados PostgreSQL, autenticação, storage e Edge Functions).</li>
            </ul>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Com foco em acessibilidade, usabilidade e sustentabilidade, o CarregueAqui busca contribuir para a evolução da mobilidade elétrica no Brasil, mesmo sendo um projeto acadêmico em fase de testes. Em breve, mais estados serão adicionados à base de dados de carregadores.
            </p>

            <h2 className="text-lg sm:text-xl font-semibold mb-2 mt-6">Sobre o Desenvolvedor</h2>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              O CarregueAqui foi desenvolvido por <span className="text-green-600 font-semibold">Jeferson Junior</span> como parte do Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas no SENAI-SE.
            </p>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Durante o desenvolvimento, foram aplicadas boas práticas de segurança, acessibilidade e experiência do usuário, reforçando o compromisso com a qualidade e a responsabilidade técnica do projeto.
            </p>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Este projeto representa um marco no aprendizado e crescimento profissional, aplicando conhecimentos adquiridos para resolver um problema real e contribuir para a área de mobilidade elétrica.
            </p>

            <h2 className="text-lg sm:text-xl font-semibold mb-2 mt-6">Contato do Desenvolvedor</h2>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Caso tenha dúvidas ou sugestões, entre em contato:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-gray-700 mb-0 text-sm sm:text-base">
                📧 {email}
              </p>
              <AvatarCircles avatarUrls={avatarUrls} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 