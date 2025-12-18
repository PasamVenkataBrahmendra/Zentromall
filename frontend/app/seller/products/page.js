'use client';

import SellerLayout from '../../../src/components/SellerLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../src/utils/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen } from 'react-icons/fa';

export default function SellerProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products/myproducts');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SellerLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Products</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your catalog</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => router.push('/seller/products/new')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 36px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <div className="spinner"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-lg)' }}>
                    <FaBoxOpen size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }} />
                    <h3>No products found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {searchTerm ? 'Try a different search term' : 'Start selling by adding your first product'}
                    </p>
                </div>
            ) : (
                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)', width: '80px' }}>Image</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Product Name</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Category</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Price</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)' }}>Stock</th>
                                <th style={{ padding: 'var(--space-lg) var(--space-md)', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                    <FaBoxOpen />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)', fontWeight: '500' }}>{product.title}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                            fontSize: '0.85rem'
                                        }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)' }}>${product.price}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <span style={{ color: product.countInStock > 0 ? 'var(--success)' : 'var(--error)' }}>
                                            {product.countInStock > 0 ? product.countInStock : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => router.push(`/seller/products/${product._id}/edit`)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleDelete(product._id, product.title)}
                                                style={{ color: 'var(--error)', borderColor: 'transparet' }}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </SellerLayout>
    );
}
