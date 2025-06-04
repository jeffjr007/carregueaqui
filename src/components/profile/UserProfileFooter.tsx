import { Button } from "@/components/ui/button";
import { FileText, Shield, History, LogOut, ChevronRight, Info, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { isCurrentUserAdmin } from "@/utils/adminUtils";
import { Link } from "react-router-dom";

interface UserProfileFooterProps {
  onLogout: () => Promise<void>;
  onAdminPanel?: () => void;
}

export const UserProfileFooter = ({ onLogout, onAdminPanel }: UserProfileFooterProps) => {
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      const adminStatus = await isCurrentUserAdmin();
      setIsAdmin(adminStatus);
    };
    
    checkAdminStatus();
  }, []);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível desconectar. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implementar lógica real de exclusão de conta
    console.log("Botão Excluir Conta clicado");
    toast({
      title: "Excluir Conta",
      description: "Funcionalidade de exclusão de conta a ser implementada.",
    });
  };

  return (
    <div className="mt-6 space-y-1 pb-0">
      <Button
        variant="ghost"
        className="w-full justify-between py-3 px-3 h-auto"
        asChild
      >
        <Link to="/termos">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-3" />
            <span>Termos de Uso</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-between py-3 px-3 h-auto"
        asChild
      >
        <Link to="/privacidade">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-3" />
            <span>Política de Privacidade</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-between py-3 px-3 h-auto"
        asChild
      >
        <Link to="/sobre">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-3" />
            <span>Sobre o Aplicativo</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-between py-3 px-3 h-auto"
        // TODO: Implementar navegação ou modal para Histórico de Pagamentos
        onClick={() => {
          console.log("Botão Histórico de Pagamentos clicado");
          toast({
            title: "Histórico de Pagamentos",
            description: "Funcionalidade a ser implementada.",
          });
        }}
      >
        <div className="flex items-center">
          <History className="h-4 w-4 mr-3" />
          <span>Histórico de Pagamentos</span>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </Button>
      
      <div className="pt-4 space-y-2">
        <Button
          variant="destructive"
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>Saindo...</>
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair da Conta</span>
            </>
          )}
        </Button>

        {/* Novo botão Excluir Conta */}
        <Button
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50"
          onClick={handleDeleteAccount}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Excluir Conta</span>
        </Button>
        
        {isAdmin && onAdminPanel && (
          <Button
            variant="outline"
            className="w-full border-purple-500 text-purple-500 hover:bg-purple-50"
            onClick={onAdminPanel}
          >
            <Shield className="h-4 w-4 mr-2" />
            <span>Painel de Administrador</span>
          </Button>
        )}
      </div>
    </div>
  );
};
