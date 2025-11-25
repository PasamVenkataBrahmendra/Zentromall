'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaRobot } from 'react-icons/fa';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Handle scroll effect
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            setIsScrolled(window.scrollY > 10);
        });
    }

    return (
        <nav style={{
            background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            boxShadow: isScrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'all var(--transition)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '80px'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'all var(--transition)',
                    letterSpacing: '-0.5px'
                }}>
                    ZentroMall
                </Link>

                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
                    <Link href="/" style={{
                        fontWeight: 600,
                        color: 'var(--dark)',
                        position: 'relative',
                        padding: '0.5rem 0',
                        transition: 'all var(--transition)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--dark)';
                        }}>
                        Home
                    </Link>
                    <Link href="/shop" style={{
                        fontWeight: 600,
                        color: 'var(--dark)',
                        position: 'relative',
                        padding: '0.5rem 0',
                        transition: 'all var(--transition)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--dark)';
                        }}>
                        Shop
                    </Link>
                    <Link href="/ai-shop" style={{
                        fontWeight: 600,
                        background: 'var(--gradient-accent)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        padding: '0.5rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all var(--transition)'
                    }}>
                        <FaRobot size={18} style={{ color: 'var(--accent)' }} />
                        AI Shop
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
                    {/* Cart */}
                    <Link href="/cart" style={{
                        position: 'relative',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--gray-lightest)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                        <FaShoppingCart size={22} color="var(--dark)" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                background: 'var(--gradient-accent)',
                                color: 'white',
                                fontSize: '0.625rem',
                                fontWeight: '700',
                                width: '20px',
                                height: '20px',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white',
                                animation: 'pulse 2s infinite'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Actions */}
                    {user ? (
                        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                            <Link href="/profile" style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-lg)',
                                transition: 'all var(--transition)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--gray-lightest)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <FaUser size={20} color="var(--dark)" />
                            </Link>
                            <button
                                onClick={logout}
                                className="btn btn-outline btn-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
