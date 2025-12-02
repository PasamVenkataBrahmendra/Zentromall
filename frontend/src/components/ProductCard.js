'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
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
            }}
        >
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
            </div>
        </article>
    );
}
