'use client';

'use client';

import { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import Link from 'next/link';
import { FaCheckCircle, FaLock, FaShippingFast } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (!res.success) {
            setError(res.error);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-side">
                    <p className="badge badge-primary" style={{ width: 'fit-content' }}>Prime-ready</p>
                    <h2>Welcome back to ZentroMall</h2>
                    <p>Track orders, unlock Prime-only lightning deals and pick up right where you left off.</p>
                    <div className="auth-benefits">
                        <div className="auth-benefit">
                            <FaShippingFast size={26} color="#ff9900" />
                            <span>1-Day deliveries on 10k+ items</span>
                        </div>
                        <div className="auth-benefit">
                            <FaLock size={26} color="#4fa6e5" />
                            <span>Bank-grade secure checkout</span>
                        </div>
                        <div className="auth-benefit">
                            <FaCheckCircle size={26} color="#26a541" />
                            <span>Priority support 24x7</span>
                        </div>
                    </div>
                </div>
                <div className="auth-form">
                    <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Sign in</h3>
                        <p style={{ margin: 0, color: 'var(--gray)' }}>Use the same credentials across app & seller hub.</p>
                    </div>
                    {error && <div style={{ color: '#b12704', fontWeight: 600 }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Sign in securely
                        </button>
                    </form>
                    <div className="auth-alt">
                        New to ZentroMall?{' '}
                        <Link href="/register" style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>
                            Create your account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
