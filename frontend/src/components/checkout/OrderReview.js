'use client';

import React from 'react';
import styles from './OrderReview.module.css';

const OrderReview = ({ sessionId, checkoutData, onPrevious, onConfirm, loading }) => {
  const { items = [], shippingAddress = {}, shippingMethod = {}, pricing = {} } = checkoutData || {};

  return (
    <div className={styles.container}>
      <h3>Review Your Order</h3>

      <div className={styles.section}>
        <h4>Items</h4>
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item.quantity} x {item.productId?.name || item.productId} - ₹{item.price}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h4>Shipping Address</h4>
        <p>{shippingAddress.fullName}</p>
        <p>{shippingAddress.addressLine1} {shippingAddress.addressLine2}</p>
        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}</p>
      </div>

      <div className={styles.section}>
        <h4>Shipping Method</h4>
        <p>{shippingMethod.method} - ₹{shippingMethod.cost}</p>
      </div>

      <div className={styles.section}>
        <h4>Pricing</h4>
        <div className={styles.row}><span>Subtotal</span><span>₹{pricing.subtotal}</span></div>
        <div className={styles.row}><span>Tax</span><span>₹{pricing.tax}</span></div>
        <div className={styles.row}><span>Shipping</span><span>₹{pricing.shipping}</span></div>
        <div className={styles.total}><span>Total</span><span>₹{pricing.total}</span></div>
      </div>

      <div className={styles.actions}>
        <button className={styles.secondary} onClick={onPrevious} disabled={loading}>Back</button>
        <button className={styles.primary} onClick={onConfirm} disabled={loading}>Confirm Order</button>
      </div>
    </div>
  );
};

export default OrderReview;
