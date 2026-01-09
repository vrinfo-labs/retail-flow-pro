import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    TrendingUp,
    Package,
    Users,
    DollarSign,
    FileText,
    Download,
    Calendar,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const relatoriosDisponiveis = [
    {
        title: "Vendas por Período",
        description: "Relatório detalhado de vendas com filtros por data",
        icon: BarChart3,
    },
    {
        title: "Produtos Mais Vendidos",
        description: "Ranking de produtos por quantidade e valor",
        icon: Package,
    },
    {
        title: "Clientes Frequentes",
        description: "Análise de clientes por frequência e valor",
        icon: Users,
    },
    {
        title: "Fluxo de Caixa",
        description: "Entradas e saídas detalhadas por período",
        icon: DollarSign,
    },
    {
        title: "Margem de Lucro",
        description: "Análise de margem por produto e categoria",
        icon: TrendingUp,
    },
    {
        title: "Movimentação de Estoque",
        description: "Histórico de entradas, saídas e ajustes",
        icon: FileText,
    },
];

// Define the type for our data
interface TopProduct {
    name: string;
    quantidade: number;
    valor: number;
}

interface MonthlySales {
    name: string;
    vendas: number;
}

interface PaymentMethod {
    name: string;
    value: number;
    color: string;
}

export default function Relatorios() {
    const [topProdutos, setTopProdutos] = useState<TopProduct[]>([]);
    const [vendasMensais, setVendasMensais] = useState<MonthlySales[]>([]);
    const [formasPagamento, setFormasPagamento] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const today = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);

            const [topProductsData, monthlySalesData, paymentMethodData] = await Promise.all([
                supabase.rpc('get_top_selling_products', {
                    start_date: startDate.toISOString(),
                    end_date: today.toISOString(),
                }),
                supabase.rpc('get_monthly_sales'),
                supabase.rpc('get_payment_method_distribution'),
            ]);

            if (topProductsData.error) console.error("Error fetching top products:", topProductsData.error);
            else setTopProdutos(topProductsData.data || []);

            if (monthlySalesData.error) console.error("Error fetching monthly sales:", monthlySalesData.error);
            else setVendasMensais(monthlySalesData.data || []);

            if (paymentMethodData.error) console.error("Error fetching payment methods:", paymentMethodData.error);
            else setFormasPagamento(paymentMethodData.data || []);

            setLoading(false);
        };

        fetchData();
    }, []);


    return (
        <MainLayout
            title="Relatórios"
            subtitle="Análises e relatórios gerenciais"
        >
            {/* Period Selector */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Hoje</Button>
                    <Button variant="outline" size="sm">Esta Semana</Button>
                    <Button variant="secondary" size="sm">Este Mês</Button>
                    <Button variant="outline" size="sm">Este Ano</Button>
                </div>
                <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Personalizado
                </Button>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border/50 shadow-card">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">Vendas Mensais</h3>
                            <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                    <div className="h-[280px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">Carregando...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={vendasMensais}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 88%)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }} tickFormatter={(value) => `R$ ${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(215 25% 88%)", borderRadius: "8px" }}
                                        formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Vendas"]}
                                    />
                                    <Bar dataKey="vendas" fill="hsl(222 47% 20%)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
                    <h3 className="font-semibold text-foreground mb-4">Formas de Pagamento</h3>
                    <div className="h-[200px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">Carregando...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={formasPagamento} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                                        {formasPagamento.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    {!loading && <div className="grid grid-cols-2 gap-2 mt-4">
                        {formasPagamento.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-xl border border-border/50 shadow-card mb-6">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Produtos Mais Vendidos</h3>
                    <Button variant="outline" size="sm">Ver todos</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Produto</th>
                                <th className="text-center p-4 font-medium text-muted-foreground">Quantidade</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="text-center p-8 text-muted-foreground">Carregando...</td></tr>
                            ) : topProdutos.length === 0 ? (
                                <tr><td colSpan={4} className="text-center p-8 text-muted-foreground">Nenhum produto encontrado no período.</td></tr>
                            ) : (
                                topProdutos.map((produto, index) => (
                                    <tr key={produto.name} className="border-b border-border hover:bg-muted/30 transition-colors">
                                        <td className="p-4"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{index + 1}</span></td>
                                        <td className="p-4 font-medium text-foreground">{produto.name}</td>
                                        <td className="p-4 text-center text-muted-foreground">{produto.quantidade} un</td>
                                        <td className="p-4 text-right font-semibold text-accent">R$ {produto.valor.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Available Reports */}
            <div>
                <h3 className="font-semibold text-foreground mb-4">Relatórios Disponíveis</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatoriosDisponiveis.map((relatorio, index) => (
                        <button key={relatorio.title} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-card hover:border-primary hover:shadow-md transition-all text-left animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <relatorio.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">{relatorio.title}</h4>
                                <p className="text-sm text-muted-foreground">{relatorio.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
