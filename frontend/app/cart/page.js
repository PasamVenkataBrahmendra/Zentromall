'use client';

import { useCart } from '../../src/context/CartContext';
import Link from 'next/link';

export default function Cart() {
    const { cart } = useCart();

    if (!cart || cart.items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Your cart is empty</h2>
                <Link href="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>Start Shopping</Link>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
            <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                {cart.items.map(item => (
                    <div key={item._id} className="bg-white rounded shadow" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '80px', height: '80px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.product.images?.[0] && <img src={item.product.images[0]} alt={item.product.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px' }}>{item.product.title}</h3>
                                <p style={{ color: 'var(--text-gray)' }}>${item.price} x {item.quantity}</p>
                            </div>
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                            ${item.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <h2 style={{ marginBottom: '20px' }}>Total: ${cart.totalPrice}</h2>
                <button className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '18px' }}>Checkout</button>
            </div>
        </div>
    );
}
