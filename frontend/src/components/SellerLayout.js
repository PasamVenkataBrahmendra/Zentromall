'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'seller') {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'seller') {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Seller Panel...</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '80vh', gap: '30px' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: 'white', padding: '20px', borderRadius: 'var(--radius)', height: 'fit-content' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--accent)' }}>Seller Panel</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/seller" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Dashboard</Link>
                    <Link href="/seller/products" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>My Products</Link>
                    <Link href="/seller/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Seller Orders</Link>
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
