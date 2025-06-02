import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const SuggestStationButton = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    type: "AC",
    image_url: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await (supabase as any).from("suggested_stations").insert([
      {
        name: form.name,
        address: form.address,
        type: form.type,
        image_url: form.image_url || null,
      }
    ]);
    setLoading(false);
    if (error) {
      toast({
        title: "Erro ao enviar sugestão",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }
    setOpen(false);
    setForm({ name: "", address: "", type: "AC", image_url: "" });
    toast({
      title: "Solicitação Enviada",
      description: "Sua sugestão de estação será avaliada pelos administradores.",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center text-xs md:text-sm"
        onClick={() => setOpen(true)}
        size="sm"
      >
        <Plus className="w-4 h-4 mr-1 md:mr-2" />
        Sugerir Nova Estação
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">Sugerir Nova Estação</h2>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
              >
                <option value="AC">AC</option>
                <option value="DC">DC</option>
                <option value="DC/AC">DC/AC</option>
              </select>
            </div>
            <div>
              <Label htmlFor="image_url">URL da Imagem (opcional)</Label>
              <Input
                id="image_url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Sugestão"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
