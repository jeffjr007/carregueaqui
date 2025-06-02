
import { useState } from "react";
import { CreditCard, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const PaymentMethods = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const { toast } = useToast();

  const handleAddCard = () => {
    // Validação simples
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    // Aqui você adicionaria a lógica para salvar o cartão no banco de dados
    toast({
      title: "Cartão adicionado",
      description: "Seu novo cartão foi adicionado com sucesso"
    });
    
    // Reset form
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setShowAddCard(false);
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <CreditCard className="mr-2 h-5 w-5" /> 
        <h3 className="font-medium">Métodos de Pagamento</h3>
      </div>
      
      <Card className="p-3 mb-3 border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-md h-8 w-8 flex items-center justify-center mr-3">
              VISA
            </div>
            <div>
              <h3 className="font-medium">Visa ****4589</h3>
              <p className="text-xs text-gray-500">Expira em 08/2026</p>
            </div>
          </div>
          <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Principal</div>
        </div>
      </Card>
      
      <Card className="p-3 mb-3 border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-orange-600 text-white rounded-md h-8 w-8 flex items-center justify-center mr-3">
              MC
            </div>
            <div>
              <h3 className="font-medium">Mastercard ****2371</h3>
              <p className="text-xs text-gray-500">Expira em 03/2025</p>
            </div>
          </div>
        </div>
      </Card>
      
      {showAddCard ? (
        <Card className="p-4 mb-3 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Adicionar Novo Cartão</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowAddCard(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input 
                id="cardNumber" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input 
                id="cardName" 
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="NOME SOBRENOME"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiryDate">Validade</Label>
                <Input 
                  id="expiryDate" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button 
              variant="default" 
              className="w-full mt-2"
              onClick={handleAddCard}
            >
              Adicionar Cartão
            </Button>
          </div>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setShowAddCard(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Método
        </Button>
      )}
    </div>
  );
};
