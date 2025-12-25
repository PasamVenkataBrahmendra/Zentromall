'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle } from 'react-icons/fa';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // New Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/products/${productId}/reviews`);
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        setError('');

        try {
            await api.post(`/products/${productId}/reviews`, {
                rating,
                comment
            });

            // Reset form and reload reviews
            setComment('');
            setRating(5);
            fetchReviews();
            alert('Review submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (value) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (value >= i) {
                stars.push(<FaStar key={i} color="#ffc107" />);
            } else if (value >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
            } else {
                stars.push(<FaRegStar key={i} color="#e4e5e9" />);
            }
        }
        return stars;
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>Customer Reviews</h2>

            {/* Reviews List */}
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review this product!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        {reviews.map((review) => (
                            <div key={review._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                                        <FaUserCircle size={24} color="var(--text-secondary)" />
                                        {review.name}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ marginBottom: 'var(--space-xs)' }}>
                                    {renderStars(review.rating)}
                                </div>
                                <p style={{ lineHeight: '1.5' }}>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Review Form */}
            {user ? (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-md)' }}>Write a Review</h3>
                    {error && <p style={{ color: 'var(--error)', marginBottom: 'var(--space-sm)' }}>{error}</p>}
                    <form onSubmit={handleSubmitReview}>
                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 'bold' }}>Rating</label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={24}
                                        color={star <= rating ? "#ffc107" : "#e4e5e9"}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 'bold' }}>Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="Share your thoughts about this product..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ padding: 'var(--space-lg)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <p>Please <a href={`/login?redirect=/product/${productId}`} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>login</a> to write a review.</p>
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
