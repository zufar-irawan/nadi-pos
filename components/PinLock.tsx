import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store/authStore';

const { width, height } = Dimensions.get('window');

export default function PinLock() {
    const { loginWithPin, isAuthenticated, isRegistered, isLoading } = useAuthStore();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (pin.length === 6) {
            handleVerify();
        }
    }, [pin]);

    const handleVerify = async () => {
        const success = await loginWithPin(pin);
        if (!success) {
            setError('PIN Salah. Coba lagi.');
            setPin('');
        }
    };

    const handlePress = (num: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + num);
            setError('');
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    // If already authenticated or not registered yet (meaning we are in onboarding/register flow), don't show lock
    // Wait, if !isRegistered, we shouldn't show lock, we should show "Starting" screen.
    // This component should only appear if `isRegistered && !isAuthenticated`.
    if (!isRegistered || isAuthenticated) return null;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Masukkan PIN</Text>
                <Text style={styles.subtitle}>Masukkan PIN untuk melanjutkan</Text>

                {/* PIN Dots */}
                <View style={styles.dotContainer}>
                    {[...Array(6)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i < pin.length && styles.dotFilled,
                                error ? styles.dotError : null
                            ]}
                        />
                    ))}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Numpad */}
                <View style={styles.numpad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={styles.numBtn}
                            onPress={() => handlePress(num.toString())}
                        >
                            <Text style={styles.numText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.numBtn} />
                    <TouchableOpacity
                        style={styles.numBtn}
                        onPress={() => handlePress('0')}
                    >
                        <Text style={styles.numText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.numBtn}
                        onPress={handleDelete}
                    >
                        <Ionicons name="backspace-outline" size={28} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: '#fff',
        zIndex: 9999, // High z-index to cover everything
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 40,
    },
    dotContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: 'transparent',
    },
    dotFilled: {
        backgroundColor: '#00CCEB',
        borderColor: '#00CCEB',
    },
    dotError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        marginBottom: 20,
    },
    numpad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
        marginTop: 20,
        width: 280, // Constrain width for 3 cols
    },
    numBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    numText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#111827',
    },
});
