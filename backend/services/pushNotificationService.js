// Push Notification Service
// Uses Firebase Cloud Messaging (FCM) for web push notifications

let admin;
try {
    admin = require('firebase-admin');
} catch (error) {
    console.warn('firebase-admin not installed. Push notifications will be disabled.');
    admin = null;
}

// Initialize Firebase Admin (requires service account key)
if (admin && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
    }
}

// @desc    Send push notification
// @route   POST /api/push/send
// @access  Private (Admin)
const sendPushNotification = async (req, res) => {
    try {
        if (!admin) {
            return res.status(503).json({ message: 'Push notifications not available. firebase-admin not installed.' });
        }

        const { token, title, body, data } = req.body;

        if (!admin.apps || admin.apps.length === 0) {
            return res.status(500).json({ message: 'Firebase not initialized' });
        }

        const message = {
            notification: {
                title,
                body
            },
            data: data || {},
            token
        };

        const response = await admin.messaging().send(message);
        res.json({ success: true, messageId: response });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Send to multiple tokens
const sendToMultiple = async (tokens, title, body, data) => {
    try {
        if (!admin || !admin.apps || admin.apps.length === 0) {
            console.warn('Push notifications not available');
            return;
        }

        const message = {
            notification: { title, body },
            data: data || {},
            tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        return response;
    } catch (error) {
        console.error('Push notification error:', error);
        throw error;
    }
};

module.exports = { sendPushNotification, sendToMultiple };

