'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../src/utils/api';
import { useCart } from '../../../src/context/CartContext';
import ProductRail from '../../../src/components/ProductRail';
import { FaCheckCircle } from 'react-icons/fa';
import { FALLBACK_PRODUCTS } from '../../../src/data/fallbackData';

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
        <span style={{ color: 'var(--gray)' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
);

export default function ProductDetails() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data);
                setSelectedColor(data.variantOptions?.colors?.[0] || null);
                setSelectedSize(data.variantOptions?.sizes?.[0] || null);
            } catch (error) {
                console.error('Error fetching product:', error);
                const fallbackProduct = FALLBACK_PRODUCTS.find(item => item.slug === slug);
                if (fallbackProduct) {
                    const relatedProducts = FALLBACK_PRODUCTS.filter(item => item.slug !== slug && item.category.slug === fallbackProduct.category.slug);
                    setProduct({ ...fallbackProduct, relatedProducts });
                    setSelectedColor(fallbackProduct.variantOptions?.colors?.[0] || null);
                    setSelectedSize(fallbackProduct.variantOptions?.sizes?.[0] || null);
                }
            }
        };
        if (slug) fetchProduct();
    }, [slug]);

    if (!product) return <div className="card">Loading product...</div>;

    const rating = product.rating || 4.5;
    const breakdown = product.ratingBreakdown || {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xl)' }}>
                <section style={{ flex: '1 1 55%', background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {product.images?.map((img, index) => (
                                <button
                                    key={img}
                                    onClick={() => setActiveImage(index)}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 'var(--radius)',
                                        border: index === activeImage ? '2px solid var(--brand-orange)' : '1px solid var(--gray-lighter)',
                                        background: 'white',
                                        padding: '0.25rem'
                                    }}
                                >
                                    <img src={img} alt={`${product.title}-${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </button>
                            ))}
                        </div>
                        <div style={{ flex: 1, background: '#f7fafa', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={product.images?.[activeImage]} alt={product.title} style={{ maxWidth: '100%', maxHeight: 420 }} />
                        </div>
                    </div>
                    <div style={{ marginTop: 'var(--space-xl)' }}>
                        <p style={{ color: 'var(--gray)', marginBottom: '0.5rem' }}>Brand: <strong>{product.brand}</strong></p>
                        <h1 style={{ marginBottom: 'var(--space-sm)' }}>{product.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{rating} ★</span>
                            <span style={{ color: 'var(--gray)' }}>{product.numReviews} ratings</span>
                        </div>
                        <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b12704' }}>${product.price}</p>
                        <p>
                            MRP: <span style={{ textDecoration: 'line-through', color: 'var(--gray)' }}>${product.mrp}</span> ({product.discount}% off)
                        </p>
                        <p style={{ color: '#007600' }}>Inclusive of all taxes</p>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--gray)', fontSize: '0.95rem' }}>
                            {product.highlights?.map(point => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </section>
                <aside style={{ flex: '1 1 35%', background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow)' }}>
                    <InfoRow label="Sold by" value={product.seller?.storeName || 'Zentro Official'} />
                    <InfoRow label="Category" value={product.category?.name} />
                    <InfoRow label="Return policy" value={`${product.deliveryInfo?.returnWindow || 7}-day replacement`} />
                    <InfoRow label="Delivery" value={product.deliveryInfo?.estimatedDays || '2-4 days'} />

                    {product.variantOptions?.colors?.length > 0 && (
                        <div style={{ marginTop: 'var(--space-lg)' }}>
                            <p style={{ fontWeight: 600 }}>Color</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {product.variantOptions.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`filter-chip ${selectedColor === color ? 'active' : ''}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.variantOptions?.sizes?.length > 0 && (
                        <div style={{ marginTop: 'var(--space-lg)' }}>
                            <p style={{ fontWeight: 600 }}>Size</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {product.variantOptions.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`filter-chip ${selectedSize === size ? 'active' : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="btn btn-primary" onClick={() => addToCart(product._id)}>
                            Add to Cart
                        </button>
                        <button className="btn btn-accent">
                            Buy Now
                        </button>
                    </div>

                    <div style={{ marginTop: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FaCheckCircle color="#26a541" /> Cash on Delivery available
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FaCheckCircle color="#26a541" /> No-cost EMI from $25/mo
                        </p>
                    </div>
                </aside>
            </div>

            <section className="card">
                <h2>Specifications</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {product.specifications?.map(spec => (
                        <div key={spec.label} style={{ padding: '0.75rem', border: '1px solid var(--gray-lighter)', borderRadius: 'var(--radius)' }}>
                            <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.9rem' }}>{spec.label}</p>
                            <strong>{spec.value}</strong>
                        </div>
                    ))}
                </div>
            </section>

            {product.relatedProducts?.length > 0 && (
                <ProductRail
                    title="Customers also viewed"
                    products={product.relatedProducts}
                    cta={{ label: 'See more similar items', href: `/shop?category=${product.category?.slug}` }}
                />
            )}
        </div>
    );
}
