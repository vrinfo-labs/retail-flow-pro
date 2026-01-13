
// --- TIPAGEM DOS DADOS ---
export interface Product {
  id: number;
  name: string;
  price: number;       // Preço de venda para o cliente
  supplierId: string;  // ID do fornecedor
  code: string;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
}

export interface CustomerOrder {
  id: string; // Ex: "PED-001"
  customer: Customer;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado';
  paymentMethod: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  minimumOrderValue: number; // Pedido mínimo
}

// --- DADOS DE EXEMPLO ---

export const suppliers: Supplier[] = [
  {
    id: 'SUP-A',
    name: 'Fornecedor A (Eletrônicos)',
    minimumOrderValue: 1500.00,
  },
  {
    id: 'SUP-B',
    name: 'Fornecedor B (Vestuário)',
    minimumOrderValue: 800.00,
  },
  {
    id: 'SUP-C',
    name: 'Fornecedor C (Cosméticos)',
    minimumOrderValue: 450.00,
  },
];

export const sampleProducts: Product[] = [
  { id: 1, name: "Fone de Ouvido Bluetooth", price: 250.00, supplierId: 'SUP-A', code: "78900001" },
  { id: 2, name: "Smartwatch X3", price: 600.00, supplierId: 'SUP-A', code: "78900002" },
  { id: 3, name: "Mouse Gamer RGB", price: 180.00, supplierId: 'SUP-A', code: "78900003" },
  { id: 4, name: "Teclado Mecânico", price: 320.00, supplierId: 'SUP-A', code: "78900004" },
  { id: 5, name: "Camiseta Básica", price: 59.90, supplierId: 'SUP-B', code: "78900005" },
  { id: 6, name: "Calça Jeans", price: 150.00, supplierId: 'SUP-B', code: "78900006" },
  { id: 7, name: "Perfume Classic", price: 180.00, supplierId: 'SUP-C', code: "78900007" },
  { id: 8, name: "Kit de Maquiagem", price: 120.00, supplierId: 'SUP-C', code: "78900008" },
];

export const sampleCustomers: Customer[] = [
    { id: "CUST-01", name: "Ana Clara", phone: "5511987654321" },
    { id: "CUST-02", name: "Bruno Martins", phone: "5521912345678" },
    { id: "CUST-03", name: "Carla Dias", phone: "5531998765432" },
    { id: "CUST-04", name: "Daniel Fogaça", phone: "5541988887777" },
    { id: "CUST-05", name: "Fernanda Lima", phone: "5551911112222" },
];

const initialOrders: CustomerOrder[] = [
  {
    id: 'PED-101',
    customer: sampleCustomers[0],
    date: '2024-07-30',
    items: [
      { productId: 1, productName: 'Fone de Ouvido Bluetooth', quantity: 1, price: 250.00, supplierId: 'SUP-A' },
      { productId: 5, productName: 'Camiseta Básica', quantity: 2, price: 59.90, supplierId: 'SUP-B' },
    ],
    total: 369.80,
    status: 'Pendente',
    paymentMethod: 'Crédito',
  },
  {
    id: 'PED-102',
    customer: sampleCustomers[1],
    date: '2024-07-30',
    items: [
      { productId: 2, productName: 'Smartwatch X3', quantity: 1, price: 600.00, supplierId: 'SUP-A' },
      { productId: 7, productName: 'Perfume Classic', quantity: 1, price: 180.00, supplierId: 'SUP-C' },
    ],
    total: 780.00,
    status: 'Pendente',
    paymentMethod: 'Crediário (3x)',
  },
];

// Objeto que gerencia os dados em memória para simular um banco de dados
export const inMemoryData = {
  orders: [...initialOrders],
  getNewOrderId: function() {
      const lastId = this.orders.length > 0 ? Math.max(...this.orders.map(o => parseInt(o.id.split('-')[1]))) : 100;
      return `PED-${lastId + 1}`;
  },
  addOrder: function(newOrder: Omit<CustomerOrder, 'id' | 'date'>) {
    const orderToAdd: CustomerOrder = {
        ...newOrder,
        id: this.getNewOrderId(),
        date: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
    }
    this.orders.push(orderToAdd);
    return orderToAdd;
  }
};
