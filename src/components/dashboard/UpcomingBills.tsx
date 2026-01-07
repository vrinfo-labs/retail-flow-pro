import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const bills = [
  {
    id: 1,
    description: "Fornecedor ABC - NF 12345",
    amount: "R$ 2.500,00",
    dueDate: "07/01/2026",
    daysUntil: 0,
    status: "today",
  },
  {
    id: 2,
    description: "Aluguel - Janeiro",
    amount: "R$ 3.200,00",
    dueDate: "10/01/2026",
    daysUntil: 3,
    status: "upcoming",
  },
  {
    id: 3,
    description: "Energia Elétrica",
    amount: "R$ 890,00",
    dueDate: "15/01/2026",
    daysUntil: 8,
    status: "upcoming",
  },
  {
    id: 4,
    description: "Fornecedor XYZ - NF 54321",
    amount: "R$ 1.450,00",
    dueDate: "03/01/2026",
    daysUntil: -4,
    status: "overdue",
  },
];

export function UpcomingBills() {
  const sortedBills = [...bills].sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="rounded-xl bg-card border border-border/50 shadow-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Contas a Vencer</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Ver todas
        </button>
      </div>
      <div className="divide-y divide-border">
        {sortedBills.map((bill, index) => (
          <div
            key={bill.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              {bill.status === "overdue" && (
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-foreground">{bill.description}</p>
                <p className="text-sm text-muted-foreground">{bill.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{bill.amount}</p>
              <span
                className={cn(
                  "text-xs font-medium",
                  bill.status === "overdue" && "text-destructive",
                  bill.status === "today" && "text-warning",
                  bill.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {bill.status === "overdue"
                  ? `${Math.abs(bill.daysUntil)} dias atrás`
                  : bill.status === "today"
                  ? "Vence hoje"
                  : `em ${bill.daysUntil} dias`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
