'use client';

import Link from 'next/link';

const RailProductCard = ({ product }) => (
    <Link
        href={`/product/${product.slug}`}
        className="card"
        style={{
            minWidth: 280,
            maxWidth: 280,
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
        }}
    >
        <div
            style={{
                height: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
            }}
        >
            <img
                src={product.images?.[0]}
                alt={product.title}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
            />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
            <p style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
                margin: 0
            }}>
                {product.brand || 'Brand'}
            </p>
            <h4 style={{ 
                fontSize: 'var(--text-base)', 
                fontWeight: 600,
                minHeight: 48,
                lineHeight: 'var(--leading-snug)',
                color: 'var(--text-primary)',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {product.title}
            </h4>
            <p style={{ 
                margin: 0, 
                fontWeight: 700, 
                fontSize: 'var(--text-xl)',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                ${product.price}
            </p>
            {product.badges?.length > 0 && (
                <span className="badge badge-primary">
                    {product.badges[0]}
                </span>
            )}
        </div>
    </Link>
);

export default function ProductRail({ title, subtitle, products = [], cta }) {
    if (!products.length) return null;
    return (
        <section className="glass" style={{
            padding: 'var(--space-10)',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, rgba(254,111,94,0.03), rgba(0,118,182,0.03))'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--space-8)' 
            }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>{title}</h2>
                    {subtitle && (
                        <p style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: 'var(--text-lg)' 
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {cta && (
                    <Link
                        href={cta.href}
                        className="btn btn-outline btn-sm"
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

