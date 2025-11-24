// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://10.30.37.211:5000/api/v1',
    TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const ENDPOINTS = {
    // ==================== AUTH ENDPOINTS ====================
    // Login routes
    SEND_LOGIN_OTP: '/auth/login/send-otp',
    VERIFY_LOGIN_OTP: '/auth/login/verify-otp',
    RESEND_LOGIN_OTP: '/auth/login/resend-otp',
    
    // Signup routes
    SEND_SIGNUP_OTP: '/auth/signup/send-otp',
    VERIFY_SIGNUP_OTP: '/auth/signup/verify-otp',
    RESEND_SIGNUP_OTP: '/auth/signup/resend-otp',
    
    // User profile
    GET_USER_PROFILE: '/auth/profile',
    UPDATE_USER_PROFILE: '/auth/profile',
    CHECK_PHONE_EXISTS: '/auth/check-phone', // Optional
    
    // ==================== WALLET ENDPOINTS ====================
    GET_WALLET_BALANCE: '/wallet/balance',
    ADD_MONEY: '/wallet/add-money',
    WITHDRAW_MONEY: '/wallet/withdraw',
    GET_TRANSACTIONS: '/wallet/transactions',
    
    // ==================== BANK & KYC ENDPOINTS ====================
    UPDATE_BANK_DETAILS: '/auth/bank-details',
    UPDATE_PAN_CARD: '/auth/pan-card',
};

// Payment Gateway Options
export const PAYMENT_GATEWAYS = {
    PHONEPE: 'PhonePe',
    GOOGLEPAY: 'GooglePay',
    PAYTM: 'Paytm',
    UPI: 'UPI',
};

// Transaction Categories
export const TRANSACTION_CATEGORIES = {
    ADD_MONEY: 'add_money',
    WITHDRAWAL: 'withdrawal',
    TRADE_BUY: 'trade_buy',
    TRADE_SELL: 'trade_sell',
    PROFIT: 'profit',
    LOSS: 'loss',
    REFUND: 'refund',
    SIGNUP_BONUS: 'signup_bonus',
    DIVIDEND: 'dividend',
};

// Transaction Status
export const TRANSACTION_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REJECTED: 'rejected',
};

// Minimum transaction amounts
export const TRANSACTION_LIMITS = {
    MIN_ADD_MONEY: 500,
    MIN_WITHDRAWAL: 100,
    MAX_ADD_MONEY: 100000,
    MAX_WITHDRAWAL: 50000,
};
