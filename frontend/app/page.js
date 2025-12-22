'use client';

import { useEffect, useState } from 'react';
import api from '../src/utils/api';
import Link from 'next/link';
import { FaRocket, FaShieldAlt, FaTruck, FaHeadset, FaMobileAlt, FaTshirt, FaHome, FaGamepad, FaMagic } from 'react-icons/fa';
import ProductCard from '../src/components/ProductCard';
import ProductRail from '../src/components/ProductRail';
import { FALLBACK_COLLECTIONS } from '../src/data/fallbackData';

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
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const categories = [
    { name: 'Electronics', icon: FaMobileAlt, color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
    { name: 'Fashion', icon: FaTshirt, color: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { name: 'Home & Kitchen', icon: FaHome, color: 'linear-gradient(135deg, #10b981, #3b82f6)' },
    { name: 'Gaming', icon: FaGamepad, color: 'linear-gradient(135deg, #f59e0b, #ef4444)' }
  ];

  const benefits = [
    { title: 'Fast Delivery', desc: 'Within 24 hours', icon: FaRocket },
    { title: 'Secure Payment', desc: '100% protected', icon: FaShieldAlt },
    { title: 'Free Returns', desc: 'Within 30 days', icon: FaTruck },
    { title: '24/7 Support', desc: 'Always here for you', icon: FaHeadset },
  ];

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!collections) return null;

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: '-80px', // Pull behind navbar
        paddingTop: '80px'
      }}>
        {/* Animated Background Blobs */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: -1,
          animation: 'float 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: -1,
          animation: 'float 15s ease-in-out infinite reverse'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '5rem',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: 'var(--space-lg)',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))'
          }}>
            Future of Shopping <br /> is Here.
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-xl)',
            maxWidth: '700px',
            margin: '0 auto var(--space-xl)'
          }}>
            Experience the next generation of e-commerce with AI-powered recommendations and immersive shopping.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
              Start Exploring
            </Link>
            <Link href="/ai-shop" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
              <FaMagic /> AI Assistant
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Categories */}
        <div style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Browse Categories</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            {categories.map((cat, idx) => (
              <Link href={`/shop?category=${cat.name.toLowerCase()}`} key={idx}>
                <div className="glass-card" style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }}>
                    <cat.icon size={32} color="white" />
                  </div>
                  <h3 style={{ fontSize: '1.2rem' }}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products (Using Best Sellers) */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', lineHeight: '1' }}>Trending <br /> <span className="text-gradient">Products</span></h2>
            <Link href="/shop?sort=best-selling" className="btn btn-outline btn-sm">View All</Link>
          </div>

          <div className="grid-products">
            {collections.bestSellers?.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* New Arrivals Rail */}
        <div style={{ marginBottom: '100px' }}>
          <ProductRail
            title="New Arrivals"
            products={collections.newArrivals}
            cta={{ label: 'See All', href: '/shop?sort=newest' }}
          />
        </div>

        {/* Benefits */}
        <div className="glass" style={{
          padding: '60px',
          borderRadius: 'var(--radius-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                padding: '15px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#ec4899'
              }}>
                <benefit.icon size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '5px', fontWeight: '600' }}>{benefit.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
