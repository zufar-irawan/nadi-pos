import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/orderStore';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const { orders } = useOrderStore();

    const orderId = typeof id === 'string' ? id : id[0];
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detail Pesanan</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>Pesanan tidak ditemukan.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const orderDate = new Date(order.date);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Detail Pesanan</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusIcon}>
                        <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                    </View>
                    <Text style={styles.statusTitle}>Pembayaran Berhasil</Text>
                    <Text style={styles.statusSubtitle}>Total Pembayaran</Text>
                    <Text style={styles.statusAmount}>Rp{order.totalAmount.toLocaleString('id-ID')}</Text>
                </View>

                {/* Order Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Pesanan</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>ID Pesanan</Text>
                            <Text style={styles.value}>{order.id}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Tanggal</Text>
                            <Text style={styles.value}>
                                {orderDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Waktu</Text>
                            <Text style={styles.value}>
                                {orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Metode Pembayaran</Text>
                            <Text style={styles.value}>{order.paymentMethod}</Text>
                        </View>
                    </View>
                </View>

                {/* Items List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rincian Item</Text>
                    <View style={styles.card}>
                        {order.items.length === 0 ? (
                            <Text style={styles.emptyText}>Tidak ada detail item (data dummy).</Text>
                        ) : (
                            order.items.map((item, index) => (
                                <React.Fragment key={index}>
                                    <View style={styles.itemRow}>
                                        {/* Placeholder Image */}
                                        <View style={styles.itemImage}>
                                            {item.product.image ? (
                                                <Image source={{ uri: item.product.image }} style={styles.thumb} />
                                            ) : (
                                                <Ionicons name="cube-outline" size={20} color="#9CA3AF" />
                                            )}
                                        </View>
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemName}>{item.product.name}</Text>
                                            <Text style={styles.itemPrice}>Rp{item.product.price.toLocaleString('id-ID')} x {item.quantity}</Text>
                                        </View>
                                        <Text style={styles.itemTotal}>
                                            Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                                        </Text>
                                    </View>
                                    {index < order.items.length - 1 && <View style={styles.separator} />}
                                </React.Fragment>
                            ))
                        )}
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Subtotal</Text>
                            <Text style={styles.value}>Rp{order.totalAmount.toLocaleString('id-ID')}</Text>
                        </View>
                        {/* 
                <View style={styles.separator} />
                <View style={styles.row}>
                    <Text style={styles.label}>Pajak</Text>
                    <Text style={styles.value}>Rp0</Text>
                </View> 
                */}
                        <View style={styles.separator} />
                        <View style={[styles.row, { marginTop: 4 }]}>
                            <Text style={[styles.label, styles.bold]}>Total</Text>
                            <Text style={[styles.value, styles.bold, { color: '#4F46E5' }]}>Rp{order.totalAmount.toLocaleString('id-ID')}</Text>
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
    content: {
        padding: 24,
        gap: 24,
    },
    statusCard: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statusIcon: {
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    statusAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#10B981',
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    bold: {
        fontWeight: '700',
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    thumb: {
        width: '100%',
        height: '100%',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    itemPrice: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: '#6B7280',
        fontSize: 16,
    },
    emptyText: {
        color: '#9CA3AF',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 8,
    }
});
