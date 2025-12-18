'use client';

'use client';

import { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import Link from 'next/link';
<<<<<<< HEAD
import { FaEnvelope, FaLock, FaMagic, FaArrowRight } from 'react-icons/fa';
=======
import { FaCheckCircle, FaLock, FaShippingFast } from 'react-icons/fa';
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await login(email, password);
        if (!res.success) {
            setError(res.error);
            setIsLoading(false);
        }
    };

    return (
<<<<<<< HEAD
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '40px',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '100px',
                    height: '100px',
                    background: 'var(--gradient-main)',
                    filter: 'blur(40px)',
                    opacity: 0.5,
                    borderRadius: '50%'
                }} />

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'var(--gradient-glass)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <FaMagic size={24} color="#ec4899" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your shopping journey</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        padding: '12px',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
=======
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
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 45px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
=======
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 45px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
=======
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
                                placeholder="••••••••"
                                required
                            />
                        </div>
<<<<<<< HEAD
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : (
                            <>
                                Sign In <FaArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: '25px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: '#ec4899', fontWeight: '600' }}>
                        Create Account
                    </Link>
                </p>
=======
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
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
            </div>
        </div>
    );
}
