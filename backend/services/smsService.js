// SMS Service
// Uses Twilio or similar SMS provider

let twilio;
let client;

try {
    twilio = require('twilio');
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
} catch (error) {
    console.warn('twilio not installed. SMS notifications will be disabled.');
    twilio = null;
    client = null;
}

// @desc    Send SMS
const sendSMS = async (to, message) => {
    try {
        if (!client) {
            console.log('SMS Service not configured. Message:', message);
            return { success: false, message: 'SMS service not configured' };
        }

        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });

        return { success: true, sid: result.sid };
    } catch (error) {
        console.error('SMS error:', error);
        throw error;
    }
};

// @desc    Send order confirmation SMS
const sendOrderConfirmationSMS = async (phone, orderNumber) => {
    const message = `Your order ${orderNumber} has been confirmed. Track at ${process.env.FRONTEND_URL}/orders/${orderNumber}`;
    return await sendSMS(phone, message);
};

// @desc    Send OTP
const sendOTP = async (phone, otp) => {
    const message = `Your ZentroMall OTP is ${otp}. Valid for 5 minutes.`;
    return await sendSMS(phone, message);
};

module.exports = { sendSMS, sendOrderConfirmationSMS, sendOTP };

