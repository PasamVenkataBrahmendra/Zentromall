'use client';

import Link from 'next/link';

const DealCard = ({ product }) => (
    <article
        className="card hover-lift"
        style={{
            width: 280,
            padding: 'var(--space-lg)',
            background:
                'radial-gradient(circle at top, rgba(239,68,68,0.08), transparent 60%), white',
        }}
    >
        <Link href={`/product/${product.slug}`}>
            <div
                style={{
                    height: 170,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                }}
            >
                <img
                    src={product.images?.[0]}
                    alt={product.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                }}
            >
                <span className="badge badge-error">-{product.discount || 15}%</span>
                <span style={{ color: '#b12704', fontWeight: 600 }}>Deal of the Day</span>
            </div>
            <h4 style={{ fontSize: '1rem', minHeight: 48 }}>{product.title}</h4>
            <p style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${product.price}</span>
                <span
                    style={{
                        textDecoration: 'line-through',
                        marginLeft: '0.5rem',
                        color: 'var(--gray)',
                    }}
                >
                    ${product.mrp}
                </span>
            </p>
        </Link>
    </article>
);

export default function DealsCarousel({ items = [] }) {
    if (!items.length) return null;
    return (
        <section className="home-rail">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem' }}>Top deals in electronics</h2>
                    <p style={{ color: 'var(--gray)' }}>Handpicked lightning deals, updated hourly</p>
                </div>
                <Link href="/shop?deal=true" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>See all deals</Link>
            </div>
            <div className="rail-scroll">
                {items.map(product => (
                    <DealCard key={product.slug} product={product} />
                ))}
            </div>
        </section>
    );
}

