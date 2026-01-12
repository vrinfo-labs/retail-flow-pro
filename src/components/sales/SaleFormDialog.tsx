import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sale, useCreateSale } from "@/hooks/useSales";
import { useSale } from "@/hooks/useSale";
import { useCustomers } from "@/hooks/useCustomers";
import { SaleItemsForm } from "./SaleItemsForm";
import { supabase } from "@/lib/supabaseClient";

interface SaleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: Sale | null;
}

const INITIAL_STATE = {
  customer_id: undefined,
  operator_id: "",
  subtotal: 0,
  desconto: 0,
  total: 0,
  forma_pagamento: "dinheiro" as const,
  status: "pendente" as const,
  observacoes: "",
};

export function SaleFormDialog({ open, onOpenChange, sale: initialSale }: SaleFormDialogProps) {
  const [saleData, setSaleData] = useState<any>(INITIAL_STATE);
  const [items, setItems] = useState<any[]>([]);
  const isEditing = !!initialSale;

  // Hooks
  const { data: clients } = useCustomers({ page: 1, perPage: 1000 });
  const { data: fullSale, isLoading: isLoadingSale } = useSale(initialSale?.id);
  const createSale = useCreateSale();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !isEditing) {
        setSaleData(prev => ({ ...prev, operator_id: user.id }));
      }
    };

    fetchUser();

    if (isEditing) {
      if (fullSale) {
        setSaleData({
          ...fullSale,
          customer_id: fullSale.customers?.id
        });
        const saleItems = fullSale.sale_items.map(item => ({
            ...item,
            price: item.preco_unitario,
            discount: item.desconto,
            product: item.products, // Match the structure expected by SaleItemsForm
        }));
        setItems(saleItems);
      }
    } else {
      setSaleData(INITIAL_STATE);
      setItems([]);
    }
  }, [initialSale, fullSale, isEditing, open]);

  // Recalculate totals whenever items or discount change
  useMemo(() => {
      if (isEditing) return; // Don't recalculate in edit mode, just display stored values
      const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
      const total = subtotal - (saleData.desconto || 0);
      setSaleData(prev => ({ ...prev, subtotal, total }));
  }, [items, saleData.desconto, isEditing]);


  const handleSubmit = () => {
    const salePayload = {
      sale_data: { 
          ...saleData, 
          customer_id: saleData.customer_id || null,
          subtotal: saleData.subtotal,
          desconto: saleData.desconto,
          total: saleData.total,
      },
      sale_items: items.map(i => ({
        product_id: i.product.id,
        quantidade: i.quantity,
        preco_unitario: i.price,
        desconto: i.discount,
        subtotal: i.subtotal,
      })),
    };

    createSale.mutate(salePayload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleFieldChange = (field: keyof typeof INITIAL_STATE, value: any) => {
    setSaleData(prev => ({...prev, [field]: value}));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Detalhes da Venda #${initialSale.id.substring(0, 5)}` : "Nova Venda"}</DialogTitle>
          {isEditing && initialSale && <DialogDescription>Venda realizada em {format(parseISO(initialSale.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</DialogDescription>}
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <Select value={saleData.customer_id} onValueChange={(val) => handleFieldChange('customer_id', val)} disabled={isEditing}>
            <SelectTrigger><SelectValue placeholder="Selecione um Cliente" /></SelectTrigger>
            <SelectContent>
              {clients?.data.map(client => <SelectItem key={client.id} value={client.id}>{client.nome}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={saleData.forma_pagamento} onValueChange={(val) => handleFieldChange('forma_pagamento', val)} disabled={isEditing}>
            <SelectTrigger><SelectValue placeholder="Forma de Pagamento" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="crediario">Crediário</SelectItem>
            </SelectContent>
          </Select>

          <Select value={saleData.status} onValueChange={(val) => handleFieldChange('status', val)} disabled={isEditing}>
            <SelectTrigger><SelectValue placeholder="Status do Pagamento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="quitado">Quitado</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SaleItemsForm items={items} setItems={setItems} disabled={isEditing || isLoadingSale} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Textarea 
                placeholder="Observações da venda..."
                value={saleData.observacoes || ''}
                onChange={(e) => handleFieldChange('observacoes', e.target.value)}
                disabled={isEditing}
                rows={3}
            />
            <div className="space-y-2">
                <Input 
                    type="number"
                    placeholder="Desconto (R$)"
                    value={saleData.desconto}
                    onChange={(e) => handleFieldChange('desconto', parseFloat(e.target.value) || 0)}
                    disabled={isEditing}
                    className="max-w-xs ml-auto"
                />
                <div className="text-right font-semibold text-lg">
                    Total: R$ {Number(saleData.total || 0).toFixed(2)}
                </div>
            </div>
        </div>

        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isEditing ? "Fechar" : "Cancelar"}</Button>
          {!isEditing && <Button onClick={handleSubmit} disabled={createSale.isLoading}>Salvar Venda</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
