import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FEATURED_INDICES = [
    { id: '1', name: 'NIFTY 50', value: '19,435', change: '+1.24%', isPositive: true, icon: 'chart-line' },
    { id: '2', name: 'SENSEX', value: '64,832', change: '+0.98%', isPositive: true, icon: 'chart-timeline-variant' },
    { id: '3', name: 'BANK NIFTY', value: '43,567', change: '+2.14%', isPositive: true, icon: 'bank' },
    { id: '4', name: 'NIFTY IT', value: '30,234', change: '-0.45%', isPositive: false, icon: 'code-tags' },
];



const INDICES_CATEGORIES = [
    { id: '1', title: 'All Indices', icon: 'view-grid', color: '#00C896' },
    { id: '2', title: 'Indian Indices', icon: 'chart-box', color: '#00C896' },
    { id: '3', title: 'Global Indices', icon: 'earth', color: '#2196F3' },
    { id: '4', title: 'Crypto', icon: 'bitcoin', color: '#FF9800' },
];

const MarketIndices = ({ theme, navigation }) => {
    const renderFeaturedItem = ({ item }) => {
        if (item.id === 'view-all') {
            return (
                <TouchableOpacity style={[styles.viewAllCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.8} onPress={() => navigation.navigate('Indices', { tab: 'All' })}>
                    <Icon name="arrow-right-circle" size={40} color={theme.primary} />
                    <Text style={[styles.viewAllCardTitle, { color: theme.text }]}>View All</Text>
                    <Text style={[styles.viewAllCardSubtitle, { color: theme.textSecondary }]}>Indices</Text>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity style={[styles.featuredCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.9} onPress={() => navigation.navigate('StockDetail', { stock: item })}>
                <View style={[styles.featuredIcon, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
                    <Icon name={item.icon} size={20} color={item.isPositive ? '#00C896' : '#FF9800'} />
                </View>
                <Text style={[styles.featuredName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.featuredValue, { color: theme.text }]}>{item.value}</Text>
                <View style={[styles.featuredChange, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
                    <Icon name={item.isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={item.isPositive ? '#00C896' : '#FF9800'} />
                    <Text style={[styles.featuredChangeText, { color: item.isPositive ? '#00C896' : '#FF9800' }]}>{item.change}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const featuredIndicesWithViewAll = [...FEATURED_INDICES, { id: 'view-all' }];

    return (
        <>
            {/* Featured Indices */}
            <View style={styles.indicesSection}>
                <View style={styles.featuredSectionHeader}>
                    <Text style={[styles.featuredSectionTitle, { color: theme.text }]}>Top Indices</Text>
                    <Icon name="chart-timeline-variant" size={18} color="#00C896" />
                </View>
                <FlatList
                    horizontal
                    data={featuredIndicesWithViewAll}
                    renderItem={renderFeaturedItem}
                    keyExtractor={item => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredList}
                />
            </View>

            {/* Market Categories */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Market Indices</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate('Indices', { tab: 'All' })}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Icon name="chevron-right" size={16} color="#00C896" />
                </TouchableOpacity>
            </View>

            <View style={styles.categoriesGrid}>
                {INDICES_CATEGORIES.map(cat => (
                    <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.8} onPress={() => navigation.navigate('Indices', { tab: cat.title })}>
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                            <Icon name={cat.icon} size={24} color={cat.color} />
                        </View>
                        <Text style={[styles.categoryTitle, { color: theme.text }]}>{cat.title}</Text>
                        <Icon name="chevron-right" size={18} color={theme.textTertiary} />
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    indicesSection: { marginBottom: 20 },
    featuredSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 12 },
    featuredSectionTitle: { fontSize: 16, fontWeight: '800' },
    featuredList: { paddingHorizontal: 16 },
    featuredCard: { width: 110, borderRadius: 12, padding: 10, marginRight: 10, borderWidth: 1 },
    featuredIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    featuredName: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
    featuredValue: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
    featuredChange: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, gap: 3, alignSelf: 'flex-start' },
    featuredChangeText: { fontSize: 10, fontWeight: '700' },
    viewAllCard: { width: 110, borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed' },
    viewAllCardTitle: { fontSize: 12, fontWeight: '700', marginBottom: 2, marginTop: 6 },
    viewAllCardSubtitle: { fontSize: 10 },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '800' },
    viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    viewAllText: { fontSize: 12, fontWeight: '700', color: '#00C896' },

    categoriesGrid: { marginHorizontal: 16, gap: 10 },
    categoryCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, borderWidth: 1 },
    categoryIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    categoryTitle: { flex: 1, fontSize: 13, fontWeight: '700' },
});

export default MarketIndices;
