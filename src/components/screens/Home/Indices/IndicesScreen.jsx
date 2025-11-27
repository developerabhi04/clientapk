import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Data remains the same...
const FEATURED_INDICES = [
  { id: 'feat-1', name: 'NIFTY 0', value: '19,439.30', change: '+1.24%', isPositive: true, icon: 'chart-line-variant' },
  { id: 'feat-2', name: 'SENSEX', value: '64,832.55', change: '+0.98%', isPositive: true, icon: 'trending-up' },
  { id: 'feat-3', name: 'BANK NIFTY', value: '43,567.80', change: '+2.14%', isPositive: true, icon: 'bank' },
  { id: 'feat-4', name: 'NIFTY IT', value: '30,234.90', change: '-0.45%', isPositive: false, icon: 'laptop' },
  { id: 'feat-5', name: 'DOW JONES', value: '34,567.89', change: '+0.67%', isPositive: true, icon: 'chart-areaspline' },
  { id: 'feat-6', name: 'S&P 500', value: '4,456.23', change: '+0.82%', isPositive: true, icon: 'chart-bell-curve' },
];

const INDIAN_INDICES = [
  { id: 'in-1', name: 'NIFTY 50', value: '19,43', change: '+1.24%', isPositive: true },
  { id: 'in-2', name: 'SENSEX', value: '64,83.55', change: '+0.98%', isPositive: true },
  { id: 'in-3', name: 'BANK NIFTY', value: '43,567.80', change: '+2.14%', isPositive: true },
  { id: 'in-4', name: 'NIFTY IT', value: '30,234.90', change: '-0.45%', isPositive: false },
  { id: 'in-5', name: 'NIFTY PHARMA', value: '14,876.25', change: '+1.78%', isPositive: true },
  { id: 'in-6', name: 'NIFTY AUTO', value: '13,456.70', change: '+0.56%', isPositive: true },
  { id: 'in-7', name: 'NIFTY METAL', value: '6,234.80', change: '+2.34%', isPositive: true },
  { id: 'in-8', name: 'NIFTY REALTY', value: '567.45', change: '-1.23%', isPositive: false },
  { id: 'in-9', name: 'NIFTY ENERGY', value: '21,345.60', change: '+1.45%', isPositive: true },
  { id: 'in-10', name: 'NIFTY FMCG', value: '45,678.90', change: '+0.78%', isPositive: true },
  { id: 'in-11', name: 'NIFTY MEDIA', value: '1,234.56', change: '+1.90%', isPositive: true },
  { id: 'in-12', name: 'NIFTY PSU BANK', value: '3,456.78', change: '-0.67%', isPositive: false },
];

const GLOBAL_INDICES = [
  { id: 'gl-1', name: 'DOW JONES', value: '34,567.89', change: '+0.67%', isPositive: true },
  { id: 'gl-2', name: 'S&P 500', value: '4,456.23', change: '+0.82%', isPositive: true },
  { id: 'gl-3', name: 'NASDAQ', value: '13,789.45', change: '-0.34%', isPositive: false },
  { id: 'gl-4', name: 'FTSE 100', value: '7,456.78', change: '+0.45%', isPositive: true },
  { id: 'gl-5', name: 'NIKKEI 225', value: '28,234.56', change: '+1.12%', isPositive: true },
  { id: 'gl-6', name: 'HANG SENG', value: '19,876.34', change: '-0.89%', isPositive: false },
  { id: 'gl-7', name: 'DAX', value: '15,234.67', change: '+1.34%', isPositive: true },
  { id: 'gl-8', name: 'CAC 40', value: '6,789.23', change: '+0.56%', isPositive: true },
];

const CRYPTO_DATA = [
  { id: 'cr-1', name: 'Bitcoin', symbol: 'BTC', value: '$42,567.89', change: '+3.45%', isPositive: true },
  { id: 'cr-2', name: 'Ethereum', symbol: 'ETH', value: '$2,234.56', change: '+2.78%', isPositive: true },
  { id: 'cr-3', name: 'Binance Coin', symbol: 'BNB', value: '$345.67', change: '-1.23%', isPositive: false },
  { id: 'cr-4', name: 'Cardano', symbol: 'ADA', value: '$0.89', change: '+5.67%', isPositive: true },
  { id: 'cr-5', name: 'Solana', symbol: 'SOL', value: '$78.45', change: '+4.12%', isPositive: true },
  { id: 'cr-6', name: 'Ripple', symbol: 'XRP', value: '$0.56', change: '+2.34%', isPositive: true },
  { id: 'cr-7', name: 'Polkadot', symbol: 'DOT', value: '$12.34', change: '-0.89%', isPositive: false },
  { id: 'cr-8', name: 'Dogecoin', symbol: 'DOGE', value: '$0.12', change: '+6.78%', isPositive: true },
];

const TABS = ['All Indices', 'Indian Indices', 'Global Indices', 'Crypto'];

const IndicesScreen = forwardRef(({ navigation, route }, ref) => {
  const initialTab = route?.params?.tab || 'All Indices';
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const scrollViewRef = useRef(null);

  // Expose scrollToTop method
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    },
  }));

  const getIndicesData = () => {
    switch (selectedTab) {
      case 'Indian Indices':
        return INDIAN_INDICES;
      case 'Global Indices':
        return GLOBAL_INDICES;
      case 'Crypto':
        return CRYPTO_DATA;
      default:
        return [
          ...INDIAN_INDICES.slice(0, 6),
          ...GLOBAL_INDICES.slice(0, 5),
          ...CRYPTO_DATA.slice(0, 5),
        ];
    }
  };

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('StockDetail', {
        stock: { name: item.name, value: item.value, change: item.change, isPositive: item.isPositive }
      })}
      activeOpacity={0.8}>
      <View style={[styles.featuredIcon, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
        <Icon name={item.icon} size={20} color={item.isPositive ? '#00C896' : '#FF9800'} />
      </View>
      <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.featuredValue}>{item.value}</Text>
      <View style={[styles.featuredChange, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
        <Icon name={item.isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={item.isPositive ? '#00C896' : '#FF9800'} />
        <Text style={[styles.featuredChangeText, { color: item.isPositive ? '#00C896' : '#FF9800' }]}>
          {item.change}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderIndicesItem = ({ item }) => (
    <TouchableOpacity
      style={styles.indicesCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('StockDetail', {
        stock: { name: item.name, value: item.value, change: item.change, isPositive: item.isPositive, symbol: item.symbol }
      })}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
          <Icon name="chart-line" size={18} color={item.isPositive ? '#00C896' : '#FF9800'} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.indicesName} numberOfLines={1}>{item.name}</Text>
          {item.symbol && <Text style={styles.indicesSymbol}>{item.symbol}</Text>}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.indicesValue}>{item.value}</Text>
        <View style={[styles.indicesChange, { backgroundColor: item.isPositive ? '#0D2B24' : '#2A1F0D' }]}>
          <Icon name={item.isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={item.isPositive ? '#00C896' : '#FF9800'} />
          <Text style={[styles.indicesChangeText, { color: item.isPositive ? '#00C896' : '#FF9800' }]}>
            {item.change}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Market Indices</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="magnify" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {/* Featured Indices */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredSectionHeader}>
            <Text style={styles.featuredSectionTitle}>Top Indices</Text>
            <Icon name="chart-timeline-variant" size={18} color="#00C896" />
          </View>
          <FlatList
            horizontal
            data={FEATURED_INDICES}
            renderItem={renderFeaturedItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {TABS.map((tab, index) => (
              <TouchableOpacity
                key={`tab-${index}`}
                style={[styles.tab, selectedTab === tab && styles.tabActive]}
                onPress={() => setSelectedTab(tab)}>
                <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Indices Grid */}
        <View style={styles.allIndicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedTab === 'All Indices' ? 'All Markets' : selectedTab}
            </Text>
            <Text style={styles.sectionCount}>
              {getIndicesData().length} {selectedTab === 'Crypto' ? 'Coins' : 'Indices'}
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {getIndicesData().map((item) => (
              <View key={item.id} style={styles.gridItemWrapper}>
                {renderIndicesItem({ item })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  safeAreaTop: { backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#000000', borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', flex: 1, textAlign: 'center' },
  searchButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },

  // Featured
  featuredSection: { paddingVertical: 16, backgroundColor: '#000000', borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  featuredSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  featuredSectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  featuredList: { paddingHorizontal: 16 },
  featuredCard: { width: 110, borderRadius: 12, padding: 10, marginRight: 10, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A' },
  featuredIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featuredName: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  featuredValue: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  featuredChange: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, gap: 3, alignSelf: 'flex-start' },
  featuredChangeText: { fontSize: 10, fontWeight: '700' },

  // Tabs
  tabsSection: { backgroundColor: '#000000', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  tabsContainer: { paddingHorizontal: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1A1A1A', marginRight: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  tabActive: { backgroundColor: '#0D2B24', borderColor: '#00C896' },
  tabText: { fontSize: 12, color: '#999999', fontWeight: '700' },
  tabTextActive: { color: '#00C896' },

  // Grid
  allIndicesSection: { paddingTop: 16, paddingBottom: 24, backgroundColor: '#000000' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  sectionCount: { fontSize: 12, color: '#666666', fontWeight: '600' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  gridItemWrapper: { width: '50%', paddingHorizontal: 6, marginBottom: 12 },
  indicesCard: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2A2A2A', minHeight: 100, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconWrapper: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  cardInfo: { flex: 1 },
  indicesName: { fontSize: 13, color: '#FFFFFF', fontWeight: '700', marginBottom: 2 },
  indicesSymbol: { fontSize: 10, color: '#666666' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indicesValue: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  indicesChange: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  indicesChangeText: { fontSize: 10, fontWeight: '700' },
});

export default IndicesScreen;
