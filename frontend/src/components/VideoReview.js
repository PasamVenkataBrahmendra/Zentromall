'use client';

import { useState } from 'react';
import { FaPlay, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function VideoReview({ videoReview, onLike }) {
    const [playing, setPlaying] = useState(false);

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <div style={{ position: 'relative', marginBottom: 'var(--space-sm)' }}>
                {!playing ? (
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%', // 16:9 aspect ratio
                            background: '#000',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer'
                        }}
                        onClick={() => setPlaying(true)}
                    >
                        <img
                            src={videoReview.thumbnail || '/placeholder.png'}
                            alt="Video thumbnail"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem'
                        }}>
                            <FaPlay />
                        </div>
                    </div>
                ) : (
                    <video
                        src={videoReview.videoUrl}
                        controls
                        style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)'
                        }}
                    />
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{videoReview.user?.name}</p>
                    {videoReview.review?.rating && (
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            ⭐ {videoReview.review.rating}/5
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <button
                        onClick={() => onLike && onLike(videoReview._id, 'like')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 'var(--space-xs) var(--space-sm)',
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer'
                        }}
                    >
                        <FaThumbsUp /> {videoReview.likes || 0}
                    </button>
                    <button
                        onClick={() => onLike && onLike(videoReview._id, 'dislike')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 'var(--space-xs) var(--space-sm)',
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer'
                        }}
                    >
                        <FaThumbsDown /> {videoReview.dislikes || 0}
                    </button>
                </div>
            </div>

            {videoReview.review?.comment && (
                <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>
                    {videoReview.review.comment}
                </p>
            )}
        </div>
    );
}

