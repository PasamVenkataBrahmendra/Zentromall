'use client';

import { useCart } from '../../src/context/CartContext';
import Link from 'next/link';
import { FaTrash, FaArrowRight, FaShoppingBag } from 'react-icons/fa';

export default function Cart() {
    const { cart, removeFromCart } = useCart();

    if (!cart || cart.items.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-3xl) 0',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'var(--gray-lightest)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-xl)'
                }}>
                    <FaShoppingBag size={40} color="var(--gray-dark)" />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-xl)' }}>
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link href="/shop" className="btn btn-primary" style={{ padding: '12px 30px' }}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 'var(--space-3xl)' }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: 'var(--space-2xl)',
                marginTop: 'var(--space-lg)'
            }}>
                Shopping Cart
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: 'var(--space-2xl)',
                alignItems: 'start'
            }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {cart.items.map(item => (
                        <div key={item._id} className="card" style={{
                            padding: 'var(--space-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-lg)',
                            transition: 'all var(--transition)'
                        }}>
                            {/* Product Image */}
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'var(--gray-lightest)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                {item.product.images?.[0] ? (
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <span style={{ color: 'var(--text-light)' }}>No Image</span>
                                )}
                            </div>

                            {/* Product Details */}
                            <div style={{ flex: 1 }}>
                                <Link href={`/product/${item.product.slug}`} style={{ textDecoration: 'none' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        marginBottom: 'var(--space-xs)',
                                        color: 'var(--dark)'
                                    }}>
                                        {item.product.title}
                                    </h3>
                                </Link>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                    Unit Price: ${item.price}
                                </p>
                            </div>

                            {/* Quantity & Total */}
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: 'var(--primary)',
                                    marginBottom: 'var(--space-xs)'
                                }}>
                                    ${item.price * item.quantity}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 'var(--space-sm)' }}>
                                    Qty: {item.quantity}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.product._id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '0.9rem',
                                        marginLeft: 'auto'
                                    }}
                                >
                                    <FaTrash size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: '100px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>Order Summary</h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-md)',
                        color: 'var(--text-gray)'
                    }}>
                        <span>Subtotal</span>
                        <span>${cart.totalPrice}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-lg)',
                        color: 'var(--text-gray)'
                    }}>
                        <span>Shipping</span>
                        <span style={{ color: 'var(--success)' }}>Free</span>
                    </div>

                    <div style={{
                        borderTop: '1px solid var(--gray-light)',
                        paddingTop: 'var(--space-lg)',
                        marginTop: 'var(--space-lg)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        marginBottom: 'var(--space-xl)'
                    }}>
                        <span>Total</span>
                        <span>${cart.totalPrice}</span>
                    </div>

                    <Link href="/checkout" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            Proceed to Checkout <FaArrowRight />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
