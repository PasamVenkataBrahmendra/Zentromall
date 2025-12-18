'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} color="#ffa41c" size={14} />);
    }
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" color="#ffa41c" size={14} />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} color="#d5d9d9" size={14} />);
    }
    return stars;
};

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    // Fallbacks
    const rating = product.rating || 4.5;
    const reviews = product.numReviews || 0;

    return (
        <article
            className="glass-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow)'
            }}
        >
            {/* Badges */}
            {product.badges?.includes('Top Rated') && (
                <span className="badge badge-success" style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                    Top Rated
                </span>
            )}
            {product.isDealOfDay && (
                <span className="badge badge-warning" style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                    Deal
                </span>
            )}
            {product.discount > 0 && (
                <span className="badge badge-error" style={{ position: 'absolute', top: 12, left: product.badges?.length ? 80 : 12, zIndex: 10 }}>
                    -{product.discount}%
                </span>
            )}

            {/* Image Container */}
            <Link href={`/product/${product.slug}`} style={{ flex: '0 0 auto' }}>
                <div style={{
                    height: '280px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                            }}
                        />
                    ) : (
                        <div style={{ color: 'var(--text-muted)' }}>No Image</div>
                    )}

                    {/* Overlay with Quick Actions */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '20px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.3s ease'
                    }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product._id);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                    </div>

                    {/* Wishlist Button (Always visible on hover) */}
                    <button style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'white',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ec4899',
                        cursor: 'pointer',
                        transform: isHovered ? 'scale(1)' : 'scale(0)',
                        transition: 'transform 0.3s ease 0.1s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <FaHeart />
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {product.brand || product.category?.name}
                    </span>
                    <div style={{ display: 'flex', gap: 2 }}>{renderStars(rating)}</div>
                </div>

                <Link href={`/product/${product.slug}`} style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {product.title}
                    </h3>
                </Link>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                        ${product.price}
                    </span>
                    {product.mrp > product.price && (
                        <span style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'line-through'
                        }}>
                            ${product.mrp}
                        </span>
                    )}
                </div>

                {product.highlights?.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                        {product.highlights[0]}
                    </div>
                )}
            </div>
        </article>
    );
}
