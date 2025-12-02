'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../src/utils/api';
import { useCart } from '../../../src/context/CartContext';
import { useRecentlyViewed } from '../../../src/context/RecentlyViewedContext';
import ProductRecommendations from '../../../src/components/ProductRecommendations';

export default function ProductDetails() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const { addToRecentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data);
                // Track recently viewed
                addToRecentlyViewed(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        if (slug) fetchProduct();
    }, [slug, addToRecentlyViewed]);

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: 'var(--radius)' }}>
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
                        {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : (
                            <span>No Image</span>
                        )}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{product.title}</h1>
                    <p style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '20px' }}>${product.price}</p>
                    <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>{product.description}</p>

                    <div style={{ marginBottom: '20px' }}>
                        <strong>Category:</strong> {product.category?.name} <br />
                        <strong>Seller:</strong> {product.seller?.storeName}
                    </div>

                    <button
                        onClick={() => addToCart(product._id)}
                        className="btn btn-primary"
                        style={{ padding: '15px 40px', fontSize: '18px' }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product Recommendations */}
            {product && <ProductRecommendations productId={product._id} />}
        </div>
    );
}
