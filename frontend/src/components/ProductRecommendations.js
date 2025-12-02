'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from './ProductCard';
import { FaLightbulb } from 'react-icons/fa';

export default function ProductRecommendations({ productId }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await api.get(`/products/${productId}/recommendations?limit=8`);
                setRecommendations(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchRecommendations();
        }
    }, [productId]);

    if (loading || recommendations.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-2xl)' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-xl)'
            }}>
                <FaLightbulb size={24} style={{ color: 'var(--secondary)' }} />
                <h2 style={{ fontSize: '2rem', margin: 0 }}>
                    You May Also <span className="text-gradient">Like</span>
                </h2>
            </div>

            <div className="grid-products">
                {recommendations.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
