'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import MultiStepCheckout from '../../src/components/MultiStepCheckout';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponMessage, setCouponMessage] = useState('');

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        // Assuming free shipping for now or managed elsewhere
        return Math.max(0, subtotal - discount);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponMessage('');
        try {
            const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            const { data } = await api.post('/coupons/validate', {
                code: couponCode,
                cartTotal: subtotal
            });
            setDiscount(data.discountAmount);
            setAppliedCoupon(data.code);
            setCouponMessage({ type: 'success', text: `Coupon applied: -$${data.discountAmount}` });
        } catch (err) {
            setDiscount(0);
            setAppliedCoupon(null);
            setCouponMessage({ type: 'error', text: err.response?.data?.message || 'Invalid coupon' });
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xl)' }}>Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
                <div>
                    <MultiStepCheckout />
                </div>
                <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                    <h2>Order Summary</h2>
                    <div style={{ margin: '1rem 0' }}>
                        {cart.map(item => (
                            <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>{item.product.title} x {item.quantity}</span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Coupon Section */}
                    <div style={{ marginBottom: '1rem', padding: '10px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Promo Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={!!appliedCoupon}
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            {appliedCoupon ? (
                                <button onClick={() => { setAppliedCoupon(null); setDiscount(0); setCouponCode(''); setCouponMessage(''); }} className="btn btn-outline btn-sm">Remove</button>
                            ) : (
                                <button onClick={handleApplyCoupon} className="btn btn-primary btn-sm">Apply</button>
                            )}
                        </div>
                        {couponMessage && (
                            <p style={{ fontSize: '0.8rem', marginTop: '5px', color: couponMessage.type === 'success' ? 'var(--success)' : 'var(--error)' }}>
                                {couponMessage.text}
                            </p>
                        )}
                    </div>

                    <div style={{ borderTop: '2px solid var(--gray-lighter)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal</span>
                            <span>${cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--success)' }}>
                                <span>Discount</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem' }}>
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
