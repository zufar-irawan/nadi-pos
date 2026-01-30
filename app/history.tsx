import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/orderStore';

const { width } = Dimensions.get('window');

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function HistoryScreen() {
    const { getOrdersByMonth } = useOrderStore();

    const currentDate = new Date();
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const orders = getOrdersByMonth(selectedMonthIndex, selectedYear);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <Feather name="menu" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Riwayat Penjualan</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            {/* Month Filter */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
                    {months.map((month, index) => (
                        <TouchableOpacity
                            key={month}
                            style={[styles.filterChip, selectedMonthIndex === index && styles.filterChipActive]}
                            onPress={() => setSelectedMonthIndex(index)}
                        >
                            <Text style={[styles.filterText, selectedMonthIndex === index && styles.filterTextActive]}>
                                {month}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {orders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Belum ada transaksi di bulan ini</Text>
                    </View>
                ) : (
                    orders.map((order) => {
                        const orderDate = new Date(order.date);
                        const day = orderDate.getDate();
                        // Format: Dec 27, 2025
                        const dateString = orderDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

                        return (
                            <TouchableOpacity
                                key={order.id}
                                style={styles.card}
                                onPress={() => router.push({ pathname: '/order-detail', params: { id: order.id } })}
                            >
                                <View style={styles.iconContainer}>
                                    <Ionicons name="receipt" size={32} color="#9CA3AF" />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.orderId}>{order.id}</Text>
                                    <Text style={styles.orderDate}>{dateString}</Text>

                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>Rp{order.totalAmount.toLocaleString('id-ID')}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
                            </TouchableOpacity>
                        );
                    })
                )}
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
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    filterContainer: {
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    filterContent: {
        paddingHorizontal: 24,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#10B981', // Green like in dashboard/image 1
        borderColor: '#10B981',
    },
    filterText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    content: {
        padding: 24,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 16,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
    },
    emptyText: {
        marginTop: 16,
        color: '#9CA3AF',
        fontSize: 16,
    }
});
