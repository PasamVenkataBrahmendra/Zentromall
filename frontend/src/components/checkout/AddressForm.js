'use client';

import React, { useState } from 'react';
import styles from './AddressForm.module.css';

const AddressForm = ({ initialData = {}, onNext, loading }) => {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'India'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Shipping Address</h3>
      <div className={styles.row}>
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      </div>
      <input name="addressLine1" placeholder="Address Line 1" value={form.addressLine1} onChange={handleChange} required />
      <input name="addressLine2" placeholder="Address Line 2" value={form.addressLine2} onChange={handleChange} />
      <div className={styles.row}>
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
      </div>
      <div className={styles.row}>
        <input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={loading} className={styles.primary}>Save & Continue</button>
      </div>
    </form>
  );
};

export default AddressForm;
