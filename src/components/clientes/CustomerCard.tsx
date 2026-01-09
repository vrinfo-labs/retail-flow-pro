import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Customer } from "@/hooks/useCustomers";
import { MoreVertical, Trash2, Pencil, Phone, Mail, MapPin } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function CustomerCard({ customer, onEdit, onDelete, index }: CustomerCardProps) {
  return (
    <div 
      className="bg-card rounded-xl p-5 border border-border/50 shadow-card hover:shadow-md transition-all animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {customer.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{customer.nome}</h3>
            <p className="text-sm text-muted-foreground">{customer.cpf_cnpj || "Sem CPF/CNPJ"}</p>
          </div>
        </div>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(customer)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação moverá o cliente para a lixeira. Ele poderá ser recuperado se necessário.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(customer.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-2 mb-4">
        {customer.telefone && <InfoLine icon={Phone} text={customer.telefone} />}
        {customer.email && <InfoLine icon={Mail} text={customer.email} />}
        {(customer.cidade || customer.estado) && <InfoLine icon={MapPin} text={[customer.cidade, customer.estado].filter(Boolean).join(', ')} />}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Limite crédito</p>
          <p className="font-semibold text-accent">{ (customer.limite_credito || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Cadastro</p>
          <p className="text-sm font-medium">{new Date(customer.created_at).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>
    </div>
  );
}

const InfoLine = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Icon className="h-4 w-4" />
    {text}
  </div>
);
