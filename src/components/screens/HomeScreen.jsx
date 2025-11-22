import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BannerCarousel from './Home/BannerHome';
import MarketIndices from './Home/MarketIndices';
import StockCard from '../StockCard';
import { MOCK_STOCKS } from '../../utils/mockData';

// Theme
const THEMES = {
    dark: {
        bg: '#000000',
        card: '#1A1A1A',
        border: '#2A2A2A',
        text: '#FFFFFF',
        textSecondary: '#999999',
        textTertiary: '#666666',
        primary: '#00C896',
        statusBar: 'light-content'
    },
    light: {
        bg: '#FFFFFF',
        card: '#F5F5F5',
        border: '#E0E0E0',
        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        primary: '#00C896',
        statusBar: 'dark-content'
    },
};

const HomeScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const theme = isDarkMode ? THEMES.dark : THEMES.light;

    const toggleTheme = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.bg }]}>
            <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />
            <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top']}>
                <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoContainer}>
                            <Icon name="chart-line-variant" size={22} color="#00C896" />
                        </View>
                        <Text style={[styles.companyName, { color: theme.text }]}>TradeHub</Text>
                    </View>

                    <View style={styles.headerRight}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                style={[styles.themeButton, { backgroundColor: theme.card }]}
                                onPress={toggleTheme}>
                                <Icon
                                    name={isDarkMode ? 'weather-sunny' : 'weather-night'}
                                    size={20}
                                    color={isDarkMode ? '#FFA500' : '#4A5568'}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.card }]}
                            onPress={() => navigation.navigate('Notification')}>
                            <Icon name="bell-outline" size={20} color={theme.text} />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                            <Icon name="account" size={18} color="#FFF" />
                        </TouchableOpacity> */}
                    </View>

                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <BannerCarousel theme={theme} />
                <MarketIndices theme={theme} navigation={navigation} />

                {/* Top Stocks Section */}
                <View style={styles.stocksSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Stocks</Text>
                            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Live market prices</Text>
                        </View>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <Icon name="chevron-right" size={16} color="#00C896" />
                        </TouchableOpacity>
                    </View>

                    {/* 2-Column Grid */}
                    <View style={styles.stockGrid}>
                        {MOCK_STOCKS.slice(0, 8).map(stock => (
                            <View key={stock.id} style={styles.stockGridItem}>
                                <StockCard
                                    stock={stock}
                                    theme={theme}
                                    onPress={() => navigation.navigate('StockDetail', { stock })}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    container: {},
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center'
    },
    companyName: { fontSize: 17, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 10 },
    themeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF5252'
    },
    profileButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#00C896',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollContent: { paddingBottom: 80 },

    // Top Stocks Section
    stocksSection: {
        marginTop: 20,
        marginBottom: 20,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4,
    },

    sectionSubtitle: {
        fontSize: 12,
        fontWeight: '600',
    },

    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    viewAllText: {
        fontSize: 13,
        color: '#00C896',
        fontWeight: '700',
    },

    // 2-Column Grid
    stockGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },

    stockGridItem: {
        width: '50%',
        paddingHorizontal: 6,
        marginBottom: 12,
    },
});

export default HomeScreen;
