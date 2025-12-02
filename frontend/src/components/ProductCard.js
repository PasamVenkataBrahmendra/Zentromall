'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="glass-card"
            style={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} style={{ flex: 1 }}>
                <div style={{
                    height: '280px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    background: '#f1f5f9'
                }}>
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                opacity: 1
                            }}
                        />
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            No Image
                        </div>
                    )}

                    {/* Overlay Gradient */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }} />

                    {/* Quick Action Buttons */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '0',
                        right: '0',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.3s ease',
                        padding: '0 20px'
                    }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product._id);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%' }}
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                    </div>

                    {/* Wishlist Button */}
                    <button style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ec4899',
                        cursor: 'pointer',
                        transform: isHovered ? 'scale(1)' : 'scale(0)',
                        transition: 'transform 0.3s ease 0.1s',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <FaHeart />
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div className="badge badge-hot" style={{ fontSize: '10px' }}>
                        {product.category?.name || 'New Arrival'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                        <FaStar size={12} />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.rating || 4.5}</span>
                    </div>
                </div>

                <Link href={`/product/${product.slug}`}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '10px',
                        color: 'var(--text-main)',
                        lineHeight: '1.4',
                        height: '2.8em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {product.title}
                    </h3>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                            ${product.price}
                        </span>
                        {product.mrp > product.price && (
                            <span style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-muted)',
                                textDecoration: 'line-through',
                                marginLeft: '8px'
                            }}>
                                ${product.mrp}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
