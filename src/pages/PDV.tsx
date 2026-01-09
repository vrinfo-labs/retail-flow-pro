import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  User,
  ShoppingCart,
  Printer,
  Check,
  Calendar,
  ChevronsUpDown,
} from "lucide-react";
import { PrinterStatus } from "@/components/pdv/PrinterStatus";
import { ReceiptPreview } from "@/components/pdv/ReceiptPreview";
import { useThermalPrinter } from "@/hooks/useThermalPrinter";
import { ReceiptData } from "@/services/thermalPrinter";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCustomers, Customer, useCreateCustomer } from "@/hooks/useCustomers";
import { useCreateSale, SaleInsert } from "@/hooks/useSales";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product_id: string;
}

const companyInfo = {
  name: "MINHA LOJA LTDA",
  cnpj: "12.345.678/0001-90",
  address: "Rua das Flores, 123 - Centro - Sao Paulo, SP",
  phone: "(11) 3333-4444",
};

export default function PDV() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [installments, setInstallments] = useState(1);
  const [saleComplete, setSaleComplete] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);

  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const createCustomer = useCreateCustomer();
  const createSale = useCreateSale();
  const { isConnected, isPrinting, printReceipt } = useThermalPrinter();

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: product.id, name: product.nome, price: product.preco_venda, quantity: 1, product_id: product.id }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo_barras?.includes(searchTerm)
    );
  }, [products, searchTerm]);

  const handlePaymentSelect = (method: string) => {
    if (method === 'Crediário' && !selectedCustomer) {
      toast({ 
        title: "Cliente não selecionado", 
        description: "Por favor, selecione um cliente para vendas a prazo.",
        variant: "destructive"
      });
      return;
    }
    setSelectedPayment(method);
    setAmountPaid(total.toFixed(2));
    if (method !== 'Crediário') {
      setInstallments(1);
    }
  };

  const handleFinalizeSale = async () => {
    if (!selectedPayment) return;

    const paid = parseFloat(amountPaid) || 0;
    if (selectedPayment !== 'Crediário' && paid < total) {
      toast({
        title: "Valor insuficiente",
        description: "O valor pago é menor que o total",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCustomer) {
      toast({ 
        title: "Cliente não selecionado", 
        description: "Por favor, selecione um cliente.",
        variant: "destructive"
      });
      return;
    }

    const sale: SaleInsert = {
      customer_id: selectedCustomer.id,
      total_amount: total,
      payment_method: selectedPayment,
      installments: selectedPayment === 'Crediário' ? installments : undefined,
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))
    }

    await createSale.mutateAsync(sale);

    const receipt: ReceiptData = {
      company: companyInfo,
      customer: selectedCustomer ? { name: selectedCustomer.nome, document: selectedCustomer.cpf_cnpj || '' } : undefined,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      discount: 0,
      total,
      paymentMethod: selectedPayment,
      amountPaid: paid,
      change: selectedPayment === 'Dinheiro' ? paid - total : 0,
      cashier: "Caixa 01",
      operator: "Maria Silva",
      saleNumber: Math.floor(Math.random() * 100000),
      date: new Date(),
      installments: selectedPayment === 'Crediário' ? installments : undefined,
    };

    setCurrentReceipt(receipt);
    setSaleComplete(true);
    setShowPaymentDialog(false);
    setShowReceipt(true);
  };

  const handlePrint = async () => {
    if (currentReceipt) {
      const success = await printReceipt(currentReceipt);
      if (success) {
        handleNewSale();
      }
    }
  };

  const handleNewSale = () => {
    setCart([]);
    setSelectedPayment(null);
    setAmountPaid("");
    setInstallments(1);
    setSaleComplete(false);
    setShowReceipt(false);
    setCurrentReceipt(null);
    setSelectedCustomer(null);
  };

  const handleCreateCustomer = async () => {
    if (newCustomerName.trim() === '') return;
    await createCustomer.mutateAsync({ nome: newCustomerName.trim() });
    setNewCustomerName('');
    setShowNewCustomerDialog(false);
  };

  const change = (parseFloat(amountPaid) || 0) - total;

  return (
    <MainLayout title="PDV" subtitle="Ponto de Venda">
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        {/* Products Section */}
        <div className="lg:col-span-2 flex flex-col bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          {/* Search and Printer Status */}
          <div className="p-4 border-b border-border flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <PrinterStatus compact />
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-auto p-4">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center h-full">
                <p>Carregando produtos...</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex flex-col items-start p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-full aspect-square rounded-md bg-muted mb-3 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                    </div>
                    <p className="font-medium text-foreground text-sm line-clamp-2">
                      {product.nome}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.codigo_barras}
                    </p>
                    <p className="text-lg font-bold text-accent mt-2">
                      R$ {product.preco_venda.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="flex flex-col bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          {/* Cart Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Carrinho</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {cart.length} itens
            </span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Carrinho vazio</p>
                <p className="text-sm text-muted-foreground/70">
                  Adicione produtos para começar
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-accent font-semibold">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-7 w-7 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-7 w-7 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 rounded-md text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t border-border p-4 space-y-4">
            {/* Customer */}
            <Popover open={openCustomerCombobox} onOpenChange={setOpenCustomerCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selectedCustomer && "text-muted-foreground"
                  )}
                >
                  <User className="h-4 w-4 mr-2" />
                  {selectedCustomer ? selectedCustomer.nome : "Selecionar cliente"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Buscar cliente..." 
                    onValueChange={setCustomerSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <DialogTrigger asChild>
                         <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowNewCustomerDialog(true)}
                        >
                          {`Criar "${customerSearchTerm}"`}
                        </Button>
                      </DialogTrigger>
                    </CommandEmpty>
                    <CommandGroup>
                      {customers?.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          onSelect={() => {
                            setSelectedCustomer(customer);
                            setOpenCustomerCombobox(false);
                          }}
                        >
                          {customer.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>


            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-accent">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
              disabled={cart.length === 0}
              onClick={() => setShowPaymentDialog(true)}
            >
              Finalizar Venda
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Forma de Pagamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Total */}
            <div className="text-center py-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total a pagar</p>
              <p className="text-3xl font-bold text-accent">
                R$ {total.toFixed(2)}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePaymentSelect("Dinheiro")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  selectedPayment === "Dinheiro"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-primary"
                }`}
              >
                <Banknote className="h-6 w-6" />
                <span className="font-medium">Dinheiro</span>
              </button>
              <button
                onClick={() => handlePaymentSelect("Cartão de Crédito")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  selectedPayment === "Cartão de Crédito"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-primary"
                }`}
              >
                <CreditCard className="h-6 w-6" />
                <span className="font-medium">Crédito</span>
              </button>
              <button
                onClick={() => handlePaymentSelect("Cartão de Débito")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  selectedPayment === "Cartão de Débito"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-primary"
                }`}
              >
                <CreditCard className="h-6 w-6" />
                <span className="font-medium">Débito</span>
              </button>
              <button
                onClick={() => handlePaymentSelect("PIX")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  selectedPayment === "PIX"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-primary"
                }`}
              >
                <QrCode className="h-6 w-6" />
                <span className="font-medium">PIX</span>
              </button>
              <button
                onClick={() => handlePaymentSelect("Crediário")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  selectedPayment === "Crediário"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-primary"
                }`}
              >
                <Calendar className="h-6 w-6" />
                <span className="font-medium">Crediário</span>
              </button>
            </div>

            {/* Amount Paid (for cash) */}
            {selectedPayment === "Dinheiro" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Valor Recebido
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="text-lg"
                />
                {change > 0 && (
                  <div className="flex justify-between p-3 bg-accent/10 rounded-lg">
                    <span className="font-medium">Troco</span>
                    <span className="font-bold text-accent">
                      R$ {change.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Installments (for crediario) */}
            {selectedPayment === "Crediário" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Número de Parcelas
                </label>
                <Input
                  type="number"
                  min={1}
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                  className="text-lg"
                />
              </div>
            )}

            {/* Confirm Button */}
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
              disabled={!selectedPayment || createSale.isLoading}
              onClick={handleFinalizeSale}
            >
              {createSale.isLoading ? "Salvando..." : <><Check className="h-4 w-4 mr-2" />Confirmar Pagamento</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

       {/* New Customer Dialog */}
      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Nome do cliente"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCreateCustomer}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Preview */}
      {showReceipt && currentReceipt && (
        <ReceiptPreview
          data={currentReceipt}
          onClose={handleNewSale}
          onPrint={handlePrint}
          isPrinting={isPrinting}
          isConnected={isConnected}
        />
      )}
    </MainLayout>
  );
}
