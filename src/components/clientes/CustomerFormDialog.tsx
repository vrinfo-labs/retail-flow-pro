import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreateCustomer, useUpdateCustomer, Customer } from "@/hooks/useCustomers";
import { Loader2 } from "lucide-react";

const customerSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  cpf_cnpj: z.string().optional(),
  data_nascimento: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  limite_credito: z.coerce.number().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerFormDialog({ customer, open, onOpenChange }: CustomerFormDialogProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      limite_credito: 0,
    }
  });

  useEffect(() => {
    if (customer) {
      reset({
        ...customer,
        data_nascimento: customer.data_nascimento ? new Date(customer.data_nascimento).toISOString().split('T')[0] : '',
      });
    } else {
      reset({ nome: '', telefone: '', email: '', cpf_cnpj: '', data_nascimento: '', endereco: '', cidade: '', estado: '', limite_credito: 0 });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const submissionData = {
        ...data,
        data_nascimento: data.data_nascimento ? new Date(data.data_nascimento).toISOString() : null
      };

      if (customer) {
        await updateCustomer.mutateAsync({ ...submissionData, id: customer.id });
      } else {
        await createCustomer.mutateAsync(submissionData);
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = createCustomer.isPending || updateCustomer.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input id="nome" {...register("nome")} placeholder="Nome do cliente" />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input id="cpf_cnpj" {...register("cpf_cnpj")} placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input id="data_nascimento" type="date" {...register("data_nascimento")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" {...register("telefone")} placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} placeholder="email@exemplo.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" {...register("endereco")} placeholder="Rua, número, bairro" />
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2 col-span-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register("cidade")} placeholder="São Paulo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" {...register("estado")} placeholder="SP" maxLength={2} />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="limite_credito">Limite de Crédito (R$)</Label>
              <Input id="limite_credito" type="number" step="0.01" {...register("limite_credito")} placeholder="0.00" />
            </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {customer ? "Salvar Alterações" : "Cadastrar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
