export const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length === 0) {
        return { isValid: false, message: 'Phone number is required' };
    }

    if (cleaned.length < 10) {
        return { isValid: false, message: 'Phone number must be at least 10 digits' };
    }

    if (cleaned.length > 15) {
        return { isValid: false, message: 'Phone number is too long' };
    }

    return { isValid: true, message: '' };
};

export const validateOTP = (otp) => {
    if (!otp || otp.length === 0) {
        return { isValid: false, message: 'OTP is required' };
    }

    if (otp.length !== 6) {
        return { isValid: false, message: 'OTP must be 6 digits' };
    }

    if (!/^\d+$/.test(otp)) {
        return { isValid: false, message: 'OTP must contain only numbers' };
    }

    return { isValid: true, message: '' };
};

export const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length <= 3) {
        return cleaned;
    }

    if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }

    if (cleaned.length <= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
};
