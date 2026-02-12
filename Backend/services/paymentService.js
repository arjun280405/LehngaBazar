// 🎯 Payment Processing Service
// Core payment processing logic for Stripe using test tokens

import {
    stripe,
    stripeEnabled,
    testCardTokens,
    paymentConfig,
    validateCardNumber,
} from "../config/stripeConfig.js";
import razorpay from "../config/razorpayConfig.js";
import crypto from "crypto";

// Map card numbers to appropriate test tokens
const getTestToken = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    // Direct mapping for known test cards
    if (testCardTokens[cleanNumber]) {
        return testCardTokens[cleanNumber].token;
    }

    // Fallback based on card prefix
    if (cleanNumber.startsWith("4")) {
        return "tok_visa"; // Visa
    } else if (cleanNumber.startsWith("5")) {
        return "tok_mastercard"; // Mastercard
    } else if (cleanNumber.startsWith("3")) {
        return "tok_amex"; // Amex
    } else if (cleanNumber.startsWith("6")) {
        return "tok_discover"; // Discover
    }

    // Default to visa
    return "tok_visa";
};

// Razorpay: create an order server-side
export const createRazorpayOrder = async ({ amount, currency = "INR", receipt = null, notes = {} }) => {
    try {
        const options = {
            amount: Math.round(amount * 100), // amount in paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            payment_capture: 1,
            notes,
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error("[RAZORPAY ORDER ERROR]", error.message);
        throw error;
    }
};

// Verify razorpay signature
export const verifyRazorpayPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    try {
        // In development mode, skip verification (for testing purposes)
        if (process.env.NODE_ENV === "development") {
            console.log("[RAZORPAY VERIFY - DEVELOPMENT MODE]");
            console.log(`  Order ID: ${razorpay_order_id}`);
            console.log(`  Payment ID: ${razorpay_payment_id}`);
            console.log(`  ✅ Skipping signature verification in development mode`);
            return true; // Auto-pass in development
        }

        // In production, verify signature
        const message = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(message)
            .digest("hex");

        console.log("[RAZORPAY VERIFY - PRODUCTION MODE]");
        console.log(`  Order ID: ${razorpay_order_id}`);
        console.log(`  Payment ID: ${razorpay_payment_id}`);
        console.log(`  Expected signature: ${razorpay_signature}`);
        console.log(`  Generated signature: ${generated_signature}`);
        console.log(`  Match: ${generated_signature === razorpay_signature}`);

        return generated_signature === razorpay_signature;
    } catch (error) {
        console.error("[RAZORPAY VERIFY ERROR]", error.message);
        return false;
    }
};

export const processPaymentIntent = async (paymentData) => {
    if (!stripeEnabled || !stripe) {
        throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY to enable card payments.");
    }
    const {
        amount,
        email,
        name,
        phone,
        address,
        city,
        state,
        zipcode,
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        cartItems,
    } = paymentData;

    // Validate card number
    if (!validateCardNumber(cardNumber)) {
        throw new Error("Invalid card number format");
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    try {
        // Step 1: Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: paymentConfig.currency,
            description: `${name} - SoniMahal Order`,
            metadata: {
                customerEmail: email,
                customerName: name,
                cardLastFour: cleanCardNumber.slice(-4),
                cartItemCount: cartItems.length,
            },
        });

        console.log(`[PAYMENT] Processing ${amount} INR for ${name}`);
        console.log(`[PAYMENT] Payment Intent created: ${paymentIntent.id}`);

        // Step 2: Get appropriate test token for the card
        const testToken = getTestToken(cleanCardNumber);
        const cardInfo = testCardTokens[cleanCardNumber] || {
            network: "Card",
            description: "Test Card",
            status: "success"
        };

        console.log(`[PAYMENT] Using test token: ${testToken}`);
        console.log(`[PAYMENT] Card type: ${cardInfo.network}`);

        // Step 3: Confirm Payment Intent with test token
        // Test tokens are safe and don't require enabling raw card APIs
        const confirmedPayment = await stripe.paymentIntents.confirm(
            paymentIntent.id,
            {
                payment_method: testToken,
            },
            {
                idempotencyKey: `payment_${paymentIntent.id}_${Date.now()}`,
            }
        );

        console.log(`[PAYMENT] Payment status: ${confirmedPayment.status}`);

        return {
            success:
                confirmedPayment.status === "succeeded" ||
                confirmedPayment.status === "processing",
            paymentIntent: confirmedPayment,
            cardInfo: {
                lastFourDigits: cleanCardNumber.slice(-4),
                network: cardInfo.network,
                description: cardInfo.description,
            },
        };
    } catch (error) {
        console.error("[PAYMENT ERROR]", error.message);
        throw error;
    }
};

export const getPaymentStatus = async (paymentIntentId) => {
    if (!stripeEnabled || !stripe) {
        throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY to enable payment status checks.");
    }
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
        );
        return {
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            created: new Date(paymentIntent.created * 1000),
        };
    } catch (error) {
        console.error("[GET STATUS ERROR]", error.message);
        throw error;
    }
};

export const handlePaymentError = (error) => {
    let userMessage = "Payment processing failed. Please try again.";
    let code = "PAYMENT_ERROR";

    if (error.code === "card_declined") {
        userMessage = "Your card was declined. Please use a different card.";
        code = "CARD_DECLINED";
    } else if (error.code === "expired_card") {
        userMessage = "Your card has expired. Please use a valid card.";
        code = "EXPIRED_CARD";
    } else if (error.code === "incorrect_cvc") {
        userMessage = "The CVC code is incorrect. Please check and try again.";
        code = "INCORRECT_CVC";
    } else if (error.code === "processing_error") {
        userMessage =
            "A processing error occurred. Please try again in a few moments.";
        code = "PROCESSING_ERROR";
    } else if (error.message.includes("Invalid API Key")) {
        userMessage = "Payment service configuration error. Please contact support.";
        code = "CONFIG_ERROR";
    }

    return {
        message: userMessage,
        code,
        originalError: error.message,
    };
};

