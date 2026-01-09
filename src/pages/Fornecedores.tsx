import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import {
  Search,
  Phone,
  Building,
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import {
  useSuppliers,
  useSoftDeleteSupplier,
  Supplier,
} from "@/hooks/useSuppliers";
import { SupplierFormDialog } from "@/components/fornecedores/SupplierFormDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(
    undefined
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const { data: suppliers, isLoading } = useSuppliers();
  const deleteMutation = useSoftDeleteSupplier();

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setSupplierToDelete(id);
    setIsConfirmingDelete(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      deleteMutation.mutate(supplierToDelete, {
        onSuccess: () => {
          setIsConfirmingDelete(false);
          setSupplierToDelete(null);
        },
      });
    }
  };

  const filteredSuppliers = suppliers?.filter(
    (s) =>
      s.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cnpj?.includes(searchTerm)
  );

  return (
    <MainLayout
      title="Fornecedores"
      subtitle="Gestão de fornecedores e compras"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar fornecedor por nome ou CNPJ..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SupplierFormDialog
          supplier={editingSupplier}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingSupplier(undefined);
          }}
          open={isFormOpen}
        />
        <Button onClick={() => setIsFormOpen(true)}>Novo Fornecedor</Button>
      </div>

      {/* Suppliers Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSuppliers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
            <p className="text-sm text-muted-foreground/70">
              Cadastre fornecedores usando o botão acima
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium">Fornecedor</th>
                  <th className="text-left p-4 font-medium">Contato</th>
                  <th className="text-left p-4 font-medium">Localização</th>
                  <th className="text-left p-4 font-medium">Cadastro</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers?.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium">{supplier.razao_social}</div>
                      <div className="text-muted-foreground">
                        {supplier.cnpj || "Sem CNPJ"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{supplier.contato || "-"}</div>
                      {supplier.telefone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {supplier.telefone}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {[supplier.cidade, supplier.estado]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(supplier.created_at).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(supplier.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja remover este fornecedor? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : null}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
