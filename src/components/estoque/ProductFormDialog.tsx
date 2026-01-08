import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateProduct, useCategories } from "@/hooks/useProducts";

export function ProductFormDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    codigo_barras: "",
    categoria_id: "",
    preco_custo: "",
    preco_venda: "",
    estoque: "",
    estoque_minimo: "",
  });

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createProduct.mutateAsync({
      nome: formData.nome,
      codigo_barras: formData.codigo_barras || undefined,
      categoria_id: formData.categoria_id || undefined,
      preco_custo: parseFloat(formData.preco_custo) || 0,
      preco_venda: parseFloat(formData.preco_venda),
      estoque: parseInt(formData.estoque) || 0,
      estoque_minimo: parseInt(formData.estoque_minimo) || 10,
    });

    setFormData({
      nome: "",
      codigo_barras: "",
      categoria_id: "",
      preco_custo: "",
      preco_venda: "",
      estoque: "",
      estoque_minimo: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              placeholder="Ex: Arroz Integral 5kg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo_barras">Código de Barras</Label>
              <Input
                id="codigo_barras"
                value={formData.codigo_barras}
                onChange={(e) =>
                  setFormData({ ...formData, codigo_barras: e.target.value })
                }
                placeholder="7891234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoria_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
              <Input
                id="preco_custo"
                type="number"
                step="0.01"
                value={formData.preco_custo}
                onChange={(e) =>
                  setFormData({ ...formData, preco_custo: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco_venda">Preço de Venda (R$) *</Label>
              <Input
                id="preco_venda"
                type="number"
                step="0.01"
                value={formData.preco_venda}
                onChange={(e) =>
                  setFormData({ ...formData, preco_venda: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque Inicial</Label>
              <Input
                id="estoque"
                type="number"
                value={formData.estoque}
                onChange={(e) =>
                  setFormData({ ...formData, estoque: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                value={formData.estoque_minimo}
                onChange={(e) =>
                  setFormData({ ...formData, estoque_minimo: e.target.value })
                }
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={createProduct.isPending}
            >
              {createProduct.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
