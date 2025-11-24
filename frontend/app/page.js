'use client';

import { useEffect, useState } from 'react';
import api from '../src/utils/api';
import ProductCard from '../src/components/ProductCard';
import Link from 'next/link';

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

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
        borderRadius: 'var(--radius)',
        padding: '40px',
        color: 'white',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Welcome to ZentroMall</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Discover the best deals on Electronics, Fashion, and more.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/shop" style={{
            background: 'white', color: 'var(--primary)',
            padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold'
          }}>
            Shop Now
          </Link>
          <Link href="/ai-shop" style={{
            background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white',
            padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold'
          }}>
            Shop with AI
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--dark)' }}>Featured Products</h2>
      <div className="grid-products">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
