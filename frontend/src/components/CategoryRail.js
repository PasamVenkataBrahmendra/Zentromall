'use client';

import Link from 'next/link';

export default function CategoryRail({ categories = [] }) {
    if (!categories.length) return null;
    return (
        <section className="home-rail">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Shop by category</h2>
                <Link href="/shop" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>View all</Link>
            </div>
            <div className="rail-scroll">
                {categories.map(category => (
                    <Link key={category.slug} href={`/shop?category=${category.slug}`} className="category-chip">
                        <img src={category.image} alt={category.name} />
                        <h4 style={{ margin: 0 }}>{category.name}</h4>
                        <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.9rem' }}>Explore new arrivals</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

