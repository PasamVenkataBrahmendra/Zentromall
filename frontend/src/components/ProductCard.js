'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
<<<<<<< HEAD
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
=======
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from 'react-icons/fa';

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
    const rating = product.rating || 4.5;
    const reviews = product.numReviews || 100;

    return (
        <article
            className="card hover-lift hover-glow"
            style={{
                padding: 'var(--space-lg)',
                borderRadius: 'var(--radius-2xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
                background:
                    'radial-gradient(circle at top left, rgba(255,153,0,0.08), transparent 55%), white',
                position: 'relative',
                overflow: 'hidden',
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
            }}
        >
<<<<<<< HEAD
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
=======
            {product.badges?.includes('Top Rated') && (
                <span
                    className="badge badge-success"
                    style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 1,
                    }}
                >
                    Top Rated
                </span>
            )}
            {product.isDealOfDay && (
                <span
                    className="badge badge-warning"
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                    }}
                >
                    Deal
                </span>
            )}

            <Link href={`/product/${product.slug}`}>
                <div
                    style={{
                        height: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-sm)',
                    }}
                >
                    <img
                        src={product.images?.[0]}
                        alt={product.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                </div>
                <p style={{ margin: '0.25rem 0', color: 'var(--gray)', fontSize: '0.8rem' }}>
                    {product.brand}
                </p>
                <h3
                    style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        minHeight: 48,
                        color: 'var(--dark)',
                    }}
                >
                    {product.title}
                </h3>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: 2 }}>{renderStars(rating)}</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                    {rating} ({reviews.toLocaleString()})
                </span>
            </div>

            <div>
                <span
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#b12704',
                    }}
                >
                    ${product.price}
                </span>
                {product.mrp && (
                    <span
                        style={{
                            marginLeft: '0.5rem',
                            textDecoration: 'line-through',
                            color: 'var(--gray)',
                            fontSize: '0.85rem',
                        }}
                    >
                        ${product.mrp}
                    </span>
                )}
                {product.discount && (
                    <span
                        className="badge badge-success"
                        style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}
                    >
                        -{product.discount}%
                    </span>
                )}
            </div>

            <ul
                style={{
                    paddingLeft: '1.2rem',
                    color: 'var(--gray)',
                    fontSize: '0.8rem',
                    margin: 0,
                }}
            >
                {product.highlights?.slice(0, 2).map((point) => (
                    <li key={point}>{point}</li>
                ))}
            </ul>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                }}
            >
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                    {product.deliveryInfo?.fastDelivery
                        ? 'FREE One-Day'
                        : product.deliveryInfo?.estimatedDays || 'Standard delivery'}
                </p>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => addToCart(product._id)}
                >
                    <FaShoppingCart size={14} />
                    Add
                </button>
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
            </div>
        </article>
    );
}
