'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../src/context/CartContext';
import { useAuth } from '../../src/context/AuthContext';
import { useCheckout } from '../../src/context/CheckoutContext';
import api from '../../src/utils/api';
import { FaMapMarkerAlt, FaShoppingBag, FaCreditCard, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useCart();
    const { user } = useAuth();
    const { checkoutData, updateCheckoutData, nextStep, prevStep, resetCheckout } = useCheckout();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push('/login?redirect=/checkout');
            return;
        }
        if (cart.items.length === 0) {
            router.push('/cart');
            return;
        }
        fetchAddresses();
    }, [user, cart]);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/users/addresses');
            setAddresses(data);
            const defaultAddr = data.find(addr => addr.isDefault);
            if (defaultAddr && !checkoutData.selectedAddress) {
                updateCheckoutData({ selectedAddress: defaultAddr._id });
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const calculateTotal = () => {
        const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const discount = checkoutData.discount || 0;
        const deliveryFee = subtotal > 500 ? 0 : 50;
        return {
            subtotal,
            discount,
            deliveryFee,
            total: subtotal - discount + deliveryFee
        };
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/orders', {
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                shippingAddress: checkoutData.selectedAddress,
                paymentMethod: checkoutData.paymentMethod,
                totalAmount: calculateTotal().total
            });

            setOrderId(data._id);
            setOrderPlaced(true);
            resetCheckout();
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const { subtotal, discount, deliveryFee, total } = calculateTotal();

    const steps = [
        { number: 1, title: 'Address', icon: FaMapMarkerAlt },
        { number: 2, title: 'Review', icon: FaShoppingBag },
        { number: 3, title: 'Payment', icon: FaCreditCard },
        { number: 4, title: 'Confirm', icon: FaCheckCircle }
    ];

    if (orderPlaced) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-3xl)' }}>
                    <FaCheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--space-lg)' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>Order Placed Successfully!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                        Your order ID: <strong>{orderId}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={() => router.push('/orders')}>
                            View Orders
                        </button>
                        <button className="btn btn-outline" onClick={() => router.push('/shop')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xl)' }}>Checkout</h1>

            {/* Progress Steps */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-3xl)',
                position: 'relative'
            }}>
                {steps.map((step, index) => (
                    <div key={step.number} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: checkoutData.step >= step.number ? 'var(--primary)' : 'var(--gray-200)',
                            color: checkoutData.step >= step.number ? 'white' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-sm)',
                            transition: 'all var(--transition-base)'
                        }}>
                            <step.icon size={24} />
                        </div>
                        <p style={{
                            fontSize: '0.875rem',
                            fontWeight: checkoutData.step === step.number ? '600' : '400',
                            color: checkoutData.step >= step.number ? 'var(--primary)' : 'var(--text-secondary)'
                        }}>
                            {step.title}
                        </p>
                        {index < steps.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                top: '25px',
                                left: '50%',
                                right: '-50%',
                                height: '2px',
                                background: checkoutData.step > step.number ? 'var(--primary)' : 'var(--gray-200)',
                                zIndex: -1
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
                {/* Main Content */}
                <div>
                    {/* Step 1: Address Selection */}
                    {checkoutData.step === 1 && (
                        <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Select Delivery Address</h2>
                            {addresses.length === 0 ? (
                                <p>No saved addresses. Please add an address in your profile.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                                    {addresses.map(addr => (
                                        <label
                                            key={addr._id}
                                            style={{
                                                display: 'block',
                                                padding: 'var(--space-lg)',
                                                border: `2px solid ${checkoutData.selectedAddress === addr._id ? 'var(--primary)' : 'var(--border-color)'}`,
                                                borderRadius: 'var(--radius-lg)',
                                                cursor: 'pointer',
                                                transition: 'all var(--transition-fast)'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={checkoutData.selectedAddress === addr._id}
                                                onChange={() => updateCheckoutData({ selectedAddress: addr._id })}
                                                style={{ marginRight: 'var(--space-sm)' }}
                                            />
                                            <strong>{addr.street}</strong>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                {addr.city}, {addr.state} {addr.zip}, {addr.country}
                                            </p>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Order Review */}
                    {checkoutData.step === 2 && (
                        <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Review Your Order</h2>
                            {cart.items.map(item => (
                                <div key={item.product._id} style={{
                                    display: 'flex',
                                    gap: 'var(--space-md)',
                                    padding: 'var(--space-md) 0',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <img
                                        src={item.product.images?.[0] || '/placeholder.png'}
                                        alt={item.product.title}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4>{item.product.title}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: '600' }}>${item.product.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Payment Method */}
                    {checkoutData.step === 3 && (
                        <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Select Payment Method</h2>
                            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                                {['cod', 'card', 'upi'].map(method => (
                                    <label
                                        key={method}
                                        style={{
                                            display: 'block',
                                            padding: 'var(--space-lg)',
                                            border: `2px solid ${checkoutData.paymentMethod === method ? 'var(--primary)' : 'var(--border-color)'}`,
                                            borderRadius: 'var(--radius-lg)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={checkoutData.paymentMethod === method}
                                            onChange={() => updateCheckoutData({ paymentMethod: method })}
                                            style={{ marginRight: 'var(--space-sm)' }}
                                        />
                                        <strong>{method === 'cod' ? 'Cash on Delivery' : method === 'card' ? 'Credit/Debit Card' : 'UPI'}</strong>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div>
                    <div className="glass-card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: 'var(--space-lg)' }}>Order Summary</h3>
                        <div style={{ display: 'grid', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Delivery</span>
                                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: 'var(--space-md)',
                                borderTop: '2px solid var(--border-color)',
                                fontSize: '1.25rem',
                                fontWeight: '700'
                            }}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {checkoutData.step > 1 && (
                                <button className="btn btn-outline" onClick={prevStep}>
                                    <FaArrowLeft /> Back
                                </button>
                            )}
                            {checkoutData.step < 3 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={checkoutData.step === 1 && !checkoutData.selectedAddress}
                                >
                                    Continue <FaArrowRight />
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
