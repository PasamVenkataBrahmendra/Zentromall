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
        <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ background: 'var(--nav-dark)', color: 'white' }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    padding: '0.75rem 0'
                }}>
                    {/* Logo */}
                    <Link href="/" style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: -0.5
                    }}>
                        Zentro<span style={{ color: 'var(--brand-orange)' }}>Mall</span>
                    </Link>

                    {/* Location Selection */}
                    <button style={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer'
                    }}>
                        <span style={{ fontSize: '0.75rem', color: '#ccc' }}>Deliver to</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            <FaMapMarkerAlt size={14} color="var(--brand-orange)" />
                            {user?.address?.city || 'Select Location'}
                        </span>
                    </button>

                    {/* Advanced Search Bar */}
                    <div style={{ flex: 1, margin: '0 var(--space-md)' }}>
                        <SearchBar />
                    </div>

                    {/* Right Side Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                        <Link href="/ai-shop" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'white' }}>
                            <FaRobot size={18} color="var(--brand-orange)" />
                            AI Shop
                        </Link>

                        <Link href="/profile" style={{ color: 'white' }}>
                            <div style={{ fontSize: '0.75rem' }}>Hello, {user ? user.name.split(' ')[0] : 'sign in'}</div>
                            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Account & Lists <FaChevronDown size={12} />
                            </div>
                        </Link>

                        <Link href="/orders" style={{ color: 'white' }}>
                            <div style={{ fontSize: '0.75rem' }}>Returns</div>
                            <div style={{ fontWeight: 700 }}>& Orders</div>
                        </Link>

                        <Link href="/cart" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem', position: 'relative' }}>
                            <FaShoppingCart size={24} />
                            <span style={{ fontWeight: 700 }}>Cart</span>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    background: 'var(--brand-orange)',
                                    color: '#111',
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user && (
                            <button
                                onClick={logout}
                                className="btn btn-outline btn-sm"
                                style={{ borderColor: 'white', color: 'white' }}
                            >
                                Logout
                            </button>
                        )}
                        {!user && (
                            <Link href="/login" className="btn btn-primary btn-sm">
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Secondary Navigation */}
            <div style={{ background: 'var(--nav-light)', color: 'white', fontSize: '0.95rem' }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    padding: '0.5rem 0',
                    overflowX: 'auto'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <span style={{ fontSize: '1.2rem' }}>☰</span> All
                    </div>
                    {secondaryLinks.map(link => (
                        <Link key={link.href} href={link.href} style={{ whiteSpace: 'nowrap', color: 'white' }}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
