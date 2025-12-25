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
            className="card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
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
                    height: '300px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
                            }}
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

                    {/* Quick Actions Overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: 'var(--space-4)',
                        left: 'var(--space-4)',
                        right: 'var(--space-4)',
                        display: 'flex',
                        gap: 'var(--space-2)',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all var(--transition-base)'
                    }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product._id);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{
                                flex: 1,
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <FaShoppingCart size={14} /> Add to Cart
                        </button>
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => e.preventDefault()}
                        style={{
                            position: 'absolute',
                            top: 'var(--space-3)',
                            right: 'var(--space-3)',
                            background: 'white',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                            transition: 'all var(--transition-base)',
                            boxShadow: 'var(--shadow-md)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'var(--primary)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <FaHeart size={16} />
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div style={{
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: 'var(--space-2)'
            }}>
                {/* Brand and Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        {product.brand || product.category?.name}
                    </span>
                    <div style={{ display: 'flex', gap: 1 }}>{renderStars(rating)}</div>
                </div>

                {/* Product Title */}
                <Link href={`/product/${product.slug}`} style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 'var(--leading-snug)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color var(--transition-base)'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                        {product.title}
                    </h3>
                </Link>

                {/* Price */}
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'var(--space-2)',
                    marginTop: 'auto'
                }}>
                    <span style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        ${product.price}
                    </span>
                    {product.mrp > product.price && (
                        <span style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-tertiary)',
                            textDecoration: 'line-through'
                        }}>
                            ${product.mrp}
                        </span>
                    )}
                </div>

                {/* Highlights */}
                {product.highlights?.length > 0 && (
                    <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        lineHeight: 'var(--leading-snug)',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {product.highlights[0]}
                    </p>
                )}
            </div>
        </article>
    );
}
