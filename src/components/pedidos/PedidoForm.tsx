import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronsUpDown } from 'lucide-react';
import { useProducts, useCreateProduct, Product } from '@/hooks/useProducts';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  product: Product | null;
  supplier: string;
  reference: string;
  quantity: string;
  value: string;
}

interface PedidoFormProps {
  items: OrderItem[];
  setItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export function PedidoForm({ items, setItems }: PedidoFormProps) {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const createProduct = useCreateProduct();
  const [openCombobox, setOpenCombobox] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddItem = () => {
    setItems([...items, { id: crypto.randomUUID(), product: null, supplier: '', reference: '', quantity: '1', value: '0.00' }]);
  };

  const handleItemChange = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCreateProduct = async (productName: string) => {
    const newProduct = await createProduct.mutateAsync({ nome: productName, preco_venda: 0.01, preco_custo: 0, estoque: 0 });
    // After creating, you might want to automatically select it.
    // This part is complex because it would require finding the right item to update.
    // For now, let's just close the combobox.
    setOpenCombobox(null);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-muted-foreground px-2">
        <div className="col-span-3">Produto</div>
        <div className="col-span-2">Fornecedor</div>
        <div className="col-span-3">Referência</div>
        <div className="col-span-1 text-center">Qtd.</div>
        <div className="col-span-2 text-right">Valor</div>
        <div className="col-span-1"></div>
      </div>
      {items.map(item => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-3">
            <Popover open={openCombobox === item.id} onOpenChange={(isOpen) => setOpenCombobox(isOpen ? item.id : null)}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !item.product && "text-muted-foreground"
                  )}
                >
                  {item.product ? item.product.nome : "Selecione"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Procurar ou criar produto..." 
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCreateProduct(searchTerm)}
                      >
                        {`Criar "${searchTerm}"`}
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {products?.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => {
                            handleItemChange(item.id, 'product', product);
                            handleItemChange(item.id, 'value', product.preco_venda.toString());
                            setOpenCombobox(null);
                          }}
                        >
                          {product.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-2"><Input placeholder="Fornecedor" value={item.supplier} onChange={(e) => handleItemChange(item.id, 'supplier', e.target.value)} /></div>
          <div className="col-span-3"><Input placeholder="Referência" value={item.reference} onChange={(e) => handleItemChange(item.id, 'reference', e.target.value)} /></div>
          <div className="col-span-1"><Input type="number" placeholder="Qtd." value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className="text-center" /></div>
          <div className="col-span-2"><Input type="number" placeholder="Valor" value={item.value} onChange={(e) => handleItemChange(item.id, 'value', e.target.value)} className="text-right" /></div>
          <div className="col-span-1 text-right"><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </div>
      ))}
      <Button onClick={handleAddItem} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item
      </Button>
    </div>
  );
}
