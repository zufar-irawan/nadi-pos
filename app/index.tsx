import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  useEffect(() => {
    // Simulasi loading selama 3 detik sebelum masuk ke dashboard
    const timer = setTimeout(() => {
      router.replace('/starting');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 20,
  },
  footer: {
    paddingBottom: 50,
  },
});
