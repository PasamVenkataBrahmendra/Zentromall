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
    <div style={{ paddingBottom: 'var(--space-24)' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'var(--space-20) 0',
        background: 'linear-gradient(180deg, rgba(254,111,94,0.03) 0%, rgba(255,255,255,0) 100%)'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,127,80,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          animation: 'float-slow 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(0,118,182,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          animation: 'float-slow 25s ease-in-out infinite reverse'
        }} />

        <div className="container" style={{ 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1,
          maxWidth: '1000px'
        }}>
          {/* Small Badge */}
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'linear-gradient(135deg, rgba(254,111,94,0.1), rgba(255,127,80,0.1))',
            border: '1px solid rgba(254,111,94,0.2)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-8)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--primary)'
          }}>
            <FaMagic size={14} />
            <span>AI-Powered Shopping Experience</span>
          </div>

          <h1 style={{
            fontSize: 'var(--text-7xl)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 'var(--space-6)',
            letterSpacing: '-0.03em'
          }}>
            Shop Smarter,
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto'
            }}>
              Live Better
            </span>
          </h1>
          
          <p style={{
            fontSize: 'var(--text-xl)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-10)',
            maxWidth: '650px',
            margin: '0 auto var(--space-10)',
            lineHeight: 'var(--leading-relaxed)'
          }}>
            Discover premium products curated just for you. Experience seamless shopping with personalized recommendations and exclusive deals.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-4)', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              <FaRocket /> Start Shopping
            </Link>
            <Link href="/ai-shop" className="btn btn-secondary btn-lg">
              <FaMagic /> Try AI Assistant
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-8)',
            justifyContent: 'center',
            marginTop: 'var(--space-16)',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: FaShieldAlt, text: 'Secure Payments' },
              { icon: FaTruck, text: 'Free Delivery' },
              { icon: FaHeadset, text: '24/7 Support' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500
              }}>
                <item.icon size={18} color="var(--primary)" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Categories */}
        <section style={{ marginBottom: 'var(--space-24)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Shop by Category</h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
              Explore our curated collections
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {categories.map((cat, idx) => (
              <Link href={`/shop?category=${cat.name.toLowerCase()}`} key={idx}>
                <div className="glass-card" style={{
                  padding: 'var(--space-10) var(--space-6)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-2xl)',
                    background: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transition: 'transform var(--transition-base)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}>
                    <cat.icon size={40} color="white" />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products (Using Best Sellers) */}
        <section style={{ marginBottom: 'var(--space-24)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 'var(--space-12)'
          }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>
                Trending <span className="text-gradient">Now</span>
              </h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
                Most popular items this week
              </p>
            </div>
            <Link href="/shop?sort=best-selling" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          <div className="grid-products">
            {collections.bestSellers?.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals Rail */}
        <section style={{ marginBottom: 'var(--space-24)' }}>
          <ProductRail
            title="New Arrivals"
            subtitle="Fresh picks just for you"
            products={collections.newArrivals}
            cta={{ label: 'See All', href: '/shop?sort=newest' }}
          />
        </section>

        {/* Benefits */}
        <section className="glass" style={{
          padding: 'var(--space-12)',
          borderRadius: 'var(--radius-2xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-8)'
        }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              alignItems: 'flex-start',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-50)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                padding: 'var(--space-3)',
                background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                height: '48px',
                boxShadow: 'var(--shadow-primary)'
              }}>
                <benefit.icon size={24} />
              </div>
              <div>
                <h4 style={{ 
                  fontSize: 'var(--text-lg)', 
                  marginBottom: 'var(--space-1)', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {benefit.title}
                </h4>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
