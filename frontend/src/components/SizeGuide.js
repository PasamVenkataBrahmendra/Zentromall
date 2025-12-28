'use client';

import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function SizeGuide({ productId }) {
    const [sizeGuide, setSizeGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        if (productId && showGuide) {
            fetchSizeGuide();
        }
    }, [productId, showGuide]);

    const fetchSizeGuide = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/size-guide/product/${productId}`);
            setSizeGuide(data);
        } catch (error) {
            console.error('Error fetching size guide:', error);
            setSizeGuide(null);
        } finally {
            setLoading(false);
        }
    };

    if (!showGuide) {
        return (
            <button
                onClick={() => setShowGuide(true)}
                style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: 'var(--primary)'
                }}
            >
                📏 Size Guide
            </button>
        );
    }

    if (loading) {
        return <div>Loading size guide...</div>;
    }

    if (!sizeGuide) {
        return (
            <div style={{ padding: 'var(--space-md)', background: '#f5f5f5', borderRadius: 'var(--radius-md)' }}>
                <p>Size guide not available for this product.</p>
                <button
                    onClick={() => setShowGuide(false)}
                    style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div style={{
            padding: 'var(--space-lg)',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            marginTop: 'var(--space-md)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Size Guide</h3>
                <button
                    onClick={() => setShowGuide(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                    }}
                >
                    ×
                </button>
            </div>

            {sizeGuide.sizeChart?.image && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <img
                        src={sizeGuide.sizeChart.image}
                        alt="Size Chart"
                        style={{ width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-md)' }}
                    />
                </div>
            )}

            {sizeGuide.measurements && sizeGuide.measurements.length > 0 && (
                <div style={{ overflowX: 'auto', marginBottom: 'var(--space-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ padding: 'var(--space-sm)', textAlign: 'left', border: '1px solid var(--border-color)' }}>Size</th>
                                {sizeGuide.measurements[0].chest && (
                                    <th style={{ padding: 'var(--space-sm)', textAlign: 'center', border: '1px solid var(--border-color)' }}>Chest</th>
                                )}
                                {sizeGuide.measurements[0].waist && (
                                    <th style={{ padding: 'var(--space-sm)', textAlign: 'center', border: '1px solid var(--border-color)' }}>Waist</th>
                                )}
                                {sizeGuide.measurements[0].hips && (
                                    <th style={{ padding: 'var(--space-sm)', textAlign: 'center', border: '1px solid var(--border-color)' }}>Hips</th>
                                )}
                                {sizeGuide.measurements[0].length && (
                                    <th style={{ padding: 'var(--space-sm)', textAlign: 'center', border: '1px solid var(--border-color)' }}>Length</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sizeGuide.measurements.map((measurement, idx) => (
                                <tr key={idx}>
                                    <td style={{ padding: 'var(--space-sm)', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>
                                        {measurement.size}
                                    </td>
                                    {measurement.chest && (
                                        <td style={{ padding: 'var(--space-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                            {measurement.chest}
                                        </td>
                                    )}
                                    {measurement.waist && (
                                        <td style={{ padding: 'var(--space-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                            {measurement.waist}
                                        </td>
                                    )}
                                    {measurement.hips && (
                                        <td style={{ padding: 'var(--space-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                            {measurement.hips}
                                        </td>
                                    )}
                                    {measurement.length && (
                                        <td style={{ padding: 'var(--space-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                            {measurement.length}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {sizeGuide.instructions && (
                <div style={{
                    padding: 'var(--space-md)',
                    background: '#f9fafb',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 'var(--space-md)'
                }}>
                    <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: '1rem', fontWeight: 'bold' }}>Instructions</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {sizeGuide.instructions}
                    </p>
                </div>
            )}
        </div>
    );
}

