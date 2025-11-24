'use client';

import SellerLayout from '../../../src/components/SellerLayout';
import { useEffect, useState } from 'react';
import api from '../../../src/utils/api';

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/sellerorders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <SellerLayout>
            <h1 style={{ marginBottom: '30px' }}>Seller Orders</h1>
            <div className="bg-white rounded shadow" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Order ID</th>
                            <th style={{ padding: '15px' }}>User</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Items</th>
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
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ fontSize: '12px' }}>
                                            {item.product?.title} (x{item.quantity})
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
