'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Admin Panel...</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '80vh', gap: '30px' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: 'white', padding: '20px', borderRadius: 'var(--radius)', height: 'fit-content' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Admin Panel</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/admin" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Dashboard</Link>
                    <Link href="/admin/products" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Products</Link>
                    <Link href="/admin/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Orders</Link>
                    <Link href="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Users</Link>
                    <Link href="/" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', marginTop: '20px', color: 'var(--text-gray)' }}>Back to Shop</Link>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}
