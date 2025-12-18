/**
 * MultiStepCheckout Component
 * 
 * Main checkout component with 5 steps:
 * 1. Shipping Address
 * 2. Shipping Method
 * 3. Payment Method
 * 4. Order Review
 * 5. Order Confirmation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MultiStepCheckout.module.css';
import AddressForm from './checkout/AddressForm';
import ShippingMethod from './checkout/ShippingMethod';
import PaymentMethod from './checkout/PaymentMethod';
import OrderReview from './checkout/OrderReview';
import OrderConfirmation from './checkout/OrderConfirmation';

const MultiStepCheckout = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    pricing: null,
    coupon: null
  });

  // Initialize checkout session
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        const response = await fetch(`/api/checkout/initialize/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to initialize checkout');
        }

        const data = await response.json();
        setSessionId(data.checkout.sessionId);
        setCheckoutData(prev => ({
          ...prev,
          pricing: data.checkout.pricing
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  // Fetch checkout data
  useEffect(() => {
    if (!sessionId) return;

    const fetchCheckout = async () => {
      try {
        const response = await fetch(`/api/checkout/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentStep(data.checkout.currentStep);
          setCheckoutData({
            shippingAddress: data.checkout.shippingAddress,
            shippingMethod: data.checkout.shippingMethod,
            paymentMethod: data.checkout.paymentMethod,
            pricing: data.checkout.pricing,
            coupon: data.checkout.coupon
          });
        }
      } catch (err) {
        console.error('Fetch checkout error:', err);
      }
    };

    fetchCheckout();
  }, [sessionId]);

  const handleNextStep = async (stepData) => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '';
      let body = {};

      switch (currentStep) {
        case 1:
          endpoint = `${sessionId}/address`;
          body = stepData;
          break;
        case 2:
          endpoint = `${sessionId}/shipping`;
          body = stepData;
          break;
        case 3:
          endpoint = `${sessionId}/payment`;
          body = stepData;
          break;
        default:
          break;
      }

      const response = await fetch(`/api/checkout/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update checkout');
      }

      const data = await response.json();
      setCheckoutData(data.checkout);
      setCurrentStep(data.checkout.currentStep);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm
            initialData={checkoutData.shippingAddress}
            onNext={handleNextStep}
            loading={loading}
          />
        );
      case 2:
        return (
          <ShippingMethod
            selectedMethod={checkoutData.shippingMethod}
            subtotal={checkoutData.pricing?.subtotal}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            loading={loading}
          />
        );
      case 3:
        return (
          <PaymentMethod
            sessionId={sessionId}
            amount={checkoutData.pricing?.total}
            selectedMethod={checkoutData.paymentMethod}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            loading={loading}
          />
        );
      case 4:
        return (
          <OrderReview
            sessionId={sessionId}
            checkoutData={checkoutData}
            onPrevious={handlePreviousStep}
            onConfirm={handleConfirmOrder}
            loading={loading}
          />
        );
      case 5:
        return (
          <OrderConfirmation
            orderId={checkoutData.orderId}
            orderNumber={checkoutData.orderNumber}
          />
        );
      default:
        return null;
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/checkout/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      setCheckoutData(prev => ({
        ...prev,
        orderId: data.order.orderId,
        orderNumber: data.order.orderNumber
      }));
      setCurrentStep(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sessionId) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Initializing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress Indicator */}
      <div className={styles.progressBar}>
        {[1, 2, 3, 4, 5].map(step => (
          <div
            key={step}
            className={`${styles.step} ${step <= currentStep ? styles.active : ''}`}
          >
            <div className={styles.stepNumber}>{step}</div>
            <div className={styles.stepLabel}>
              {['Address', 'Shipping', 'Payment', 'Review', 'Confirm'][step - 1]}
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorBox}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Step Content */}
      <div className={styles.stepContent}>
        {renderStepContent()}
      </div>

      {/* Sidebar: Order Summary */}
      {currentStep < 5 && checkoutData.pricing && (
        <div className={styles.sidebar}>
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Subtotal</span>
                <span>₹{checkoutData.pricing.subtotal}</span>
              </div>
              {checkoutData.pricing.discount > 0 && (
                <div className={styles.priceRow + ' ' + styles.discount}>
                  <span>Discount</span>
                  <span>-₹{checkoutData.pricing.discount}</span>
                </div>
              )}
              <div className={styles.priceRow}>
                <span>Tax (18%)</span>
                <span>₹{checkoutData.pricing.tax}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Shipping</span>
                <span>
                  {checkoutData.pricing.shipping === 0 ? (
                    <span className={styles.freeShipping}>FREE</span>
                  ) : (
                    `₹${checkoutData.pricing.shipping}`
                  )}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>₹{checkoutData.pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepCheckout;
