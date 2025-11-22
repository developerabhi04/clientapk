import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GUIDE_SECTIONS = [
    {
        id: '1',
        title: 'Getting Started',
        icon: 'rocket-launch',
        iconColor: COLORS.primary,
        steps: [
            {
                step: 'Sign Up',
                description: 'Create your account using your phone number and verify with OTP.',
            },
            {
                step: 'Complete KYC',
                description: 'Upload your PAN card and bank account details for verification.',
            },
            {
                step: 'Add Money',
                description: 'Fund your wallet with minimum ₹500 to start trading.',
            },
        ],
    },
    {
        id: '2',
        title: 'How to Add Money',
        icon: 'wallet-plus',
        iconColor: COLORS.success,
        steps: [
            {
                step: 'Go to Wallet',
                description: 'Tap on the Wallet icon from the bottom navigation.',
            },
            {
                step: 'Click Add Money',
                description: 'Enter the amount you want to add (minimum ₹500).',
            },
            {
                step: 'Choose Payment Method',
                description: 'Pay using UPI (PhonePe, Google Pay, Paytm) or Net Banking.',
            },
            {
                step: 'Submit UTR Number',
                description: '⚠️ IMPORTANT: After payment, you must enter the UTR/Transaction ID to credit your wallet. Without UTR, money will NOT be added.',
            },
        ],
    },
    {
        id: '3',
        title: 'How to Trade',
        icon: 'chart-line',
        iconColor: COLORS.primary,
        steps: [
            {
                step: 'Browse Market',
                description: 'Explore NIFTY, SENSEX, BANK NIFTY and other indices on the home screen.',
            },
            {
                step: 'Select Stock',
                description: 'Tap on any stock to view details and current price.',
            },
            {
                step: 'Enter Amount',
                description: 'Use the number pad to enter the amount you want to invest (minimum ₹500).',
            },
            {
                step: 'Confirm Trade',
                description: 'Review your order and tap "Buy Now" to execute the trade.',
            },
        ],
    },
    {
        id: '4',
        title: 'Trading Rules',
        icon: 'shield-check',
        iconColor: COLORS.warning,
        steps: [
            {
                step: 'Minimum Trade Amount',
                description: 'You must invest at least ₹500 per trade. Orders below ₹500 will be rejected.',
            },
            {
                step: 'Wallet Balance Required',
                description: 'Ensure you have sufficient balance in your wallet before placing an order.',
            },
            {
                step: 'Balance After Trade',
                description: 'The system will show your balance after the trade is executed.',
            },
            {
                step: 'Same-Day Settlement',
                description: 'Profits and losses are reflected in your wallet immediately after trade execution.',
            },
        ],
    },
    {
        id: '5',
        title: 'How to Withdraw',
        icon: 'bank-transfer',
        iconColor: COLORS.error,
        steps: [
            {
                step: 'Go to Wallet',
                description: 'Open the Wallet screen from bottom navigation.',
            },
            {
                step: 'Click Withdraw',
                description: 'Enter the amount you want to withdraw (minimum ₹100).',
            },
            {
                step: 'Verify Bank Details',
                description: 'Ensure your bank account is verified in Account Settings.',
            },
            {
                step: 'Wait for Processing',
                description: 'Money will be transferred to your bank within 1-3 business days.',
            },
        ],
    },
    {
        id: '6',
        title: 'Portfolio & Holdings',
        icon: 'briefcase',
        iconColor: COLORS.primary,
        steps: [
            {
                step: 'View Holdings',
                description: 'Tap "My Portfolio" to see all your current stock holdings.',
            },
            {
                step: 'Check P&L',
                description: 'See profit/loss for each stock and your overall portfolio performance.',
            },
            {
                step: 'Track Performance',
                description: 'Monitor daily changes, invested amount, and current value.',
            },
            {
                step: 'Sell Anytime',
                description: 'Tap on any holding to view details and sell your position.',
            },
        ],
    },
];

const AppGuideScreen = ({ navigation }) => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (id) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}>
                        <Icon name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>How It Works</Text>
                    <View style={styles.headerRight} />
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View style={styles.welcomeIcon}>
                        <Icon name="book-open-variant" size={48} color={COLORS.primary} />
                    </View>
                    <Text style={styles.welcomeTitle}>Complete Trading Guide</Text>
                    <Text style={styles.welcomeText}>
                        Learn how to use our app and start trading with confidence
                    </Text>
                </View>

                {/* Important Notice */}
                <View style={styles.noticeCard}>
                    <Icon name="alert-circle" size={24} color={COLORS.error} />
                    <View style={styles.noticeContent}>
                        <Text style={styles.noticeTitle}>Important!</Text>
                        <Text style={styles.noticeText}>
                            Always submit UTR number after adding money to wallet. Without UTR, your payment will not be credited.
                        </Text>
                    </View>
                </View>

                {/* Guide Sections */}
                {GUIDE_SECTIONS.map((section) => (
                    <TouchableOpacity
                        key={section.id}
                        style={[
                            styles.sectionCard,
                            expandedSection === section.id && styles.sectionCardExpanded
                        ]}
                        onPress={() => toggleSection(section.id)}
                        activeOpacity={0.8}>

                        {/* Section Header */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionHeaderLeft}>
                                <View style={[
                                    styles.sectionIcon,
                                    { backgroundColor: section.iconColor + '20' }
                                ]}>
                                    <Icon name={section.icon} size={24} color={section.iconColor} />
                                </View>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            <Icon
                                name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                                size={24}
                                color={COLORS.textSecondary}
                            />
                        </View>

                        {/* Section Content */}
                        {expandedSection === section.id && (
                            <View style={styles.sectionContent}>
                                {section.steps.map((step, index) => (
                                    <View key={index} style={styles.stepItem}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={styles.stepTitle}>{step.step}</Text>
                                            <Text style={styles.stepDescription}>
                                                {step.description}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                {/* Quick Tips */}
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsSectionTitle}>💡 Quick Tips</Text>

                    <View style={styles.tipCard}>
                        <Icon name="check-circle" size={20} color={COLORS.success} />
                        <Text style={styles.tipText}>
                            Always maintain minimum ₹500 balance for trading
                        </Text>
                    </View>

                    <View style={styles.tipCard}>
                        <Icon name="check-circle" size={20} color={COLORS.success} />
                        <Text style={styles.tipText}>
                            Check your balance before placing any order
                        </Text>
                    </View>

                    <View style={styles.tipCard}>
                        <Icon name="check-circle" size={20} color={COLORS.success} />
                        <Text style={styles.tipText}>
                            Keep your PAN card and bank details updated
                        </Text>
                    </View>

                    <View style={styles.tipCard}>
                        <Icon name="check-circle" size={20} color={COLORS.success} />
                        <Text style={styles.tipText}>
                            Enable biometric login for quick and secure access
                        </Text>
                    </View>
                </View>

                {/* Need Help */}
                <TouchableOpacity
                    style={styles.helpCard}
                    onPress={() => navigation.navigate('HelpSupport')}
                    activeOpacity={0.8}>
                    <View style={styles.helpIconContainer}>
                        <Icon name="help-circle" size={32} color={COLORS.primary} />
                    </View>
                    <View style={styles.helpContent}>
                        <Text style={styles.helpTitle}>Still Need Help?</Text>
                        <Text style={styles.helpText}>Contact our support team</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    safeArea: {
        backgroundColor: COLORS.surface,
    },

    // Header
    header: {
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },

    headerRight: {
        width: 40,
    },

    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },

    // Welcome Section
    welcomeSection: {
        alignItems: 'center',
        paddingVertical: 32,
        marginBottom: 16,
    },

    welcomeIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryUltraLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    welcomeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center',
    },

    welcomeText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },

    // Notice Card
    noticeCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.errorLight,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.error,
    },

    noticeContent: {
        flex: 1,
        marginLeft: 12,
    },

    noticeTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.error,
        marginBottom: 4,
    },

    noticeText: {
        fontSize: 13,
        color: COLORS.error,
        lineHeight: 18,
    },

    // Section Card
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    sectionCardExpanded: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    sectionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        flex: 1,
    },

    sectionContent: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },

    // Step Item
    stepItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },

    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,
    },

    stepContent: {
        flex: 1,
    },

    stepTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },

    stepDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },

    // Tips Section
    tipsSection: {
        backgroundColor: COLORS.successLight,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.success,
    },

    tipsSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.success,
        marginBottom: 16,
    },

    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 10,
    },

    tipText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.success,
        lineHeight: 18,
        fontWeight: '500',
    },

    // Help Card
    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primaryUltraLight,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },

    helpIconContainer: {
        marginRight: 16,
    },

    helpContent: {
        flex: 1,
    },

    helpTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },

    helpText: {
        fontSize: 13,
        color: COLORS.primary,
    },
});

export default AppGuideScreen;
