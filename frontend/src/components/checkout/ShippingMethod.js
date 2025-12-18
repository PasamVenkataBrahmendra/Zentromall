'use client';

import React, { useState } from 'react';
import styles from './ShippingMethod.module.css';

const ShippingMethod = ({ selectedMethod, subtotal = 0, onNext, onPrevious, loading }) => {
  const [method, setMethod] = useState(selectedMethod?.method || 'standard');

  const handleProceed = () => {
    if (onNext) onNext({ method });
  };

  return (
    <div className={styles.container}>
      <h3>Select Shipping Method</h3>
      <div className={styles.methods}>
        <label className={styles.method}>
          <input type="radio" name="method" value="standard" checked={method === 'standard'} onChange={() => setMethod('standard')} />
          <div>
            <strong>Standard Delivery</strong>
            <div className={styles.desc}>2-5 business days - ₹50 {subtotal >= 500 ? '(FREE)' : ''}</div>
          </div>
        </label>

        <label className={styles.method}>
          <input type="radio" name="method" value="express" checked={method === 'express'} onChange={() => setMethod('express')} />
          <div>
            <strong>Express Delivery</strong>
            <div className={styles.desc}>1-2 business days - ₹100</div>
          </div>
        </label>

        <label className={styles.method}>
          <input type="radio" name="method" value="overnight" checked={method === 'overnight'} onChange={() => setMethod('overnight')} />
          <div>
            <strong>Overnight Delivery</strong>
            <div className={styles.desc}>Next day - ₹200</div>
          </div>
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.secondary} onClick={onPrevious} disabled={loading}>Back</button>
        <button className={styles.primary} onClick={handleProceed} disabled={loading}>Continue</button>
      </div>
    </div>
  );
};

export default ShippingMethod;
