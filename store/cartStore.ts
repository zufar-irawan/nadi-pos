// store/cartStore.ts
import { create } from 'zustand';
import { getDB } from '../services/database';
import { Product } from './inventoryStore';

export interface CartItem {
    id: string; // unique item id from cart_items table
    product: Product;
    quantity: number;
}

interface CartState {
    cartId: string | null;
    items: CartItem[];
    isLoading: boolean;
    initCart: () => Promise<void>;
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cartId: null,
    items: [],
    isLoading: false,

    initCart: async () => {
        set({ isLoading: true });
        try {
            const db = await getDB();

            // simple strategy: get the most recent cart active (or just a single draft cart)
            let result = await db.getAllAsync<{ id: string }>('SELECT id FROM cart_draft ORDER BY created_at DESC LIMIT 1');
            let currentCartId = result.length > 0 ? result[0].id : null;

            if (!currentCartId) {
                // Create new cart
                currentCartId = Math.random().toString(36).substr(2, 9);
                await db.runAsync('INSERT INTO cart_draft (id, created_at) VALUES (?, ?)', [currentCartId, new Date().toISOString()]);
            }

            set({ cartId: currentCartId });

            // Load items
            const itemsResult = await db.getAllAsync<any>(`
                SELECT ci.id as item_id, ci.qty, ci.price, p.id as p_id, p.name as p_name, p.price as p_price
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = ?
            `, [currentCartId]);

            const items: CartItem[] = itemsResult.map(row => ({
                id: row.item_id,
                quantity: row.qty,
                product: {
                    id: row.p_id,
                    name: row.p_name,
                    price: row.p_price,
                    stock: 0, // We might need to join inventory if stock is needed here
                }
            }));

            set({ items });

        } catch (error) {
            console.error('Failed to init cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (product) => {
        try {
            const { cartId, items } = get();
            if (!cartId) return;

            const existingItem = items.find(item => item.product.id === product.id);
            const db = await getDB();

            if (existingItem) {
                const newQty = existingItem.quantity + 1;
                await db.runAsync('UPDATE cart_items SET qty = ? WHERE id = ?', [newQty, existingItem.id]);
                // Optimistic update
                set({
                    items: items.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: newQty }
                            : item
                    )
                });
            } else {
                const newItemId = Math.random().toString(36).substr(2, 9);
                await db.runAsync(
                    'INSERT INTO cart_items (id, cart_id, product_id, qty, price) VALUES (?, ?, ?, ?, ?)',
                    [newItemId, cartId, product.id, 1, product.price]
                );
                // Optimistic update
                set({ items: [...items, { id: newItemId, product, quantity: 1 }] });
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            await get().initCart(); // revert/refresh on error
        }
    },

    removeFromCart: async (productId) => {
        try {
            const { items, cartId } = get();
            if (!cartId) return;

            const itemToRemove = items.find(item => item.product.id === productId);
            if (itemToRemove) {
                const db = await getDB();
                await db.runAsync('DELETE FROM cart_items WHERE id = ?', [itemToRemove.id]);
                set({
                    items: items.filter(item => item.product.id !== productId)
                });
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            await get().initCart();
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            const { items, cartId } = get();
            if (!cartId) return;

            if (quantity <= 0) {
                await get().removeFromCart(productId);
                return;
            }

            const itemToUpdate = items.find(item => item.product.id === productId);
            if (itemToUpdate) {
                const db = await getDB();
                await db.runAsync('UPDATE cart_items SET qty = ? WHERE id = ?', [quantity, itemToUpdate.id]);
                set({
                    items: items.map(item =>
                        item.product.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                });
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            await get().initCart();
        }
    },

    clearCart: async () => {
        try {
            const { cartId } = get();
            if (!cartId) return; // Should likely create one if missing, but let's assume initCart called.

            const db = await getDB();
            await db.runAsync('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
            set({ items: [] });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    },

    getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
}));

