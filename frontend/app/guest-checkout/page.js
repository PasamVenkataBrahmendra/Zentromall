'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/utils/api';

export default function GuestCheckoutPage() {
    const router = useRouter();
    const [sessionId, setSessionId] = useState(null);
    const [cart, setCart] = useState(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        shippingAddress: {
            fullName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India'
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeSession();
    }, []);

    const initializeSession = async () => {
        try {
            const storedSessionId = localStorage.getItem('guestSessionId');
            if (storedSessionId) {
                setSessionId(storedSessionId);
                fetchCart(storedSessionId);
            } else {
                const { data } = await api.get('/guest/cart');
                const newSessionId = data.sessionId;
                setSessionId(newSessionId);
                localStorage.setItem('guestSessionId', newSessionId);
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error initializing session:', error);
        }
    };

    const fetchCart = async (sid) => {
        try {
            const { data } = await api.get(`/guest/cart?sessionId=${sid}`, {
                headers: { 'x-session-id': sid }
            });
            setCart(data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post('/guest/checkout', {
                sessionId,
                email: formData.email,
                phone: formData.phone,
                shippingAddress: formData.shippingAddress,
                paymentMethod: 'cod'
            });

            localStorage.removeItem('guestSessionId');
            router.push(`/guest/order/${data.order.orderNumber}?email=${formData.email}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) {
        return <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>Loading...</div>;
    }

    if (cart.items.length === 0) {
        return (
            <div className="container" style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
                <h1>Your cart is empty</h1>
                <button onClick={() => router.push('/shop')} className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>Guest Checkout</h1>

            {error && (
                <div style={{
                    padding: 'var(--space-md)',
                    background: '#fee',
                    color: '#c33',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-lg)'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Contact & Shipping Information</h2>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                            />
                        </div>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Phone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                            />
                        </div>

                        <h3 style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>Shipping Address</h3>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.shippingAddress.fullName}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingAddress: { ...formData.shippingAddress, fullName: e.target.value }
                                })}
                                style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                            />
                        </div>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Address Line 1 *</label>
                            <input
                                type="text"
                                required
                                value={formData.shippingAddress.addressLine1}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingAddress: { ...formData.shippingAddress, addressLine1: e.target.value }
                                })}
                                style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                            />
                        </div>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Address Line 2</label>
                            <input
                                type="text"
                                value={formData.shippingAddress.addressLine2}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingAddress: { ...formData.shippingAddress, addressLine2: e.target.value }
                                })}
                                style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                            <div>
                                <label>City *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shippingAddress.city}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                                    })}
                                    style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                                />
                            </div>
                            <div>
                                <label>State *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shippingAddress.state}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                                    })}
                                    style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Zip Code *</label>
                            <input
                                type="text"
                                required
                                pattern="[0-9]{6}"
                                value={formData.shippingAddress.zipCode}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value }
                                })}
                                style={{ width: '100%', padding: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}
                            />
                        </div>

                        <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: '#f0f9ff', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                💡 <strong>Tip:</strong> Create an account to save your information and track orders easily!
                            </p>
                            <button
                                type="button"
                                onClick={() => router.push('/register')}
                                className="btn btn-outline btn-sm"
                                style={{ marginTop: 'var(--space-sm)' }}
                            >
                                Create Account
                            </button>
                        </div>
                    </div>

                    <div className="card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                        <h2>Order Summary</h2>
                        <div style={{ margin: 'var(--space-md) 0' }}>
                            {cart.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                    <span>{item.product?.title || 'Product'} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                <span>Tax (18%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: 'var(--space-md)' }}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

