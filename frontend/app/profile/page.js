'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/utils/api';
import { useRouter } from 'next/navigation';
import { FaUser, FaBox, FaSignOutAlt, FaEnvelope, FaIdBadge } from 'react-icons/fa';

export default function Profile() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [user, router]);

    if (!user) return null;

    return (
        <div style={{ paddingBottom: 'var(--space-3xl)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-2xl)',
                marginTop: 'var(--space-lg)'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    My Profile
                </h1>
                <button
                    onClick={logout}
                    className="btn btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                {/* User Info Card */}
                <div className="card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: '100px' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 'var(--space-xl)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            background: 'var(--gradient-primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 'var(--space-md)',
                            color: 'white',
                            fontSize: '2.5rem'
                        }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>{user.name}</h2>
                        <span className="badge badge-primary">{user.role}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-gray)' }}>
                            <FaEnvelope color="var(--primary)" />
                            <span>{user.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-gray)' }}>
                            <FaIdBadge color="var(--primary)" />
                            <span>ID: {user._id.substring(0, 10)}...</span>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBox color="var(--primary)" /> Order History
                    </h2>

                    {orders.length === 0 ? (
                        <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-light)' }}>
                            <p>No orders found yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                            {orders.map(order => (
                                <div key={order._id} className="card" style={{ padding: 'var(--space-lg)', transition: 'all var(--transition)' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 'var(--space-md)',
                                        borderBottom: '1px solid var(--gray-light)',
                                        paddingBottom: 'var(--space-md)'
                                    }}>
                                        <div>
                                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Order ID</span>
                                            <div style={{ fontWeight: 'bold' }}>#{order._id.substring(0, 8)}</div>
                                        </div>
                                        <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: 'var(--space-md)' }}>
                                        {order.items.map((item, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: 'var(--space-xs)',
                                                fontSize: '0.95rem'
                                            }}>
                                                <span style={{ color: 'var(--text-gray)' }}>
                                                    {item.quantity}x Product
                                                </span>
                                                {/* Note: Product details might not be populated in order items depending on backend */}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 'var(--space-md)',
                                        paddingTop: 'var(--space-md)',
                                        borderTop: '1px solid var(--gray-light)'
                                    }}>
                                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                            ${order.totalAmount}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
