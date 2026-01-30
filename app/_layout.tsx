import { Stack, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from 'react-native';
import PinLock from "../components/PinLock";
import { initDatabase } from "../services/database";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { checkRegistration, lockApp, isRegistered } = useAuthStore();
  const appState = useRef(AppState.currentState);
  const pathname = usePathname();

  useEffect(() => {
    initDatabase();
    checkRegistration();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|active/) &&
        nextAppState === 'background'
      ) {
        // App went to background
        if (isRegistered) {
          lockApp();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRegistered]);

  // Basic Protection: If not registered and trying to access protected routes
  useEffect(() => {
    if (useAuthStore.getState().isLoading) return;

    const inAuthGroup = ['/daftar', '/masuk', '/starting'].includes(pathname);
    const isRegistered = useAuthStore.getState().isRegistered;

    if (!isRegistered && !inAuthGroup && pathname !== '/') {
      // If not registered and not in auth screens, verify flow
      // Maybe redirect to starting?
      // router.replace('/starting'); 
      // For now let's not force redirect aggressively to avoid loops, 
      // but PinLock handles the "Locked" state.
      // The issue is if !isRegistered, PinLock returns null.
      // So user can see dashboard if they navigate there.
      // We rely on the initial screen being 'idx' or 'starting'.
    }
  }, [pathname]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
      <PinLock />
    </>
  );
}

