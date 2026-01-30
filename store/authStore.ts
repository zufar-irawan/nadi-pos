import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface AuthState {
    isRegistered: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    userPhone: string | null;
    userName: string | null;

    // Actions
    checkRegistration: () => Promise<void>;
    register: (name: string, phone: string, pin: string) => Promise<void>;
    loginWithPin: (pin: string) => Promise<boolean>;
    logout: () => Promise<void>;
    lockApp: () => void;
}

const PIN_KEY = 'user_pin';
const PHONE_KEY = 'user_phone';
const NAME_KEY = 'user_name';
const PASSWORD_KEY = 'user_password'; // We might generate a password for Supabase

export const useAuthStore = create<AuthState>((set, get) => ({
    isRegistered: false,
    isAuthenticated: false, // Default locked
    isLoading: true,
    userPhone: null,
    userName: null,

    checkRegistration: async () => {
        set({ isLoading: true });
        try {
            const pin = await SecureStore.getItemAsync(PIN_KEY);
            const phone = await SecureStore.getItemAsync(PHONE_KEY);
            const name = await SecureStore.getItemAsync(NAME_KEY);

            if (pin && phone) {
                set({
                    isRegistered: true,
                    userPhone: phone,
                    userName: name
                });
            } else {
                set({ isRegistered: false });
            }
        } catch (e) {
            console.error('Failed to check registration', e);
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (name, phone, pin) => {
        set({ isLoading: true });
        try {
            // 1. Generate a random password for Supabase Auth
            const dummyPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            // 2. Register/Login with Supabase (Shadow Account)
            // Sanitise phone for email
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            const email = `${cleanPhone}@nadi-pos.local`;

            // Try sign up
            let sbError = null;
            try {
                const { error } = await supabase.auth.signUp({
                    email,
                    password: dummyPassword,
                    options: {
                        data: { full_name: name, phone: phone }
                    }
                });
                sbError = error;
            } catch (e) {
                console.warn("Supabase fetch failed (likely config or network)", e);
                // Swallow connection errors to allow offline handling
            }

            if (sbError) {
                console.warn("Supabase signup error:", sbError);
                // Proceed with local reg anyway? 
                if (sbError.message && (sbError.message.includes('JSON Parse error') || sbError.message.includes('Network'))) {
                    console.warn("Proceeding with local registration despite server error");
                }
            }

            // 3. Store Locally
            await SecureStore.setItemAsync(PIN_KEY, pin);
            await SecureStore.setItemAsync(PHONE_KEY, phone);
            await SecureStore.setItemAsync(NAME_KEY, name);
            await SecureStore.setItemAsync(PASSWORD_KEY, dummyPassword);

            set({
                isRegistered: true,
                isAuthenticated: true, // Auto login after register
                userPhone: phone,
                userName: name
            });

        } catch (e) {
            console.error('Registration failed', e);
            throw e;
        } finally {
            set({ isLoading: false });
        }
    },

    loginWithPin: async (pin) => {
        set({ isLoading: true });
        try {
            const storedPin = await SecureStore.getItemAsync(PIN_KEY);
            if (storedPin === pin) {
                set({ isAuthenticated: true });
                return true;
            }
            return false;
        } catch (e) {
            console.error('Login failed', e);
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    lockApp: () => {
        set({ isAuthenticated: false });
    },

    logout: async () => {
        // This would be a "Full Reset" in this context?
        // Or just locking?
        // The requirement says "Ketika sesi pengguna sudah berakhir ... pengguna harus memasukkan PIN"
        // So logout just means Lock usually. 
        // But if we want to "Switch Account", we need a reset.
        // Let's keep logout as "Lock" for now, and maybe add a "Reset Device" function later.
        set({ isAuthenticated: false });
    }
}));
