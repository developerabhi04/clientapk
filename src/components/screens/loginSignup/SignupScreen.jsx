import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../../../services/ApiService';

const COLORS = {
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
    primary: '#00C896',
    primaryLight: 'rgba(0, 200, 150, 0.15)',
    error: '#FF5252',
    errorLight: 'rgba(255, 82, 82, 0.15)',
};

const SignupScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleFullNameChange = (text) => {
        setErrors({ ...errors, fullName: '' });
        setFullName(text);
    };

    const handlePhoneChange = (text) => {
        setErrors({ ...errors, phoneNumber: '' });
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 10) {
            setPhoneNumber(cleaned);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }

        if (phoneNumber.length !== 10) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        } else if (!/^[6-9]/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must start with 6, 7, 8, or 9';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            // Call API to send signup OTP
            const response = await ApiService.sendSignupOTP(fullName, phoneNumber);

            if (response.success) {
                // Navigate to OTP verification screen
                navigation.navigate('OTPVerification', {
                    phoneNumber: phoneNumber,
                    fullName: fullName,
                    isLogin: false,
                });
            } else {
                // Show error message
                setErrors({
                    general: response.message || 'Failed to send OTP'
                });

                // If phone already registered, show alert
                if (response.message?.includes('already registered')) {
                    Alert.alert(
                        'Phone Already Registered',
                        'This phone number is already registered. Would you like to login instead?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Login',
                                onPress: () => navigation.navigate('Login')
                            },
                        ]
                    );
                }
            }
        } catch (err) {
            console.error('Signup Error:', err);
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (number) => {
        if (number.length <= 3) return number;
        if (number.length <= 6) return `${number.slice(0, 3)} ${number.slice(3)}`;
        return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    };

    const isFormValid = fullName.trim().length >= 3 && phoneNumber.length === 10;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}>
                            <Icon name="arrow-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Icon name="chart-line" size={32} color="#00C896" />
                            </View>
                            <Text style={styles.appName}>TradeHub</Text>
                        </View>
                    </Animated.View>

                    {/* Content */}
                    <Animated.View
                        style={[
                            styles.content,
                            { opacity: fadeAnim }
                        ]}>
                        <View style={styles.welcomeSection}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Join TradeHub and start your trading journey
                            </Text>
                        </View>

                        {/* General Error */}
                        {errors.general && (
                            <View style={styles.errorContainer}>
                                <Icon name="alert-circle" size={14} color="#FF5252" />
                                <Text style={styles.errorText}>{errors.general}</Text>
                            </View>
                        )}

                        {/* Full Name Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <View style={[
                                styles.inputContainer,
                                errors.fullName && styles.inputContainerError,
                                fullName.trim().length >= 3 && styles.inputContainerSuccess
                            ]}>
                                <Icon name="account" size={20} color="#00C896" />
                                <TextInput
                                    style={styles.input}
                                    value={fullName}
                                    onChangeText={handleFullNameChange}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#666666"
                                    autoCapitalize="words"
                                    editable={!loading}
                                />
                                {fullName.trim().length >= 3 && (
                                    <Icon name="check-circle" size={20} color="#00C896" />
                                )}
                            </View>
                            {errors.fullName && (
                                <View style={styles.errorContainer}>
                                    <Icon name="alert-circle" size={14} color="#FF5252" />
                                    <Text style={styles.errorText}>{errors.fullName}</Text>
                                </View>
                            )}
                        </View>

                        {/* Phone Number Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={[
                                styles.inputContainer,
                                errors.phoneNumber && styles.inputContainerError,
                                phoneNumber.length === 10 && styles.inputContainerSuccess
                            ]}>
                                <View style={styles.inputPrefix}>
                                    <Icon name="phone" size={20} color="#00C896" />
                                    <Text style={styles.countryCode}>+91</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={formatPhoneNumber(phoneNumber)}
                                    onChangeText={handlePhoneChange}
                                    placeholder="000 000 0000"
                                    placeholderTextColor="#666666"
                                    keyboardType="phone-pad"
                                    maxLength={12}
                                    editable={!loading}
                                />
                                {phoneNumber.length === 10 && (
                                    <Icon name="check-circle" size={20} color="#00C896" />
                                )}
                            </View>
                            {errors.phoneNumber && (
                                <View style={styles.errorContainer}>
                                    <Icon name="alert-circle" size={14} color="#FF5252" />
                                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.infoBox}>
                            <Icon name="shield-check" size={16} color="#00C896" />
                            <Text style={styles.infoText}>
                                Your data is secure and encrypted
                            </Text>
                        </View>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                (!isFormValid || loading) && styles.continueButtonDisabled
                            ]}
                            onPress={handleContinue}
                            disabled={!isFormValid || loading}
                            activeOpacity={0.8}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <Icon name="loading" size={20} color="#FFFFFF" />
                                    <Text style={styles.continueButtonText}>Sending OTP...</Text>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <Icon name="arrow-right" size={20} color="#FFFFFF" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text style={styles.termsText}>
                            By continuing, you agree to our{' '}
                            <Text style={styles.termsLink}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </Animated.View>
                </ScrollView>

                {/* Footer */}
                <Animated.View
                    style={[
                        styles.footer,
                        { opacity: fadeAnim }
                    ]}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.footerLink}>Login</Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Keep all your existing styles - they're perfect!
const styles = StyleSheet.create({
    // ... (keep all your existing styles exactly as they are)
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    keyboardView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
    },

    header: {
        paddingTop: 20,
        paddingHorizontal: 24,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },

    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },

    appName: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.text,
        letterSpacing: -0.5,
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },

    welcomeSection: {
        marginBottom: 32,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },

    inputSection: {
        marginBottom: 20,
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 10,
        letterSpacing: 0.3,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },

    inputContainerError: {
        borderColor: COLORS.error,
        backgroundColor: COLORS.errorLight,
    },

    inputContainerSuccess: {
        borderColor: COLORS.primary,
    },

    inputPrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
        gap: 8,
    },

    countryCode: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },

    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        padding: 0,
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },

    errorText: {
        fontSize: 13,
        color: COLORS.error,
        fontWeight: '600',
    },

    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primaryLight,
        padding: 12,
        borderRadius: 10,
        marginBottom: 24,
        gap: 8,
    },

    infoText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },

    continueButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },

    continueButtonDisabled: {
        backgroundColor: COLORS.border,
    },

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    continueButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: 0.5,
    },

    termsText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },

    termsLink: {
        color: COLORS.primary,
        fontWeight: '700',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
        gap: 6,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },

    footerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },

    footerLink: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '700',
    },
});

export default SignupScreen;
