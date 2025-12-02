'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '../../src/context/WishlistContext';
import { useCart } from '../../src/context/CartContext';
import ProductCard from '../../src/components/ProductCard';
import Link from 'next/link';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';

export default function WishlistPage() {
    const { wishlist, loading, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
    const [removing, setRemoving] = useState(null);

    const handleRemove = async (productId) => {
        setRemoving(productId);
        await removeFromWishlist(productId);
        setRemoving(null);
    };

    const handleMoveToCart = async (productId) => {
        const result = await moveToCart(productId);
        if (result.success) {
            alert('Product moved to cart!');
        }
    };

    const handleClearAll = async () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            await clearWishlist();
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
                <div style={{ textAlign: 'center' }}>
                    <p>Loading wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-2xl)'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                        My <span className="text-gradient">Wishlist</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
                {wishlist.products.length > 0 && (
                    <button
                        className="btn btn-outline"
                        onClick={handleClearAll}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FaTrash /> Clear All
                    </button>
                )}
            </div>

            {/* Wishlist Items */}
            {wishlist.products.length === 0 ? (
                <div className="glass" style={{
                    textAlign: 'center',
                    padding: 'var(--space-3xl)',
                    borderRadius: 'var(--radius-xl)'
                }}>
                    <FaHeart size={64} style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
                        Your wishlist is empty
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                        Start adding products you love to your wishlist!
                    </p>
                    <Link href="/shop" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid-products">
                    {wishlist.products.map(({ product, addedAt }) => (
                        <div key={product._id} style={{ position: 'relative' }}>
                            <ProductCard product={product} />

                            {/* Action Buttons Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '20px',
                                right: '20px',
                                display: 'flex',
                                gap: 'var(--space-sm)',
                                zIndex: 10
                            }}>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleMoveToCart(product._id)}
                                    style={{ flex: 1, fontSize: '0.75rem' }}
                                >
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleRemove(product._id)}
                                    disabled={removing === product._id}
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
