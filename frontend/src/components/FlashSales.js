'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from './ProductCard';
import CountdownTimer from './CountdownTimer';
import { FaBolt } from 'react-icons/fa';

export default function FlashSales() {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFlashSales();
    }, []);

    const fetchFlashSales = async () => {
        try {
            const { data } = await api.get('/flash-sales');
            setFlashSales(data);
        } catch (error) {
            console.error('Error fetching flash sales:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || flashSales.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-2xl)' }}>
            {flashSales.map(sale => (
                <div key={sale._id} style={{ marginBottom: 'var(--space-3xl)' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--danger), var(--secondary))',
                        padding: 'var(--space-xl)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--space-lg)',
                        color: 'white'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 'var(--space-lg)'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                                    <FaBolt size={32} />
                                    <h2 style={{ fontSize: '2rem', margin: 0 }}>{sale.title}</h2>
                                </div>
                                {sale.description && (
                                    <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>{sale.description}</p>
                                )}
                            </div>
                            <CountdownTimer endTime={sale.endTime} />
                        </div>
                    </div>

                    <div className="grid-products">
                        {sale.products.slice(0, 6).map(({ product, salePrice, stockLimit, soldCount }) => (
                            <div key={product._id} style={{ position: 'relative' }}>
                                {/* Flash Sale Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    background: 'var(--danger)',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    zIndex: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <FaBolt size={12} />
                                    {Math.round(((product.price - salePrice) / product.price) * 100)}% OFF
                                </div>

                                <ProductCard
                                    product={{
                                        ...product,
                                        price: salePrice,
                                        mrp: product.price
                                    }}
                                />

                                {/* Stock Progress */}
                                {stockLimit && (
                                    <div style={{
                                        padding: 'var(--space-sm)',
                                        background: 'var(--gray-50)',
                                        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                                        marginTop: '-10px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '0.75rem',
                                            marginBottom: 'var(--space-xs)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <span>Sold: {soldCount}/{stockLimit}</span>
                                            <span>{Math.round((soldCount / stockLimit) * 100)}%</span>
                                        </div>
                                        <div style={{
                                            height: '4px',
                                            background: 'var(--gray-200)',
                                            borderRadius: 'var(--radius-full)',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${(soldCount / stockLimit) * 100}%`,
                                                background: 'linear-gradient(90deg, var(--danger), var(--secondary))',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
