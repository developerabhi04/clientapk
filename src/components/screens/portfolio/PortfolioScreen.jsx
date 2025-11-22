import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MOCK_HOLDINGS = [
    {
        id: 'h1',
        name: 'Reliance Industries',
        ticker: 'RELIANCE',
        quantity: 10,
        avgPrice: 2450.50,
        currentPrice: 2580.75,
        investedValue: 24505,
        currentValue: 25807.50,
        pnl: 1302.50,
        pnlPercent: 5.32,
        isPositive: true,
    },
    {
        id: 'h2',
        name: 'TCS',
        ticker: 'TCS',
        quantity: 5,
        avgPrice: 3420.00,
        currentPrice: 3380.25,
        investedValue: 17100,
        currentValue: 16901.25,
        pnl: -198.75,
        pnlPercent: -1.16,
        isPositive: false,
    },
    {
        id: 'h3',
        name: 'HDFC Bank',
        ticker: 'HDFCBANK',
        quantity: 15,
        avgPrice: 1620.00,
        currentPrice: 1685.50,
        investedValue: 24300,
        currentValue: 25282.50,
        pnl: 982.50,
        pnlPercent: 4.04,
        isPositive: true,
    },
    {
        id: 'h4',
        name: 'Infosys',
        ticker: 'INFY',
        quantity: 8,
        avgPrice: 1450.00,
        currentPrice: 1475.25,
        investedValue: 11600,
        currentValue: 11802,
        pnl: 202,
        pnlPercent: 1.74,
        isPositive: true,
    },
    {
        id: 'h5',
        name: 'ITC',
        ticker: 'ITC',
        quantity: 50,
        avgPrice: 425.00,
        currentPrice: 418.75,
        investedValue: 21250,
        currentValue: 20937.50,
        pnl: -312.50,
        pnlPercent: -1.47,
        isPositive: false,
    },
];

const PortfolioScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [sortBy, setSortBy] = useState('value');

    const totalInvested = MOCK_HOLDINGS.reduce((sum, h) => sum + h.investedValue, 0);
    const totalCurrent = MOCK_HOLDINGS.reduce((sum, h) => sum + h.currentValue, 0);
    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPercent = (totalPnl / totalInvested) * 100;

    const todayPnl = 1250.75;
    const todayPnlPercent = 1.86;

    const sortedHoldings = [...MOCK_HOLDINGS].sort((a, b) => {
        if (sortBy === 'value') return b.currentValue - a.currentValue;
        if (sortBy === 'pnl') return b.pnl - a.pnl;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Portfolio</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Icon name="chart-line" size={22} color="#00C896" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>

                {/* Enhanced Portfolio Summary Card - Groww Style */}
                <View style={styles.summaryCard}>
                    {/* Main Value Display */}
                    <View style={styles.mainValueSection}>
                        <Text style={styles.mainValueLabel}>Current Value</Text>
                        <Text style={styles.mainValue}>₹{totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        {/* Total Investment */}
                        <View style={styles.statBox}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainer}>
                                    <Icon name="cash" size={16} color="#00C896" />
                                </View>
                                <Text style={styles.statLabel}>Invested</Text>
                            </View>
                            <Text style={styles.statValue}>₹{totalInvested.toLocaleString('en-IN')}</Text>
                        </View>

                        {/* Total Returns */}
                        <View style={styles.statBox}>
                            <View style={styles.statHeader}>
                                <View style={[styles.statIconContainer, { backgroundColor: totalPnl >= 0 ? '#0D2B24' : '#2A1F0D' }]}>
                                    <Icon 
                                        name={totalPnl >= 0 ? "trending-up" : "trending-down"} 
                                        size={16} 
                                        color={totalPnl >= 0 ? '#00C896' : '#FF9800'} 
                                    />
                                </View>
                                <Text style={styles.statLabel}>Returns</Text>
                            </View>
                            <View style={styles.returnsRow}>
                                <Text style={[styles.statValue, { color: totalPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                                    {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                                <View style={[styles.percentBadge, { backgroundColor: totalPnl >= 0 ? '#0D2B24' : '#2A1F0D' }]}>
                                    <Text style={[styles.percentText, { color: totalPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                                        {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Today's P&L Banner */}
                    <View style={[styles.todayPnlBanner, { backgroundColor: todayPnl >= 0 ? '#0D2B24' : '#2A1F0D', borderColor: todayPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                        <View style={styles.todayPnlLeft}>
                            <Icon name="clock-outline" size={16} color={todayPnl >= 0 ? '#00C896' : '#FF9800'} />
                            <Text style={styles.todayPnlLabel}>Today's P&L</Text>
                        </View>
                        <View style={styles.todayPnlRight}>
                            <Text style={[styles.todayPnlValue, { color: todayPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                                {todayPnl >= 0 ? '+' : ''}₹{Math.abs(todayPnl).toFixed(2)}
                            </Text>
                            <Text style={[styles.todayPnlPercent, { color: todayPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                                ({todayPnl >= 0 ? '+' : ''}{todayPnlPercent.toFixed(2)}%)
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Sort Options */}
                <View style={styles.sortContainer}>
                    <Text style={styles.sectionTitle}>Holdings ({MOCK_HOLDINGS.length})</Text>
                    <View style={styles.sortButtons}>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'value' && styles.sortButtonActive]}
                            onPress={() => setSortBy('value')}>
                            <Text style={[styles.sortButtonText, sortBy === 'value' && styles.sortButtonTextActive]}>Value</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'pnl' && styles.sortButtonActive]}
                            onPress={() => setSortBy('pnl')}>
                            <Text style={[styles.sortButtonText, sortBy === 'pnl' && styles.sortButtonTextActive]}>P&L</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
                            onPress={() => setSortBy('name')}>
                            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>Name</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Holdings List */}
                <View style={styles.holdingsList}>
                    {sortedHoldings.map((holding) => (
                        <TouchableOpacity
                            key={holding.id}
                            style={styles.holdingCard}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('SellStock', { 
                                stock: {
                                    ...holding,
                                    name: holding.name,
                                    value: holding.currentPrice.toString(),
                                    change: `${holding.isPositive ? '+' : ''}${holding.pnlPercent.toFixed(2)}%`,
                                    isPositive: holding.isPositive,
                                    holdings: holding.quantity,
                                    avgPrice: holding.avgPrice
                                }
                            })}>

                            <View style={styles.holdingHeader}>
                                <View style={styles.holdingLeft}>
                                    <View style={[styles.holdingIcon, { backgroundColor: holding.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
                                        <Icon name="chart-line" size={18} color={holding.isPositive ? '#00C896' : '#FF9800'} />
                                    </View>
                                    <View style={styles.holdingInfo}>
                                        <Text style={styles.holdingName}>{holding.name}</Text>
                                        <Text style={styles.holdingTicker}>{holding.quantity} qty • Avg ₹{holding.avgPrice.toFixed(2)}</Text>
                                    </View>
                                </View>
                                <View style={styles.holdingRight}>
                                    <Text style={styles.holdingCurrentPrice}>₹{holding.currentPrice.toFixed(2)}</Text>
                                    <View style={[styles.holdingPnlBadge, { backgroundColor: holding.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
                                        <Icon name={holding.isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={holding.isPositive ? '#00C896' : '#FF9800'} />
                                        <Text style={[styles.holdingPnlText, { color: holding.isPositive ? '#00C896' : '#FF9800' }]}>
                                            {holding.isPositive ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.holdingDivider} />

                            <View style={styles.holdingFooter}>
                                <View style={styles.holdingFooterItem}>
                                    <Text style={styles.holdingFooterLabel}>Invested</Text>
                                    <Text style={styles.holdingFooterValue}>₹{holding.investedValue.toLocaleString('en-IN')}</Text>
                                </View>
                                <View style={styles.holdingFooterItem}>
                                    <Text style={styles.holdingFooterLabel}>Current</Text>
                                    <Text style={styles.holdingFooterValue}>₹{holding.currentValue.toLocaleString('en-IN')}</Text>
                                </View>
                                <View style={styles.holdingFooterItem}>
                                    <Text style={styles.holdingFooterLabel}>P&L</Text>
                                    <Text style={[styles.holdingFooterValue, { color: holding.isPositive ? '#00C896' : '#FF9800' }]}>
                                        {holding.isPositive ? '+' : ''}₹{Math.abs(holding.pnl).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    safeAreaTop: { backgroundColor: '#000000' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#1A1A1A' 
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
    headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

    // Enhanced Summary Card - Groww Style
    summaryCard: { 
        marginHorizontal: 16, 
        marginTop: 16, 
        marginBottom: 20, 
        backgroundColor: '#1A1A1A', 
        borderRadius: 20, 
        padding: 20, 
        borderWidth: 1, 
        borderColor: '#2A2A2A' 
    },

    // Main Value Section
    mainValueSection: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    mainValueLabel: {
        fontSize: 13,
        color: '#999999',
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    mainValue: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    statIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#999999',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    returnsRow: {
        flexDirection: 'column',
        gap: 6,
    },
    percentBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    percentText: {
        fontSize: 12,
        fontWeight: '800',
    },

    // Today's P&L Banner
    todayPnlBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    todayPnlLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    todayPnlLabel: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    todayPnlRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    todayPnlValue: {
        fontSize: 16,
        fontWeight: '900',
    },
    todayPnlPercent: {
        fontSize: 13,
        fontWeight: '800',
    },

    // Sort
    sortContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginHorizontal: 16, 
        marginBottom: 16 
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
    sortButtons: { flexDirection: 'row', gap: 8 },
    sortButton: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 8, 
        backgroundColor: '#1A1A1A', 
        borderWidth: 1, 
        borderColor: '#2A2A2A' 
    },
    sortButtonActive: { backgroundColor: '#0D2B24', borderColor: '#00C896' },
    sortButtonText: { fontSize: 11, fontWeight: '700', color: '#999999' },
    sortButtonTextActive: { color: '#00C896' },

    // Holdings
    holdingsList: { marginHorizontal: 16, gap: 12 },
    holdingCard: { 
        backgroundColor: '#1A1A1A', 
        borderRadius: 12, 
        padding: 14, 
        borderWidth: 1, 
        borderColor: '#2A2A2A' 
    },
    holdingHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 12 
    },
    holdingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
    holdingIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    holdingInfo: { flex: 1 },
    holdingName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
    holdingTicker: { fontSize: 11, color: '#999999' },
    holdingRight: { alignItems: 'flex-end', gap: 6 },
    holdingCurrentPrice: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
    holdingPnlBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 6, 
        gap: 4 
    },
    holdingPnlText: { fontSize: 11, fontWeight: '700' },
    holdingDivider: { height: 1, backgroundColor: '#2A2A2A', marginBottom: 12 },
    holdingFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    holdingFooterItem: { flex: 1, alignItems: 'center' },
    holdingFooterLabel: { fontSize: 10, color: '#999999', marginBottom: 4, fontWeight: '600' },
    holdingFooterValue: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});

export default PortfolioScreen;
