
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UpcomingBills() {
  // In a real app, you would fetch this data from your API
  const upcomingBills = [
    { name: "Fornecedor X", amount: 250.75, dueDate: "30/07/2024" },
    { name: "Aluguel", amount: 1200.0, dueDate: "05/08/2024" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Pagar (Próximos 30 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBills.length > 0 ? (
          <ul className="space-y-2">
            {upcomingBills.map((bill) => (
              <li key={bill.name} className="flex justify-between text-sm">
                <span>{bill.name}</span>
                <span className="font-medium">R$ {bill.amount.toFixed(2)}</span>
                <span className="text-muted-foreground">{bill.dueDate}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma conta a pagar em breve.</p>
        )}
      </CardContent>
    </Card>
  );
}
