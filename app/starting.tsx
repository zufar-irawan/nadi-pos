import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const handleRegister = () => {
    router.push('/daftar');
  };

  const handleLogin = () => {
    router.push('/masuk');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Hero Image Section */}
      <View style={styles.heroContainer}>
        <Image
          source={require('../assets/images/starting.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Text Content */}
      <View style={styles.textSection}>
        <Text style={styles.title}>
          Selamat Datang!{'\n'}Masuk atau Daftar
        </Text>
        <Text style={styles.description}>
          Buat akun untuk mulai mengelola dan mendigitalisasikan proses kasir
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRegister}
        >
          <Text style={styles.primaryButtonText}>Daftar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleLogin}
        >
          <Text style={styles.secondaryButtonText}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroContainer: {
    paddingHorizontal: 24,
    marginTop: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 20,
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    backgroundColor: '#B2EBF2',
    borderRadius: 60,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: '#D1D5DB',
  },
  textSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonSection: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#00CCEB',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00CCEB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WelcomeScreen;
