import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';

export default function PaymentScreen() {
    const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
    const { addOrder } = useOrderStore();
    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();

    // Random Order ID
    const [orderId] = useState(`#${Math.floor(Math.random() * 9000000000) + 1000000000}`);
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountTendered, setAmountTendered] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handlePay = () => {
        // Add to Order History
        addOrder({
            id: orderId,
            items: [...items],
            totalAmount: totalPrice,
            paymentMethod: paymentMethod,
            date: new Date().toISOString()
        });

        // Proceed
        clearCart();
        router.replace('/payment-success');
    };

    const methods = ['Cash', 'E-Wallet', 'Card'];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header - Dashboard Style */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Konfirmasi Pembayaran</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Total Card */}
                <View style={styles.cardPrimary}>
                    <Text style={styles.labelLight}>Total Tagihan</Text>
                    <Text style={styles.bigTotal}>Rp {totalPrice.toLocaleString('id-ID')},00</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{totalItems} Item</Text>
                    </View>
                </View>

                {/* Order Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detail Pesanan</Text>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.infoLabel}>ID Pesanan</Text>
                            <Text style={styles.infoValue}>{orderId}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.infoLabel}>Waktu</Text>
                            <Text style={styles.infoValue}>{dateStr}, {timeStr}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Form */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionHeader}>Detail Pembayaran</Text>

                    <Text style={styles.inputLabel}>Metode Pembayaran</Text>
                    <TouchableOpacity
                        style={[styles.dropdown, { marginBottom: isDropdownOpen ? 8 : 20 }]}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name={paymentMethod === 'Cash' ? 'cash-outline' : 'card-outline'} size={20} color="#4F46E5" />
                            <Text style={styles.dropdownText}>{paymentMethod}</Text>
                        </View>
                        <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <View style={styles.dropdownList}>
                            {methods.map(m => (
                                <TouchableOpacity
                                    key={m}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setPaymentMethod(m);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{m}</Text>
                                    {paymentMethod === m && <Ionicons name="checkmark" size={18} color="#4F46E5" />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {paymentMethod === 'Cash' && amountTendered ? (
                        <View style={styles.changeRow}>
                            <Text style={styles.changeLabel}>Kembalian:</Text>
                            <Text style={styles.changeValue}>
                                Rp {(Math.max(0, parseFloat(amountTendered) - totalPrice)).toLocaleString('id-ID')}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                    <Text style={styles.payButtonText}>Proses Pembayaran</Text>
                    <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
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
        gap: 20,
    },
    cardPrimary: {
        backgroundColor: '#4F46E5',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    labelLight: {
        fontSize: 14,
        color: '#E0E7FF',
        marginBottom: 8,
    },
    bigTotal: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 16,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    formSection: {
        marginTop: 8,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dropdownText: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: -12,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#374151',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    currencyPrefix: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    changeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        padding: 16,
        borderRadius: 16,
        marginTop: -8,
        marginBottom: 24,
    },
    changeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },
    changeValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#059669',
    },
    footer: {
        padding: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    payButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    }
});
