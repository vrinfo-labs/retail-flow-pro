import { useState } from "react";
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
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const sampleProducts = [
  { id: 1, name: "Arroz Integral 5kg", price: 24.9, code: "7891234567890" },
  { id: 2, name: "Feijão Carioca 1kg", price: 8.5, code: "7891234567891" },
  { id: 3, name: "Óleo de Soja 900ml", price: 7.9, code: "7891234567892" },
  { id: 4, name: "Açúcar Refinado 1kg", price: 4.5, code: "7891234567893" },
  { id: 5, name: "Café Torrado 500g", price: 15.9, code: "7891234567894" },
  { id: 6, name: "Leite Integral 1L", price: 5.9, code: "7891234567895" },
];

export default function PDV() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addToCart = (product: (typeof sampleProducts)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
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

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const filteredProducts = sampleProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.includes(searchTerm)
  );

  return (
    <MainLayout title="PDV" subtitle="Ponto de Venda">
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        {/* Products Section */}
        <div className="lg:col-span-2 flex flex-col bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-auto p-4">
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
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.code}
                  </p>
                  <p className="text-lg font-bold text-accent mt-2">
                    R$ {product.price.toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
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
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Identificar cliente
              </span>
            </button>

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

            {/* Payment Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex-col h-auto py-3" disabled={cart.length === 0}>
                <Banknote className="h-5 w-5 mb-1" />
                <span className="text-xs">Dinheiro</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-3" disabled={cart.length === 0}>
                <CreditCard className="h-5 w-5 mb-1" />
                <span className="text-xs">Cartão</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-3" disabled={cart.length === 0}>
                <QrCode className="h-5 w-5 mb-1" />
                <span className="text-xs">PIX</span>
              </Button>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
              disabled={cart.length === 0}
            >
              Finalizar Venda
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
