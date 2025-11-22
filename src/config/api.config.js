// API Configuration
export const API_CONFIG = {
    // Replace with your actual backend URL
    BASE_URL: 'http://10.30.37.211:5000/api/v1', // For Android emulator use: http://10.0.2.2:5000/api/v1
    TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const ENDPOINTS = {
    // Auth endpoints
    SEND_SIGNUP_OTP: '/auth/signup/send-otp',
    VERIFY_SIGNUP_OTP: '/auth/signup/verify-otp',
    RESEND_SIGNUP_OTP: '/auth/signup/resend-otp',

    SEND_LOGIN_OTP: '/auth/login/send-otp',
    VERIFY_LOGIN_OTP: '/auth/login/verify-otp',
    RESEND_LOGIN_OTP: '/auth/login/resend-otp',

    GET_USER_PROFILE: '/auth/profile',
    UPDATE_USER_PROFILE: '/auth/profile',
};
