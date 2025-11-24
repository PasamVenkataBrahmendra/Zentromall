'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/utils/api';
import { useRouter } from 'next/navigation';

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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>My Profile</h1>
                <button onClick={logout} className="btn btn-outline">Logout</button>
            </div>

            <div className="bg-white rounded shadow" style={{ padding: '20px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Personal Information</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded shadow" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Order ID: {order._id}</strong>
                                <span style={{
                                    padding: '5px 10px', borderRadius: '15px', fontSize: '12px',
                                    background: order.paymentStatus === 'paid' ? '#e6fffa' : '#fff5f5',
                                    color: order.paymentStatus === 'paid' ? 'green' : 'red'
                                }}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <p>Total: ${order.totalAmount}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <div style={{ marginTop: '10px' }}>
                                {order.items.map((item, index) => (
                                    <span key={index} style={{ display: 'inline-block', marginRight: '10px', fontSize: '14px', color: '#666' }}>
                                        {item.quantity}x Product
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
