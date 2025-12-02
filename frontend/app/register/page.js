'use client';

'use client';

import { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import Link from 'next/link';
import { FaLeaf, FaShieldAlt, FaSmile } from 'react-icons/fa';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(name, email, password);
        if (!res.success) {
            setError(res.error);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-side">
                    <p className="badge badge-success" style={{ width: 'fit-content' }}>Create & explore</p>
                    <h2>Join Project Leaf on ZentroMall</h2>
                    <p>Showcase sustainable launches, curate storefronts, and reach millions of conscious shoppers.</p>
                    <div className="auth-benefits">
                        <div className="auth-benefit">
                            <FaLeaf size={26} color="#8bc34a" />
                            <span>Dedicated Project Leaf spotlight</span>
                        </div>
                        <div className="auth-benefit">
                            <FaShieldAlt size={26} color="#4fa6e5" />
                            <span>Secure seller + buyer profiles</span>
                        </div>
                        <div className="auth-benefit">
                            <FaSmile size={26} color="#ffb703" />
                            <span>Personalised recos for your fans</span>
                        </div>
                    </div>
                </div>
                <div className="auth-form">
                    <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Create your account</h3>
                        <p style={{ margin: 0, color: 'var(--gray)' }}>One login unlocks shopping, selling and AI concierge.</p>
                    </div>
                    {error && <div style={{ color: '#b12704', fontWeight: 600 }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="auth-field">
                            <label>Full name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Aisha Sharma"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label>Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Start shopping
                        </button>
                    </form>
                    <div className="auth-alt">
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
