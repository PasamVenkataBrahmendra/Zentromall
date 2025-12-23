'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import {
    FaShoppingCart,
    FaRobot,
    FaMapMarkerAlt,
    FaChevronDown
} from 'react-icons/fa';
import SearchBar from './SearchBar';

const secondaryLinks = [
    { label: 'Best Sellers', href: '/shop?sort=best-selling' },
    { label: 'Today\'s Deals', href: '/shop?deal=true' },
    { label: 'Zentro Fresh', href: '/shop?category=home-kitchen' },
    { label: 'Electronics', href: '/shop?category=electronics' },
    { label: 'Fashion', href: '/shop?category=fashion' },
    { label: 'Customer Service', href: '/profile' },
    { label: 'Sell on Zentro', href: '/seller' }
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const router = useRouter();

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <header style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 100,
            background: 'var(--nav-bg)',
            borderBottom: '1px solid var(--border-light)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Main Navigation */}
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)',
                padding: 'var(--space-4) var(--space-6)',
                minHeight: '70px'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 800,
                    fontFamily: 'Syne, sans-serif',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                }}>
                    Zentro<span style={{ 
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Mall</span>
                </Link>

                {/* Search Bar */}
                <div style={{ flex: 1, maxWidth: '600px' }}>
                    <SearchBar />
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    {/* AI Shop */}
                    <Link href="/ai-shop" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-2)',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-base)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--gray-100)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                    }}>
                        <FaRobot size={18} />
                        <span>AI Shop</span>
                    </Link>

                    {/* Account */}
                    <Link href="/profile" style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-base)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--gray-100)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                    }}>
                        <div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                {user ? 'Hello, ' + user.name.split(' ')[0] : 'Sign in'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                Account <FaChevronDown size={10} />
                            </div>
                        </div>
                    </Link>

                    {/* Orders */}
                    <Link href="/orders" style={{ 
                        display: 'none',
                        alignItems: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-base)'
                    }}
                    className="desktop-only"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--gray-100)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                    }}>
                        Orders
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-2)',
                        position: 'relative',
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'var(--gray-100)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        transition: 'all var(--transition-base)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--gray-200)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--gray-100)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        <FaShoppingCart size={20} />
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                color: 'white',
                                minWidth: 22,
                                height: 22,
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 700,
                                padding: '0 var(--space-1)',
                                boxShadow: 'var(--shadow-primary)'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Buttons */}
                    {user ? (
                        <button
                            onClick={logout}
                            className="btn btn-secondary btn-sm"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">
                            Sign in
                        </Link>
                    )}
                </div>
            </div>

            {/* Secondary Navigation */}
            <div style={{ 
                background: 'var(--gray-50)',
                borderTop: '1px solid var(--border-light)',
                fontSize: 'var(--text-sm)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-6)',
                    padding: 'var(--space-2) var(--space-6)',
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                }}>
                    {secondaryLinks.map(link => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            style={{ 
                                whiteSpace: 'nowrap',
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                                padding: 'var(--space-2) 0',
                                transition: 'color var(--transition-base)',
                                borderBottom: '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.borderBottomColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-secondary)';
                                e.currentTarget.style.borderBottomColor = 'transparent';
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
