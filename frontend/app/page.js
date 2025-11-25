'use client';

import { useEffect, useState } from 'react';
import api from '../src/utils/api';
import ProductCard from '../src/components/ProductCard';
import Link from 'next/link';
import { FaRocket, FaShieldAlt, FaTruck, FaHeadset, FaMobileAlt, FaTshirt, FaHome, FaGamepad } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.slice(0, 8)); // Show first 8 products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: FaMobileAlt, color: 'var(--gradient-primary)' },
    { name: 'Fashion', icon: FaTshirt, color: 'var(--gradient-accent)' },
    { name: 'Home & Living', icon: FaHome, color: 'var(--gradient-success)' },
    { name: 'Gaming', icon: FaGamepad, color: 'var(--gradient-primary)' }
  ];

  const benefits = [
    { icon: FaRocket, title: 'Fast Delivery', desc: 'Get your orders delivered in 24-48 hours' },
    { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure payment methods' },
    { icon: FaTruck, title: 'Free Shipping', desc: 'Free shipping on orders over $50' },
    { icon: FaHeadset, title: '24/7 Support', desc: 'Dedicated customer support team' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'var(--gradient-hero)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-3xl) var(--space-xl)',
        color: 'white',
        marginBottom: 'var(--space-3xl)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-full)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-full)',
          animation: 'float 8s ease-in-out infinite'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '3.5rem',
            marginBottom: 'var(--space-lg)',
            fontWeight: '800',
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            Welcome to ZentroMall
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: 'var(--space-2xl)',
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto var(--space-2xl)'
          }}>
            Discover amazing products at unbeatable prices. Shop with AI assistance or browse our curated collections.
          </p>
          <div style={{
            display: 'flex',
            gap: 'var(--space-lg)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/shop" className="btn btn-lg" style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: '700'
            }}>
              Shop Now
            </Link>
            <Link href="/ai-shop" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              backdropFilter: 'blur(10px)',
              fontWeight: '700'
            }}>
              🤖 Shop with AI
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: 'var(--space-xl)',
          color: 'var(--dark)',
          textAlign: 'center',
          fontWeight: '700'
        }}>
          Shop by Category
        </h2>
        <div className="grid grid-4" style={{ gap: 'var(--space-lg)' }}>
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                href="/shop"
                className="card"
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: category.color,
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-lg)',
                  transition: 'all var(--transition)'
                }}>
                  <Icon size={36} color="white" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--dark)' }}>
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-xl)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: 'var(--dark)',
            fontWeight: '700',
            margin: 0
          }}>
            Featured Products
          </h2>
          <Link href="/shop" style={{
            color: 'var(--primary)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            transition: 'all var(--transition)'
          }}>
            View All →
          </Link>
        </div>
        <div className="grid-products">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--gray-lightest) 0%, white 100%)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-3xl) var(--space-xl)',
        marginBottom: 'var(--space-3xl)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: 'var(--space-2xl)',
          color: 'var(--dark)',
          textAlign: 'center',
          fontWeight: '700'
        }}>
          Why Choose ZentroMall?
        </h2>
        <div className="grid grid-4" style={{ gap: 'var(--space-xl)' }}>
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-md)',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <Icon size={32} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--dark)',
                  marginBottom: 'var(--space-sm)'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--gray)',
                  margin: 0
                }}>
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
