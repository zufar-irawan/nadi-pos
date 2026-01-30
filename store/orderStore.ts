import { create } from 'zustand';
import { Product } from './inventoryStore';

export interface OrderItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string; // 'Cash' | 'QRIS' | 'Debit'
    date: string; // ISO String
}

interface OrderState {
    orders: Order[];
    addOrder: (order: Order) => void;
    getOrdersByMonth: (month: number, year: number) => Order[];
    getOrdersByRange: (startDate: Date, endDate: Date) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [
        // Today (Jan 29, 2026)
        {
            id: `ORD-${Date.now()}`,
            items: [{ product: { id: '1', name: 'Kopi', price: 18000, stock: 10 }, quantity: 2 }],
            totalAmount: 36000,
            paymentMethod: 'Cash',
            date: new Date().toISOString()
        },
        // Yesterday
        {
            id: 'ORD-YESTERDAY',
            items: [],
            totalAmount: 125000,
            paymentMethod: 'QRIS',
            date: new Date(Date.now() - 86400000).toISOString()
        },
        // Week 1 Jan 2026
        { id: 'ORD-JAN05', items: [], totalAmount: 450000, paymentMethod: 'Cash', date: new Date(2026, 0, 5).toISOString() },
        // Week 2 Jan 2026
        { id: 'ORD-JAN12', items: [], totalAmount: 320000, paymentMethod: 'Debit', date: new Date(2026, 0, 12).toISOString() },
        // Week 3 Jan 2026
        { id: 'ORD-JAN19', items: [], totalAmount: 550000, paymentMethod: 'QRIS', date: new Date(2026, 0, 19).toISOString() },
        { id: 'ORD-JAN21', items: [], totalAmount: 150000, paymentMethod: 'Cash', date: new Date(2026, 0, 21).toISOString() },
        // Week 4 Jan 2026
        { id: 'ORD-JAN26', items: [], totalAmount: 280000, paymentMethod: 'Cash', date: new Date(2026, 0, 26).toISOString() },
        { id: 'ORD-JAN28', items: [], totalAmount: 180000, paymentMethod: 'QRIS', date: new Date(2026, 0, 28).toISOString() },
    ],
    addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
    })),
    getOrdersByMonth: (month, year) => {
        const { orders } = get();
        return orders.filter(order => {
            const d = new Date(order.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
    },
    getOrdersByRange: (startDate, endDate) => {
        const { orders } = get();
        return orders.filter(order => {
            const d = new Date(order.date);
            const dTime = d.getTime();
            const sTime = startDate.getTime();
            const eTime = endDate.getTime();
            return dTime >= sTime && dTime <= eTime;
        });
    }
}));
