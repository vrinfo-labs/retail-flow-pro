import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Store,
  Printer,
  Bell,
  CreditCard,
  Shield,
  Database,
  Palette,
} from "lucide-react";

const configSections = [
  {
    id: "empresa",
    title: "Dados da Empresa",
    description: "Informações que aparecem nos cupons e relatórios",
    icon: Store,
  },
  {
    id: "impressora",
    title: "Impressora Térmica",
    description: "Configuração de impressoras ESC/POS",
    icon: Printer,
  },
  {
    id: "notificacoes",
    title: "Notificações",
    description: "Alertas de estoque, vencimentos e vendas",
    icon: Bell,
  },
  {
    id: "pagamentos",
    title: "Formas de Pagamento",
    description: "Métodos aceitos e taxas",
    icon: CreditCard,
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Senhas, acessos e logs",
    icon: Shield,
  },
  {
    id: "backup",
    title: "Backup e Dados",
    description: "Exportação e restauração de dados",
    icon: Database,
  },
];

export default function Configuracoes() {
  return (
    <MainLayout
      title="Configurações"
      subtitle="Configurações do sistema"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {configSections.map((section, index) => (
            <button
              key={section.id}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-card hover:border-primary hover:shadow-md transition-all text-left animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Empresa */}
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                Dados da Empresa
              </h3>
            </div>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    placeholder="Nome da empresa"
                    defaultValue="Minha Loja Ltda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input
                    id="nomeFantasia"
                    placeholder="Nome fantasia"
                    defaultValue="Minha Loja"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    defaultValue="12.345.678/0001-90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input
                    id="ie"
                    placeholder="Inscrição estadual"
                    defaultValue="123.456.789.000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Endereço completo"
                  defaultValue="Rua das Flores, 123 - Centro - São Paulo, SP"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 0000-0000"
                    defaultValue="(11) 3333-4444"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@empresa.com"
                    defaultValue="contato@minhaloja.com.br"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Impressora */}
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Printer className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                Impressora Térmica
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">
                    Impressora Padrão
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Impressora térmica ESC/POS conectada via USB
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Imprimir automaticamente
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Imprimir cupom ao finalizar venda
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Duas vias</p>
                  <p className="text-sm text-muted-foreground">
                    Imprimir cupom do cliente e da loja
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Notificações</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Estoque baixo</p>
                  <p className="text-sm text-muted-foreground">
                    Alertar quando produto atingir estoque mínimo
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Contas a vencer
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre contas próximas do vencimento
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Resumo diário
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enviar resumo de vendas por e-mail
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
