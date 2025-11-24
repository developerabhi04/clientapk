import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../config/api.config';
import AuthStorage from './AuthStorage';

class ApiService {
    constructor() {
        // Create axios instance
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - Add token to headers
        this.api.interceptors.request.use(
            async (config) => {
                const token = await AuthStorage.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('❌ Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle errors globally
        this.api.interceptors.response.use(
            (response) => {
                console.log(`📥 API Response: ${response.config.url} - ${response.status}`);
                return response;
            },
            async (error) => {
                console.error('❌ Response Error:', error.response?.data || error.message);

                // Handle 401 Unauthorized - Token expired
                if (error.response?.status === 401) {
                    await AuthStorage.clearAuth();
                    // You can add navigation to login screen here if needed
                }

                return Promise.reject(error);
            }
        );
    }

    // Format error messages
    handleError(error) {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || 'Something went wrong';
            return {
                success: false,
                message: message,
                statusCode: error.response.status,
            };
        } else if (error.request) {
            // Request made but no response
            return {
                success: false,
                message: 'Network error. Please check your connection.',
            };
        } else {
            // Something else happened
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    }

    // ==================== SIGNUP APIs ====================

    // Send Signup OTP
    async sendSignupOTP(fullName, phoneNumber) {
        try {
            console.log(`📞 Sending Signup OTP to: ${phoneNumber}`);
            const response = await this.api.post(ENDPOINTS.SEND_SIGNUP_OTP, {
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'OTP sent successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Verify Signup OTP
    async verifySignupOTP(fullName, phoneNumber, otp) {
        try {
            console.log(`🔐 Verifying Signup OTP for: ${phoneNumber}`);
            const response = await this.api.post(ENDPOINTS.VERIFY_SIGNUP_OTP, {
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
                otp: otp.trim(),
            });

            // Save token and user data
            if (response.data.data?.token) {
                await AuthStorage.saveToken(response.data.data.token);
                await AuthStorage.saveUser(response.data.data.user);
            }

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Signup successful',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Resend Signup OTP
    async resendSignupOTP(fullName, phoneNumber) {
        try {
            console.log(`🔄 Resending Signup OTP to: ${phoneNumber}`);
            const response = await this.api.post(ENDPOINTS.RESEND_SIGNUP_OTP, {
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'OTP resent successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // ==================== LOGIN APIs ====================

    // Send Login OTP
    async sendLoginOTP(phoneNumber) {
        try {
            console.log(`📞 Sending Login OTP to: ${phoneNumber}`);
            const response = await this.api.post(ENDPOINTS.SEND_LOGIN_OTP, {
                phoneNumber: phoneNumber.trim(),
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'OTP sent successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Verify Login OTP
    async verifyLoginOTP(phoneNumber, otp) {
        try {
            console.log(`🔐 Verifying Login OTP for: ${phoneNumber}`);
            const response = await this.api.post(ENDPOINTS.VERIFY_LOGIN_OTP, {
                phoneNumber: phoneNumber.trim(),
                otp: otp.trim(),
            });

            // Save token and user data
            if (response.data.data?.token) {
                await AuthStorage.saveToken(response.data.data.token);
                await AuthStorage.saveUser(response.data.data.user);
            }

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Login successful',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Resend Login OTP
    async resendLoginOTP(phoneNumber) {
        try {
            console.log(`🔄 Resending Login OTP to: ${phoneNumber}`);
            const response = await this.api.post(ENDPOINTS.RESEND_LOGIN_OTP, {
                phoneNumber: phoneNumber.trim(),
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'OTP resent successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // ==================== USER APIs ====================

    // Get User Profile (Protected)
    async getUserProfile() {
        try {
            console.log(`👤 Fetching user profile`);
            const response = await this.api.get(ENDPOINTS.GET_USER_PROFILE);

            // Update stored user data
            if (response.data.data) {
                await AuthStorage.saveUser(response.data.data);
            }

            return {
                success: true,
                data: response.data.data,
                message: 'Profile fetched successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Logout
    async logout() {
        try {
            await AuthStorage.clearAuth();
            console.log('🚪 User logged out successfully');
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            return { success: false, message: 'Error during logout' };
        }
    }



    // Add these methods to your ApiService class

    // ==================== WALLET MANAGEMENT APIs ====================

    /**
     * Get Wallet Balance
     */
    async getWalletBalance() {
        try {
            console.log(`💰 Fetching wallet balance`);
            const response = await this.api.get('/wallet/balance');

            return {
                success: true,
                data: response.data.data,
                message: 'Balance fetched successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Add Money to Wallet (Submit Payment with UTR)
     */
    async addMoney(amount, utrNumber, gateway, paymentMethod = 'UPI') {
        try {
            console.log(`💵 Adding money: ₹${amount}, UTR: ${utrNumber}`);
            const response = await this.api.post('/wallet/add-money', {
                amount,
                utrNumber,
                gateway,
                paymentMethod
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Payment submitted successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Get Transaction History
     */
    async getTransactions(page = 1, limit = 20, filters = {}) {
        try {
            console.log(`📜 Fetching transactions (page ${page})`);

            const params = new URLSearchParams({
                page,
                limit,
                ...filters
            });

            const response = await this.api.get(`/wallet/transactions?${params}`);

            return {
                success: true,
                data: response.data.data.transactions || [],
                pagination: {
                    totalPages: response.data.data.totalPages,
                    currentPage: response.data.data.currentPage,
                    totalTransactions: response.data.data.totalTransactions
                },
                message: 'Transactions fetched successfully',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Withdraw Money
     */
    async withdrawMoney(amount, bankDetails) {
        try {
            console.log(`🏦 Withdrawing: ₹${amount}`);
            const response = await this.api.post('/wallet/withdraw', {
                amount,
                ...bankDetails
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Withdrawal request submitted',
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

}

export default new ApiService();
