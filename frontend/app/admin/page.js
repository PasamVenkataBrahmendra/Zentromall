'use client';

import AdminLayout from '../../src/components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../../src/utils/api';
import SalesChart from '../../src/components/SalesChart';
import StatusDistributionChart from '../../src/components/StatusDistributionChart';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
    const [salesData, setSalesData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders'),
                    api.get('/users')
                ]);

                const orders = ordersRes.data;

                setStats({
                    products: productsRes.data.length,
                    orders: orders.length,
                    users: usersRes.data.length
                });

                // Process Sales Data (Last 7 days)
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const salesByDay = last7Days.map(date => {
                    const dailyOrders = orders.filter(o => o.createdAt.split('T')[0] === date);
                    const totalSales = dailyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                    return { date, sales: totalSales };
                });
                setSalesData(salesByDay);

                // Process Status Distribution
                const statusCounts = orders.reduce((acc, o) => {
                    const status = o.orderStatus || 'pending';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});

                const distribution = Object.entries(statusCounts).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value
                }));
                setStatusData(distribution);

            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>Total Products</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.products}</p>
                </div>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>Total Orders</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.orders}</p>
                </div>
                <div className="bg-white rounded shadow" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--dark)' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-gray)', marginBottom: '10px' }}>Total Users</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--dark)' }}>{stats.users}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                <div className="bg-white rounded shadow" style={{ padding: '25px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '600' }}>Sales Trend (Last 7 Days)</h3>
                    <SalesChart data={salesData} />
                </div>
                <div className="bg-white rounded shadow" style={{ padding: '25px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '600' }}>Order Status Distribution</h3>
                    <StatusDistributionChart data={statusData} />
                </div>
            </div>
        </AdminLayout>
    );
}
