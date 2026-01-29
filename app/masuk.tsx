import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // In a real app, you would handle login here
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerDecor} />
          <Text style={styles.headerTitle}>Masuk ke{'\n'}Akun Anda</Text>
          <Text style={styles.headerSubtitle}>
            Masuk ke akun anda untuk lanjut mengelola usaha anda
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.formContent}>
            
            {/* Input Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Input Password */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Tombol Masuk */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Masuk</Text>
            </TouchableOpacity>

            {/* Link Daftar */}
            <TouchableOpacity onPress={() => router.push('/daftar')}>
              <Text style={styles.footerText}>
                Belum punya akun? <Text style={styles.linkText}>Daftar disini</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    zIndex: 10,
  },
  headerDecor: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 280,
    height: 280,
    backgroundColor: '#374151',
    borderRadius: 140,
    opacity: 0.2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  formContent: {
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 40,
    gap: 20,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    fontSize: 14,
    color: '#111827',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 14,
    color: '#111827',
  },
  button: {
    backgroundColor: '#00CCEB',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00CCEB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 24,
  },
  linkText: {
    color: '#00E676', // Bright green color from design
    fontWeight: '700',
  },
});

export default LoginScreen;
