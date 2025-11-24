import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Modal,
    Animated,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import ApiService from '../../../services/ApiService';

const WithdrawScreen = ({ navigation, route }) => {
    const [userData, setUserData] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation refs
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const successScaleAnim = useRef(new Animated.Value(0)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;

    // Mock bank accounts (replace with actual API call later)
    const bankAccounts = [
        {
            id: '1',
            bankName: 'HDFC Bank',
            accountNumber: '****1234',
            fullAccountNumber: '12345678901234',
            accountHolderName: 'John Doe',
            accountType: 'Savings',
            ifscCode: 'HDFC0001234',
            icon: 'bank',
            isPrimary: true,
        },
        {
            id: '2',
            bankName: 'ICICI Bank',
            accountNumber: '****5678',
            fullAccountNumber: '98765432109876',
            accountHolderName: 'John Doe',
            accountType: 'Current',
            ifscCode: 'ICIC0005678',
            icon: 'bank',
            isPrimary: false,
        },
    ];

    // ✅ Fetch user profile and wallet balance
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    const fetchUserData = async () => {
        try {
            console.log('👤 Fetching user data for withdrawal...');
            const response = await ApiService.getUserProfile();

            if (response.success) {
                setUserData(response.data);
                console.log('✅ Available balance:', response.data.walletBalance);
            } else {
                console.error('❌ Failed to fetch user data');
                Alert.alert('Error', 'Failed to load wallet balance');
            }
        } catch (error) {
            console.error('❌ Error fetching user data:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberPress = (num) => {
        if (withdrawAmount.length < 10) {
            setWithdrawAmount(withdrawAmount + num);
        }
    };

    const handleBackspace = () => {
        setWithdrawAmount(withdrawAmount.slice(0, -1));
    };

    const handleDecimal = () => {
        if (!withdrawAmount.includes('.')) {
            setWithdrawAmount(withdrawAmount + '.');
        }
    };

    const handleClear = () => {
        setWithdrawAmount('');
    };

    const handleMaxAmount = () => {
        const availableBalance = userData?.walletBalance || 0;
        setWithdrawAmount(availableBalance.toString());
    };

    // ✅ Withdrawal calculations
    const walletBalance = userData?.walletBalance || 0;
    const bonusBalance = userData?.bonusBalance || 0;
    const enteredAmount = parseFloat(withdrawAmount) || 0;
    const minimumWithdrawal = 100;
    const processingFee = 0; // No processing fee as per backend
    const totalAmount = enteredAmount - processingFee;
    const remainingBalance = walletBalance - enteredAmount;

    const isBelowMinimum = enteredAmount > 0 && enteredAmount < minimumWithdrawal;
    const exceedsBalance = enteredAmount > walletBalance;
    const canWithdraw = enteredAmount >= minimumWithdrawal && enteredAmount <= walletBalance && selectedBank !== null;

    const handleWithdraw = () => {
        if (canWithdraw) {
            setShowConfirmModal(true);
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }).start();
        }
    };

    // ✅ Submit withdrawal request to backend
    const handleConfirmWithdraw = async () => {
        setIsSubmitting(true);

        try {
            console.log('📤 Submitting withdrawal request...');

            const withdrawalData = {
                amount: enteredAmount,
                accountNumber: selectedBank.fullAccountNumber,
                ifscCode: selectedBank.ifscCode,
                accountHolderName: selectedBank.accountHolderName,
                bankName: selectedBank.bankName,
            };

            const response = await ApiService.withdrawMoney(enteredAmount, withdrawalData);

            if (response.success) {
                console.log('✅ Withdrawal request submitted successfully');

                const txnId = response.data.transaction._id ||
                    `WD${Date.now()}${Math.floor(Math.random() * 10000)}`;
                setTransactionId(txnId);

                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setShowConfirmModal(false);
                    setShowSuccessModal(true);

                    Animated.sequence([
                        Animated.spring(successScaleAnim, {
                            toValue: 1,
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                        Animated.spring(checkmarkAnim, {
                            toValue: 1,
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                    ]).start();
                });
            } else {
                console.error('❌ Withdrawal failed:', response.message);
                Alert.alert(
                    'Withdrawal Failed',
                    response.message || 'Unable to process withdrawal. Please try again.',
                    [{ text: 'OK' }]
                );
                closeConfirmModal();
            }
        } catch (error) {
            console.error('❌ Error submitting withdrawal:', error);
            Alert.alert(
                'Error',
                'An unexpected error occurred. Please try again.',
                [{ text: 'OK' }]
            );
            closeConfirmModal();
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeConfirmModal = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setShowConfirmModal(false));
    };

    const closeSuccessModal = () => {
        Animated.timing(successScaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setShowSuccessModal(false);
            navigation.navigate('ProfileWallet'); // Navigate back to wallet
        });
    };

    const NumberButton = ({ value, onPress }) => (
        <TouchableOpacity
            style={styles.numButton}
            onPress={onPress}
            activeOpacity={0.7}>
            {typeof value === 'string' ? (
                <Text style={styles.numButtonText}>{value}</Text>
            ) : (
                value
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF9800" />
                <Text style={styles.loadingText}>Loading wallet...</Text>
            </View>
        );
    }

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
                    <Text style={styles.headerTitle}>Withdraw Money</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Available Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <View style={styles.balanceIconContainer}>
                            <Icon name="wallet" size={24} color="#FF9800" />
                        </View>
                        <View style={styles.balanceInfo}>
                            <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
                            <Text style={styles.balanceValue}>
                                ₹{walletBalance.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                        </View>
                    </View>

                    {/* ✅ Show bonus balance info */}
                    {bonusBalance > 0 && (
                        <View style={styles.bonusInfoContainer}>
                            <Icon name="information-outline" size={16} color="#FFD700" />
                            <Text style={styles.bonusInfoText}>
                                Bonus balance (₹{bonusBalance.toFixed(2)}) cannot be withdrawn
                            </Text>
                        </View>
                    )}

                    {isBelowMinimum && (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle-outline" size={16} color="#FF5252" />
                            <Text style={styles.errorText}>
                                Minimum withdrawal is ₹{minimumWithdrawal}
                            </Text>
                        </View>
                    )}

                    {exceedsBalance && (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle-outline" size={16} color="#FF5252" />
                            <Text style={styles.errorText}>
                                Insufficient balance. Available: ₹{walletBalance.toFixed(2)}
                            </Text>
                        </View>
                    )}

                    {canWithdraw && (
                        <View style={styles.successContainer}>
                            <Icon name="check-circle-outline" size={16} color="#00C896" />
                            <Text style={styles.successText}>
                                Ready to withdraw • Balance after: ₹{remainingBalance.toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Amount Input Section */}
                <View style={styles.amountSection}>
                    <View style={styles.amountSectionHeader}>
                        <Text style={styles.sectionTitle}>Enter Amount</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.maxButton}
                                onPress={handleMaxAmount}
                                activeOpacity={0.7}>
                                <Text style={styles.maxButtonText}>MAX</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={handleClear}
                                activeOpacity={0.7}>
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[
                        styles.amountInputContainer,
                        isBelowMinimum && styles.amountInputError,
                        exceedsBalance && styles.amountInputError,
                        canWithdraw && styles.amountInputSuccess
                    ]}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <Text style={styles.amountInputText}>
                            {withdrawAmount || '0'}
                        </Text>
                    </View>

                    <View style={styles.amountHints}>
                        <View style={styles.amountHint}>
                            <Icon name="information-outline" size={14} color="#999999" />
                            <Text style={styles.amountHintText}>
                                Min: ₹{minimumWithdrawal}
                            </Text>
                        </View>
                        <View style={styles.amountHint}>
                            <Icon name="clock-outline" size={14} color="#999999" />
                            <Text style={styles.amountHintText}>
                                Processing: 1-3 days
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bank Account Selection */}
                <View style={styles.bankSection}>
                    <Text style={styles.sectionTitle}>Select Bank Account</Text>

                    {bankAccounts.map((bank) => (
                        <TouchableOpacity
                            key={bank.id}
                            style={[
                                styles.bankCard,
                                selectedBank?.id === bank.id && styles.bankCardSelected
                            ]}
                            onPress={() => setSelectedBank(bank)}
                            activeOpacity={0.8}>
                            <View style={styles.bankCardLeft}>
                                <View style={[
                                    styles.bankIconContainer,
                                    selectedBank?.id === bank.id && styles.bankIconContainerSelected
                                ]}>
                                    <Icon
                                        name={bank.icon}
                                        size={24}
                                        color={selectedBank?.id === bank.id ? '#FF9800' : '#999999'}
                                    />
                                </View>
                                <View style={styles.bankInfo}>
                                    <View style={styles.bankNameRow}>
                                        <Text style={styles.bankName}>{bank.bankName}</Text>
                                        {bank.isPrimary && (
                                            <View style={styles.primaryBadge}>
                                                <Text style={styles.primaryBadgeText}>Primary</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.accountNumber}>
                                        {bank.accountNumber} • {bank.accountType}
                                    </Text>
                                    <Text style={styles.ifscCode}>IFSC: {bank.ifscCode}</Text>
                                </View>
                            </View>
                            {selectedBank?.id === bank.id && (
                                <Icon name="check-circle" size={24} color="#FF9800" />
                            )}
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.addBankButton}
                        onPress={() => console.log('Add bank account coming soon')}
                        activeOpacity={0.8}>
                        <Icon name="plus-circle-outline" size={20} color="#00C896" />
                        <Text style={styles.addBankButtonText}>Add New Bank Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Transaction Summary */}
                {enteredAmount > 0 && (
                    <View style={styles.summarySection}>
                        <Text style={styles.sectionTitle}>Withdrawal Summary</Text>

                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Withdrawal Amount</Text>
                                <Text style={styles.summaryValue}>₹{enteredAmount.toFixed(2)}</Text>
                            </View>

                            <View style={styles.summaryDivider} />

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabelBold}>You'll Receive</Text>
                                <Text style={[styles.summaryValueBold, { color: '#00C896' }]}>
                                    ₹{totalAmount.toFixed(2)}
                                </Text>
                            </View>

                            <View style={styles.summaryDivider} />

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Remaining Balance</Text>
                                <Text style={styles.summaryValue}>
                                    ₹{remainingBalance.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Icon name="clock-outline" size={16} color="#FF9800" />
                            <Text style={styles.infoText}>
                                Funds will be credited within 1-3 business days after approval
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Section */}
            <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[
                            styles.withdrawButton,
                            !canWithdraw && styles.disabledButton
                        ]}
                        activeOpacity={canWithdraw ? 0.8 : 1}
                        disabled={!canWithdraw}
                        onPress={handleWithdraw}>
                        <Icon
                            name={canWithdraw ? "bank-transfer-out" : "alert-circle-outline"}
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={[
                            styles.withdrawButtonText,
                            !canWithdraw && styles.disabledButtonText
                        ]}>
                            {isBelowMinimum
                                ? `Min ₹${minimumWithdrawal}`
                                : exceedsBalance
                                    ? 'Insufficient Balance'
                                    : !selectedBank
                                        ? 'Select Bank Account'
                                        : canWithdraw
                                            ? 'Confirm Withdrawal'
                                            : 'Enter Amount'}
                        </Text>
                    </TouchableOpacity>

                    {/* Number Pad */}
                    <View style={styles.numberPad}>
                        <View style={styles.numberRow}>
                            <NumberButton value="1" onPress={() => handleNumberPress('1')} />
                            <NumberButton value="2" onPress={() => handleNumberPress('2')} />
                            <NumberButton value="3" onPress={() => handleNumberPress('3')} />
                        </View>

                        <View style={styles.numberRow}>
                            <NumberButton value="4" onPress={() => handleNumberPress('4')} />
                            <NumberButton value="5" onPress={() => handleNumberPress('5')} />
                            <NumberButton value="6" onPress={() => handleNumberPress('6')} />
                        </View>

                        <View style={styles.numberRow}>
                            <NumberButton value="7" onPress={() => handleNumberPress('7')} />
                            <NumberButton value="8" onPress={() => handleNumberPress('8')} />
                            <NumberButton value="9" onPress={() => handleNumberPress('9')} />
                        </View>

                        <View style={styles.numberRow}>
                            <NumberButton value="." onPress={handleDecimal} />
                            <NumberButton value="0" onPress={() => handleNumberPress('0')} />
                            <NumberButton
                                value={<Icon name="backspace-outline" size={24} color="#FFFFFF" />}
                                onPress={handleBackspace}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeConfirmModal}>
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.confirmModalContent,
                            { transform: [{ scale: scaleAnim }] }
                        ]}>
                        <View style={styles.modalIconContainer}>
                            <Icon name="alert-circle-outline" size={60} color="#FF9800" />
                        </View>

                        <Text style={styles.modalTitle}>Confirm Withdrawal</Text>
                        <Text style={styles.modalSubtitle}>
                            Please review your withdrawal details
                        </Text>

                        <View style={styles.modalDetailsCard}>
                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalDetailLabel}>Bank Account</Text>
                                <Text style={styles.modalDetailValue}>
                                    {selectedBank?.bankName}
                                </Text>
                            </View>

                            <View style={styles.modalDetailDivider} />

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalDetailLabel}>Account Number</Text>
                                <Text style={styles.modalDetailValue}>
                                    {selectedBank?.accountNumber}
                                </Text>
                            </View>

                            <View style={styles.modalDetailDivider} />

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalDetailLabel}>Withdrawal Amount</Text>
                                <Text style={styles.modalDetailValue}>
                                    ₹{enteredAmount.toFixed(2)}
                                </Text>
                            </View>

                            <View style={styles.modalDetailDivider} />

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalDetailLabel}>You'll Receive</Text>
                                <Text style={[styles.modalDetailValue, styles.modalDetailHighlight]}>
                                    ₹{totalAmount.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={closeConfirmModal}
                                disabled={isSubmitting}
                                activeOpacity={0.8}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalConfirmButton,
                                    isSubmitting && styles.disabledButton
                                ]}
                                onPress={handleConfirmWithdraw}
                                disabled={isSubmitting}
                                activeOpacity={0.8}>
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Icon name="check-circle" size={20} color="#FFFFFF" />
                                        <Text style={styles.modalConfirmText}>Confirm</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeSuccessModal}>
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.successModalContent,
                            { transform: [{ scale: successScaleAnim }] }
                        ]}>
                        <Animated.View
                            style={[
                                styles.successIconContainer,
                                { transform: [{ scale: checkmarkAnim }] }
                            ]}>
                            <Icon name="check-circle" size={80} color="#00C896" />
                        </Animated.View>

                        <Text style={styles.successTitle}>Withdrawal Requested!</Text>
                        <Text style={styles.successSubtitle}>
                            Your withdrawal request has been submitted for admin approval
                        </Text>

                        <View style={styles.transactionIdContainer}>
                            <Text style={styles.transactionIdLabel}>Transaction ID</Text>
                            <Text style={styles.transactionIdValue}>{transactionId}</Text>
                        </View>

                        <View style={styles.successDetailsCard}>
                            <View style={styles.successDetailRow}>
                                <Icon name="bank" size={20} color="#999999" />
                                <View style={styles.successDetailInfo}>
                                    <Text style={styles.successDetailLabel}>Bank Account</Text>
                                    <Text style={styles.successDetailValue}>
                                        {selectedBank?.bankName} {selectedBank?.accountNumber}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.successDetailRow}>
                                <Icon name="cash-multiple" size={20} color="#999999" />
                                <View style={styles.successDetailInfo}>
                                    <Text style={styles.successDetailLabel}>Amount to Receive</Text>
                                    <Text style={[styles.successDetailValue, { color: '#00C896' }]}>
                                        ₹{totalAmount.toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.successDetailRow}>
                                <Icon name="clock-outline" size={20} color="#999999" />
                                <View style={styles.successDetailInfo}>
                                    <Text style={styles.successDetailLabel}>Expected Time</Text>
                                    <Text style={styles.successDetailValue}>1-3 business days</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={closeSuccessModal}
                            activeOpacity={0.8}>
                            <Text style={styles.successButtonText}>Done</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.viewTransactionButton}
                            onPress={() => {
                                closeSuccessModal();
                                navigation.navigate('TransactionHistory');
                            }}
                            activeOpacity={0.8}>
                            <Text style={styles.viewTransactionButtonText}>
                                View Transaction History
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

// Continue with your existing styles...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999999',
        fontWeight: '600',
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
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
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
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    // Balance Card
    balanceCard: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    balanceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    balanceInfo: {
        flex: 1,
    },

    balanceLabel: {
        fontSize: 13,
        color: '#999999',
        marginBottom: 4,
        fontWeight: '600',
    },

    balanceValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },

    bonusInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 12,
    },

    bonusInfoText: {
        flex: 1,
        fontSize: 12,
        color: '#FFD700',
        fontWeight: '600',
        marginLeft: 8,
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 82, 82, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },

    errorText: {
        flex: 1,
        fontSize: 12,
        color: '#FF5252',
        fontWeight: '600',
        marginLeft: 8,
    },

    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 200, 150, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },

    successText: {
        flex: 1,
        fontSize: 12,
        color: '#00C896',
        fontWeight: '600',
        marginLeft: 8,
    },

    // Amount Section
    amountSection: {
        marginHorizontal: 16,
        marginTop: 20,
    },

    amountSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },

    maxButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#FF9800',
    },

    maxButtonText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#1A1A1A',
    },

    clearButtonText: {
        fontSize: 12,
        color: '#FF9800',
        fontWeight: '600',
    },

    amountInputContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#2A2A2A',
        paddingHorizontal: 20,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 80,
    },

    amountInputError: {
        borderColor: '#FF5252',
        backgroundColor: 'rgba(255, 82, 82, 0.05)',
    },

    amountInputSuccess: {
        borderColor: '#00C896',
    },

    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: '#999999',
        marginRight: 8,
    },

    amountInputText: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
        flex: 1,
        letterSpacing: -1,
    },

    amountHints: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    amountHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    amountHintText: {
        fontSize: 12,
        color: '#999999',
    },

    // Bank Section
    bankSection: {
        marginHorizontal: 16,
        marginTop: 24,
    },

    bankCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 2,
        borderColor: '#2A2A2A',
    },

    bankCardSelected: {
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.05)',
    },

    bankCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    bankIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0D0D0D',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    bankIconContainerSelected: {
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
    },

    bankInfo: {
        flex: 1,
    },

    bankNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },

    bankName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    primaryBadge: {
        backgroundColor: '#0D2B24',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },

    primaryBadgeText: {
        fontSize: 10,
        color: '#00C896',
        fontWeight: '700',
    },

    accountNumber: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
    },

    ifscCode: {
        fontSize: 11,
        color: '#666666',
    },

    addBankButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderStyle: 'dashed',
        gap: 8,
    },

    addBankButtonText: {
        fontSize: 14,
        color: '#00C896',
        fontWeight: '600',
    },

    // Summary Section
    summarySection: {
        marginHorizontal: 16,
        marginTop: 24,
    },

    summaryCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },

    summaryDivider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 8,
    },

    summaryLabel: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '500',
    },

    summaryValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    summaryLabelBold: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '800',
    },

    summaryValueBold: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        gap: 10,
    },

    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#FF9800',
        fontWeight: '600',
    },

    // Bottom Section
    safeAreaBottom: {
        backgroundColor: '#000000',
    },

    bottomSection: {
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    withdrawButton: {
        flexDirection: 'row',
        backgroundColor: '#FF9800',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 8,
    },

    disabledButton: {
        backgroundColor: '#2A2A2A',
    },

    withdrawButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    disabledButtonText: {
        color: '#666666',
    },

    // Number Pad
    numberPad: {
        gap: 8,
        marginBottom: 8,
    },

    numberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },

    numButton: {
        flex: 1,
        aspectRatio: 1.3,
        maxHeight: 55,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    numButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    confirmModalContent: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    modalIconContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },

    modalSubtitle: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        marginBottom: 24,
    },

    modalDetailsCard: {
        backgroundColor: '#0D0D0D',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },

    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },

    modalDetailDivider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 4,
    },

    modalDetailLabel: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '500',
    },

    modalDetailValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    modalDetailHighlight: {
        fontSize: 18,
        color: '#00C896',
    },

    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },

    modalCancelButton: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    modalCancelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    modalConfirmButton: {
        flex: 1,
        backgroundColor: '#FF9800',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },

    modalConfirmText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Success Modal
    successModalContent: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    successIconContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },

    successTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#00C896',
        textAlign: 'center',
        marginBottom: 8,
    },

    successSubtitle: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        marginBottom: 20,
    },

    transactionIdContainer: {
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        alignItems: 'center',
    },

    transactionIdLabel: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 4,
    },

    transactionIdValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FF9800',
        letterSpacing: 1,
    },

    successDetailsCard: {
        backgroundColor: '#0D0D0D',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        gap: 16,
    },

    successDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    successDetailInfo: {
        marginLeft: 12,
        flex: 1,
    },

    successDetailLabel: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 4,
    },

    successDetailValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    successButton: {
        backgroundColor: '#FF9800',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },

    successButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    viewTransactionButton: {
        backgroundColor: '#0D0D0D',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    viewTransactionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF9800',
    },
});

export default WithdrawScreen;
