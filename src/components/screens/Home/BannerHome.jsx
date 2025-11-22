import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;

const BANNERS = [
    { id: '1', icon: 'rocket-launch', title: 'Start Investing', subtitle: 'Zero commission', color: '#00C896' },
    { id: '2', icon: 'trending-up', title: 'Trade F&O', subtitle: 'Advanced tools', color: '#2196F3' },
    { id: '3', icon: 'gift', title: 'Refer & Earn', subtitle: 'Get ₹500', color: '#FF9800' },
];

const BannerCarousel = ({ theme }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextSlide = (activeSlide + 1) % BANNERS.length;
            if (flatListRef.current) {
                flatListRef.current.scrollToOffset({ offset: nextSlide * BANNER_WIDTH, animated: true });
            }
            setActiveSlide(nextSlide);
        }, 3500);
        return () => clearInterval(interval);
    }, [activeSlide]);

    const onScroll = event => {
        const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
        setActiveSlide(index);
    };

    const renderBanner = ({ item }) => (
        <View style={[styles.bannerSlide, { width: BANNER_WIDTH }]}>
            <View style={[styles.bannerGradient, { backgroundColor: item.color }]}>
                <View style={styles.bannerContent}>
                    <View style={styles.bannerIconWrap}>
                        <Icon name={item.icon} size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                        <Text style={styles.bannerButtonText}>Learn More</Text>
                        <Icon name="arrow-right" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.bannerContainer}>
            <FlatList
                ref={flatListRef}
                data={BANNERS}
                renderItem={renderBanner}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            />
            <View style={styles.paginationContainer}>
                {BANNERS.map((_, idx) => (
                    <View key={idx} style={[styles.paginationDot, { backgroundColor: idx === activeSlide ? theme.primary : theme.textTertiary }]} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: { marginBottom: 20 },
    bannerSlide: { paddingHorizontal: 16 },
    bannerGradient: { borderRadius: 14, overflow: 'hidden', height: 160 },
    bannerContent: { padding: 20, alignItems: 'center', justifyContent: 'center', height: '100%' },
    bannerIconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    bannerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 4 },
    bannerSubtitle: { fontSize: 12, color: '#FFF', opacity: 0.95, marginBottom: 12 },
    bannerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, gap: 4 },
    bannerButtonText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
    paginationContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 5 },
    paginationDot: { width: 5, height: 5, borderRadius: 3 },
});

export default BannerCarousel;
