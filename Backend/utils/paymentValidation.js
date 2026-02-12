// 💳 Payment Validation Utilities
// Centralized validation for payment data

export const validatePaymentData = (data) => {
    const errors = [];

    // Check required fields
    if (!data.amount || data.amount <= 0) {
        errors.push("Valid amount is required");
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push("Valid email is required");
    }

    if (!data.name || data.name.trim().length < 2) {
        errors.push("Customer name is required");
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push("Valid phone number is required");
    }

    if (!data.address || data.address.trim().length < 5) {
        errors.push("Valid address is required");
    }

    if (!data.cartItems || !Array.isArray(data.cartItems) || data.cartItems.length === 0) {
        errors.push("Cart items are required");
    }

    // Card validation
    if (!data.cardNumber || !isValidCardNumber(data.cardNumber)) {
        errors.push("Valid card number is required");
    }

    if (!data.expiryDate || !isValidExpiry(data.expiryDate)) {
        errors.push("Valid expiry date is required");
    }

    if (!data.cvv || !isValidCVV(data.cvv)) {
        errors.push("Valid CVV is required");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
    // Accept various phone formats
    return /^\+?(\d{10,14}|[\d\s\-\+()]{10,})$/.test(phone.replace(/\s/g, ""));
};

export const isValidCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cleanNumber)) {
        return false;
    }
    // Luhn algorithm validation
    return luhnCheck(cleanNumber);
};

export const isValidExpiry = (expiry) => {
    const [month, year] = expiry.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
        return false;
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
        return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Check if card is expired
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return false;
    }

    return true;
};

export const isValidCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
};

// Luhn algorithm for credit card validation
export const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Sanitize user input
export const sanitizePaymentData = (data) => {
    return {
        amount: parseFloat(data.amount),
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        city: (data.city || "").trim(),
        state: (data.state || "").trim(),
        zipcode: (data.zipcode || "").trim(),
        cardNumber: data.cardNumber.replace(/\s/g, ""),
        expiryDate: data.expiryDate.trim(),
        cvv: data.cvv.trim(),
        cartItems: data.cartItems,
    };
};
