import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StockCard = ({ stock, onPress, theme }) => {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onPress}
            activeOpacity={0.8}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: stock.isPositive ? (theme.bg === '#000000' ? '#0D2B24' : '#E8F5F1') : (theme.bg === '#000000' ? '#2A1F0D' : '#FFF4E6') }]}>
                    <Icon name="chart-line" size={16} color={stock.isPositive ? '#00C896' : '#FF9800'} />
                </View>
                <View style={[styles.changeBadge, { backgroundColor: stock.isPositive ? (theme.bg === '#000000' ? '#0D2B24' : '#E8F5F1') : (theme.bg === '#000000' ? '#2A1F0D' : '#FFF4E6') }]}>
                    <Icon
                        name={stock.isPositive ? 'arrow-up' : 'arrow-down'}
                        size={9}
                        color={stock.isPositive ? '#00C896' : '#FF9800'}
                    />
                    <Text style={[styles.change, { color: stock.isPositive ? '#00C896' : '#FF9800' }]}>
                        {stock.change}
                    </Text>
                </View>
            </View>

            <View style={styles.info}>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                    {stock.name}
                </Text>
                <Text style={[styles.ticker, { color: theme.textSecondary }]}>{stock.ticker}</Text>
            </View>

            <Text style={[styles.price, { color: theme.text }]}>₹{stock.price}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        minHeight: 120,
        justifyContent: 'space-between',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },

    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        gap: 3,
    },

    change: {
        fontSize: 10,
        fontWeight: '700',
    },

    info: {
        marginBottom: 8,
    },

    name: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 3,
    },

    ticker: {
        fontSize: 10,
        fontWeight: '600',
    },

    price: {
        fontSize: 16,
        fontWeight: '800',
    },
});

export default StockCard;
