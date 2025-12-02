'use client';

import Link from 'next/link';

const RailProductCard = ({ product }) => (
    <Link
        href={`/product/${product.slug}`}
        className="card hover-lift"
        style={{
            width: 260,
            padding: 'var(--space-lg)',
            background:
                'radial-gradient(circle at top right, rgba(20,110,180,0.08), transparent 60%), white',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
        }}
    >
        <div
            style={{
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-sm)',
            }}
        >
            <img
                src={product.images?.[0]}
                alt={product.title}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{product.brand}</p>
        <h4 style={{ fontSize: '1rem', minHeight: 48 }}>{product.title}</h4>
        <p style={{ margin: 0, fontWeight: 700, color: '#b12704' }}>${product.price}</p>
        {product.badges?.length > 0 && (
            <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                {product.badges[0]}
            </span>
        )}
    </Link>
);

export default function ProductRail({ title, subtitle, products = [], cta }) {
    if (!products.length) return null;
    return (
        <section
            className="home-rail"
            style={{
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-2xl)',
                background:
                    'linear-gradient(135deg, rgba(19,25,33,0.98), rgba(35,47,62,0.96))',
                color: 'white',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div>
                    <h2 style={{ fontSize: '1.6rem' }}>{title}</h2>
                    {subtitle && (
                        <p style={{ color: 'rgba(229,231,235,0.9)', fontSize: '0.95rem' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {cta && (
                    <Link
                        href={cta.href}
                        style={{ color: 'var(--brand-orange)', fontWeight: 600 }}
                    >
                        {cta.label}
                    </Link>
                )}
            </div>
            <div className="rail-scroll">
                {products.map(product => (
                    <RailProductCard key={product.slug} product={product} />
                ))}
            </div>
        </section>
    );
}

