'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../src/context/AuthContext';
import api from '../../../src/utils/api';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaTruck, FaBox, FaDownload } from 'react-icons/fa';

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams(); // Use useParams hook
    const { id } = params; // Extract id from params
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push(`/login?redirect=/orders/${id}`);
            } else {
                fetchOrderDetails();
            }
        }
    }, [user, id, authLoading, router]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            console.error('Error fetching order:', err);
            setError(err.response?.data?.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="spinner"></div>
                <p>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-xl)' }}>
                    <h2 style={{ color: 'var(--error)' }}>Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-outline" style={{ marginTop: 'var(--space-md)' }} onClick={() => router.push('/orders')}>
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <button
                onClick={() => router.back()}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: 'var(--space-lg)',
                    fontSize: '1rem'
                }}
            >
                <FaArrowLeft /> Back to Orders
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>
                        Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {/* Placeholder button for invoice - functionality can be added later */}
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaDownload size={14} /> Invoice
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
                {/* Left Column: Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-sm)' }}>
                            Items ({order.items.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {order.items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        backgroundColor: '#f5f5f5',
                                        flexShrink: 0
                                    }}>
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={item.product?.images[0]}
                                                alt={item.product?.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                <FaBox />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '4px' }}>{item.product?.title || 'Unknown Product'}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            Qty: {item.quantity} | Price: ${item.price}
                                        </p>
                                    </div>
                                    <div style={{ fontWeight: '600' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-sm)' }}>
                            Tracking Information
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: 'var(--space-sm)' }}>
                                    <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>Status:</span>
                                    <span style={{
                                        fontWeight: '600',
                                        color: order.orderStatus === 'delivered' ? 'var(--success)' : 'var(--primary)',
                                        textTransform: 'capitalize'
                                    }}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                                {order.estimatedDeliveryDate && (
                                    <div style={{ marginBottom: 'var(--space-sm)' }}>
                                        <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>Estimated Delivery:</span>
                                        <span style={{ fontWeight: '500' }}>
                                            {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <FaTruck size={32} color="var(--primary)" opacity={0.5} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Calculations & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Order Summary</h3>
                        <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                <span>${order.subtotal?.toFixed(2) || (order.totalAmount - (order.shippingCost || 0) + (order.discount || 0)).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                <span>{order.shippingCost ? `$${order.shippingCost}` : 'Free'}</span>
                            </div>
                            {order.discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                                    <span>Discount</span>
                                    <span>-${order.discount}</span>
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 'var(--space-md)',
                                paddingTop: 'var(--space-sm)',
                                borderTop: '1px solid var(--border-color)',
                                fontWeight: '700',
                                fontSize: '1.2rem'
                            }}>
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem' }}>Shipping Address</h3>
                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <FaMapMarkerAlt style={{ color: 'var(--text-tertiary)', marginTop: '4px' }} />
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {order.shippingAddress ? (
                                    <>
                                        <div>{order.userName || user?.name}</div>
                                        <div>{order.shippingAddress.street}</div>
                                        <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
                                        <div>{order.shippingAddress.country}</div>
                                    </>
                                ) : (
                                    <span style={{ color: 'var(--text-secondary)' }}>N/A</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem' }}>Payment Method</h3>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                            <FaCreditCard style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ textTransform: 'uppercase', fontWeight: '500' }}>{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
