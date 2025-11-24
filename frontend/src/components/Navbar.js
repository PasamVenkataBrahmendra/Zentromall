'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav style={{ background: 'white', boxShadow: 'var(--shadow)', position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
                <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                    ZentroMall
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link href="/" style={{ fontWeight: 500 }}>Home</Link>
                    <Link href="/shop" style={{ fontWeight: 500 }}>Shop</Link>
                    <Link href="/ai-shop" style={{ fontWeight: 500, color: 'var(--accent)' }}>Shop with AI</Link>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link href="/cart" style={{ position: 'relative' }}>
                        <FaShoppingCart size={20} color="var(--dark)" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -8, right: -8,
                                background: 'var(--primary)', color: 'white',
                                fontSize: '10px', width: '18px', height: '18px',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Link href="/profile"><FaUser size={20} color="var(--dark)" /></Link>
                            <button onClick={logout} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '12px' }}>Logout</button>
                        </div>
                    ) : (
                        <Link href="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
