'use client';

import { useState } from 'react';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

export default function AddressManager({ addresses, onUpdate }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        isDefault: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/users/addresses/${editingId}`, formData);
            } else {
                await api.post('/users/addresses', formData);
            }
            onUpdate();
            resetForm();
        } catch (error) {
            console.error('Error saving address:', error);
            alert(error.response?.data?.message || 'Failed to save address');
        }
    };

    const handleEdit = (address) => {
        setFormData({
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            isDefault: address.isDefault
        });
        setEditingId(address._id);
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (confirm('Are you sure you want to delete this address?')) {
            try {
                await api.delete(`/users/addresses/${addressId}`);
                onUpdate();
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await api.put(`/users/addresses/${addressId}/default`);
            onUpdate();
        } catch (error) {
            console.error('Error setting default:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-lg)'
            }}>
                <h3 style={{ fontSize: '1.5rem' }}>Saved Addresses</h3>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowForm(!showForm)}
                >
                    <FaPlus /> Add New Address
                </button>
            </div>

            {/* Address Form */}
            {showForm && (
                <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                    <h4 style={{ marginBottom: 'var(--space-md)' }}>
                        {editingId ? 'Edit Address' : 'New Address'}
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                required
                                style={{
                                    padding: 'var(--space-sm)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                    style={{
                                        padding: 'var(--space-sm)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    required
                                    style={{
                                        padding: 'var(--space-sm)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                <input
                                    type="text"
                                    placeholder="ZIP Code"
                                    value={formData.zip}
                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                    required
                                    style={{
                                        padding: 'var(--space-sm)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    required
                                    style={{
                                        padding: 'var(--space-sm)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                />
                                Set as default address
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update' : 'Save'} Address
                            </button>
                            <button type="button" className="btn btn-outline" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {addresses.map((address) => (
                    <div
                        key={address._id}
                        className="glass-card"
                        style={{
                            padding: 'var(--space-lg)',
                            position: 'relative',
                            border: address.isDefault ? '2px solid var(--primary)' : undefined
                        }}
                    >
                        {address.isDefault && (
                            <div style={{
                                position: 'absolute',
                                top: 'var(--space-sm)',
                                right: 'var(--space-sm)',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <FaCheck size={10} /> Default
                            </div>
                        )}
                        <p style={{ fontWeight: '600', marginBottom: 'var(--space-sm)' }}>
                            {address.street}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {address.city}, {address.state} {address.zip}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {address.country}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                            {!address.isDefault && (
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleSetDefault(address._id)}
                                >
                                    Set as Default
                                </button>
                            )}
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleEdit(address)}
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleDelete(address._id)}
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {addresses.length === 0 && !showForm && (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-3xl)',
                    color: 'var(--text-secondary)'
                }}>
                    <p>No saved addresses yet.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                        style={{ marginTop: 'var(--space-lg)' }}
                    >
                        Add Your First Address
                    </button>
                </div>
            )}
        </div>
    );
}
