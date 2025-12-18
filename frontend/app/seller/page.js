'use client';

import SellerLayout from '../../src/components/SellerLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/utils/api';
import { FaBox, FaShoppingBag, FaMoneyBillWave, FaPlus, FaArrowRight } from 'react-icons/fa';
import SalesChart from '../../src/components/SalesChart';
import StatusDistributionChart from '../../src/components/StatusDistributionChart';

export default function SellerDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products/myproducts'),
                    api.get('/orders/sellerorders')
                ]);

                const products = productsRes.data;
                const orders = ordersRes.data;

                // Calculate total revenue from orders
                // Note: This is a simplified calculation. Real usage might need more complex logic.
                const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

                setStats({
                    products: products.length,
                    orders: orders.length,
                    revenue: revenue,
                    lowStockProducts: products.filter(p => p.stock < 10)
                });

                // Process Sales Data (Last 7 Days)
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const salesMap = {};
                orders.forEach(order => {
                    const date = order.createdAt.split('T')[0];
                    salesMap[date] = (salesMap[date] || 0) + order.totalAmount;
                });

                const formattedSalesData = last7Days.map(date => ({
                    date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    sales: salesMap[date] || 0
                }));
                setSalesData(formattedSalesData);

                // Process Status Distribution
                const statusMap = {};
                orders.forEach(order => {
                    statusMap[order.orderStatus] = (statusMap[order.orderStatus] || 0) + 1;
                });
                const formattedStatusData = Object.keys(statusMap).map(status => ({
                    name: status.charAt(0).toUpperCase() + status.slice(1),
                    value: statusMap[status]
                }));
                setStatusData(formattedStatusData);

                // Get top 5 recent orders
                const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
                setRecentOrders(sortedOrders);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                fontSize: '1.5rem'
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1.2' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <SellerLayout>
            <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your seller center</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => router.push('/seller/products/new')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaPlus /> Add Product
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {/* Analytics Overview */}
                    <div style={{ marginBottom: 'var(--space-2xl)' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Analytics Overview</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                            {/* Sales Chart */}
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Sales Overview (Last 7 Days)</h3>
                                <SalesChart data={salesData} />
                            </div>
                            {/* Status Distribution */}
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Order Status</h3>
                                <StatusDistributionChart data={statusData} />
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-2xl)', borderLeft: '4px solid var(--accent)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaBox color="var(--accent)" /> Low Stock Alert
                        </h3>
                        {stats.lowStockProducts?.length > 0 ? (
                            <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', paddingBottom: '5px' }}>
                                {stats.lowStockProducts.map(p => (
                                    <div key={p._id} style={{ minWidth: '200px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>{p.title}</div>
                                        <div style={{ color: 'var(--error)', fontSize: '0.85rem' }}>Only {p.stock} left</div>
                                        <button
                                            onClick={() => router.push(`/seller/products/${p._id}/edit`)}
                                            style={{ marginTop: '5px', fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Restock
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All products are well stocked.</p>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                        <StatCard
                            title="Total Revenue"
                            value={`$${stats.revenue.toLocaleString()}`}
                            icon={<FaMoneyBillWave />}
                            color="var(--success)"
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats.orders}
                            icon={<FaShoppingBag />}
                            color="var(--accent)"
                        />
                        <StatCard
                            title="Active Products"
                            value={stats.products}
                            icon={<FaBox />}
                            color="var(--primary)"
                        />
                    </div>

                    {/* Recent Orders Section */}
                    <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Recent Orders</h2>
                            <button
                                onClick={() => router.push('/seller/orders')}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                View All <FaArrowRight size={12} />
                            </button>
                        </div>

                        {recentOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No orders yet.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>Order ID</th>
                                            <th style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>Date</th>
                                            <th style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>Customer</th>
                                            <th style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>Total</th>
                                            <th style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: 'var(--space-md)', fontWeight: '500' }}>#{order.orderNumber || order._id.slice(-6)}</td>
                                                <td style={{ padding: 'var(--space-md)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: 'var(--space-md)' }}>{order.user?.name || 'Guest'}</td>
                                                <td style={{ padding: 'var(--space-md)' }}>${order.totalAmount.toFixed(2)}</td>
                                                <td style={{ padding: 'var(--space-md)' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        backgroundColor: order.orderStatus === 'delivered' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                                                        color: order.orderStatus === 'delivered' ? 'var(--success)' : 'var(--info)',
                                                        textTransform: 'capitalize'
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
                    </div>
                </>
            )}
        </SellerLayout>
    );
}
