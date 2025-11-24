'use client';

import AdminLayout from '../../../src/components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../../../src/utils/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <AdminLayout>
            <h1 style={{ marginBottom: '30px' }}>Orders</h1>
            <div className="bg-white rounded shadow" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Order ID</th>
                            <th style={{ padding: '15px' }}>User</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '15px', fontSize: '14px' }}>{order._id}</td>
                                <td style={{ padding: '15px' }}>{order.user?.name || 'Unknown'}</td>
                                <td style={{ padding: '15px' }}>${order.totalAmount}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px', borderRadius: '15px', fontSize: '12px',
                                        background: order.orderStatus === 'delivered' ? '#e6fffa' : '#fff5f5',
                                        color: order.orderStatus === 'delivered' ? 'green' : 'orange'
                                    }}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {order.orderStatus !== 'delivered' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                            className="btn btn-primary"
                                            style={{ padding: '5px 10px', fontSize: '12px' }}
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
