'use client';

import { useEffect, useState } from 'react';
import api from '../../src/utils/api';
import ProductCard from '../../src/components/ProductCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: 'var(--space-3xl)' }}>
            {/* Header Section */}
            <div style={{
                marginBottom: 'var(--space-2xl)',
                textAlign: 'center',
                padding: 'var(--space-2xl) 0',
                background: 'linear-gradient(to right, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                borderRadius: 'var(--radius-2xl)',
                marginTop: 'var(--space-lg)'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: 'var(--space-md)',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Explore Our Collection
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Discover premium products curated just for you. From latest tech to fashion trends.
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-xl)',
                flexWrap: 'wrap',
                gap: 'var(--space-md)'
            }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    <FaSearch style={{
                        position: 'absolute',
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-light)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 45px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--gray-light)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all var(--transition)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--gray-light)'}
                    />
                </div>

                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaFilter /> Filter
                </button>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid-products">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-xl)' }}></div>
                    ))}
                </div>
            ) : (
                <>
                    {filteredProducts.length > 0 ? (
                        <div className="grid-products">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', color: 'var(--text-light)' }}>
                            <h3>No products found matching "{searchTerm}"</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
