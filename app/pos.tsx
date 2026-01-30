import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import { useInventoryStore } from '../store/inventoryStore';

const { width } = Dimensions.get('window');

export default function PosScreen() {
    const { products } = useInventoryStore();
    const { addToCart, getTotalItems } = useCartStore();
    const [searchQuery, setSearchQuery] = useState('');

    const totalItems = getTotalItems();

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header - Dashboard Style */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <Feather name="menu" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Kasir</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Semua Barang</Text>

                <View style={styles.gridContainer}>
                    {filteredProducts.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                {item.image ? (
                                    <Image source={{ uri: item.image }} style={styles.productImage} />
                                ) : (
                                    <View style={styles.placeholderImage} />
                                )}
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.productPrice}>Rp{item.price.toLocaleString('id-ID')}</Text>

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => addToCart(item)}
                                >
                                    <Feather name="plus-circle" size={18} color="#fff" />
                                    <Text style={styles.addButtonText}>Tambah</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Checkout Bar */}
            {totalItems > 0 && (
                <View style={styles.bottomBarContainer}>
                    <View style={styles.bottomBar}>
                        <View>
                            <Text style={styles.cartInfoLabel}>Total Item</Text>
                            <Text style={styles.cartInfoText}>{totalItems} Produk Dipilih</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
                            <Text style={styles.checkoutText}>Checkout</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    searchSection: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120, // Space for bottom bar
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: (width - 48 - 12) / 2, // 48 padding, 12 gap
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        height: 120,
        backgroundColor: '#F3F4F6',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E5E7EB',
    },
    cardContent: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    bottomBarContainer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
    },
    bottomBar: {
        backgroundColor: '#111827', // Dark blue/black consistent with Dashboard text
        borderRadius: 20,
        padding: 16,
        paddingLeft: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    cartInfoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    cartInfoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    checkoutButton: {
        backgroundColor: '#4F46E5', // Primary Brand Color
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    }
});
