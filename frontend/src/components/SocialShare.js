'use client';

import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaCopy } from 'react-icons/fa';

export default function SocialShare({ url, title, description, product }) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : url || '';
    const shareText = description || title || 'Check this out!';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };

    const handleShare = (platform) => {
        const link = shareLinks[platform];
        if (link) {
            window.open(link, '_blank', 'width=600,height=400');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    return (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: 'var(--space-xs)' }}>
                Share:
            </span>
            <button
                onClick={() => handleShare('facebook')}
                style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    background: '#1877f2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
                title="Share on Facebook"
            >
                <FaFacebook /> Facebook
            </button>
            <button
                onClick={() => handleShare('twitter')}
                style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    background: '#1da1f2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
                title="Share on Twitter"
            >
                <FaTwitter /> Twitter
            </button>
            <button
                onClick={() => handleShare('whatsapp')}
                style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    background: '#25d366',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
                title="Share on WhatsApp"
            >
                <FaWhatsapp /> WhatsApp
            </button>
            <button
                onClick={() => handleShare('linkedin')}
                style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    background: '#0077b5',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
                title="Share on LinkedIn"
            >
                <FaLinkedin /> LinkedIn
            </button>
            <button
                onClick={copyToClipboard}
                style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    background: 'var(--gray-200)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
                title="Copy link"
            >
                <FaCopy /> Copy
            </button>
        </div>
    );
}

