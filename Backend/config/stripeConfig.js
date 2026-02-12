import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeEnabled = Boolean(stripeSecretKey);

// Initialize Stripe only if API key is provided
const stripe = stripeEnabled ? new Stripe(stripeSecretKey) : null;

if (!stripeEnabled) {
    console.warn("[STRIPE] STRIPE_SECRET_KEY is not set. Stripe features are disabled.");
}

// Test card tokens for development
const testCardTokens = {
    "4242424242424242": {
        token: "tok_visa",
        description: "Visa (Visa)",
        network: "Visa",
        status: "success"
    },
    "5555555555554444": {
        token: "tok_mastercard",
        description: "Mastercard",
        network: "Mastercard",
        status: "success"
    },
    "378282246310005": {
        token: "tok_amex",
        description: "American Express",
        network: "Amex",
        status: "success"
    },
    "6011111111111117": {
        token: "tok_discover",
        description: "Discover",
        network: "Discover",
        status: "success"
    },
    "3566002020360505": {
        token: "tok_jcb",
        description: "JCB",
        network: "JCB",
        status: "success"
    },
    "4000002500003155": {
        token: "tok_chargeDeclined",
        description: "Visa - Charge Declined",
        network: "Visa",
        status: "declined"
    },
    "4000000000000002": {
        token: "tok_chargeDeclinedInsufficientFunds",
        description: "Visa - Insufficient Funds",
        network: "Visa",
        status: "declined"
    },
    "4000000000000069": {
        token: "tok_chargeDeclinedLostCard",
        description: "Visa - Lost Card",
        network: "Visa",
        status: "declined"
    }
};

// Payment configuration
const paymentConfig = {
    currency: "inr",
    testMode: true,
    retryAttempts: 3,
    timeoutMs: 30000
};

// Validate card number using Luhn algorithm
const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (!/^\d+$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

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

export { stripe, stripeEnabled, testCardTokens, paymentConfig, validateCardNumber };
export default stripe;
