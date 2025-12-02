'use client';

import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ProductCard from './ProductCard';
import { FaClock } from 'react-icons/fa';

export default function RecentlyViewed() {
    const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

    if (recentlyViewed.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-2xl)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-xl)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <FaClock size={24} style={{ color: 'var(--primary)' }} />
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>
                        Recently <span className="text-gradient">Viewed</span>
                    </h2>
                </div>
                <button
                    onClick={clearRecentlyViewed}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'underline'
                    }}
                >
                    Clear History
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'var(--space-lg)',
                overflowX: 'auto'
            }}>
                {recentlyViewed.slice(0, 6).map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
