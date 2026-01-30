import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/orderStore';

const { width } = Dimensions.get('window');

// Mock function to get week number of month
const getWeekOfMonth = (date: Date) => {
    const day = date.getDate();
    return Math.min(Math.ceil(day / 7), 4); // Cap at 4 weeks for simplicity
};

// Helper to get Day name
const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ming'];

const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
        return `Rp${(value / 1000000).toFixed(1).replace(/\.0$/, '')}jt`;
    }
    if (value >= 100000) {
        return `Rp${(value / 1000).toFixed(0)}rb`;
    }
    return `Rp${value.toLocaleString('id-ID')}`;
};

export default function ReportsScreen() {
    const { orders } = useOrderStore();

    // -- Calculations --
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayDateStr = now.toDateString();

    // 1. Today's Metrics
    const todayOrders = orders.filter(o => new Date(o.date).toDateString() === todayDateStr);
    const totalSalesToday = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const estimatedCostToday = totalSalesToday * 0.6; // Mock: 60% is cost

    // 2. Monthly Chart Data (Weekly buckets)
    const monthOrders = orders.filter(o => {
        const d = new Date(o.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Initialize [Week 1, Week 2, Week 3, Week 4]
    const weeklySales = [0, 0, 0, 0];
    monthOrders.forEach(o => {
        const d = new Date(o.date);
        const weekIdx = getWeekOfMonth(d) - 1;
        if (weekIdx >= 0 && weekIdx < 4) {
            weeklySales[weekIdx] += o.totalAmount;
        }
    });

    const maxWeeklySales = Math.max(...weeklySales, 100000); // Avoid div by zero

    // 3. Weekly Chart Data (Daily buckets: Mon-Sun)
    // Get start of current week (Monday)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay() || 7; // 1 (Mon) - 7 (Sun)
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekOrders = orders.filter(o => {
        const d = new Date(o.date);
        return d >= startOfWeek && d <= endOfWeek;
    });

    const dailySales = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    weekOrders.forEach(o => {
        const d = new Date(o.date);
        let dayIdx = d.getDay() - 1; // Mon=1 -> 0, Sun=0 -> -1
        if (dayIdx === -1) dayIdx = 6; // Fix Sun
        dailySales[dayIdx] += o.totalAmount;
    });

    const maxDailySales = Math.max(...dailySales, 100000);

    // 4. Cashflow (Month)
    const totalSalesMonth = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCostMonth = totalSalesMonth * 0.45; // Mock 45% cost for variety
    // Pie chart segments
    const pieData = [
        { label: 'Pemasukan', value: totalSalesMonth, color: '#991B1B' }, // Dark Red
        { label: 'Pengeluaran', value: totalCostMonth, color: '#F87171' } // Light Red
    ];
    const totalCashflow = totalSalesMonth + totalCostMonth || 1;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Laporan</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.subHeader}>Pendapatan Hari ini</Text>

                {/* Metrics Row */}
                <View style={styles.row}>
                    {/* Total Penjualan Card */}
                    <View style={styles.card}>
                        <View style={[styles.titleRow, { justifyContent: 'space-between' }]}>
                            <Text style={styles.cardLabel}>Total Penjualan</Text>
                            <MaterialCommunityIcons name="history" size={20} color="#111827" />
                        </View>
                        <Text style={styles.cardSub}>Hari ini</Text>
                        <Text style={[styles.cardValue, { color: '#10B981' }]}>
                            Rp{totalSalesToday.toLocaleString('id-ID')}
                        </Text>
                        <View style={styles.trendRow}>
                            <Ionicons name="trending-up" size={16} color="#10B981" />
                            <Text style={styles.trendText}>+50%</Text>
                        </View>
                    </View>

                    {/* Perkiraan Biaya Card */}
                    <View style={styles.card}>
                        <View style={[styles.titleRow, { justifyContent: 'space-between' }]}>
                            <Text style={styles.cardLabel}>Perkiraan Biaya</Text>
                            <Ionicons name="hourglass-outline" size={20} color="#111827" />
                        </View>
                        <Text style={styles.cardSub}>Hari ini</Text>
                        <Text style={[styles.cardValue, { color: '#EF4444' }]}>
                            Rp{estimatedCostToday.toLocaleString('id-ID')}
                        </Text>
                        <View style={styles.trendRow}>
                            <Ionicons name="trending-up" size={16} color="#EF4444" />
                            <Text style={[styles.trendText, { color: '#EF4444' }]}>+50%</Text>
                        </View>
                    </View>
                </View>

                {/* --- Chart Section (Horizontal Scroll) --- */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartsContainer}>

                    {/* Chart 1: Monthly Sales (Weeks) */}
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Total Penjualan Bulan ini</Text>
                        <View style={styles.barChart}>
                            {weeklySales.map((val, idx) => {
                                const heightPercent = (val / maxWeeklySales) * 100;
                                return (
                                    <View key={idx} style={styles.barWrapper}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                                        </View>
                                        <Text style={styles.barLabel}>Minggu {idx + 1}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>

                    {/* Chart 2: Weekly Sales (Days) */}
                    <View style={[styles.chartCard, { marginLeft: 16 }]}>
                        <Text style={styles.chartTitle}>Total Penjualan Minggu ini</Text>
                        <View style={styles.barChart}>
                            {dailySales.map((val, idx) => {
                                const heightPercent = (val / maxDailySales) * 100;
                                return (
                                    <View key={idx} style={styles.barWrapper}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${heightPercent}%`, backgroundColor: '#4F46E5', width: 8 }]} />
                                        </View>
                                        <Text style={styles.barLabel}>{days[idx]}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>

                </ScrollView>

                {/* --- Cashflow Pie Chart --- */}
                <View style={styles.cashflowCard}>
                    <Text style={styles.chartTitle}>Cashflow Bulan ini</Text>

                    <View style={styles.pieContainer}>

                        <View style={styles.donutWrapper}>
                            <View style={[styles.donutSegment, {
                                borderColor: '#72f37d', // Dark Background Ring 
                                borderWidth: 30,
                                borderRadius: 100,
                                width: 200,
                                height: 200,
                                position: 'absolute'
                            }]} />
                            <View style={[styles.donutSegment, {
                                borderTopColor: '#F87171', // Top Half
                                borderRightColor: '#F87171', // Top Right
                                borderBottomColor: 'transparent',
                                borderLeftColor: 'transparent',
                                borderWidth: 30,
                                borderRadius: 100,
                                width: 200,
                                height: 200,
                                position: 'absolute',
                                transform: [{ rotate: '45deg' }]
                            }]} />

                            {/* Inner White Circle to make it a donut */}
                            <View style={styles.innerCircle}>
                                <Text style={[styles.centerValue, { fontSize: 20 }]}>
                                    {formatCurrencyShort(totalSalesMonth)}
                                </Text>
                                <Text style={styles.centerLabel}>Pemasukan</Text>
                            </View>
                        </View>

                        {/* Legend/Labels */}
                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#7F1D1D' }]} />
                                <Text style={styles.legendText}>Untung Bersih</Text>
                                <Text style={styles.legendValue}>
                                    {formatCurrencyShort(totalSalesMonth - totalCostMonth)}
                                </Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#F87171' }]} />
                                <Text style={styles.legendText}>Pengeluaran</Text>
                                <Text style={styles.legendValue}>
                                    {formatCurrencyShort(totalCostMonth)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

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
    subHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    content: {
        padding: 24,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    titleRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#111827',
        // width: '70%',
    },
    cardSub: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#10B981',
    },
    chartsContainer: {
        paddingBottom: 24,
        paddingRight: 24,
    },
    chartCard: {
        width: width * 0.8,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
    },
    barChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingBottom: 20, // space for labels
    },
    barWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        height: 130, // Max height
        width: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 8,
    },
    barFill: {
        width: 12,
        backgroundColor: '#818CF8', // Indigo 400
        borderRadius: 6,
        minHeight: 4,
    },
    barLabel: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
    },
    cashflowCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    pieContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    donutWrapper: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    donutSegment: {
        // styling in render
    },
    innerCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    centerValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#7F1D1D',
    },
    centerLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    legendContainer: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 24,
    },
    legendItem: {
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 4,
    },
    legendText: {
        fontSize: 12,
        color: '#6B7280',
    },
    legendValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    }
});
