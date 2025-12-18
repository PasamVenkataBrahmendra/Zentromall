'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/utils/api';
import { FaBoxOpen, FaChevronRight, FaFilter } from 'react-icons/fa';

export default function OrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login?redirect=/orders');
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            // Sort by createdAt desc
            setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'var(--primary)';
            case 'shipped': return 'var(--info)';
            case 'delivered': return 'var(--success)';
            case 'cancelled': return 'var(--error)';
            default: return 'var(--text-secondary)';
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.orderStatus === filter);

    if (authLoading || loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="spinner"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-3xl)' }}>
                    <FaBoxOpen size={64} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }} />
                    <h2 style={{ marginBottom: 'var(--space-md)' }}>No Orders Yet</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                        Looks like you haven't bought anything yet. Explore our products!
                    </p>
                    <button className="btn btn-primary" onClick={() => router.push('/shop')}>
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1 style={{ fontSize: '2rem' }}>My Orders</h1>

                <div style={{ position: 'relative' }}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: 'var(--space-sm) var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(255,255,255,0.8)'
                        }}
                    >
                        <option value="all">All Orders</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                {filteredOrders.map(order => (
                    <div
                        key={order._id}
                        className="glass-card"
                        style={{
                            padding: 'var(--space-lg)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            borderLeft: `4px solid ${getStatusColor(order.orderStatus)}`
                        }}
                        onClick={() => router.push(`/orders/${order._id}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-xs)' }}>
                                    Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                                    color: getStatusColor(order.orderStatus),
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    marginBottom: 'var(--space-xs)'
                                }}>
                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                </div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                    ${order.totalAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                {order.items.slice(0, 3).map((item, i) => (
                                    <span key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {item.quantity}x {item.product?.title?.substring(0, 20)}...
                                    </span>
                                ))}
                                {order.items.length > 3 && (
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        +{order.items.length - 3} more
                                    </span>
                                )}
                            </div>
                            <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                                View Details <FaChevronRight size={12} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
