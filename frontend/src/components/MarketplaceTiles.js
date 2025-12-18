'use client';

import Link from 'next/link';

const tileData = [
    {
        title: 'Electronics clearance picks',
        subtitle: 'Up to 45% off on certified gadgets',
        items: [
            {
                label: 'Noise-cancelling headphones',
                image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400',
                slug: 'wireless-bluetooth-headphones'
            },
            {
                label: 'Portable speakers',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                slug: 'portable-bluetooth-speaker'
            },
            {
                label: 'Gaming keyboards',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
                slug: 'mechanical-gaming-keyboard'
            },
            {
                label: 'Smart home cams',
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
                slug: 'smart-home-security-camera'
            }
        ],
        cta: '/shop?category=electronics'
    },
    {
        title: 'Style refresh under $99',
        subtitle: 'New looks inspired by Flipkart Fashion',
        items: [
            {
                label: 'Denim jackets',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
                slug: 'classic-denim-jacket'
            },
            {
                label: 'Everyday sneakers',
                image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400',
                slug: 'running-sneakers-pro'
            },
            {
                label: 'Premium bags',
                image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400',
                slug: 'leather-crossbody-bag'
            },
            {
                label: 'Smart watches',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                slug: 'smart-watch-series-7'
            }
        ],
        cta: '/shop?category=fashion'
    },
    {
        title: 'Home & kitchen best sellers',
        subtitle: 'Curated combos loved by Amazon shoppers',
        items: [
            {
                label: 'Robot vacuums',
                image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
                slug: 'robot-vacuum-cleaner'
            },
            {
                label: 'Cookware sets',
                image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
                slug: 'stainless-steel-cookware-set'
            },
            {
                label: 'Coffee makers',
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
                slug: 'coffee-maker-with-grinder'
            },
            {
                label: 'Air fryers',
                image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400',
                slug: 'air-fryer-6quart'
            }
        ],
        cta: '/shop?category=home-kitchen'
    },
    {
        title: 'Fitness & outdoors essentials',
        subtitle: 'Pick up and go, Flipkart-style',
        items: [
            {
                label: 'Adjustable dumbbells',
                image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
                slug: 'adjustable-dumbbell-set'
            },
            {
                label: 'Yoga mats',
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
                slug: 'yoga-mat-premium'
            },
            {
                label: 'Protein jars',
                image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
                slug: 'protein-powder-5lb'
            },
            {
                label: 'Foam rollers',
                image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400',
                slug: 'foam-roller-massage'
            }
        ],
        cta: '/shop?category=sports-fitness'
    }
];

export default function MarketplaceTiles() {
    return (
        <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
            {tileData.map(tile => (
                <div key={tile.title} className="card" style={{ padding: 'var(--space-lg)', minHeight: 360 }}>
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <h3 style={{ marginBottom: '0.25rem' }}>{tile.title}</h3>
                        <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.95rem' }}>{tile.subtitle}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
                        {tile.items.map(item => (
                            <Link key={item.label} href={`/product/${item.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <div style={{ background: '#f5f6f6', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={item.image} alt={item.label} style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }} />
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--dark)' }}>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                    <Link href={tile.cta} style={{ display: 'inline-flex', marginTop: 'var(--space-md)', color: 'var(--brand-orange)', fontWeight: 600 }}>
                        See more
                    </Link>
                </div>
            ))}
        </section>
    );
}

