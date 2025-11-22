import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Share,
    Alert,
    Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReferralScreen = ({ navigation }) => {
    const [copiedCode, setCopiedCode] = useState(false);

    // Mock data
    const referralCode = 'ABH2024INVEST';
    const referralLink = 'https://investapp.com/ref/ABH2024INVEST';
    const totalReferrals = 12;
    const totalEarnings = 2400;
    const activeReferrals = 8;

    const referrals = [
        { id: '1', name: 'John Smith', status: 'active', earnings: 200, date: '2025-11-05' },
        { id: '2', name: 'Sarah Johnson', status: 'active', earnings: 200, date: '2025-11-04' },
        { id: '3', name: 'Mike Wilson', status: 'active', earnings: 200, date: '2025-11-03' },
        { id: '4', name: 'Emma Brown', status: 'active', earnings: 200, date: '2025-11-02' },
        { id: '5', name: 'Alex Davis', status: 'inactive', earnings: 0, date: '2025-10-28' },
    ];

    const copyToClipboard = (text, type) => {
        Clipboard.setString(text);
        setCopiedCode(true);
        Alert.alert('Copied!', `${type} copied to clipboard`);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join me on InvestApp and earn rewards! Use my referral code: ${referralCode} or click: ${referralLink}`,
                title: 'Invite Friends to InvestApp',
            });
        } catch (error) {
            Alert.alert('Error', 'Unable to share');
        }
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
                    <Text style={styles.headerTitle}>Refer & Invite</Text>
                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroIconContainer}>
                        <Icon name="gift-outline" size={60} color="#00C896" />
                    </View>
                    <Text style={styles.heroTitle}>Earn Rewards</Text>
                    <Text style={styles.heroSubtitle}>
                        Invite your friends and earn ₹200 for each successful referral
                    </Text>
                </View>

                {/* Earnings Card */}
                {/* <View style={styles.earningsCard}>
                    <View style={styles.earningsItem}>
                        <View style={styles.earningsIconContainer}>
                            <Icon name="cash-multiple" size={24} color="#00C896" />
                        </View>
                        <View style={styles.earningsInfo}>
                            <Text style={styles.earningsLabel}>Total Earnings</Text>
                            <Text style={styles.earningsValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>

                    <View style={styles.earningsDivider} />

                    <View style={styles.earningsItem}>
                        <View style={styles.earningsIconContainer}>
                            <Icon name="account-multiple" size={24} color="#2196F3" />
                        </View>
                        <View style={styles.earningsInfo}>
                            <Text style={styles.earningsLabel}>Active Referrals</Text>
                            <Text style={styles.earningsValue}>{activeReferrals}</Text>
                        </View>
                    </View>
                </View> */}

                {/* Referral Code Section */}
                <View style={styles.codeSection}>
                    <Text style={styles.sectionTitle}>Your Referral Code</Text>

                    {/* Code Display */}
                    <View style={styles.codeContainer}>
                        <View style={styles.codeBox}>
                            <Icon name="key-outline" size={20} color="#00C896" />
                            <Text style={styles.codeText}>{referralCode}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.copyCodeButton}
                            onPress={() => copyToClipboard(referralCode, 'Referral Code')}
                            activeOpacity={0.8}>
                            <Icon 
                                name={copiedCode ? "check-circle" : "content-copy"} 
                                size={20} 
                                color={copiedCode ? "#00C896" : "#FFFFFF"} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Link Display */}
                    <View style={styles.linkContainer}>
                        <View style={styles.linkBox}>
                            <Icon name="link-variant" size={20} color="#2196F3" />
                            <Text style={styles.linkText} numberOfLines={1}>
                                {referralLink}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.copyLinkButton}
                            onPress={() => copyToClipboard(referralLink, 'Referral Link')}
                            activeOpacity={0.8}>
                            <Icon name="content-copy" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Share Section */}
                <View style={styles.shareSection}>
                    <Text style={styles.sectionTitle}>Share & Invite</Text>
                    
                    <View style={styles.shareGrid}>
                        <TouchableOpacity style={styles.shareCard} activeOpacity={0.8} onPress={handleShare}>
                            <View style={[styles.shareIcon, { backgroundColor: '#0D2B24' }]}>
                                <Icon name="share-variant" size={28} color="#00C896" />
                            </View>
                            <Text style={styles.shareCardLabel}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareCard} activeOpacity={0.8}>
                            <View style={[styles.shareIcon, { backgroundColor: '#1A2035' }]}>
                                <Icon name="whatsapp" size={28} color="#0da71aff" />
                            </View>
                            <Text style={styles.shareCardLabel}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareCard} activeOpacity={0.8}>
                            <View style={[styles.shareIcon, { backgroundColor: '#1F1A2A' }]}>
                                <Icon name="email-outline" size={28} color="#9a3316ff" />
                            </View>
                            <Text style={styles.shareCardLabel}>Email</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareCard} activeOpacity={0.8}>
                            <View style={[styles.shareIcon, { backgroundColor: '#1A2B1F' }]}>
                                <Icon name="twitter" size={28} color="#1DA1F2" />
                            </View>
                            <Text style={styles.shareCardLabel}>Twitter</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* How It Works */}
                <View style={styles.howItWorksSection}>
                    <Text style={styles.sectionTitle}>How It Works</Text>

                    <View style={styles.stepsContainer}>
                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Share Code</Text>
                                <Text style={styles.stepDescription}>
                                    Share your referral code with friends
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepConnector} />

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Sign Up</Text>
                                <Text style={styles.stepDescription}>
                                    They sign up using your code
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepConnector} />

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Earn Money</Text>
                                <Text style={styles.stepDescription}>
                                    Get ₹200 for each successful referral
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Referrals List */}
                {/* <View style={styles.referralsSection}>
                    <View style={styles.referralsHeader}>
                        <Text style={styles.sectionTitle}>Recent Referrals</Text>
                        <Text style={styles.referralCount}>{totalReferrals} Total</Text>
                    </View>

                    {referrals.map((referral) => (
                        <View key={referral.id} style={styles.referralItem}>
                            <View style={styles.referralLeft}>
                                <View style={styles.referralAvatar}>
                                    <Text style={styles.referralAvatarText}>
                                        {referral.name.charAt(0)}
                                    </Text>
                                </View>
                                <View style={styles.referralInfo}>
                                    <Text style={styles.referralName}>{referral.name}</Text>
                                    <View style={styles.referralMeta}>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: referral.status === 'active' ? '#0D2B24' : '#1F1F1F' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: referral.status === 'active' ? '#00C896' : '#999999' }
                                            ]}>
                                                {referral.status}
                                            </Text>
                                        </View>
                                        <Text style={styles.referralDate}>{referral.date}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.referralEarnings}>
                                {referral.earnings > 0 ? '+' : ''}₹{referral.earnings}
                            </Text>
                        </View>
                    ))}
                </View> */}

                {/* Benefits Section */}
                <View style={styles.benefitsSection}>
                    <Text style={styles.sectionTitle}>Benefits</Text>

                    <View style={styles.benefitItem}>
                        <Icon name="check-circle" size={20} color="#00C896" />
                        <Text style={styles.benefitText}>No limit on earnings</Text>
                    </View>

                    <View style={styles.benefitItem}>
                        <Icon name="check-circle" size={20} color="#00C896" />
                        <Text style={styles.benefitText}>Instant payout to wallet</Text>
                    </View>

                    <View style={styles.benefitItem}>
                        <Icon name="check-circle" size={20} color="#00C896" />
                        <Text style={styles.benefitText}>Track all referrals in real-time</Text>
                    </View>

                    <View style={styles.benefitItem}>
                        <Icon name="check-circle" size={20} color="#00C896" />
                        <Text style={styles.benefitText}>Bonus rewards for milestones</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Bottom Button */}
            <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={handleShare}
                        activeOpacity={0.8}>
                        <Icon name="send" size={20} color="#FFFFFF" />
                        <Text style={styles.inviteButtonText}>Invite Friends Now</Text>
                        <Icon name="arrow-right" size={20} color="#FFFFFF" />
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

    // Hero Section
    heroSection: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
    },

    heroIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#00C896',
    },

    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: 0.5,
    },

    heroSubtitle: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Earnings Card
    earningsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    earningsItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    earningsIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center',
    },

    earningsInfo: {
        flex: 1,
    },

    earningsLabel: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
        marginBottom: 4,
    },

    earningsValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    earningsDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#2A2A2A',
        marginHorizontal: 12,
    },

    // Code Section
    codeSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 18,
    },

    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },

    codeBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#00C896',
        gap: 10,
    },

    codeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#00C896',
        letterSpacing: 2,
        flex: 1,
    },

    copyCodeButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00C896',
    },

    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    linkBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2196F3',
        gap: 10,
    },

    linkText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2196F3',
        flex: 1,
    },

    copyLinkButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#1A1F2A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2196F3',
    },

    // Share Section
    shareSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },

    shareGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    shareCard: {
        width: '22%',
        alignItems: 'center',
    },

    shareIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    shareCardLabel: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },

    // How It Works
    howItWorksSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },

    stepsContainer: {
        gap: 0,
    },

    stepItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },

    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00C896',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },

    stepNumberText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    stepContent: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    stepTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },

    stepDescription: {
        fontSize: 13,
        color: '#999999',
    },

    stepConnector: {
        width: 2,
        height: 16,
        backgroundColor: '#00C896',
        alignSelf: 'center',
        marginLeft: 19,
        marginBottom: 4,
    },

    // Referrals Section
    referralsSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },

    referralsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    referralCount: {
        fontSize: 14,
        color: '#00C896',
        fontWeight: '600',
    },

    referralItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    referralLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },

    referralAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00C896',
        alignItems: 'center',
        justifyContent: 'center',
    },

    referralAvatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },

    referralInfo: {
        flex: 1,
    },

    referralName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },

    referralMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'capitalize',
    },

    referralDate: {
        fontSize: 11,
        color: '#999999',
    },

    referralEarnings: {
        fontSize: 15,
        fontWeight: '700',
        color: '#00C896',
    },

    // Benefits Section
    benefitsSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },

    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },

    benefitText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
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

    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C896',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },

    inviteButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});

export default ReferralScreen;
