'use client';

import { useEffect, useState } from 'react';
import api from '../../src/utils/api';
import ProductCard from '../../src/components/ProductCard';
import { FaClock } from 'react-icons/fa';

export default function DailyDealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Timer logic: Counts down to midnight tonight
        const timer = setInterval(() => {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            const diff = endOfDay - now;

            if (diff <= 0) {
                setTimeLeft('Expired');
                clearInterval(timer);
                return;
            }

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch products that are flagged as deal of the day
                // Ideally backend has a specific route, but we can filter client side or use search
                const { data } = await api.get('/products');
                const dealProducts = data.filter(p => p.isDealOfDay);
                setDeals(dealProducts);
            } catch (error) {
                console.error('Error fetching deals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading deals...</div>;

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            {/* Hero Banner for Deals */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #ff9900 0%, #ff5500 100%)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '40px',
                    color: 'white',
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}
            >
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '10px' }}>Deal of the Day</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Huge discounts on top tech and fashion. Ends soon!</p>
                </div>
                <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '15px 30px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    <FaClock /> <span>{timeLeft}</span>
                </div>
            </div>

            {deals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <h2>No deals active right now for you.</h2>
                    <p>Check back tomorrow!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {deals.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
