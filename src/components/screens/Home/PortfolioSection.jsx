import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PortfolioSection = ({ theme, selectedTab, setSelectedTab, holdings, orders, totalCurrent, totalPnl, totalPnlPercent, navigation }) => {
    const renderHoldingItem = (item) => (
        <TouchableOpacity key={item.id} style={[styles.holdingCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.8}>
            <View style={styles.holdingHeader}>
                <View style={styles.holdingLeft}>
                    <Text style={[styles.holdingName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.holdingTicker, { color: theme.textSecondary }]}>{item.qty} qty • Avg ₹{item.avgPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.holdingRight}>
                    <Text style={[styles.holdingCurrentPrice, { color: theme.text }]}>₹{item.currentPrice.toFixed(2)}</Text>
                    <View style={[styles.holdingPnlBadge, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
                        <Icon name={item.isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={item.isPositive ? '#00C896' : '#FF9800'} />
                        <Text style={[styles.holdingPnlText, { color: item.isPositive ? '#00C896' : '#FF9800' }]}>
                            {item.isPositive ? '+' : ''}{item.pnlPercent.toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </View>
            <View style={[styles.holdingDivider, { backgroundColor: theme.border }]} />
            <View style={styles.holdingFooter}>
                <View style={styles.holdingFooterItem}>
                    <Text style={[styles.holdingFooterLabel, { color: theme.textSecondary }]}>Invested</Text>
                    <Text style={[styles.holdingFooterValue, { color: theme.text }]}>₹{item.investedValue.toLocaleString()}</Text>
                </View>
                <View style={styles.holdingFooterItem}>
                    <Text style={[styles.holdingFooterLabel, { color: theme.textSecondary }]}>Current</Text>
                    <Text style={[styles.holdingFooterValue, { color: theme.text }]}>₹{item.currentValue.toLocaleString()}</Text>
                </View>
                <View style={styles.holdingFooterItem}>
                    <Text style={[styles.holdingFooterLabel, { color: theme.textSecondary }]}>P&L</Text>
                    <Text style={[styles.holdingFooterValue, { color: item.isPositive ? '#00C896' : '#FF9800' }]}>
                        {item.isPositive ? '+' : ''}₹{Math.abs(item.pnl).toFixed(2)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderOrderItem = (item) => (
        <TouchableOpacity key={item.id} style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.8}>
            <View style={styles.orderHeader}>
                <View style={styles.orderLeft}>
                    <View style={styles.orderTypeRow}>
                        <View style={[styles.orderTypeBadge, { backgroundColor: item.type === 'BUY' ? '#0D2B24' : '#2A1F0D' }]}>
                            <Text style={[styles.orderTypeText, { color: item.type === 'BUY' ? '#00C896' : '#FF9800' }]}>{item.type}</Text>
                        </View>
                        <View style={styles.orderStatusBadge}>
                            <Text style={styles.orderStatusText}>{item.status}</Text>
                        </View>
                    </View>
                    <Text style={[styles.orderName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.orderTicker, { color: theme.textSecondary }]}>{item.ticker}</Text>
                </View>
                <View style={styles.orderRight}>
                    <Text style={[styles.orderPrice, { color: theme.text }]}>₹{item.price.toFixed(2)}</Text>
                    <Text style={[styles.orderQuantity, { color: theme.textSecondary }]}>{item.qty} qty</Text>
                </View>
            </View>
            <View style={styles.orderFooter}>
                <Icon name="clock-outline" size={12} color={theme.textSecondary} />
                <Text style={[styles.orderTime, { color: theme.textSecondary }]}>{item.time} • {item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.portfolioSection}>
            <View style={[styles.portfolioSummary, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.portfolioSummaryLeft}>
                    <Text style={[styles.portfolioLabel, { color: theme.textSecondary }]}>Portfolio Value</Text>
                    <Text style={[styles.portfolioValue, { color: theme.text }]}>₹{totalCurrent.toLocaleString()}</Text>
                </View>
                <View style={styles.portfolioSummaryRight}>
                    <Text style={[styles.portfolioLabel, { color: theme.textSecondary }]}>Total P&L</Text>
                    <View style={styles.portfolioPnlRow}>
                        <Text style={[styles.portfolioPnl, { color: totalPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                            {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toFixed(2)}
                        </Text>
                        <Text style={[styles.portfolioPnlPercent, { color: totalPnl >= 0 ? '#00C896' : '#FF9800' }]}>
                            ({totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.tabSelector, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <TouchableOpacity style={[styles.tab, selectedTab === 'holdings' && { backgroundColor: '#0D2B24', borderColor: '#00C896', borderWidth: 1 }]} onPress={() => setSelectedTab('holdings')}>
                    <Icon name="briefcase-outline" size={16} color={selectedTab === 'holdings' ? '#00C896' : theme.textSecondary} />
                    <Text style={[styles.tabText, { color: selectedTab === 'holdings' ? '#00C896' : theme.textSecondary }]}>Holdings ({holdings.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, selectedTab === 'orders' && { backgroundColor: '#0D2B24', borderColor: '#00C896', borderWidth: 1 }]} onPress={() => setSelectedTab('orders')}>
                    <Icon name="format-list-bulleted" size={16} color={selectedTab === 'orders' ? '#00C896' : theme.textSecondary} />
                    <Text style={[styles.tabText, { color: selectedTab === 'orders' ? '#00C896' : theme.textSecondary }]}>Orders ({orders.length})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.portfolioContent}>
                {selectedTab === 'holdings' ? (
                    <>
                        {holdings.map(renderHoldingItem)}
                        <TouchableOpacity style={[styles.viewAllButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => navigation.navigate('Holdings')}>
                            <Text style={styles.viewAllText}>View All Holdings</Text>
                            <Icon name="arrow-right" size={16} color="#00C896" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {orders.map(renderOrderItem)}
                        <TouchableOpacity style={[styles.viewAllButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => navigation.navigate('Orders')}>
                            <Text style={styles.viewAllText}>View All Orders</Text>
                            <Icon name="arrow-right" size={16} color="#00C896" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    portfolioSection: { marginHorizontal: 16, marginBottom: 20 },
    portfolioSummary: { flexDirection: 'row', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1 },
    portfolioSummaryLeft: { flex: 1 },
    portfolioLabel: { fontSize: 11, marginBottom: 4, fontWeight: '600' },
    portfolioValue: { fontSize: 20, fontWeight: '800' },
    portfolioSummaryRight: { alignItems: 'flex-end' },
    portfolioPnlRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    portfolioPnl: { fontSize: 14, fontWeight: '700' },
    portfolioPnlPercent: { fontSize: 11, fontWeight: '700' },
    tabSelector: { flexDirection: 'row', borderRadius: 10, padding: 3, marginBottom: 12, borderWidth: 1, gap: 3 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, gap: 4 },
    tabText: { fontSize: 12, fontWeight: '700' },
    portfolioContent: {},

    holdingCard: { borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1 },
    holdingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    holdingLeft: { flex: 1 },
    holdingName: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
    holdingTicker: { fontSize: 11 },
    holdingRight: { alignItems: 'flex-end', gap: 4 },
    holdingCurrentPrice: { fontSize: 14, fontWeight: '800' },
    holdingPnlBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, gap: 3 },
    holdingPnlText: { fontSize: 11, fontWeight: '700' },
    holdingDivider: { height: 1, marginVertical: 10 },
    holdingFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    holdingFooterItem: { flex: 1, alignItems: 'center' },
    holdingFooterLabel: { fontSize: 10, marginBottom: 3 },
    holdingFooterValue: { fontSize: 12, fontWeight: '700' },

    orderCard: { borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1 },
    orderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    orderLeft: { flex: 1 },
    orderTypeRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
    orderTypeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
    orderTypeText: { fontSize: 10, fontWeight: '700' },
    orderStatusBadge: { backgroundColor: '#0D2B24', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
    orderStatusText: { fontSize: 10, color: '#00C896', fontWeight: '700' },
    orderName: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
    orderTicker: { fontSize: 11 },
    orderRight: { alignItems: 'flex-end' },
    orderPrice: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
    orderQuantity: { fontSize: 11 },
    orderFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    orderTime: { fontSize: 10 },

    viewAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, marginTop: 6, gap: 4, borderWidth: 1 },
    viewAllText: { fontSize: 13, fontWeight: '700', color: '#00C896' },
});

export default PortfolioSection;
