/**
 * StripePayment Component
 * 
 * Handles Stripe payment processing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import styles from './PaymentBase.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ sessionId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment/stripe/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.payment.clientSecret);
      } catch (error) {
        onError(error.message);
      }
    };

    createPaymentIntent();
  }, [sessionId, onError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      onError('Payment gateway not ready');
      return;
    }

    try {
      setLoading(true);

      const cardElement = elements.getElement(CardElement);

      // Confirm payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess({
          paymentIntentId: paymentIntent.id,
          paymentId: paymentIntent.charges.data[0].id
        });
      } else {
        onError(`Payment failed with status: ${paymentIntent.status}`);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#9e2146'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Card Details</label>
        <div className={styles.cardElement}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className={styles.amount}>
        Total: <strong>₹{amount.toFixed(2)}</strong>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className={styles.button}
      >
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            Processing Payment...
          </>
        ) : (
          'Pay with Card'
        )}
      </button>

      <p className={styles.secure}>
        ✓ Your payment is secured with SSL encryption
      </p>
    </form>
  );
};

const StripePayment = ({ sessionId, amount, onSuccess, onError }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3>Stripe Payment</h3>
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            sessionId={sessionId}
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default StripePayment;
