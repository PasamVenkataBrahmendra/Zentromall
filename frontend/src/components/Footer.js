'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--gray-900)',
            color: 'white',
            marginTop: 'var(--space-24)',
            padding: 'var(--space-20) 0 var(--space-8) 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Background */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(254,111,94,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div className="container" style={{ position: 'relative' }}>
                <div className="grid-4" style={{ marginBottom: 'var(--space-16)', gap: 'var(--space-12)' }}>
                    {/* Company Info */}
                    <div>
                        <h3 style={{
                            fontSize: 'var(--text-2xl)',
                            marginBottom: 'var(--space-4)',
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 800
                        }}>
                            Zentro<span style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Mall</span>
                        </h3>
                        <p style={{ 
                            color: 'var(--gray-400)', 
                            marginBottom: 'var(--space-6)', 
                            lineHeight: 'var(--leading-relaxed)',
                            fontSize: 'var(--text-sm)'
                        }}>
                            Your one-stop destination for premium products at unbeatable prices. Shop with confidence.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                                <a key={idx} href="#" style={{
                                    color: 'var(--gray-400)',
                                    transition: 'all var(--transition-base)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--gray-800)',
                                    border: '1px solid var(--gray-700)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--gray-800)';
                                    e.currentTarget.style.color = 'var(--gray-400)';
                                    e.currentTarget.style.borderColor = 'var(--gray-700)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ 
                            fontSize: 'var(--text-lg)', 
                            marginBottom: 'var(--space-4)', 
                            fontWeight: 600,
                            color: 'white'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Home', 'Shop', 'AI Shop', 'About Us', 'Contact'].map(item => (
                                <li key={item} style={{ marginBottom: 'var(--space-3)' }}>
                                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} style={{
                                        color: 'var(--gray-400)',
                                        transition: 'all var(--transition-base)',
                                        display: 'inline-block',
                                        fontSize: 'var(--text-sm)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--gray-400)';
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
                        <h4 style={{ 
                            fontSize: 'var(--text-lg)', 
                            marginBottom: 'var(--space-4)', 
                            fontWeight: 600,
                            color: 'white'
                        }}>
                            Newsletter
                        </h4>
                        <p style={{ 
                            color: 'var(--gray-400)', 
                            marginBottom: 'var(--space-4)', 
                            fontSize: 'var(--text-sm)',
                            lineHeight: 'var(--leading-relaxed)'
                        }}>
                            Subscribe to get special offers and updates.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{
                                    flex: 1,
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--gray-700)',
                                    background: 'var(--gray-800)',
                                    color: 'white',
                                    fontSize: 'var(--text-sm)'
                                }}
                            />
                            <button className="btn btn-primary" style={{
                                padding: 'var(--space-3) var(--space-4)'
                            }}>
                                <FaEnvelope size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--gray-800)',
                    paddingTop: 'var(--space-8)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-6)'
                }}>
                    <p style={{ 
                        color: 'var(--gray-500)', 
                        fontSize: 'var(--text-sm)', 
                        margin: 0 
                    }}>
                        © 2025 ZentroMall. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ 
                            color: 'var(--gray-500)', 
                            fontSize: 'var(--text-sm)' 
                        }}>
                            We Accept:
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map(payment => (
                                <div key={payment} style={{
                                    padding: 'var(--space-1) var(--space-3)',
                                    background: 'var(--gray-800)',
                                    border: '1px solid var(--gray-700)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--gray-400)',
                                    fontWeight: 600
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
