import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useProducts, useCreateProduct, Product } from '@/hooks/useProducts';
import { useSuppliers, useCreateSupplier, Supplier } from '@/hooks/useSuppliers';
import { useCustomers, Customer } from '@/hooks/useCustomers';
import { useCreatePedido } from '@/hooks/usePedidos';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface OrderItem {
  id: string;
  product: Product | null;
  supplier: Supplier | null;
  reference: string;
  quantity: string;
  value: string;
}

export function PedidoForm() {
  const navigate = useNavigate();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [openCombobox, setOpenCombobox] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products } = useProducts();
  const { data: suppliers } = useSuppliers();
  const { data: customers } = useCustomers();

  const createProduct = useCreateProduct();
  const createSupplier = useCreateSupplier();
  const createPedido = useCreatePedido();

  const handleAddItem = () => {
    setItems([...items, { id: crypto.randomUUID(), product: null, supplier: null, reference: '', quantity: '1', value: '0.00' }]);
  };

  const handleItemChange = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCreate = async (type: 'product' | 'supplier', name: string, itemId: string) => {
    try {
      const currentItem = items.find(i => i.id === itemId);
      if (type === 'product') {
        if (!currentItem?.supplier) {
            toast({ title: "Fornecedor não selecionado", description: "Selecione um fornecedor antes de criar um novo produto.", variant: "destructive" });
            return;
        }
        const newProduct = await createProduct.mutateAsync({ 
            nome: name, 
            preco_venda: 0.01, 
            preco_custo: 0, 
            supplier_id: currentItem.supplier.id 
        });
        handleItemChange(itemId, 'product', newProduct);
      } else if (type === 'supplier') {
        const newSupplier = await createSupplier.mutateAsync({ nome_fantasia: name, razao_social: name });
        handleItemChange(itemId, 'supplier', newSupplier);
      }
      setOpenCombobox(null);
    } catch (error) {
      toast({ title: `Erro ao criar ${type === 'product' ? 'produto' : 'fornecedor'}`, description: "Tente novamente.", variant: "destructive" });
    }
  };

  const { totalItems, totalValue } = useMemo(() => {
    return items.reduce((acc, item) => {
      acc.totalItems += Number(item.quantity) || 0;
      acc.totalValue += (Number(item.quantity) || 0) * (Number(item.value) || 0);
      return acc;
    }, { totalItems: 0, totalValue: 0 });
  }, [items]);

  const handleSubmit = async () => {
    if (!customer) {
      toast({ title: "Cliente não selecionado", description: "Por favor, selecione um cliente para o pedido.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Nenhum item no pedido", description: "Adicione pelo menos um produto ao pedido.", variant: "destructive" });
      return;
    }

    const pedidoData = {
      customer_id: customer.id,
      total: totalValue,
      status: 'Pendente',
      pedido_items: items.map(item => ({
        product_id: item.product?.id,
        supplier_id: item.supplier?.id,
        quantity: Number(item.quantity),
        unit_price: Number(item.value),
        reference: item.reference
      }))
    };

    await createPedido.mutateAsync(pedidoData, {
      onSuccess: () => {
        toast({ title: "Pedido criado com sucesso!" });
        navigate('/pedidos');
      },
      onError: (error) => {
        toast({ title: "Erro ao criar pedido", description: error.message, variant: "destructive" });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pedido de Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Selection */}
        <div className="w-full md:w-1/3">
            <label className="font-semibold text-sm text-muted-foreground px-2">Cliente</label>
            <Popover onOpenChange={() => {}}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !customer && "text-muted-foreground")}>
                  {customer ? customer.nome : "Selecione um cliente"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Procure um cliente..." />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup>
                      {customers?.map((c) => (
                        <CommandItem key={c.id} onSelect={() => setCustomer(c)}>{c.nome}</CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
        </div>

        {/* Items Header */}
        <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-muted-foreground px-2">
            <div className="col-span-3">Fornecedor</div>
            <div className="col-span-3">Produto</div>
            <div className="col-span-2">Referência</div>
            <div className="col-span-1">Qtd.</div>
            <div className="col-span-2">Valor Un.</div>
            <div className="col-span-1"></div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              {/* Supplier */}
              <div className="col-span-3">
                <Popover open={openCombobox === `${item.id}-supplier`} onOpenChange={(isOpen) => setOpenCombobox(isOpen ? `${item.id}-supplier` : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className={cn("w-full justify-between", !item.supplier && "text-muted-foreground")}>
                      {item.supplier ? item.supplier.nome_fantasia : "Selecione"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Procure ou crie um fornecedor..." onValueChange={setSearchTerm} />
                      <CommandList>
                        <CommandEmpty>
                          <Button variant="outline" className="w-full" onClick={() => handleCreate('supplier', searchTerm, item.id)}>{`Criar "${searchTerm}"`}</Button>
                        </CommandEmpty>
                        <CommandGroup>
                          {suppliers?.map((supplier) => (
                            <CommandItem key={supplier.id} onSelect={() => { handleItemChange(item.id, 'supplier', supplier); setOpenCombobox(null); }}>
                              {supplier.nome_fantasia}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Product */}
              <div className="col-span-3">
                <Popover open={openCombobox === `${item.id}-product`} onOpenChange={(isOpen) => setOpenCombobox(isOpen ? `${item.id}-product` : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className={cn("w-full justify-between", !item.product && "text-muted-foreground")}>
                      {item.product ? item.product.nome : "Selecione"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Procure ou crie um produto..." onValueChange={setSearchTerm} />
                      <CommandList>
                        <CommandEmpty>
                           <Button 
                                variant="outline" 
                                className="w-full" 
                                disabled={!item.supplier}
                                onClick={() => handleCreate('product', searchTerm, item.id)}
                            >
                                {!item.supplier ? "Selecione um fornecedor primeiro" : `Criar "${searchTerm}"`}
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          {products?.filter(p => !item.supplier || p.supplier_id === item.supplier.id).map((product) => (
                            <CommandItem key={product.id} onSelect={() => { handleItemChange(item.id, 'product', product); handleItemChange(item.id, 'value', product.preco_venda.toString()); setOpenCombobox(null); }}>
                              {product.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Reference */}
              <div className="col-span-2">
                <Input placeholder="Referência" value={item.reference} onChange={(e) => handleItemChange(item.id, 'reference', e.target.value)} />
              </div>
              {/* Quantity */}
              <div className="col-span-1">
                <Input type="number" placeholder="Qtd." value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} />
              </div>
              {/* Value */}
              <div className="col-span-2">
                <Input type="number" placeholder="Valor" value={item.value} onChange={(e) => handleItemChange(item.id, 'value', e.target.value)} />
              </div>
              {/* Remove */}
              <div className="col-span-1">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleAddItem} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 py-4 px-6">
        <div className="text-lg font-semibold">
          Total: {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          <span className="text-sm text-muted-foreground font-normal ml-2">({totalItems} itens)</span>
        </div>
        <Button onClick={handleSubmit} disabled={createPedido.isPending}>
          {createPedido.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Pedido
        </Button>
      </CardFooter>
    </Card>
  );
}
