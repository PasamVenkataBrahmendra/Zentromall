'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    // Generate star rating
    const renderStars = (rating = 4.5) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} color="#fbbf24" size={14} />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" color="#fbbf24" size={14} />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} color="#d1d5db" size={14} />);
        }
        return stars;
    };

    return (
        <div
            className="card"
            style={{
                overflow: 'hidden',
                transition: 'all var(--transition)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow)',
                cursor: 'pointer',
                padding: 0
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link href={`/product/${product.slug}`}>
                <div style={{
                    height: '240px',
                    background: 'var(--gray-lightest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {product.images?.[0] ? (
                        <>
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    transition: 'all var(--transition-slow)',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                                }}
                            />
                            {/* Gradient Overlay on Hover */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                                opacity: isHovered ? 1 : 0,
                                transition: 'opacity var(--transition)'
                            }} />
                        </>
                    ) : (
                        <span style={{ color: 'var(--gray-light)' }}>No Image</span>
                    )}

                    {/* Discount Badge */}
                    {product.discount && (
                        <div className="badge badge-error" style={{
                            position: 'absolute',
                            top: 'var(--space-md)',
                            right: 'var(--space-md)',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                        }}>
                            -{product.discount}%
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div style={{ padding: 'var(--space-lg)' }}>
                <Link href={`/product/${product.slug}`}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: 'var(--space-sm)',
                        color: 'var(--dark)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'color var(--transition)'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark)'}>
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-md)'
                }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {renderStars(product.rating || 4.5)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
                        ({product.reviews || 128})
                    </span>
                </div>

                {/* Price and Add to Cart */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'var(--space-md)'
                }}>
                    <div>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            ${product.price}
                        </span>
                        {product.originalPrice && (
                            <span style={{
                                fontSize: '0.875rem',
                                color: 'var(--gray)',
                                textDecoration: 'line-through',
                                marginLeft: 'var(--space-sm)'
                            }}>
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => addToCart(product._id)}
                        className="btn btn-primary btn-sm"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            padding: '0.625rem 1rem'
                        }}
                    >
                        <FaShoppingCart size={14} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
