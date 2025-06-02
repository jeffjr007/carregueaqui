
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Question {
  user: string;
  question: string;
  answer?: string;
  date: string;
}

interface StationQuestionsProps {
  questions: Question[];
}

export const StationQuestions = ({ questions }: StationQuestionsProps) => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [question, setQuestion] = useState("");
  const { toast } = useToast();

  const handleAskQuestion = () => {
    if (question.trim()) {
      toast({
        title: "Pergunta Enviada",
        description: "Sua pergunta será respondida em breve.",
      });
      setQuestion("");
      setShowQuestionForm(false);
    }
  };

  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold mb-2 flex items-center">
        <MessageSquare className="w-4 h-4 mr-2" /> Perguntas
      </h3>
      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={index} className="bg-secondary/10 p-2 rounded-lg">
            <p className="text-sm font-medium">{q.user}: {q.question}</p>
            {q.answer && (
              <p className="text-sm text-muted-foreground mt-1">R: {q.answer}</p>
            )}
            <span className="text-xs text-muted-foreground">{q.date}</span>
          </div>
        ))}
        {!showQuestionForm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQuestionForm(true)}
            className="w-full text-xs md:text-sm"
          >
            Fazer uma pergunta
          </Button>
        ) : (
          <div className="space-y-2">
            <textarea
              className="w-full p-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua pergunta..."
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuestionForm(false)}
                className="text-xs md:text-sm"
              >
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleAskQuestion}
                className="text-xs md:text-sm"
              >
                Enviar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
