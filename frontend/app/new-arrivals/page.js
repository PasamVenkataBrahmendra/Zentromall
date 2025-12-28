'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/utils/api';
import Link from 'next/link';

export default function NewArrivalsPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchNewArrivals();
    }, [page]);

    const fetchNewArrivals = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/new-arrivals?page=${page}&limit=20`);
            setProducts(data.products || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="container" style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
                <p>Loading new arrivals...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>New Arrivals</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Discover the latest products just added to our store
                </p>
            </div>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        No new arrivals at the moment. Check back soon!
                    </p>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: 'var(--space-lg)',
                        marginBottom: 'var(--space-xl)'
                    }}>
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                href={`/product/${product.slug}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'block',
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
                                    <img
                                        src={product.images?.[0] || '/placeholder.png'}
                                        alt={product.title}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            padding: 'var(--space-md)'
                                        }}
                                    />
                                    {product.isNewArrival && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            NEW
                                        </span>
                                    )}
                                </div>
                                <div style={{ padding: 'var(--space-md)' }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        marginBottom: 'var(--space-sm)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {product.title}
                                    </h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                ${product.price}
                                            </span>
                                            {product.mrp > product.price && (
                                                <span style={{
                                                    marginLeft: 'var(--space-sm)',
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-muted)',
                                                    textDecoration: 'line-through'
                                                }}>
                                                    ${product.mrp}
                                                </span>
                                            )}
                                        </div>
                                        {product.rating > 0 && (
                                            <span style={{ fontSize: '0.9rem', color: '#ffa41c' }}>
                                                ⭐ {product.rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn btn-outline"
                            >
                                Previous
                            </button>
                            <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-md)' }}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn btn-outline"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

