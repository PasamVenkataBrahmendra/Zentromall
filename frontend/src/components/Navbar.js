'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import {
    FaShoppingCart,
    FaUser,
    FaRobot,
    FaMapMarkerAlt,
    FaChevronDown,
    FaSearch
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

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
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                const { data } = await api.get('/products/search/suggestions', {
                    params: { q: query.trim() }
                });
                setSuggestions(data);
            } catch (error) {
                console.error('Search suggestion error:', error);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/shop?keyword=${encodeURIComponent(query.trim())}`);
        setShowSuggestions(false);
    };

    const handleSuggestionSelect = (suggestion, goToProduct = false) => {
        setQuery('');
        setShowSuggestions(false);
        if (goToProduct) {
            router.push(`/product/${suggestion.slug}`);
        } else {
            router.push(`/shop?keyword=${encodeURIComponent(suggestion.title)}`);
        }
    };

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ background: 'var(--nav-dark)', color: 'white' }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    padding: '0.75rem 0'
                }}>
                    <Link href="/" style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: -0.5
                    }}>
                        Zentro<span style={{ color: 'var(--brand-orange)' }}>Mall</span>
                    </Link>

                    <button style={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        textAlign: 'left'
                    }}>
                        <span style={{ fontSize: '0.75rem', color: '#ccc' }}>Deliver to</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            <FaMapMarkerAlt size={14} color="var(--brand-orange)" /> Your Location
                        </span>
                    </button>

                    <form onSubmit={handleSearch} style={{
                        flex: 1,
                        display: 'flex',
                        position: 'relative'
                    }}
                        ref={suggestionsRef}
                    >
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            background: 'white',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            border: '2px solid transparent',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                            onFocus={() => setShowSuggestions(true)}
                        >
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                placeholder="Search for products, brands and more"
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    padding: '0.85rem 1.25rem',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            <button type="submit" style={{
                                background: 'var(--brand-orange)',
                                border: 'none',
                                padding: '0 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#232f3e'
                            }}>
                                <FaSearch size={18} />
                            </button>
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.slug}
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSuggestionSelect(suggestion, true);
                                        }}
                                    >
                                        <strong>{suggestion.title}</strong>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
                                            {suggestion.brand}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>

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
                        <Link href="/profile" style={{ color: 'white' }}>
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
                                    right: 28,
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
                            <button onClick={logout} className="btn btn-outline btn-sm">
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
            <div style={{ background: 'var(--nav-light)', color: 'white', fontSize: '0.95rem' }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    padding: '0.5rem 0',
                    overflowX: 'auto'
                }}>
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
