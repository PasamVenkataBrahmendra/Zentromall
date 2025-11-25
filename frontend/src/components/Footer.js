'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            marginTop: 'var(--space-3xl)',
            padding: 'var(--space-3xl) 0 var(--space-lg) 0'
        }}>
            <div className="container">
                <div className="grid grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
                    {/* Company Info */}
                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            marginBottom: 'var(--space-lg)',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            ZentroMall
                        </h3>
                        <p style={{ color: '#cbd5e1', marginBottom: 'var(--space-md)', lineHeight: '1.6' }}>
                            Your one-stop destination for premium products at unbeatable prices. Shop with confidence.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                            <a href="#" style={{
                                color: 'white',
                                transition: 'all var(--transition)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(255,255,255,0.1)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--gradient-primary)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" style={{
                                color: 'white',
                                transition: 'all var(--transition)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(255,255,255,0.1)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--gradient-primary)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" style={{
                                color: 'white',
                                transition: 'all var(--transition)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(255,255,255,0.1)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--gradient-primary)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" style={{
                                color: 'white',
                                transition: 'all var(--transition)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(255,255,255,0.1)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--gradient-primary)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: '600' }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Home', 'Shop', 'AI Shop', 'About Us', 'Contact'].map(item => (
                                <li key={item} style={{ marginBottom: 'var(--space-sm)' }}>
                                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} style={{
                                        color: '#cbd5e1',
                                        transition: 'all var(--transition)',
                                        display: 'inline-block'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#cbd5e1';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: '600' }}>
                            Customer Service
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Help Center', 'Track Order', 'Returns', 'Shipping Info', 'Privacy Policy'].map(item => (
                                <li key={item} style={{ marginBottom: 'var(--space-sm)' }}>
                                    <Link href="#" style={{
                                        color: '#cbd5e1',
                                        transition: 'all var(--transition)',
                                        display: 'inline-block'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#cbd5e1';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: '600' }}>
                            Newsletter
                        </h4>
                        <p style={{ color: '#cbd5e1', marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
                            Subscribe to get special offers and updates.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontSize: '0.875rem'
                                }}
                            />
                            <button style={{
                                padding: '0.75rem 1.25rem',
                                background: 'var(--gradient-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-lg)',
                                color: 'white',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all var(--transition)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                <FaEnvelope />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: 'var(--space-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-md)'
                }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                        © 2025 ZentroMall. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>We Accept:</span>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map(payment => (
                                <div key={payment} style={{
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: '0.75rem',
                                    color: '#cbd5e1'
                                }}>
                                    {payment}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
