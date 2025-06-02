
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AccessDeniedProps {
  message: string;
  onBack?: () => void;
}

export const AccessDenied = ({ message, onBack }: AccessDeniedProps) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
          <CardDescription>
            Esta área é restrita a administradores. Você não tem permissão para acessar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            {message || "Se você acredita que deveria ter acesso, entre em contato com um administrador."}
          </p>
          <Button variant="outline" onClick={onBack || (() => window.history.back())}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
