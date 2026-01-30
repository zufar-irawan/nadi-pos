import { create } from 'zustand';
import { getDB } from '../services/database';
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
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    addOrder: (order: Order) => Promise<void>;
    getOrdersByMonth: (month: number, year: number) => Order[]; // Still useful for UI filtering if all loaded, or can be async
    getOrdersByRange: (startDate: Date, endDate: Date) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const db = await getDB();

            // Get transactions
            const transactions = await db.getAllAsync<any>('SELECT * FROM transactions_local ORDER BY created_at DESC');

            // For each transaction, we technically need items and payment method.
            // Be careful with N+1 queries here.

            const orders: Order[] = [];

            for (const t of transactions) {
                // Get items
                const itemsResult = await db.getAllAsync<any>(`
                    SELECT ti.qty, ti.price, p.id, p.name, p.price as p_price
                    FROM transaction_items_local ti
                    JOIN products p ON ti.product_id = p.id
                    WHERE ti.transaction_id = ?
                `, [t.id]);

                const items: OrderItem[] = itemsResult.map(i => ({
                    quantity: i.qty,
                    product: {
                        id: i.id,
                        name: i.name,
                        price: i.p_price,
                        stock: 0
                    }
                }));

                // Get payment method (assuming one successful attempt or just taking the last one)
                const payment = await db.getFirstAsync<any>(`
                    SELECT method FROM payment_attempts_local WHERE transaction_id = ? LIMIT 1
                `, [t.id]);

                orders.push({
                    id: t.id,
                    items: items,
                    totalAmount: t.total,
                    paymentMethod: payment ? payment.method : 'Unknown',
                    date: t.created_at
                });
            }

            set({ orders });

        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addOrder: async (order) => {
        try {
            const db = await getDB();
            await db.withTransactionAsync(async () => {
                // Insert Transaction
                await db.runAsync(
                    'INSERT INTO transactions_local (id, subtotal, tax, discount, total, status, created_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [order.id, order.totalAmount, 0, 0, order.totalAmount, 'completed', order.date, 'pending']
                );

                // Insert Items
                for (const item of order.items) {
                    const itemId = Math.random().toString(36).substr(2, 9);
                    await db.runAsync(
                        'INSERT INTO transaction_items_local (id, transaction_id, product_id, qty, price) VALUES (?, ?, ?, ?, ?)',
                        [itemId, order.id, item.product.id, item.quantity, item.product.price]
                    );
                }

                // Insert Payment Attempt (Successful one)
                const paymentId = Math.random().toString(36).substr(2, 9);
                await db.runAsync(
                    'INSERT INTO payment_attempts_local (id, transaction_id, method, status, sync_status) VALUES (?, ?, ?, ?, ?)',
                    [paymentId, order.id, order.paymentMethod, 'success', 'pending']
                );
            });

            // Update local state
            set((state) => ({
                orders: [order, ...state.orders]
            }));
        } catch (error) {
            console.error('Failed to add order:', error);
        }
    },

    // These getters filter from the currently loaded 'orders'. 
    // If 'orders' contains all history, this works. If we implement pagination later, these need to be async DB queries.
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

