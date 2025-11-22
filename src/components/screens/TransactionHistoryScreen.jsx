import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    TextInput,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock transaction data
const MOCK_TRANSACTIONS = [
    {
        id: '1',
        type: 'credit',
        category: 'add_money',
        amount: 500,
        status: 'completed',
        description: 'Added money via UPI',
        date: '2025-11-07',
        time: '10:30 AM',
        utr: 'UTR432156789012',
        paymentMethod: 'UPI',
    },
    {
        id: '2',
        type: 'debit',
        category: 'stock_purchase',
        amount: 2500,
        status: 'completed',
        description: 'Bought Reliance Industries',
        stock: 'RELIANCE',
        quantity: 10,
        date: '2025-11-06',
        time: '02:15 PM',
    },
    {
        id: '3',
        type: 'credit',
        category: 'stock_sale',
        amount: 3200,
        status: 'completed',
        description: 'Sold TCS',
        stock: 'TCS',
        quantity: 5,
        date: '2025-11-05',
        time: '11:45 AM',
    },
    {
        id: '4',
        type: 'debit',
        category: 'withdrawal',
        amount: 1000,
        status: 'pending',
        description: 'Withdrawal to bank',
        date: '2025-11-04',
        time: '04:20 PM',
        bankName: 'HDFC Bank',
    },
    {
        id: '5',
        type: 'credit',
        category: 'dividend',
        amount: 150,
        status: 'completed',
        description: 'Dividend received',
        stock: 'INFY',
        date: '2025-11-03',
        time: '09:00 AM',
    },
];

const FILTER_OPTIONS = [
    { id: 'all', label: 'All', icon: 'view-grid' },
    { id: 'credit', label: 'Credit', icon: 'plus-circle' },
    { id: 'debit', label: 'Debit', icon: 'minus-circle' },
    { id: 'pending', label: 'Pending', icon: 'clock-outline' },
];

const TransactionHistoryScreen = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter transactions
    const filteredTransactions = MOCK_TRANSACTIONS.filter((transaction) => {
        const matchesFilter =
            selectedFilter === 'all' ||
            (selectedFilter === 'credit' && transaction.type === 'credit') ||
            (selectedFilter === 'debit' && transaction.type === 'debit') ||
            (selectedFilter === 'pending' && transaction.status === 'pending');

        const matchesSearch =
            searchQuery === '' ||
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.utr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.stock?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Get transaction icon and color
    const getTransactionIcon = (category) => {
        switch (category) {
            case 'add_money':
                return { icon: 'plus-circle', color: '#00C896' };
            case 'withdrawal':
                return { icon: 'bank-transfer-out', color: '#FF9800' };
            case 'stock_purchase':
                return { icon: 'cart', color: '#2196F3' };
            case 'stock_sale':
                return { icon: 'cash-multiple', color: '#00C896' };
            case 'dividend':
                return { icon: 'gift', color: '#9C27B0' };
            default:
                return { icon: 'swap-horizontal', color: '#999999' };
        }
    };

    const renderTransactionItem = ({ item }) => {
        const iconData = getTransactionIcon(item.category);

        return (
            <TouchableOpacity
                style={styles.transactionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}>
                <View style={styles.transactionLeft}>
                    <View
                        style={[
                            styles.transactionIcon,
                            { backgroundColor: iconData.color + '20' },
                        ]}>
                        <Icon name={iconData.icon} size={24} color={iconData.color} />
                    </View>
                    <View style={styles.transactionInfo}>
                        <Text style={styles.transactionDescription}>{item.description}</Text>
                        <View style={styles.transactionMeta}>
                            <Text style={styles.transactionDate}>{item.date}</Text>
                            <Text style={styles.transactionDot}>•</Text>
                            <Text style={styles.transactionTime}>{item.time}</Text>
                            {item.status === 'pending' && (
                                <>
                                    <Text style={styles.transactionDot}>•</Text>
                                    <View style={styles.pendingBadge}>
                                        <Text style={styles.pendingText}>Pending</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.transactionRight}>
                    <Text
                        style={[
                            styles.transactionAmount,
                            { color: item.type === 'credit' ? '#00C896' : '#FF5252' },
                        ]}>
                        {item.type === 'credit' ? '+' : '-'}₹
                        {item.amount.toLocaleString('en-IN')}
                    </Text>
                    <Icon name="chevron-right" size={20} color="#666666" />
                </View>
            </TouchableOpacity>
        );
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
                    <Text style={styles.headerTitle}>Transaction History</Text>
                    <TouchableOpacity style={styles.downloadButton}>
                        <Icon name="download" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon name="magnify" size={20} color="#999999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions, UTR, stocks..."
                        placeholderTextColor="#666666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close-circle" size={20} color="#999999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}>
                    {FILTER_OPTIONS.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[
                                styles.filterTab,
                                selectedFilter === filter.id && styles.filterTabActive,
                            ]}
                            onPress={() => setSelectedFilter(filter.id)}
                            activeOpacity={0.7}>
                            <Icon
                                name={filter.icon}
                                size={18}
                                color={selectedFilter === filter.id ? '#00C896' : '#999999'}
                            />
                            <Text
                                style={[
                                    styles.filterTabText,
                                    selectedFilter === filter.id && styles.filterTabTextActive,
                                ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* Transaction List */}
            {filteredTransactions.length > 0 ? (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Icon name="receipt-text-outline" size={64} color="#666666" />
                    <Text style={styles.emptyStateTitle}>No transactions found</Text>
                    <Text style={styles.emptyStateText}>
                        {searchQuery
                            ? 'Try adjusting your search'
                            : 'Your transaction history will appear here'}
                    </Text>
                </View>
            )}
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

    downloadButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 10,
        fontWeight: '500',
    },

    // Filter Tabs
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 10,
    },

    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    filterTabActive: {
        backgroundColor: '#0D2B24',
        borderColor: '#00C896',
    },

    filterTabText: {
        fontSize: 13,
        color: '#999999',
        fontWeight: '600',
    },

    filterTabTextActive: {
        color: '#00C896',
    },

    // Transaction List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },

    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    transactionInfo: {
        flex: 1,
    },

    transactionDescription: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 6,
    },

    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    transactionDate: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
    },

    transactionTime: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
    },

    transactionDot: {
        fontSize: 12,
        color: '#666666',
    },

    pendingBadge: {
        backgroundColor: '#2A1F0D',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },

    pendingText: {
        fontSize: 10,
        color: '#FF9800',
        fontWeight: '700',
    },

    transactionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },

    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 20,
        marginBottom: 8,
    },

    emptyStateText: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default TransactionHistoryScreen;
