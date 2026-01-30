// store/inventoryStore.ts
import { create } from 'zustand';
import { getDB } from '../services/database';

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    image?: string;
    sync_status?: 'synced' | 'pending' | 'failed';
}

interface InventoryState {
    products: Product[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
    products: [],
    isLoading: false,
    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const db = await getDB();
            const result = await db.getAllAsync<any>(`
                SELECT p.*, i.stock 
                FROM products p
                LEFT JOIN inventory_cache i ON p.id = i.product_id
            `);
            const products: Product[] = result.map(row => ({
                id: row.id,
                name: row.name,
                price: row.price,
                stock: row.stock || 0,
                sync_status: row.sync_status as any,
                // Note: Image is not in schema yet, handling gracefully if needed or added later
            }));
            set({ products });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            set({ isLoading: false });
        }
    },
    addProduct: async (product) => {
        try {
            const db = await getDB();
            const newId = Math.random().toString(36).substr(2, 9); // Simple ID generation
            const now = new Date().toISOString();

            await db.withTransactionAsync(async () => {
                await db.runAsync(
                    'INSERT INTO products (id, name, price, updated_at, sync_status) VALUES (?, ?, ?, ?, ?)',
                    [newId, product.name, product.price, now, 'pending']
                );
                await db.runAsync(
                    'INSERT INTO inventory_cache (product_id, stock, updated_at) VALUES (?, ?, ?)',
                    [newId, product.stock, now]
                );
            });

            // Refresh list
            await get().fetchProducts();
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    },
    updateProduct: async (id, updatedProduct) => {
        try {
            const db = await getDB();
            const now = new Date().toISOString();

            await db.withTransactionAsync(async () => {
                if (updatedProduct.name !== undefined || updatedProduct.price !== undefined) {
                    await db.runAsync(
                        'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), updated_at = ?, sync_status = ? WHERE id = ?',
                        [updatedProduct.name ?? null, updatedProduct.price ?? null, now, 'pending', id]
                    );
                }

                if (updatedProduct.stock !== undefined) {
                    await db.runAsync(
                        'INSERT OR REPLACE INTO inventory_cache (product_id, stock, updated_at) VALUES (?, ?, ?)',
                        [id, updatedProduct.stock, now]
                    );
                }
            });

            await get().fetchProducts();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    },
    deleteProduct: async (id) => {
        try {
            const db = await getDB();
            await db.withTransactionAsync(async () => {
                await db.runAsync('DELETE FROM inventory_cache WHERE product_id = ?', [id]);
                await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
            });
            await get().fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    },
}));

