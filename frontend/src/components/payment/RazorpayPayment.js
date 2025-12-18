/**
 * RazorpayPayment Component
 * 
 * Handles Razorpay payment processing
 */

'use client';

import React, { useEffect, useState } from 'react';
import styles from './PaymentBase.module.css';

const RazorpayPayment = ({ sessionId, amount, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      onError('Failed to load payment gateway');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onError]);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onError('Payment gateway not loaded');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Razorpay order
      const orderResponse = await fetch('/api/payment/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          paymentMethod: 'razorpay'
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: orderData.payment.key,
        order_id: orderData.payment.orderId,
        amount: orderData.payment.amount * 100, // Convert to paise
        currency: orderData.payment.currency,
        name: orderData.payment.name,
        description: orderData.payment.description,
        prefill: orderData.payment.prefill,
        theme: {
          color: '#667eea'
        },
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json();
              throw new Error(error.error || 'Payment verification failed');
            }

            // Payment successful
            onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            });
          } catch (error) {
            onError(error.message);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onError('Payment cancelled');
          }
        }
      });

      rzp.open();
    } catch (error) {
      onError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3>Razorpay Payment</h3>
        <p className={styles.amount}>₹{amount.toFixed(2)}</p>
        <p className={styles.info}>
          Pay securely using Razorpay. Supports credit card, debit card, UPI, and more.
        </p>
        <button
          onClick={handlePayment}
          disabled={loading || !scriptLoaded}
          className={styles.button}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : (
            'Pay with Razorpay'
          )}
        </button>
        <p className={styles.secure}>
          ✓ Your payment is secured with SSL encryption
        </p>
      </div>
    </div>
  );
};

export default RazorpayPayment;
