'use client';

'use client';

import { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import Link from 'next/link';
<<<<<<< HEAD
import { FaUser, FaEnvelope, FaLock, FaMagic, FaArrowRight } from 'react-icons/fa';
=======
import { FaLeaf, FaShieldAlt, FaSmile } from 'react-icons/fa';
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await register(name, email, password);
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
                    left: '-50px',
                    width: '100px',
                    height: '100px',
                    background: 'var(--gradient-hover)',
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
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join ZentroMall for exclusive deals</p>
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
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <FaUser style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
=======
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
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
<<<<<<< HEAD
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 45px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
=======
                                placeholder="Aisha Sharma"
                                required
                            />
                        </div>
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
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    color: 'white',
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
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : (
                            <>
                                Sign Up <FaArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: '25px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: '#ec4899', fontWeight: '600' }}>
                        Sign In
                    </Link>
                </p>
=======
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
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
            </div>
        </div>
    );
}
