'use client';

import SellerLayout from '../../../src/components/SellerLayout';
import { useState, useEffect } from 'react';
import api from '../../../src/utils/api';
import { FaFilter, FaBoxOpen, FaEye } from 'react-icons/fa';

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/sellerorders');
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

    return (
        <SellerLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Orders</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your customer orders</p>
                </div>

                <div style={{ position: 'relative' }}>
                    <FaFilter style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '8px 16px 8px 36px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <div className="spinner"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-lg)' }}>
                    <FaBoxOpen size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }} />
                    <h3>No orders found</h3>
                </div>
            ) : (
                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Order ID</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Date</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Customer</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Items</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Total</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: 'var(--space-md)', fontWeight: '500' }}>#{order.orderNumber || order._id.slice(-6)}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <div>{order.user?.name || 'Guest'}</div>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {order.items.length} items
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)' }}>${order.totalAmount.toFixed(2)}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                                            color: getStatusColor(order.orderStatus),
                                            textTransform: 'capitalize',
                                            fontWeight: '600'
                                        }}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </SellerLayout>
    );
}
