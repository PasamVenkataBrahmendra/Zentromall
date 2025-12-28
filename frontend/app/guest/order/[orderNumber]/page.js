'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '../../../../src/utils/api';
import Link from 'next/link';

export default function GuestOrderPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderNumber = params.orderNumber;
    const email = searchParams.get('email');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/guest/orders/${orderNumber}?email=${email}`);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>Loading...</div>;
    }

    if (!order) {
        return (
            <div className="container" style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
                <h1>Order not found</h1>
                <Link href="/shop" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>✅</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>Order Placed Successfully!</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Order Number: <strong>{order.orderNumber}</strong>
                </p>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2>Order Details</h2>
                <div style={{ marginTop: 'var(--space-md)' }}>
                    <p><strong>Status:</strong> {order.orderStatus}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2>Items</h2>
                <div style={{ marginTop: 'var(--space-md)' }}>
                    {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
                            <img
                                src={item.product?.images?.[0] || '/placeholder.png'}
                                alt={item.product?.title}
                                style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f5f5f5', borderRadius: 'var(--radius-md)' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3>{item.product?.title}</h3>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h2>Shipping Address</h2>
                <div style={{ marginTop: 'var(--space-md)' }}>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                <Link href="/shop" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

