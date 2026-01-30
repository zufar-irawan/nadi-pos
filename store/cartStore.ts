// store/cartStore.ts
import { create } from 'zustand';
import { Product } from './inventoryStore';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addToCart: (product) =>
        set((state) => {
            const existingItem = state.items.find(item => item.product.id === product.id);
            if (existingItem) {
                return {
                    items: state.items.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return { items: [...state.items, { product, quantity: 1 }] };
        }),
    removeFromCart: (productId) =>
        set((state) => ({
            items: state.items.filter(item => item.product.id !== productId)
        })),
    updateQuantity: (productId, quantity) =>
        set((state) => {
            if (quantity <= 0) {
                return {
                    items: state.items.filter(item => item.product.id !== productId)
                };
            }
            return {
                items: state.items.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity }
                        : item
                )
            };
        }),
    clearCart: () => set({ items: [] }),
    getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
}));
