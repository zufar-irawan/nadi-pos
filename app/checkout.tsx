import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';

export default function CheckoutScreen() {
    const { items, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
    const totalItems = getTotalItems();
    const subTotal = getTotalPrice();
    const discount = 0; // Static for now
    const total = subTotal - discount;

    useEffect(() => {
        if (items.length === 0) {
            if (router.canGoBack()) {
                router.back();
            }
        }
    }, [items.length]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header - Dashboard Style */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Checkout ({totalItems})</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {items.map((item) => (
                    <View key={item.product.id} style={styles.cartItem}>
                        <View style={styles.itemImageContainer}>
                            {item.product.image ? (
                                <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                            ) : (
                                <View style={styles.placeholderImage} />
                            )}
                        </View>

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.product.name}</Text>
                            <Text style={styles.itemPrice}>Rp {item.product.price.toLocaleString('id-ID')},00</Text>
                        </View>

                        <View style={styles.qtyContainer}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                <Ionicons name="remove" size={16} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{item.quantity}</Text>
                            <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                <Ionicons name="add" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Sub total</Text>
                    <Text style={styles.summaryValue}>Rp{subTotal.toLocaleString('id-ID')}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Diskon</Text>
                    <Text style={styles.summaryValue}>Rp{discount.toLocaleString('id-ID')}</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.summaryRow, { marginTop: 8 }]}>
                    <Text style={styles.totalLabel}>Total Pembayaran</Text>
                    <Text style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</Text>
                </View>

                <TouchableOpacity style={styles.payButton} onPress={() => router.push('/payment')}>
                    <Text style={styles.payButtonText}>Bayar Sekarang</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
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
    scrollContent: {
        padding: 24,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    itemImageContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        flex: 1,
        backgroundColor: '#E5E7EB',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F9FAFB',
        padding: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyBtnAdd: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    qtyText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        padding: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#10B981',
    },
    payButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }

});
