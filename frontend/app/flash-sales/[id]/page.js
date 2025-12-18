'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../src/utils/api';
import { useCart } from '../../src/context/CartContext';
import { FaFire, FaShoppingCart } from 'react-icons/fa';

export default function FlashSaleDetails() {
    const router = useRouter();
    const { id } = useParams();
    const { addToCart } = useCart();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSale = async () => {
            try {
                const { data } = await api.get(`/flash-sales/${id}`);
                setSale(data);
            } catch (error) {
                console.error('Error fetching sale details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSale();
    }, [id]);

    const calculateDiscount = (original, final) => {
        return Math.round(((original - final) / original) * 100);
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!sale) return <div className="container">Sale not found</div>;

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <div style={{
                backgroundColor: 'var(--secondary)',
                color: 'white',
                padding: 'var(--space-2xl)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-2xl)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>{sale.title}</h1>
                    <p style={{ opacity: 0.9 }}>{sale.description}</p>
                </div>
                <FaFire style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    fontSize: '10rem',
                    opacity: 0.1,
                    transform: 'rotate(-45deg)'
                }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
                {sale.products.map(item => {
                    const product = item.product;
                    const discount = calculateDiscount(product.price, item.discountPrice);

                    return (
                        <div key={product._id} className="glass-card" style={{ padding: 'var(--space-lg)', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                backgroundColor: 'var(--error)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                -{discount}%
                            </div>

                            <div style={{
                                height: '200px',
                                marginBottom: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }} onClick={() => router.push(`/product/${product._id}`)}>
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        No Image
                                    </div>
                                )}
                            </div>

                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)', height: '40px', overflow: 'hidden' }}>{product.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: 'var(--space-md)' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--error)' }}>
                                    ${item.discountPrice}
                                </span>
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    ${product.price}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                                <span>{item.soldCount} sold</span>
                                <div style={{ width: '60%', height: '4px', backgroundColor: '#eee', borderRadius: '2px' }}>
                                    <div style={{ width: `${Math.min((item.soldCount / item.stockLimit) * 100, 100)}%`, height: '100%', backgroundColor: 'var(--error)', borderRadius: '2px' }} />
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                onClick={() => addToCart(product._id, 1)}
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
