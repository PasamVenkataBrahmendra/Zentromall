'use client';

import { useState } from 'react';
import api from '../utils/api';

export default function ImageSearch({ onResults }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const { data } = await api.post('/search/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (onResults) {
                onResults(data.products);
            }
        } catch (error) {
            setError('Failed to search by image. Please try again.');
            console.error('Image search error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: 'var(--space-md)' }}>
            <label
                style={{
                    display: 'inline-block',
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                }}
            >
                {uploading ? 'Searching...' : '📷 Search by Image'}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </label>
            {error && (
                <div style={{ marginTop: 'var(--space-sm)', color: 'var(--error)', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
}

