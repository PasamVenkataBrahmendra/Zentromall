'use client';

import { useState, useEffect } from 'react';
import styles from './PriceBreakdown.module.css';

export default function PriceBreakdown({ 
  subtotal = 0, 
  discount = 0, 
  tax = 0, 
  shipping = 0, 
  couponCode = null,
  taxRate = '18%',
  shippingFree = false,
  showDetails = true 
}) {
  const [expanded, setExpanded] = useState(false);
  const total = subtotal - discount + tax + shipping;

  if (!showDetails) {
    return (
      <div className={styles.minimal}>
        <div className={styles.total}>
          <span>Total:</span>
          <span className={styles.amount}>₹{total.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Price Breakdown</h3>
        <button 
          className={styles.toggleBtn}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {expanded && (
        <div className={styles.details}>
          {/* Subtotal */}
          <div className={styles.row}>
            <span className={styles.label}>Subtotal</span>
            <span className={styles.value}>₹{subtotal.toFixed(2)}</span>
          </div>

          {/* Discount */}
          {discount > 0 && (
            <div className={`${styles.row} ${styles.discount}`}>
              <span className={styles.label}>
                Discount {couponCode && `(${couponCode})`}
              </span>
              <span className={styles.value}>−₹{discount.toFixed(2)}</span>
            </div>
          )}

          {/* Subtotal after discount */}
          {discount > 0 && (
            <div className={styles.divider}></div>
          )}

          {/* Tax */}
          <div className={styles.row}>
            <span className={styles.label}>
              Tax/GST ({taxRate})
            </span>
            <span className={styles.value}>₹{tax.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className={styles.row}>
            <span className={styles.label}>
              Shipping
              {shippingFree && <span className={styles.badge}>FREE</span>}
            </span>
            <span className={`${styles.value} ${shippingFree ? styles.free : ''}`}>
              {shippingFree ? 'FREE' : `₹${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className={styles.divider}></div>

          {/* Total */}
          <div className={styles.totalRow}>
            <span className={styles.label}>Order Total</span>
            <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
          </div>

          {/* Save info */}
          {discount > 0 && (
            <div className={styles.savings}>
              You save ₹{discount.toFixed(2)}!
            </div>
          )}
        </div>
      )}

      {/* Collapsed view */}
      {!expanded && (
        <div className={styles.collapsed}>
          <div className={styles.row}>
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.totalRow}>
            <span className={styles.label}>Total</span>
            <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
