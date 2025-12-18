'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/utils/api';
import { FaClock, FaBolt, FaTag, FaChevronRight } from 'react-icons/fa';

export default function FlashSalesPage() {
    const router = useRouter();
    const [activeSales, setActiveSales] = useState([]);
    const [upcomingSales, setUpcomingSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activeRes, upcomingRes] = await Promise.all([
                    api.get('/flash-sales'),
                    api.get('/flash-sales/upcoming')
                ]);
                setActiveSales(activeRes.data);
                setUpcomingSales(upcomingRes.data);
            } catch (error) {
                console.error('Error fetching flash sales:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const CountdownTimer = ({ endTime }) => {
        const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

        useEffect(() => {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const end = new Date(endTime).getTime();
                const distance = end - now;

                if (distance < 0) {
                    clearInterval(timer);
                    setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                } else {
                    setTimeLeft({
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000)
                    });
                }
            }, 1000);

            return () => clearInterval(timer);
        }, [endTime]);

        return (
            <div style={{ display: 'flex', gap: '4px', fontWeight: '700', color: 'var(--error)', alignItems: 'center' }}>
                <FaClock />
                <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
                <div className="spinner"></div>
                <p>Loading flash sales...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(45deg, #FF6B6B, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 'var(--space-md)' }}>
                    FLASH SALES
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Limited time offers. Grab them before they're gone!</p>
            </div>

            {/* Active Sales */}
            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaBolt style={{ color: '#FFD93D' }} /> Live Now
                </h2>
                {activeSales.length === 0 ? (
                    <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                        <p>No active flash sales right now. Check back later!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                        {activeSales.map(sale => (
                            <div key={sale._id} className="glass-card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => router.push(`/flash-sales/${sale._id}`)}>
                                {sale.banner && (
                                    <div style={{ height: '150px', background: `url(${sale.banner}) center/cover no-repeat` }} />
                                )}
                                <div style={{ padding: 'var(--space-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                        <span style={{ backgroundColor: 'var(--error)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>LIVE</span>
                                        <CountdownTimer endTime={sale.endTime} />
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xs)' }}>{sale.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                                        {sale.products.length} Items on Sale
                                    </p>
                                    <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                        View Deals <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Upcoming Sales */}
            <section>
                <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaTag style={{ color: 'var(--primary)' }} /> Upcoming
                </h2>
                {upcomingSales.length === 0 ? (
                    <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                        <p>No upcoming sales scheduled.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                        {upcomingSales.map(sale => (
                            <div key={sale._id} className="glass-card" style={{ opacity: 0.8 }}>
                                <div style={{ padding: 'var(--space-lg)' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>{sale.title}</h3>
                                    <p style={{ marginBottom: 'var(--space-md)' }}>Starts on: <strong>{new Date(sale.startTime).toLocaleString()}</strong></p>
                                    <button className="btn btn-outline" disabled style={{ width: '100%' }}>
                                        Not Started Yet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
