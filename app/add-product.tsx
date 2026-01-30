import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventoryStore } from '../store/inventoryStore';

export default function AddProductScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { products, addProduct, updateProduct } = useInventoryStore();
    const isEditing = !!id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (isEditing && id) {
            const product = products.find(p => p.id === id);
            if (product) {
                setName(product.name);
                setPrice(product.price.toString());
                setStock(product.stock.toString());
                setImage(product.image);
            }
        }
    }, [id, isEditing, products]);

    const handleSave = () => {
        if (!name || !price || !stock) {
            Alert.alert('Error', 'Mohon lengkapi semua data');
            return;
        }

        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock);

        if (isNaN(priceNum) || isNaN(stockNum)) {
            Alert.alert('Error', 'Harga dan stok harus angka');
            return;
        }

        if (isEditing && id) {
            updateProduct(id, {
                name,
                price: priceNum,
                stock: stockNum,
                image
            });
            Alert.alert('Sukses', 'Produk berhasil diperbarui');
        } else {
            addProduct({
                name,
                price: priceNum,
                stock: stockNum,
                image
            });
            Alert.alert('Sukses', 'Produk berhasil ditambahkan');
        }
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditing ? 'Edit Produk' : 'Produk Baru'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nama Produk</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nama produk"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Harga</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="Rp 0"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Gambar</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={() => Alert.alert('Info', 'Fitur upload gambar akan segera hadir')}>
                        {image ? (
                            <Text>Image Selected (Mock)</Text>
                        ) : (
                            <>
                                <Feather name="image" size={24} color="#9CA3AF" style={{ marginBottom: 8 }} />
                                <Text style={styles.imagePickerText}>Tambah Gambar</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Persediaan</Text>
                    <TextInput
                        style={styles.input}
                        value={stock}
                        onChangeText={setStock}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Feather name="save" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Simpan</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Image 2 seems to have dark header in 2nd image but white content? Actually image 2 top is dark. But user said "match dashboard design". Dashboard is light. I will stick to light theme consistent with dashboard but layout of form.
    },
    // Wait, the user specifically said "Desain heading dan overral harus sesuai dengan desain dashboard". Dashboard has white header. 
    // Image 2 has a dark header. I should ignore Image 2's colors for header and use Dashboard style.
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
    content: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#111827',
    },
    imagePicker: {
        height: 180,
        borderWidth: 1.5,
        borderColor: '#9CA3AF',
        borderStyle: 'dashed',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    imagePickerText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981', // Green from dashboard/image
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 24,
        gap: 8,
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});
