'use client';

import SellerLayout from '../../src/components/SellerLayout';
import { useEffect, useState } from 'react';
import api from '../../src/utils/api';

export default function SellerDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products/myproducts'),
                    api.get('/orders/sellerorders')
                ]);

                setStats({
                    products: productsRes.data.length,
                    orders: ordersRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <SellerLayout>
            <h1 style={{ marginBottom: '30px' }}>Seller Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>My Products</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.products}</p>
                </div>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>My Orders</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.orders}</p>
                </div>
            </div>
        </SellerLayout>
    );
}
