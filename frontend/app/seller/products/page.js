'use client';

import SellerLayout from '../../../src/components/SellerLayout';
import { useEffect, useState } from 'react';
import api from '../../../src/utils/api';
import Link from 'next/link';

export default function SellerProducts() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products/myproducts');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        // Note: Sellers might not have delete permission in backend yet, strictly speaking only admin has deleteProduct in routes.
        // Let's check productRoutes.js: router.route('/:id').delete(protect, admin, deleteProduct);
        // Ah, sellers cannot delete products yet based on current backend.
        // I should update backend to allow sellers to delete their own products, or just disable the button.
        // For now, I'll disable the button or show an alert.
        alert('Contact admin to delete products.');
    };

    return (
        <SellerLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>My Products</h1>
                <Link href="/seller/products/new" className="btn btn-primary">Add Product</Link>
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
                                    <button onClick={() => handleDelete(product._id)} className="btn" style={{ color: 'gray', cursor: 'not-allowed' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
