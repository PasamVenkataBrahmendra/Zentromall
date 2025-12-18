'use client';

import { useComparison } from '../../src/context/ComparisonContext';
import { useCart } from '../../src/context/CartContext';
import Link from 'next/link';
import { FaTimes, FaShoppingCart, FaStar } from 'react-icons/fa';

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare } = useComparison();
    const { addToCart } = useCart();

    if (compareList.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)' }}>
                <h1>Compare Products</h1>
                <p style={{ margin: 'var(--space-lg) 0', color: 'var(--text-secondary)' }}>
                    You haven't added any products to compare yet.
                </p>
                <Link href="/shop" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1>Compare Products ({compareList.length})</h1>
                <button onClick={clearCompare} className="btn btn-outline btn-sm">Clear All</button>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px', background: 'white' }}>
                    <tbody>
                        {/* Product Info Row */}
                        <tr>
                            <td style={{ padding: 'var(--space-lg)', fontWeight: 'bold', width: '200px', background: '#f9fafb' }}>Product</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-lg)', verticalAlign: 'top', minWidth: '250px', position: 'relative' }}>
                                    <button
                                        onClick={() => removeFromCompare(product._id)}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                        title="Remove"
                                    >
                                        <FaTimes />
                                    </button>
                                    <Link href={`/product/${product.slug}`}>
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.title}
                                            style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: 'var(--space-md)' }}
                                        />
                                        <h3 style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: 'var(--space-sm)' }}>
                                            {product.title}
                                        </h3>
                                    </Link>
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        className="btn btn-primary btn-sm"
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                </td>
                            ))}
                        </tr>

                        {/* Price Row */}
                        <tr>
                            <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>Price</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border-color)', fontWeight: 'bold', color: '#b12704', fontSize: '1.1rem' }}>
                                    ${product.price}
                                </td>
                            ))}
                        </tr>

                        {/* Rating Row */}
                        <tr>
                            <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>Rating</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ color: '#ffa41c' }}>{product.rating || 0} <FaStar /></span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.numReviews || 0})</span>
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Brand Row */}
                        <tr>
                            <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>Brand</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
                                    {product.brand}
                                </td>
                            ))}
                        </tr>

                        {/* Category Row */}
                        <tr>
                            <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>Category</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
                                    {product.category?.name || 'N/A'}
                                </td>
                            ))}
                        </tr>

                        {/* Availability Row */}
                        <tr>
                            <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>Stock Code</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
                                    {product.stock > 0 ? (
                                        <span style={{ color: 'var(--success)', fontWeight: '500' }}>In Stock</span>
                                    ) : (
                                        <span style={{ color: 'var(--error)', fontWeight: '500' }}>Out of Stock</span>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Description Row (Scrollable) */}
                        <tr>
                            <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>Description</td>
                            {compareList.map(product => (
                                <td key={product._id} style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {product.description}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
