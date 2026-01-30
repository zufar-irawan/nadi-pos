// store/inventoryStore.ts
import { useSyncExternalStore } from 'react';

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    image?: string;
}

let products: Product[] = [
    {
        id: '1',
        name: 'Kopi Susu Gula Aren',
        price: 18000,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: '2',
        name: 'Croissant Butter',
        price: 25000,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: '3',
        name: 'Americano Hot',
        price: 15000,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: '4',
        name: 'Latte Art',
        price: 22000,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200&h=200',
    },
];

let listeners: Array<() => void> = [];

const emitChange = () => {
    for (let listener of listeners) {
        listener();
    }
};

const inventoryStore = {
    addProduct: (product: Omit<Product, 'id'>) => {
        products = [
            ...products,
            { ...product, id: Math.random().toString(36).substr(2, 9) },
        ];
        emitChange();
    },
    updateProduct: (id: string, updatedProduct: Partial<Product>) => {
        products = products.map((p) =>
            p.id === id ? { ...p, ...updatedProduct } : p
        );
        emitChange();
    },
    deleteProduct: (id: string) => {
        products = products.filter((p) => p.id !== id);
        emitChange();
    },
    getProducts: () => products,
    subscribe: (listener: () => void) => {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
};

export const useInventoryStore = () => {
    const products = useSyncExternalStore(inventoryStore.subscribe, inventoryStore.getProducts);
    return {
        products,
        addProduct: inventoryStore.addProduct,
        updateProduct: inventoryStore.updateProduct,
        deleteProduct: inventoryStore.deleteProduct,
    };
};
