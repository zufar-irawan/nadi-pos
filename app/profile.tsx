import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [shopName, setShopName] = useState('Nadi Coffee & Eatery');
  const [email, setEmail] = useState('owner@nadicoffee.com');
  const [phone, setPhone] = useState('0812-3456-7890');
  const [address, setAddress] = useState('Jl. Kenangan No. 123, Jakarta');

  const menuItems = [
    {
      icon: <MaterialIcons name="dashboard" size={24} color="#9CA3AF" />,
      activeIcon: <MaterialIcons name="dashboard" size={24} color="#fff" />,
      label: 'Dashboard',
      route: '/dashboard',
      active: false
    },
    {
      icon: <Feather name="package" size={24} color="#9CA3AF" />,
      activeIcon: <Feather name="package" size={24} color="#fff" />,
      label: 'Persediaan',
      route: '/inventory',
      active: false
    },
    {
      icon: <Feather name="shopping-cart" size={24} color="#9CA3AF" />,
      activeIcon: <Feather name="shopping-cart" size={24} color="#fff" />,
      label: 'Kasir',
      route: '/pos',
      active: false
    },
    {
      icon: <MaterialIcons name="history" size={24} color="#9CA3AF" />,
      activeIcon: <MaterialIcons name="history" size={24} color="#fff" />,
      label: 'Riwayat Penjualan',
      route: '/history',
      active: false
    },
    {
      icon: <Feather name="file-text" size={24} color="#9CA3AF" />,
      activeIcon: <Feather name="file-text" size={24} color="#fff" />,
      label: 'Laporan',
      route: '/reports',
      active: false
    },
  ];

  const handleNavigation = (route: string) => {
    if (route === '/dashboard') {
      router.dismissAll();
      router.replace('/dashboard');
    } else {
      router.push(route as any);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save this to a database or local storage
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Toko</Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Simpan</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Business Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.storeIconContainer}>
            <MaterialIcons name="store" size={32} color="#4B5563" />
          </View>
          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={shopName}
                  onChangeText={setShopName}
                  placeholder="Nama Toko"
                />
                <TextInput
                  style={[styles.input, { fontSize: 13 }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <Text style={styles.businessName}>{shopName}</Text>
                <Text style={styles.email}>{email}</Text>
              </>
            )}
          </View>
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Feather name="edit-2" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {isEditing && (
          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Nomor Telepon</Text>
            <TextInput
              style={styles.formInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Contoh: 08123456789"
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Alamat Toko</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Alamat lengkap toko"
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, item.active && styles.menuItemActive]}
              onPress={() => handleNavigation(item.route)}
            >
              <View style={[styles.menuIconContainer, item.active && styles.menuIconActive]}>
                {item.active ? item.activeIcon : item.icon}
              </View>
              <Text style={[styles.menuLabel, item.active && styles.menuLabelActive]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#E5E7EB" style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/starting')}>
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Keluar Aplikasi</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versi 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  content: {
    padding: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  storeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: '#6B7280',
  },
  editButton: {
    padding: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  editForm: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#06B6D4', // Cyan color from original design
  },
  menuIconContainer: {
    marginRight: 16,
  },
  menuIconActive: {
    // Styling for active icon if needed
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  menuLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  chevron: {
    opacity: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#D1D5DB',
    fontSize: 12,
  }
});
