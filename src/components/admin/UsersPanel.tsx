
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface UsersPanelProps {
  adminMessage: string;
}

export const UsersPanel = ({ adminMessage }: UsersPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Esta funcionalidade está em desenvolvimento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-400" />
          <p className="text-sm text-gray-500">
            O gerenciamento de usuários estará disponível em breve.
          </p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          {adminMessage || "Mensagem de status do administrador aparecerá aqui."}
        </p>
      </CardContent>
    </Card>
  );
};
