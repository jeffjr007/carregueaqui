import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { IconCloud } from "./magicui/icon-cloud"
import { SparklesText } from "./magicui/sparkles-text"

interface IntroductionScreenProps {
  onComplete: () => void
}

export function IntroductionScreen({ onComplete }: IntroductionScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const slugs = [
    "react",
    "typescript",
    "vite",
    "tailwindcss",
    "shadcn",
    "mapbox",
    "reactnative",
    "supabase",
    "postgresql"
  ];

  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );

  const steps = [
    {
      title: "Bem-vindo ao CarregueAqui",
      description: "O projeto CarregueAqui foi idealizado e desenvolvido por ",
      icon: "🚗",
      highlight: "Jeferson Junior",
      highlightDescription: " como parte do Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas no SENAI-SE."
    },
    {
      title: "Nossa Missão",
      description: "Com o crescimento do uso de veículos elétricos, surgiu a necessidade de facilitar o acesso a pontos de carregamento de forma prática, moderna e eficiente. O CarregueAqui foi criado como uma plataforma digital que permite aos usuários localizar, gerenciar e interagir com estações de carregamento elétrico.",
      icon: "⚡"
    },
    {
      title: "Tecnologias Utilizadas",
      description: "O projeto foi desenvolvido utilizando React, TypeScript, Vite, Tailwind CSS e Shadcn/UI no frontend web, com integração de mapas interativos via Mapbox GL. A versão mobile foi construída com React Native. Para o backend, foi utilizada a plataforma Supabase.",
      icon: "💻",
      showIconCloud: true
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl flex flex-col"
      >
        <Card className="flex flex-col h-full">
          <CardHeader className="px-6 py-4 flex-shrink-0">
            <div className="text-4xl mb-4">{steps[currentStep].icon}</div>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            {steps[currentStep].highlight ? (
              <div className="text-lg mt-2">
                {steps[currentStep].description}
                <SparklesText className="font-bold text-primary">
                  {steps[currentStep].highlight}
                </SparklesText>
                {steps[currentStep].highlightDescription}
              </div>
            ) : (
              <CardDescription className="text-lg mt-2">
                {steps[currentStep].description}
              </CardDescription>
            )}
          </CardHeader>

          {steps[currentStep].showIconCloud && (
            <CardContent className="px-6 py-4 flex-grow overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                 <IconCloud images={images} />
              </div>
            </CardContent>
          )}

          <CardContent className="px-6 py-4 flex-shrink-0">
             <div className="flex justify-end items-center mt-4">
                <div className="flex gap-2 mr-auto">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                      Voltar
                    </Button>
                  )}
                  <Button onClick={handleNext}>
                    {currentStep === steps.length - 1 ? "Começar" : "Próximo"}
                  </Button>
                </div>
              </div>
          </CardContent>

        </Card>
      </motion.div>
    </div>
  )
} 