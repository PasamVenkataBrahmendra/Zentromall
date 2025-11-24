'use client';

import AdminLayout from '../../src/components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../../src/utils/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, we'd have a dedicated stats endpoint.
                // For now, we'll just fetch counts from list endpoints if available, or mock it.
                // Since we don't have a "get all users" endpoint for admin yet, we'll skip users count or add it later.
                // We added getAllOrders. We have getProducts.

                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders')
                ]);

                setStats({
                    products: productsRes.data.length,
                    orders: ordersRes.data.length,
                    users: 'N/A' // Placeholder
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>Total Products</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.products}</p>
                </div>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>Total Orders</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.orders}</p>
                </div>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>Total Users</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--dark)' }}>{stats.users}</p>
                </div>
            </div>
        </AdminLayout>
    );
}
