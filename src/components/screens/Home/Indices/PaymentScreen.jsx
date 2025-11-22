import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    StatusBar,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';

const PaymentScreen = ({ navigation, route }) => {
    const { amount } = route?.params || { amount: 1000 };

    const upiId = 'merchant@paytm';
    const qrCodeImage = 'https://via.placeholder.com/300';

    const [utr, setUtr] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedUTR, setSubmittedUTR] = useState('');

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Copied!', 'UPI ID copied to clipboard');
    };

    const handlePaymentDone = () => {
        setCurrentStep(2);
    };

    const handleSubmitUTR = async () => {
        if (!utr.trim()) {
            Alert.alert('Required', 'Please enter UTR/Transaction ID');
            return;
        }

        if (utr.length < 12) {
            Alert.alert('Invalid UTR', 'UTR must be at least 12 characters');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmittedUTR(utr);
            setShowSuccessModal(true);
        }, 2000);
    };

    const handleDoneSuccess = () => {
        setShowSuccessModal(false);
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Complete Payment</Text>
                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Progress Steps */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressStep}>
                        <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
                            {currentStep > 1 ? (
                                <Icon name="check" size={16} color="#FFFFFF" />
                            ) : (
                                <Text style={styles.stepNumber}>1</Text>
                            )}
                        </View>
                        <Text style={styles.stepLabel}>Pay</Text>
                    </View>
                    <View style={[styles.progressLine, currentStep >= 2 && styles.progressLineActive]} />
                    <View style={styles.progressStep}>
                        <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
                            <Text style={styles.stepNumber}>2</Text>
                        </View>
                        <Text style={styles.stepLabel}>Submit UTR</Text>
                    </View>
                </View>

                {/* Amount Card */}
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Amount to Pay</Text>
                    <Text style={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</Text>
                </View>

                {currentStep === 1 ? (
                    <>
                        <View style={styles.instructionBox}>
                            <Icon name="information" size={20} color="#00C896" />
                            <Text style={styles.instructionText}>
                                Scan QR code or use UPI ID to complete payment in any UPI app
                            </Text>
                        </View>

                        <View style={styles.paymentSection}>
                            <Text style={styles.sectionTitle}>Use UPI ID</Text>
                            <View style={styles.upiContainer}>
                                <View style={styles.upiIdBox}>
                                    <Icon name="at" size={18} color="#999999" />
                                    <Text style={styles.upiIdText}>{upiId}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={() => copyToClipboard(upiId)}
                                    activeOpacity={0.7}>
                                    <Icon name="content-copy" size={18} color="#00C896" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.paymentSection}>
                            <Text style={styles.sectionTitle}>Scan QR Code</Text>
                            <View style={styles.qrContainer}>
                                {qrCodeImage ? (
                                    <Image
                                        source={{ uri: qrCodeImage }}
                                        style={styles.qrImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={styles.qrPlaceholder}>
                                        <Icon name="qrcode" size={100} color="#666666" />
                                        <Text style={styles.qrPlaceholderText}>
                                            QR Code will appear here
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={styles.securityBadge}>
                            <Icon name="lock" size={16} color="#00C896" />
                            <Text style={styles.securityText}>
                                256-bit Encrypted • 100% Secure
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.utrSection}>
                            <View style={styles.utrHeader}>
                                <Icon name="shield-check" size={24} color="#00C896" />
                                <Text style={styles.utrHeaderText}>Verify Your Payment</Text>
                            </View>

                            <Text style={styles.utrDescription}>
                                To credit ₹{amount.toLocaleString('en-IN')} to your wallet, please enter the 12-digit UTR/Transaction ID from your payment app.
                            </Text>

                            <View style={styles.noticeBox}>
                                <Icon name="alert-circle" size={20} color="#FF9800" />
                                <Text style={styles.noticeText}>
                                    Without UTR, your payment cannot be verified and wallet will not be credited.
                                </Text>
                            </View>

                            <View style={styles.utrInputSection}>
                                <Text style={styles.utrInputLabel}>UTR / Transaction ID</Text>
                                <View style={styles.utrInputContainer}>
                                    <Icon name="receipt-text" size={20} color="#999999" />
                                    <TextInput
                                        style={styles.utrInput}
                                        placeholder="Enter 12-digit UTR"
                                        placeholderTextColor="#666666"
                                        value={utr}
                                        onChangeText={setUtr}
                                        autoCapitalize="characters"
                                        keyboardType="default"
                                        maxLength={20}
                                    />
                                    {utr.length > 0 && (
                                        <TouchableOpacity onPress={() => setUtr('')}>
                                            <Icon name="close-circle" size={20} color="#666666" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {utr.length > 0 && utr.length < 12 && (
                                    <View style={styles.validationBox}>
                                        <Icon name="alert" size={14} color="#FF5252" />
                                        <Text style={styles.validationText}>
                                            UTR must be at least 12 characters
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.helpBox}>
                                    <Icon name="help-circle" size={16} color="#00C896" />
                                    <Text style={styles.helpText}>
                                        Find UTR in your payment app's transaction history or SMS
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.exampleBox}>
                                <Text style={styles.exampleTitle}>Example UTR Format:</Text>
                                <Text style={styles.exampleText}>401234567890</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.backToPaymentButton}
                                onPress={() => setCurrentStep(1)}
                                activeOpacity={0.7}>
                                <Icon name="arrow-left" size={18} color="#999999" />
                                <Text style={styles.backToPaymentText}>Back to Payment</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.securityBadge}>
                            <Icon name="lock" size={16} color="#00C896" />
                            <Text style={styles.securityText}>
                                256-bit Encrypted • 100% Secure
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Fixed Bottom Button */}
            <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
                <View style={styles.bottomButtonContainer}>
                    {currentStep === 1 ? (
                        <TouchableOpacity
                            style={styles.paymentDoneButton}
                            onPress={handlePaymentDone}
                            activeOpacity={0.8}>
                            <Icon name="check-circle" size={20} color="#FFFFFF" />
                            <Text style={styles.paymentDoneButtonText}>Payment Done? Continue</Text>
                            <Icon name="arrow-right" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (!utr.trim() || utr.length < 12 || isSubmitting) &&
                                styles.submitButtonDisabled,
                            ]}
                            onPress={handleSubmitUTR}
                            disabled={!utr.trim() || utr.length < 12 || isSubmitting}
                            activeOpacity={0.8}>
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Icon name="check-circle" size={20} color="#FFFFFF" />
                                    <Text style={styles.submitButtonText}>Submit & Verify</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.successModal}>
                        {/* Success Animation */}
                        <View style={styles.successIconContainer}>
                            <View style={styles.successIconBackground}>
                                <Icon name="check-circle" size={80} color="#12b00cff" />
                            </View>
                        </View>

                        {/* Success Title */}
                        <Text style={styles.successTitle}>
                            UTR Submitted Successfully! ✓
                        </Text>

                        {/* Success Message */}
                        <Text style={styles.successMessage}>
                            We've received your UTR. Our team will verify it shortly.
                        </Text>

                        {/* UTR Display */}
                        <View style={styles.utrDisplayBox}>
                            <Text style={styles.utrDisplayLabel}>Your UTR:</Text>
                            <Text style={styles.utrDisplayValue}>{submittedUTR}</Text>
                        </View>

                        {/* Info Box */}
                        <View style={styles.infoBox}>
                            <View style={styles.infoItem}>
                                <View style={styles.infoIconContainer}>
                                    <Icon name="clock-outline" size={20} color="#FF9800" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoTitle}>Processing Time</Text>
                                    <Text style={styles.infoText}>Up to 24 hours</Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={styles.infoIconContainer}>
                                    <Icon name="check-circle-outline" size={20} color="#00C896" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoTitle}>Verification</Text>
                                    <Text style={styles.infoText}>UTR matching in progress</Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={styles.infoIconContainer}>
                                    <Icon name="wallet" size={20} color="#2196F3" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoTitle}>Amount</Text>
                                    <Text style={styles.infoText}>₹{amount.toLocaleString('en-IN')}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Note */}
                        <View style={styles.noteBox}>
                            <Icon name="information-outline" size={16} color="#2196F3" />
                            <Text style={styles.noteText}>
                                Once verified, your wallet will be credited automatically. We'll send you a notification.
                            </Text>
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleDoneSuccess}
                            activeOpacity={0.8}>
                            <Text style={styles.closeButtonText}>Go to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    safeAreaTop: {
        backgroundColor: '#000000',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 30,
    },

    // Progress Steps
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
        paddingVertical: 24,
    },

    progressStep: {
        alignItems: 'center',
    },

    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1A1A1A',
        borderWidth: 2,
        borderColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },

    stepCircleActive: {
        backgroundColor: '#00C896',
        borderColor: '#00C896',
    },

    stepNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    stepLabel: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '600',
    },

    progressLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#333333',
        marginHorizontal: 8,
    },

    progressLineActive: {
        backgroundColor: '#00C896',
    },

    // Amount Card
    amountCard: {
        marginHorizontal: 16,
        marginBottom: 14,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    amountLabel: {
        fontSize: 13,
        color: '#FF9800',
        marginBottom: 2,
        fontWeight: '500',
    },

    amountValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -1,
    },

    // Instruction Box
    instructionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D2B24',
        marginHorizontal: 16,
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#00C896',
        gap: 10,
    },

    instructionText: {
        flex: 1,
        fontSize: 13,
        color: '#00C896',
        lineHeight: 18,
        fontWeight: '500',
    },

    // Payment Section
    paymentSection: {
        marginHorizontal: 16,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 14,
    },

    qrContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    qrImage: {
        width: 250,
        height: 250,
        borderRadius: 12,
    },

    qrPlaceholder: {
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#333333',
        borderStyle: 'dashed',
        borderRadius: 12,
    },

    qrPlaceholderText: {
        fontSize: 12,
        color: '#666666',
        marginTop: 12,
    },

    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 20,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333333',
    },

    dividerText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '700',
        paddingHorizontal: 12,
    },

    // UPI Section
    upiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    upiIdBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        gap: 10,
    },

    upiIdText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },

    copyButton: {
        backgroundColor: '#0D2B24',
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00C896',
    },

    // UTR Section
    utrSection: {
        marginHorizontal: 16,
        marginBottom: 20,
    },

    utrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },

    utrHeaderText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    utrDescription: {
        fontSize: 14,
        color: '#999999',
        lineHeight: 20,
        marginBottom: 16,
    },

    // Notice Box
    noticeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A1F0D',
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FF9800',
        gap: 10,
    },

    noticeText: {
        flex: 1,
        fontSize: 13,
        color: '#FF9800',
        lineHeight: 18,
        fontWeight: '500',
    },

    // UTR Input
    utrInputSection: {
        marginBottom: 20,
    },

    utrInputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
    },

    utrInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 14,
        borderWidth: 2,
        borderColor: '#00C896',
        gap: 10,
    },

    utrInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1,
    },

    validationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },

    validationText: {
        fontSize: 12,
        color: '#FF5252',
        fontWeight: '600',
    },

    helpBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D2B24',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        gap: 8,
    },

    helpText: {
        flex: 1,
        fontSize: 12,
        color: '#00C896',
        fontWeight: '500',
    },

    // Example Box
    exampleBox: {
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    exampleTitle: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 6,
        fontWeight: '600',
    },

    exampleText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#00C896',
        letterSpacing: 2,
    },

    // Back Button
    backToPaymentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6,
    },

    backToPaymentText: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '600',
    },

    // Security Badge
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },

    securityText: {
        fontSize: 12,
        color: '#00C896',
        fontWeight: '600',
    },

    // Fixed Bottom Button
    safeAreaBottom: {
        backgroundColor: '#000000',
    },

    bottomButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
    },

    paymentDoneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C896',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },

    paymentDoneButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C896',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },

    submitButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },

    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    // Success Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },

    successModal: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    // Success Icon
    successIconContainer: {
        marginBottom: 20,
    },

    successIconBackground: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#2fda0cff',
    },

    // Success Text
    successTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3daf23ff',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.5,
    },

    successMessage: {
        fontSize: 12,
        color: '#c9e4c7ff',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },

    // UTR Display
    utrDisplayBox: {
        backgroundColor: '#0D2B24',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#00C896',
        width: '100%',
    },

    utrDisplayLabel: {
        fontSize: 11,
        color: '#00C896',
        fontWeight: '600',
        marginBottom: 4,
    },

    utrDisplayValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#00C896',
        letterSpacing: 1,
    },

    // Info Box
    infoBox: {
        width: '100%',
        marginBottom: 16,
        gap: 12,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D2B24',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        gap: 12,
    },

    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    infoContent: {
        flex: 1,
    },

    infoTitle: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '600',
        marginBottom: 2,
    },

    infoText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // Note Box
    noteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2535',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A3F5A',
        gap: 8,
    },

    noteText: {
        flex: 1,
        fontSize: 12,
        color: '#B3D9FF',
        lineHeight: 16,
        fontWeight: '500',
    },

    // Close Button
    closeButton: {
        backgroundColor: '#00C896',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },

    closeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});

export default PaymentScreen;
