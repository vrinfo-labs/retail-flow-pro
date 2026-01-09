import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useOperadores, useCreateOperador, useUpdateOperador, Operador, OperadorInsert } from "@/hooks/useOperadores";
import { Plus } from "lucide-react";

export default function Operadores() {
  const { data: operadores, isLoading } = useOperadores();
  const createOperador = useCreateOperador();
  const updateOperador = useUpdateOperador();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperador, setEditingOperador] = useState<Operador | null>(null);

  const handleSave = (formData: OperadorInsert) => {
    if (editingOperador) {
      updateOperador.mutate({ ...formData, id: editingOperador.id });
    } else {
      createOperador.mutate(formData);
    }
    setIsDialogOpen(false);
    setEditingOperador(null);
  };

  const handleOpenDialog = (operador?: Operador) => {
    setEditingOperador(operador || null);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout title="Operadores" subtitle="Gestão de operadores de caixa">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Operadores</h2>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Operador
        </Button>
      </div>

      {isLoading ? <p>Carregando operadores...</p> : (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Nome</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Login</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Horário de Trabalho</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {operadores?.map((operador) => (
                <tr key={operador.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{operador.nome}</td>
                  <td className="p-4 text-muted-foreground">{operador.login}</td>
                  <td className="p-4 text-muted-foreground">{operador.horario_trabalho || '-'}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(operador)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OperadorForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        operador={editingOperador}
      />
    </MainLayout>
  );
}

interface OperadorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OperadorInsert) => void;
  operador: Operador | null;
}

function OperadorForm({ isOpen, onClose, onSave, operador }: OperadorFormProps) {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [horario, setHorario] = useState("");

  useState(() => {
    if (operador) {
      setNome(operador.nome);
      setLogin(operador.login);
      setHorario(operador.horario_trabalho || "");
      setSenha("");
    } else {
      setNome("");
      setLogin("");
      setSenha("");
      setHorario("");
    }
  }, [operador]);

  const handleSubmit = () => {
    onSave({
      nome,
      login,
      senha: senha || undefined,
      horario_trabalho: horario,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{operador ? "Editar Operador" : "Novo Operador"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)} />
          <Input type="password" placeholder={operador ? "Nova senha (deixar em branco para não alterar)" : "Senha"} value={senha} onChange={(e) => setSenha(e.target.value)} />
          <Input placeholder="Horário de trabalho (ex: 08:00 - 17:00)" value={horario} onChange={(e) => setHorario(e.target.value)} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
