'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaMagic } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [scrolled, setScrolled] = useState(false);

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            padding: '15px 30px',
            borderRadius: 'var(--radius-full)',
            background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            {/* Logo */}
            <Link href="/" style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                background: 'var(--gradient-text)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <FaMagic size={20} color="#ec4899" />
                ZentroMall
            </Link>

            {/* Links */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <Link href="/" style={{ fontWeight: '500', color: 'var(--text-main)' }}>Home</Link>
                <Link href="/shop" style={{ fontWeight: '500', color: 'var(--text-main)' }}>Shop</Link>
                <Link href="/ai-shop" style={{
                    fontWeight: '600',
                    color: '#ec4899',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    AI Shop
                </Link>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.05)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <FaSearch color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            outline: 'none',
                            width: '100px'
                        }}
                    />
                </div>

                <Link href="/cart" style={{ position: 'relative' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.05)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        color: 'var(--text-main)'
                    }}>
                        <FaShoppingCart size={18} />
                    </div>
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#ec4899',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </Link>

                {user ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link href="/profile">
                            <div style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {user.name[0]}
                            </div>
                        </Link>
                    </div>
                ) : (
                    <Link href="/login" className="btn btn-primary btn-sm">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
