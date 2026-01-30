import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useOrderStore } from '../store/orderStore';
import { useShopStore } from '../store/shopStore';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { userName } = useAuthStore();
  const { products, fetchProducts } = useInventoryStore();
  const { orders, fetchOrders } = useOrderStore();
  const { profile, fetchProfile: fetchShopProfile } = useShopStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchProducts(), fetchOrders(), fetchShopProfile()]);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // --- Statistics Calculation ---
  const today = new Date();
  const todayDateStr = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDateStr = yesterday.toDateString();

  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === todayDateStr);
  const yesterdayOrders = orders.filter(o => new Date(o.date).toDateString() === yesterdayDateStr);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const todayCount = todayOrders.length;
  const yesterdayCount = yesterdayOrders.length;

  const todayItemsSold = todayOrders.reduce((sum, o) => sum + o.items.reduce((acc, i) => acc + i.quantity, 0), 0);

  // Revenue Trend
  let revTrend = 0;
  if (yesterdayRevenue > 0) {
    revTrend = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
  } else if (todayRevenue > 0) {
    revTrend = 100;
  }

  // Order Trend
  const orderDiff = todayCount - yesterdayCount;

  // Inventory Logic
  const lowStockProducts = products
    .filter(p => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3);

  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Navigation / Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/profile')}>
          <Feather name="menu" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>Halo, {userName || 'Pemilik Toko'} 👋</Text>
          <Text style={styles.shopName}>{profile.name}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        {/* Insight Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Insight Bisnis</Text>
            <TouchableOpacity onPress={() => router.push('/reports')}>
              <Text style={styles.seeAllText}>Detail {'>'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightScroll}>
            <View style={[styles.insightCard, styles.cardPrimary]}>
              <View style={styles.cardIconBg}>
                <MaterialCommunityIcons name="cash-multiple" size={24} color="#fff" />
              </View>
              <Text style={styles.cardLabelLight}>Omzet Hari Ini</Text>
              <Text style={styles.cardValueLight}>Rp{todayRevenue.toLocaleString('id-ID')}</Text>
              <View style={styles.trendContainer}>
                <Ionicons name={revTrend >= 0 ? "arrow-up" : "arrow-down"} size={14} color={revTrend >= 0 ? "#A7F3D0" : "#FCA5A5"} />
                <Text style={revTrend >= 0 ? styles.trendTextPositive : styles.trendTextNegative}> {Math.abs(revTrend).toFixed(1)}% dari kemarin</Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={[styles.cardIconBg, { backgroundColor: '#EEF2FF' }]}>
                <MaterialCommunityIcons name="receipt" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.cardLabel}>Transaksi</Text>
              <Text style={styles.cardValue}>{todayCount} Order</Text>
              <View style={styles.trendContainer}>
                <Ionicons name={orderDiff >= 0 ? "arrow-up" : "arrow-down"} size={14} color={orderDiff >= 0 ? "#10B981" : "#EF4444"} />
                <Text style={orderDiff >= 0 ? styles.trendTextPositiveText : styles.trendTextNegativeText}> {orderDiff > 0 ? '+' : ''}{orderDiff} Order</Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={[styles.cardIconBg, { backgroundColor: '#FFF7ED' }]}>
                <MaterialCommunityIcons name="cube-outline" size={24} color="#F97316" />
              </View>
              <Text style={styles.cardLabel}>Terjual</Text>
              <Text style={styles.cardValue}>{todayItemsSold} Item</Text>
              <View style={styles.trendContainer}>
                <Ionicons name="remove" size={14} color="#9CA3AF" />
                <Text style={styles.trendTextNeutral}> Stabil</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Quick Buttons (Tombol Cepat) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/pos')}>
              <View style={[styles.actionIcon, { backgroundColor: '#4F46E5' }]}>
                <Ionicons name="calculator" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Kasir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/add-product')}>
              <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="add-circle" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Tambah Produk</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/inventory')}>
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
                <MaterialCommunityIcons name="barcode-scan" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Scan Stok</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/history')}>
              <View style={[styles.actionIcon, { backgroundColor: '#EC4899' }]}>
                <Ionicons name="people" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Pelanggan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Inventori & Stok</Text>
            <TouchableOpacity onPress={() => router.push('/inventory')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {/* Low Stock Alert */}
          {lowStockCount > 0 && (
            <View style={styles.alertBox}>
              <Ionicons name="warning" size={20} color="#B45309" />
              <Text style={styles.alertText}>{lowStockCount} Produk stok menipis, segera restock!</Text>
            </View>
          )}

          <View style={styles.inventoryList}>
            {lowStockProducts.length === 0 ? (
              <Text style={{ color: '#6B7280', fontStyle: 'italic', marginLeft: 4 }}>Stok aman semua</Text>
            ) : (
              lowStockProducts.map(item => (
                <InventoryItem
                  key={item.id}
                  name={item.name}
                  stock={item.stock}
                  unit="Pcs"
                  status={item.stock === 0 ? 'critical' : 'low'}
                  image={item.image || 'https://via.placeholder.com/100'}
                />
              ))
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function InventoryItem({ name, stock, unit, status, image }: { name: string, stock: number, unit: string, status: 'good' | 'low' | 'critical', image: string }) {
  const getStatusColor = () => {
    if (status === 'critical') return '#EF4444';
    if (status === 'low') return '#F59E0B';
    return '#10B981';
  };

  const getStatusBg = () => {
    if (status === 'critical') return '#FEF2F2';
    if (status === 'low') return '#FFFBEB';
    return '#ECFDF5';
  }

  const getStatusText = () => {
    if (status === 'critical') return 'Kritis';
    if (status === 'low') return 'Menipis';
    return 'Aman';
  }

  return (
    <View style={styles.inventoryItem}>
      <Image source={{ uri: image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemStock}>Sisa: <Text style={{ fontWeight: '700' }}>{stock} {unit}</Text></Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  profileButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: '#E0E7FF',
    borderRadius: 24,
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  insightScroll: {
    paddingRight: 24,
    gap: 16,
  },
  insightCard: {
    width: width * 0.42,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPrimary: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    width: width * 0.5,
  },
  cardIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardLabelLight: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  cardValueLight: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendTextPositive: {
    fontSize: 12,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  trendTextPositiveText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  trendTextNeutral: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  trendTextNegative: {
    fontSize: 12,
    color: '#FCA5A5',
    fontWeight: '600',
  },
  trendTextNegativeText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: 16,
  },
  alertText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '500',
    flex: 1,
  },
  inventoryList: {
    gap: 12,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  }
});
