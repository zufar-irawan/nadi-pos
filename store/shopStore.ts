import { create } from 'zustand';
import { getDB } from '../services/database';

interface ShopProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface ShopState {
    profile: ShopProfile;
    isLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (profile: ShopProfile) => Promise<void>;
}

const DEFAULT_PROFILE: ShopProfile = {
    name: 'Nadi Coffee & Eatery',
    email: 'owner@nadicoffee.com',
    phone: '0812-3456-7890',
    address: 'Jl. Kenangan No. 123, Jakarta'
};

export const useShopStore = create<ShopState>((set, get) => ({
    profile: DEFAULT_PROFILE,
    isLoading: false,

    fetchProfile: async () => {
        set({ isLoading: true });
        try {
            const db = await getDB();
            const result = await db.getAllAsync<{ key: string, value: string }>(
                `SELECT key, value FROM local_meta WHERE key IN ('shop_name', 'shop_email', 'shop_phone', 'shop_address')`
            );

            // Convert array of {key, value} to object
            const loadedData: Partial<ShopProfile> = {};
            result.forEach(row => {
                if (row.key === 'shop_name') loadedData.name = row.value;
                if (row.key === 'shop_email') loadedData.email = row.value;
                if (row.key === 'shop_phone') loadedData.phone = row.value;
                if (row.key === 'shop_address') loadedData.address = row.value;
            });

            // Merge with default or current state
            set((state) => ({
                profile: { ...state.profile, ...loadedData }
            }));

        } catch (error) {
            console.error('Failed to fetch shop profile:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (newProfile: ShopProfile) => {
        set({ isLoading: true });
        try {
            const db = await getDB();

            // Upsert each field
            await db.runAsync(`INSERT OR REPLACE INTO local_meta (key, value) VALUES (?, ?)`, 'shop_name', newProfile.name);
            await db.runAsync(`INSERT OR REPLACE INTO local_meta (key, value) VALUES (?, ?)`, 'shop_email', newProfile.email);
            await db.runAsync(`INSERT OR REPLACE INTO local_meta (key, value) VALUES (?, ?)`, 'shop_phone', newProfile.phone);
            await db.runAsync(`INSERT OR REPLACE INTO local_meta (key, value) VALUES (?, ?)`, 'shop_address', newProfile.address);

            set({ profile: newProfile });
        } catch (error) {
            console.error('Failed to update shop profile:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
