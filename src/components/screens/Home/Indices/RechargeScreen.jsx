import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

const RechargeScreen = ({ navigation }) => {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');

    const amountToUse = customAmount ? Number(customAmount) : selectedAmount;

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount(amount.toString());
    };

    const handleRecharge = () => {
        if (!amountToUse || amountToUse <= 0) return;
        navigation.navigate('Payment', { amount: amountToUse });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Money</Text>
                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>

                    {/* Amount Input Card */}
                    <View style={styles.amountCard}>
                        <Text style={styles.amountLabel}>Enter Amount</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0"
                                placeholderTextColor="#666666"
                                keyboardType="numeric"
                                value={customAmount}
                                onChangeText={(text) => {
                                    setCustomAmount(text.replace(/[^0-9]/g, ''));
                                    setSelectedAmount(null);
                                }}
                                maxLength={7}
                            />
                        </View>
                        {amountToUse > 0 && (
                            <Text style={styles.amountHint}>
                                You will add ₹{amountToUse.toLocaleString('en-IN')} to your wallet
                            </Text>
                        )}
                    </View>

                    {/* Quick Amount Selection */}
                    <View style={styles.quickAmountSection}>
                        <Text style={styles.quickAmountTitle}>Quick Amount</Text>
                        <View style={styles.quickAmountGrid}>
                            {PRESET_AMOUNTS.map((amount) => {
                                const isSelected = selectedAmount === amount;
                                return (
                                    <TouchableOpacity
                                        key={amount}
                                        style={[
                                            styles.quickAmountButton,
                                            isSelected && styles.quickAmountButtonSelected,
                                        ]}
                                        onPress={() => handleAmountSelect(amount)}
                                        activeOpacity={0.7}>
                                        <Text
                                            style={[
                                                styles.quickAmountText,
                                                isSelected && styles.quickAmountTextSelected,
                                            ]}>
                                            ₹{amount.toLocaleString('en-IN')}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Payment Methods */}
                    {/* <View style={styles.paymentMethodsSection}>
                        <Text style={styles.paymentMethodsTitle}>Payment Methods</Text>
                        
                        <TouchableOpacity style={styles.paymentMethodCard} activeOpacity={0.8}>
                            <View style={styles.paymentMethodLeft}>
                                <View style={[styles.paymentMethodIcon, { backgroundColor: '#E8F5E9' }]}>
                                    <Icon name="credit-card-outline" size={24} color="#00C896" />
                                </View>
                                <View style={styles.paymentMethodInfo}>
                                    <Text style={styles.paymentMethodName}>UPI / Cards</Text>
                                    <Text style={styles.paymentMethodDesc}>Fast & Secure Payment</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={24} color="#666666" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.paymentMethodCard} activeOpacity={0.8}>
                            <View style={styles.paymentMethodLeft}>
                                <View style={[styles.paymentMethodIcon, { backgroundColor: '#E3F2FD' }]}>
                                    <Icon name="bank" size={24} color="#2196F3" />
                                </View>
                                <View style={styles.paymentMethodInfo}>
                                    <Text style={styles.paymentMethodName}>Net Banking</Text>
                                    <Text style={styles.paymentMethodDesc}>All major banks supported</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={24} color="#666666" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.paymentMethodCard} activeOpacity={0.8}>
                            <View style={styles.paymentMethodLeft}>
                                <View style={[styles.paymentMethodIcon, { backgroundColor: '#FFF3E0' }]}>
                                    <Icon name="wallet" size={24} color="#FF9800" />
                                </View>
                                <View style={styles.paymentMethodInfo}>
                                    <Text style={styles.paymentMethodName}>Wallets</Text>
                                    <Text style={styles.paymentMethodDesc}>Paytm, PhonePe, Google Pay</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={24} color="#666666" />
                        </TouchableOpacity>
                    </View> */}

                    {/* Benefits Section */}
                    {/* <View style={styles.benefitsSection}>
                        <View style={styles.benefitItem}>
                            <Icon name="shield-check" size={20} color="#00C896" />
                            <Text style={styles.benefitText}>100% Secure & Encrypted</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Icon name="lightning-bolt" size={20} color="#00C896" />
                            <Text style={styles.benefitText}>Instant Credit</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Icon name="shield-lock" size={20} color="#00C896" />
                            <Text style={styles.benefitText}>Bank-grade Security</Text>
                        </View>
                    </View> */}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Button */}
            <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[
                            styles.addMoneyButton,
                            !amountToUse && styles.addMoneyButtonDisabled,
                        ]}
                        disabled={!amountToUse || amountToUse <= 0}
                        onPress={handleRecharge}
                        activeOpacity={0.8}>
                        <Icon name="plus-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.addMoneyButtonText}>
                            {amountToUse
                                ? `Add ₹${amountToUse.toLocaleString('en-IN')}`
                                : 'Enter Amount'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    flex: {
        flex: 1,
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
        paddingBottom: 20,
    },

    // Amount Input Card
    amountCard: {
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 20,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    amountLabel: {
        fontSize: 13,
        color: '#999999',
        marginBottom: 12,
        fontWeight: '500',
    },

    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#00C896',
        paddingBottom: 8,
        marginBottom: 12,
    },

    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: '#666666',
        marginRight: 8,
    },

    amountInput: {
        flex: 1,
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        padding: 0,
        letterSpacing: -2,
    },

    amountHint: {
        fontSize: 12,
        color: '#00C896',
        marginTop: 8,
        fontWeight: '500',
    },

    // Quick Amount Section
    quickAmountSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    quickAmountTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },

    quickAmountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    quickAmountButton: {
        width: '31%',
        backgroundColor: '#1A1A1A',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    quickAmountButtonSelected: {
        backgroundColor: '#00C896',
        borderColor: '#00C896',
    },

    quickAmountText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    quickAmountTextSelected: {
        color: '#FFFFFF',
    },

    // Payment Methods Section
    paymentMethodsSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    paymentMethodsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },

    paymentMethodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    paymentMethodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    paymentMethodInfo: {
        flex: 1,
    },

    paymentMethodName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 3,
    },

    paymentMethodDesc: {
        fontSize: 12,
        color: '#999999',
    },

    // Benefits Section
    benefitsSection: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    benefitText: {
        fontSize: 13,
        color: '#999999',
        marginLeft: 10,
        fontWeight: '500',
    },

    // Bottom Section
    safeAreaBottom: {
        backgroundColor: '#000000',
    },

    bottomSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
    },

    addMoneyButton: {
        backgroundColor: '#00C896',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },

    addMoneyButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },

    addMoneyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});

export default RechargeScreen;
