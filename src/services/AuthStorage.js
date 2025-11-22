import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@tradehub_token';
const USER_KEY = '@tradehub_user';

class AuthStorageService {
    // Save authentication token
    async saveToken(token) {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            console.log('✅ Token saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving token:', error);
            return false;
        }
    }

    // Get authentication token
    async getToken() {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token;
        } catch (error) {
            console.error('❌ Error getting token:', error);
            return null;
        }
    }

    // Save user data
    async saveUser(user) {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
            console.log('✅ User data saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving user:', error);
            return false;
        }
    }

    // Get user data
    async getUser() {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('❌ Error getting user:', error);
            return null;
        }
    }

    // Clear all auth data (logout)
    async clearAuth() {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
            console.log('✅ Auth data cleared successfully');
            return true;
        } catch (error) {
            console.error('❌ Error clearing auth:', error);
            return false;
        }
    }

    // Check if user is authenticated
    async isAuthenticated() {
        const token = await this.getToken();
        return !!token;
    }
}

export default new AuthStorageService();
