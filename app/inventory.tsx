import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventoryStore } from '../store/inventoryStore';

const { width } = Dimensions.get('window');

export default function InventoryScreen() {
    const { products, deleteProduct, updateProduct } = useInventoryStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Hapus Produk",
            `Apakah anda yakin ingin menghapus ${name}?`,
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: () => deleteProduct(id) }
            ]
        );
    };

    const handleEdit = (id: string) => {
        router.push({ pathname: '/add-product', params: { id } });
    };

    const handleStockChange = (id: string, currentStock: number, change: number) => {
        const newStock = Math.max(0, currentStock + change);
        updateProduct(id, { stock: newStock });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header - Matching Dashboard Style */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="menu" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inventori</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.contentContainer}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari disini"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Action Bar */}
                <View style={styles.actionBar}>
                    <Text style={styles.sectionTitle}>Semua Barang</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/add-product')}
                    >
                        <Feather name="plus" size={18} color="#fff" />
                        <Text style={styles.addButtonText}>Tambah Produk</Text>
                    </TouchableOpacity>
                </View>

                {/* Product Grid */}
                <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
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
                                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.productPrice}>Rp{item.price.toLocaleString('id-ID')}</Text>

                                <View style={styles.cardActions}>
                                    <View style={styles.stockControl}>
                                        <TouchableOpacity
                                            style={styles.stockBtn}
                                            onPress={() => handleStockChange(item.id, item.stock, -1)}
                                        >
                                            <Text style={styles.stockBtnText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.stockValue}>{item.stock}</Text>
                                        <TouchableOpacity
                                            style={[styles.stockBtn, styles.stockBtnAdd]}
                                            onPress={() => handleStockChange(item.id, item.stock, 1)}
                                        >
                                            <Text style={[styles.stockBtnText, { color: '#fff' }]}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.iconActions}>
                                        <TouchableOpacity
                                            style={styles.iconBtn}
                                            onPress={() => handleDelete(item.id, item.name)}
                                        >
                                            <Feather name="trash-2" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.iconBtn}
                                            onPress={() => handleEdit(item.id)}
                                        >
                                            <Feather name="edit-3" size={18} color="#9CA3AF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
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
    contentContainer: {
        flex: 1,
        padding: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    card: {
        width: (width - 48 - 16) / 2, // 48 padding, 16 gap
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 140,
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
        height: 40,
    },
    productPrice: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stockControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stockBtn: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stockBtnAdd: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    stockBtnText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 16,
    },
    stockValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    iconActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        padding: 4,
    }
});
