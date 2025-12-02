'use client';

import { useEffect, useState } from 'react';
import api from '../src/utils/api';
import HeroCarousel from '../src/components/HeroCarousel';
import DealsCarousel from '../src/components/DealsCarousel';
import ProductRail from '../src/components/ProductRail';
import CategoryRail from '../src/components/CategoryRail';
import ProjectLeafShowcase from '../src/components/ProjectLeafShowcase';
import MarketplaceTiles from '../src/components/MarketplaceTiles';
import { FALLBACK_COLLECTIONS } from '../src/data/fallbackData';
import Link from 'next/link';

export default function Home() {
  const [collections, setCollections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await api.get('/products/collections/featured');
        setCollections(data);
      } catch (error) {
        console.error('Error fetching featured collections:', error);
        setCollections(FALLBACK_COLLECTIONS);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        Loading curated storefront...
      </div>
    );
  }

  if (!collections) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
      <HeroCarousel slides={collections.heroBanners} />
      <DealsCarousel items={collections.dealsOfDay} />
      <CategoryRail categories={collections.curatedCategories} />

      <MarketplaceTiles />
      <ProductRail
        title="Bestsellers across India"
        subtitle="Most loved products this week"
        products={collections.bestSellers}
        cta={{ label: 'See all bestsellers', href: '/shop?sort=best-selling' }}
      />
      <ProductRail
        title="New arrivals just for you"
        subtitle="Fresh drops every morning"
        products={collections.newArrivals}
        cta={{ label: 'Browse new launches', href: '/shop?sort=newest' }}
      />
      <ProductRail
        title="Top rated picks"
        subtitle="Highly reviewed essentials"
        products={collections.topRated}
        cta={{ label: 'See all top rated', href: '/shop?rating=4' }}
      />
      <ProjectLeafShowcase />
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>Trending searches</h2>
            <p style={{ margin: 0, color: 'var(--gray)' }}>What other shoppers are looking for</p>
          </div>
          <Link href="/shop" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>Explore all</Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {collections.trendingSearches.map(term => (
            <Link
              key={term}
              href={`/shop?keyword=${encodeURIComponent(term)}`}
              className="filter-chip"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
