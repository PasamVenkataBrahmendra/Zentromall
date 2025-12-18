'use client';

import React from 'react';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = ({ orderId, orderNumber }) => {
  return (
    <div className={styles.container}>
      <h3>Thank you for your order!</h3>
      <p>Your order has been placed successfully.</p>
      <div className={styles.box}>
        <p><strong>Order Number:</strong> {orderNumber}</p>
        <p><strong>Order ID:</strong> {orderId}</p>
      </div>
      <p>We'll send you an email confirmation shortly.</p>
    </div>
  );
};

export default OrderConfirmation;
