'use client';

import AdminLayout from '../../../src/components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../../../src/utils/api';
import Link from 'next/link';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Products</h1>
                <Link href="/admin/products/new" className="btn btn-primary">Add Product</Link>
            </div>

            <div className="bg-white rounded shadow" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Image</th>
                            <th style={{ padding: '15px' }}>Name</th>
                            <th style={{ padding: '15px' }}>Price</th>
                            <th style={{ padding: '15px' }}>Category</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>
                                    <img src={product.images?.[0] || ''} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td style={{ padding: '15px' }}>{product.title}</td>
                                <td style={{ padding: '15px' }}>${product.price}</td>
                                <td style={{ padding: '15px' }}>{product.category?.name}</td>
                                <td style={{ padding: '15px' }}>
                                    <button onClick={() => handleDelete(product._id)} className="btn" style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
