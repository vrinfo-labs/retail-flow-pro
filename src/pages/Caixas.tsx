import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCaixas, useCreateCaixa, useUpdateCaixa, Caixa, CaixaInsert } from "@/hooks/useCaixas";
import { Monitor, Plus, User, Clock, Power, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

const operadores = [
  { id: 1, nome: "Maria Silva", turno: "08:00 - 17:00", vendas: 45680.0 },
  { id: 2, nome: "João Santos", turno: "09:00 - 18:00", vendas: 38920.0 },
  { id: 3, nome: "Ana Costa", turno: "10:00 - 19:00", vendas: 42150.0 },
  { id: 4, nome: "Carlos Oliveira", turno: "14:00 - 22:00", vendas: 35800.0 },
];

export default function Caixas() {
  const { data: caixas, isLoading } = useCaixas();
  const createCaixa = useCreateCaixa();
  const updateCaixa = useUpdateCaixa();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCaixa, setEditingCaixa] = useState<Caixa | null>(null);

  const handleSave = (formData: CaixaInsert) => {
    if (editingCaixa) {
      updateCaixa.mutate({ ...formData, id: editingCaixa.id });
    } else {
      createCaixa.mutate(formData);
    }
    setIsDialogOpen(false);
    setEditingCaixa(null);
  };

  const handleOpenDialog = (caixa?: Caixa) => {
    setEditingCaixa(caixa || null);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (caixa: Caixa) => {
    const newStatus = caixa.status === 'ativo' ? 'inativo' : 'ativo';
    updateCaixa.mutate({ id: caixa.id, status: newStatus });
  };

  return (
    <MainLayout title="Caixas" subtitle="Gestão de caixas e operadores">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Terminais de Caixa</h2>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Caixa
          </Button>
        </div>

        {isLoading ? <p>Carregando caixas...</p> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {caixas?.map((caixa, index) => (
              <div
                key={caixa.id}
                className={cn(
                  "bg-card rounded-xl p-5 border shadow-card animate-fade-in",
                  caixa.status === "ativo" ? "border-accent/50" : "border-border/50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", caixa.status === "ativo" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground")}>
                      <Monitor className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{caixa.identificacao}</h3>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", caixa.status === "ativo" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground")}>
                        {caixa.status === "ativo" ? "Aberto" : "Fechado"}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleStatus(caixa)}>
                    <Power className="h-4 w-4" />
                  </Button>
                </div>

                {caixa.status === 'ativo' ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">-</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">-</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Printer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{caixa.impressora_termica || '-'}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(caixa)}>Editar</Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Caixa não está em operação</p>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(caixa)}>Editar</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <CaixaForm 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={handleSave} 
        caixa={editingCaixa} 
      />

      {/* Operadores Section - Placeholder */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Operadores</h2>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Operador
          </Button>
        </div>
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Operador</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Turno</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Vendas (Mês)</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {operadores.map((operador, index) => (
                <tr key={operador.id} className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {operador.nome.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-foreground">{operador.nome}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{operador.turno}</td>
                  <td className="p-4 text-right font-semibold text-accent">R$ {operador.vendas.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

interface CaixaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CaixaInsert) => void;
  caixa: Caixa | null;
}

function CaixaForm({ isOpen, onClose, onSave, caixa }: CaixaFormProps) {
  const [identificacao, setIdentificacao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [impressora, setImpressora] = useState("");
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');

  useState(() => {
    if (caixa) {
      setIdentificacao(caixa.identificacao);
      setLocalizacao(caixa.localizacao || "");
      setImpressora(caixa.impressora_termica || "");
      setStatus(caixa.status);
    } else {
      setIdentificacao("");
      setLocalizacao("");
      setImpressora("");
      setStatus('ativo');
    }
  }, [caixa]);

  const handleSubmit = () => {
    onSave({
      identificacao,
      localizacao,
      impressora_termica: impressora,
      status,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{caixa ? "Editar Caixa" : "Novo Caixa"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Identificação do Caixa" value={identificacao} onChange={(e) => setIdentificacao(e.target.value)} />
          <Input placeholder="Localização" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} />
          <Input placeholder="Impressora Térmica" value={impressora} onChange={(e) => setImpressora(e.target.value)} />
          <Select value={status} onValueChange={(value: 'ativo' | 'inativo') => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
