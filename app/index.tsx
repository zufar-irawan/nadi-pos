import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const Dashboard = () => {
  const inventoryItems = [
    { name: 'Nama Produk', variant: 'Varian 1, Varian 2....', price: 'Rp. 10.000,00', stock: 1 },
    { name: 'Nama Produk', variant: 'Varian 1, Varian 2....', price: 'Rp. 10.000,00', stock: 1 },
    { name: 'Nama Produk', variant: 'Varian 1, Varian 2....', price: 'Rp. 10.000,00', stock: 1 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.iconButton}>
              <Feather name="grid" size={24} color="#4b5563" />
            </View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <View style={{ width: 40 }} /> {/* Spacer */}
          </View>

          {/* Insight Penjualan Card */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Insight Penjualan</Text>
            <View style={styles.insightStatsRow}>
              <View style={[styles.statBox, styles.statBoxIncome]}>
                <Text style={styles.statLabel}>Pendapatan</Text>
                <Text style={styles.statValue}>Rp100.000</Text>
              </View>
              <View style={[styles.statBox, styles.statBoxExpense]}>
                <Text style={styles.statLabel}>Pengeluaran</Text>
                <Text style={styles.statValue}>Rp100.000</Text>
              </View>
            </View>
          </View>

          {/* Quick Action */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Action</Text>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="home" size={18} color="#9ca3af" />
                <Text style={styles.actionButtonText}>Kasir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="package" size={18} color="#9ca3af" />
                <Text style={styles.actionButtonText}>Inventori</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Inventori List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inventori</Text>
            <View style={styles.inventoryList}>
              {inventoryItems.map((item, index) => (
                <View key={index} style={styles.inventoryItem}>
                  <View style={styles.inventoryImagePlaceholder} />
                  <View style={styles.inventoryInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemVariant}>{item.variant}</Text>
                    <Text style={styles.itemPriceLabel}>Harga</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                  <View style={styles.inventoryStock}>
                    <Text style={styles.stockLabel}>Stok</Text>
                    <Text style={styles.stockValue}>{item.stock}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>Lihat selengkapnya</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  insightCard: {
    backgroundColor: '#22d3ee', // Fallback for gradient (cyan-400)
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 12,
  },
  insightStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  statBoxIncome: {
    backgroundColor: 'rgba(22, 163, 74, 0.8)', // green-600/80
  },
  statBoxExpense: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)', // red-500/80
  },
  statLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  statValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#374151',
    fontSize: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderColor: '#f3f4f6',
    borderWidth: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inventoryList: {
    gap: 16,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
  },
  inventoryImagePlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  },
  inventoryInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1f2937',
  },
  itemVariant: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemPriceLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  inventoryStock: {
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  stockValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeMoreButton: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
});

export default Dashboard;