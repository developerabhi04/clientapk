import React, { useState, useRef, useEffect } from 'react';
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

const OTPVerificationScreen = ({ route, navigation }) => {
    const { phoneNumber, fullName, isLogin } = route.params;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOTPChange = (text, index) => {
        setError('');

        if (text.length > 1) {
            text = text.charAt(text.length - 1);
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 6 digits are entered
        if (newOtp.every(digit => digit !== '')) {
            verifyOTP(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyOTP = async (otpString) => {
        setLoading(true);
        setError('');

        try {
            let response;

            if (isLogin) {
                // Verify Login OTP
                response = await ApiService.verifyLoginOTP(phoneNumber, otpString);
            } else {
                // Verify Signup OTP
                response = await ApiService.verifySignupOTP(fullName, phoneNumber, otpString);
            }

            if (response.success) {
                // Show success message
                const user = response.data.user;
                const welcomeMessage = response.data.message ||
                    (isLogin ? 'Login successful!' : `Welcome ${user.fullName}!`);

                // Show signup bonus message if available
                if (!isLogin && user.bonusBalance > 0) {
                    Alert.alert(
                        '🎉 Welcome Bonus!',
                        `Congratulations! You've received ₹${user.bonusBalance} signup bonus!`,
                        [{
                            text: 'Start Trading',
                            onPress: () => navigateToHome()
                        }]
                    );
                } else {
                    Alert.alert(
                        'Success!',
                        welcomeMessage,
                        [{ text: 'Continue', onPress: () => navigateToHome() }]
                    );
                }
            } else {
                // Show error
                setError(response.message || 'Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error('OTP Verification Error:', err);
            setError('An unexpected error occurred. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const navigateToHome = () => {
        // Reset navigation stack and go to Home
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    const handleResend = async () => {
        if (!canResend) return;

        setOtp(['', '', '', '', '', '']);
        setError('');
        setLoading(true);

        try {
            let response;

            if (isLogin) {
                response = await ApiService.resendLoginOTP(phoneNumber);
            } else {
                response = await ApiService.resendSignupOTP(fullName, phoneNumber);
            }

            if (response.success) {
                setResendTimer(60);
                setCanResend(false);
                Alert.alert('Success', 'OTP has been resent successfully');
                inputRefs.current[0]?.focus();
            } else {
                setError(response.message || 'Failed to resend OTP');
            }
        } catch (err) {
            console.error('Resend OTP Error:', err);
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (number) => {
        if (number.length <= 3) return number;
        if (number.length <= 6) return `${number.slice(0, 3)} ${number.slice(3)}`;
        return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            disabled={loading}>
                            <Icon name="arrow-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircle}>
                                <Icon name="message-text" size={40} color="#00C896" />
                            </View>
                        </View>

                        <Text style={styles.title}>Verify OTP</Text>
                        <Text style={styles.subtitle}>
                            Enter the 6-digit code sent to
                        </Text>
                        <Text style={styles.phoneNumber}>
                            +91 {formatPhoneNumber(phoneNumber)}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.goBack()}
                            disabled={loading}>
                            <Text style={styles.editButtonText}>Edit Number</Text>
                        </TouchableOpacity>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit && styles.otpInputFilled,
                                    error && styles.otpInputError,
                                ]}
                                value={digit}
                                onChangeText={text => handleOTPChange(text, index)}
                                onKeyPress={e => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                                editable={!loading}
                            />
                        ))}
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle" size={16} color="#FF5252" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <Icon name="loading" size={20} color="#00C896" />
                            <Text style={styles.loadingText}>Verifying OTP...</Text>
                        </View>
                    )}

                    {/* Resend */}
                    <View style={styles.resendContainer}>
                        {canResend ? (
                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={loading}>
                                <Text style={styles.resendText}>Resend OTP</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.timerText}>
                                Resend OTP in {resendTimer}s
                            </Text>
                        )}
                    </View>

                    {/* Dev Info - Remove in production */}
                    {__DEV__ && (
                        <View style={styles.testInfoBox}>
                            <Icon name="information" size={16} color="#00C896" />
                            <Text style={styles.testInfoText}>
                                Check your SMS or backend console for OTP
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    keyboardView: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },

    header: {
        alignItems: 'center',
        marginBottom: 40,
    },

    backButton: {
        alignSelf: 'flex-start',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    iconContainer: {
        marginBottom: 20,
    },

    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },

    phoneNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 12,
    },

    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
    },

    editButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },

    otpInput: {
        flex: 1,
        height: 60,
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
    },

    otpInputFilled: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },

    otpInputError: {
        borderColor: COLORS.error,
        backgroundColor: COLORS.errorLight,
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.errorLight,
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        gap: 8,
    },

    errorText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.error,
        fontWeight: '600',
    },

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 10,
    },

    loadingText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },

    resendContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },

    resendText: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '700',
    },

    timerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },

    testInfoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primaryLight,
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },

    testInfoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.text,
        fontWeight: '600',
    },
});

export default OTPVerificationScreen;
