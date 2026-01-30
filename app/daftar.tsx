import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !pin) {
      Alert.alert('Error', 'Mohon lengkapi semua data');
      return;
    }

    if (pin.length < 6) {
      Alert.alert('Error', 'PIN harus 6 digit');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PIN tidak cocok');
      return;
    }

    if (!isChecked) {
      Alert.alert('Error', 'Anda harus menyetujui ketentuan layanan');
      return;
    }

    try {
      await register(name, phone, pin);
      // Navigate to dashboard or setup success
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Gagal Daftar', 'Terjadi kesalahan saat mendaftar.');
    }
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
          <Text style={styles.headerTitle}>Daftar Akun{'\n'}Baru</Text>
          <Text style={styles.headerSubtitle}>
            Masukkan nomor telepon dan buat PIN untuk keamanan
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.formContent}>

            {/* Input Nama */}
            <TextInput
              placeholder="Nama Lengkap / Bisnis"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            {/* Input Phone */}
            <TextInput
              placeholder="Nomor Telepon (misal: 08123...)"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Input PIN */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Buat PIN Baru (6 Angka)"
                placeholderTextColor="#9CA3AF"
                style={styles.passwordInput}
                secureTextEntry={!showPin}
                keyboardType="number-pad"
                maxLength={6}
                value={pin}
                onChangeText={setPin}
              />
              <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                <Feather name={showPin ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Confirm PIN */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Konfirmasi PIN"
                placeholderTextColor="#9CA3AF"
                style={styles.passwordInput}
                secureTextEntry={!showPin}
                keyboardType="number-pad"
                maxLength={6}
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </View>

            {/* Checkbox Persetujuan */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsChecked(!isChecked)}
            >
              <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
                {isChecked && <Feather name="check" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya setuju dengan segala ketentuan
              </Text>
            </TouchableOpacity>

            {/* Tombol Daftar */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Daftar</Text>
            </TouchableOpacity>

            {/* Link Masuk */}
            <TouchableOpacity onPress={() => router.push('/masuk')}>
              <Text style={styles.footerText}>
                Sudah terdaftar di perangkat ini? <Text style={styles.linkText}>Masuk disini</Text>
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
    paddingTop: 40,
    paddingBottom: 60,
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
    top: -40,
    left: -40,
    width: 256,
    height: 256,
    backgroundColor: '#374151',
    borderRadius: 128,
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
    paddingHorizontal: 16,
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
    paddingTop: 40,
    paddingBottom: 40,
    gap: 16,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#6B7280',
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
    marginTop: 16,
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
    marginTop: 16,
  },
  linkText: {
    color: '#10B981', // Green color similar to design
    fontWeight: '700',
  },
});

export default RegisterScreen;
