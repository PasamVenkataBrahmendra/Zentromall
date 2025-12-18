/**
 * PaymentMethod Component
 * 
 * Lets user choose payment gateway and handles gateway flow
 */

'use client';

import React, { useState } from 'react';
import RazorpayPayment from '../payment/RazorpayPayment';
import StripePayment from '../payment/StripePayment';
import styles from './PaymentMethod.module.css';

const PaymentMethod = ({ sessionId, amount = 0, selectedMethod, onNext, onPrevious, loading }) => {
  const [gateway, setGateway] = useState(selectedMethod?.gateway || 'razorpay');
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const setPaymentMethod = async (gatewayToSet) => {
    try {
      setError(null);
      const response = await fetch(`/api/checkout/${sessionId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: gatewayToSet, gateway: gatewayToSet })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set payment method');
      }

      const data = await response.json();
      setShowPayment(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProceed = async () => {
    await setPaymentMethod(gateway);
  };

  const handleSuccess = (paymentData) => {
    // paymentData contains payment identifiers; proceed to next step
    // Optionally update checkout or call complete endpoint
    if (onNext) onNext({});
  };

  const handleError = (msg) => {
    setError(msg);
  };

  return (
    <div className={styles.container}>
      <h3>Select Payment Method</h3>

      {error && <div className={styles.error}>{error}</div>}

      {!showPayment && (
        <div className={styles.methods}>
          <label className={styles.method}>
            <input type="radio" name="gateway" value="razorpay" checked={gateway === 'razorpay'} onChange={() => setGateway('razorpay')} />
            <div>
              <strong>Razorpay</strong>
              <div className={styles.desc}>Supports UPI, cards, wallets</div>
            </div>
          </label>

          <label className={styles.method}>
            <input type="radio" name="gateway" value="stripe" checked={gateway === 'stripe'} onChange={() => setGateway('stripe')} />
            <div>
              <strong>Stripe</strong>
              <div className={styles.desc}>Cards, wallets, international payments</div>
            </div>
          </label>

          <div className={styles.actions}>
            <button className={styles.secondary} onClick={onPrevious} disabled={loading}>Back</button>
            <button className={styles.primary} onClick={handleProceed} disabled={loading}>Proceed to Pay</button>
          </div>
        </div>
      )}

      {showPayment && gateway === 'razorpay' && (
        <RazorpayPayment
          sessionId={sessionId}
          amount={amount}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {showPayment && gateway === 'stripe' && (
        <StripePayment
          sessionId={sessionId}
          amount={amount}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default PaymentMethod;
