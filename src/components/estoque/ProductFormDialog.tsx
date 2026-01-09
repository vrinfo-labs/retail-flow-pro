import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { useCreateProduct, useUpdateProduct, useCategories, useSuppliers, Product } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  codigo_barras: z.string().optional(),
  categoria_id: z.string().optional(),
  supplier_id: z.string().optional(),
  preco_custo: z.coerce.number().min(0, "Custo deve ser positivo"),
  preco_venda: z.coerce.number().min(0.01, "Preço de venda é obrigatório"),
  estoque: z.coerce.number().int("Estoque deve ser inteiro"),
  estoque_minimo: z.coerce.number().int("Estoque mínimo deve ser inteiro"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFormDialog({ product, open, onOpenChange }: ProductFormDialogProps) {
  const { data: categories } = useCategories();
  const { data: suppliers } = useSuppliers();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: '',
      codigo_barras: '',
      preco_custo: 0,
      preco_venda: 0,
      estoque: 0,
      estoque_minimo: 10,
    }
  });

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        nome: '',
        codigo_barras: '',
        categoria_id: undefined,
        supplier_id: undefined,
        preco_custo: 0,
        preco_venda: 0,
        estoque: 0,
        estoque_minimo: 10,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ ...data, id: product.id });
      } else {
        await createProduct.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;
  const supplierOptions = suppliers?.map(s => ({ value: s.id, label: s.nome })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Nome e Codigo de Barras */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input id="nome" {...register("nome")} placeholder="Ex: Arroz Integral 5kg" />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="codigo_barras">Código de Barras</Label>
            <Input id="codigo_barras" {...register("codigo_barras")} placeholder="7891234567890" />
          </div>

          {/* Categoria e Fornecedor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria_id">Categoria</Label>
              <Controller
                name="categoria_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Fornecedor</Label>
              <Controller
                name="supplier_id"
                control={control}
                render={({ field }) => <Combobox options={supplierOptions} value={field.value} onChange={field.onChange} placeholder="Selecione..." />}
              />
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
              <Input id="preco_custo" type="number" step="0.01" {...register("preco_custo")} placeholder="0.00" />
              {errors.preco_custo && <p className="text-sm text-destructive">{errors.preco_custo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco_venda">Preço de Venda (R$) *</Label>
              <Input id="preco_venda" type="number" step="0.01" {...register("preco_venda")} placeholder="0.00" />
              {errors.preco_venda && <p className="text-sm text-destructive">{errors.preco_venda.message}</p>}
            </div>
          </div>

          {/* Estoque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque Inicial</Label>
              <Input id="estoque" type="number" {...register("estoque")} placeholder="0" />
               {errors.estoque && <p className="text-sm text-destructive">{errors.estoque.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input id="estoque_minimo" type="number" {...register("estoque_minimo")} placeholder="10" />
              {errors.estoque_minimo && <p className="text-sm text-destructive">{errors.estoque_minimo.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {product ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
