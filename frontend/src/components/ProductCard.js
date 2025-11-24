'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded shadow" style={{ overflow: 'hidden', transition: 'transform 0.2s' }}>
            <Link href={`/product/${product.slug}`}>
                <div style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                        <span style={{ color: '#ccc' }}>No Image</span>
                    )}
                </div>
            </Link>
            <div style={{ padding: '15px' }}>
                <Link href={`/product/${product.slug}`}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.title}
                    </h3>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>${product.price}</span>
                    <button
                        onClick={() => addToCart(product._id)}
                        className="btn btn-primary"
                        style={{ padding: '8px 15px', fontSize: '14px' }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
