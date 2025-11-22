import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Components
import BannerCarousel from './components/BannerCarousel';
import PortfolioSection from './components/PortfolioSection';
import QuickActions from './components/QuickActions';
import MarketIndices from './components/MarketIndices';



const HomeScreen = ({ navigation }) => {
  
    return (
        <>
            {/* Top Stocks Section */}
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionTitle}>Top Stocks</Text>
                    <Text style={styles.sectionSubtitle}>Live market prices</Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Icon name="chevron-right" size={18} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.stockList}>
                {MOCK_STOCKS.slice(0, 8).map(stock => (
                    <StockCard
                        key={stock.id}
                        stock={stock}
                        onPress={() => console.log('Stock pressed:', stock.ticker)}
                    />
                ))}
            </View>

            <View style={{ height: 20 }} />
        </>
    );
};



export default TopStocks;
