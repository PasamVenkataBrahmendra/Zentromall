'use client';

import Link from 'next/link';

const leafProducts = [
    {
        title: 'Leaf One Smart Speaker',
        blurb: 'Voice-first hub crafted with recycled aluminum and plant-based fabric.',
        badge: 'Carbon neutral',
        slug: 'portable-bluetooth-speaker',
        metrics: ['Dolby Spatial Audio', 'Solar-ready dock', 'Project Leaf exclusive']
    },
    {
        title: 'Leaf Air Purifier Mini',
        blurb: 'Whisper quiet filtration for studios and home offices.',
        badge: 'Project Leaf',
        slug: 'smart-home-security-camera',
        metrics: ['HEPA H13 filter', 'App + Alexa control', 'Uses 30% less power']
    },
    {
        title: 'Leaf Flow Bottle',
        blurb: 'Keeps beverages at the perfect temperature while tracking hydration.',
        badge: 'Bestseller',
        slug: 'sports-joggers',
        metrics: ['Smart reminders', 'Dishwasher safe', 'Made from ocean plastic']
    }
];

export default function ProjectLeafShowcase() {
    return (
        <section className="card" style={{ background: 'linear-gradient(135deg, #ecf7f1 0%, #f1f5f9 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <div>
                    <p className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Project Leaf</p>
                    <h2 style={{ marginBottom: '0.35rem' }}>Leaf Lab Showcase</h2>
                    <p style={{ margin: 0, color: 'var(--gray)' }}>Signature sustainable drops curated for investors and demo day decks.</p>
                </div>
                <Link href="/shop?brand=Leaf" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>
                    View all Leaf products →
                </Link>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
                {leafProducts.map((product) => (
                    <div key={product.title} className="card" style={{ background: 'white', minHeight: 260 }}>
                        <p className="badge badge-primary" style={{ width: 'fit-content', marginBottom: '0.75rem' }}>{product.badge}</p>
                        <h3 style={{ marginBottom: '0.35rem' }}>{product.title}</h3>
                        <p style={{ color: 'var(--gray)', marginBottom: '0.75rem' }}>{product.blurb}</p>
                        <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--gray)', fontSize: '0.9rem' }}>
                            {product.metrics.map(metric => (
                                <li key={metric}>{metric}</li>
                            ))}
                        </ul>
                        <Link href={`/product/${product.slug}`} className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: 'fit-content' }}>
                            See product
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

