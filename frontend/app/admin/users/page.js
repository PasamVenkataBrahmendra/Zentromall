'use client';

import AdminLayout from '../../../src/components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../../../src/utils/api';
import { FaUser, FaEnvelope, FaTag, FaCalendarAlt } from 'react-icons/fa';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return (
        <AdminLayout>
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading users...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>User Management</h1>
                <div style={{ color: 'var(--text-gray)' }}>Total: {users.length} Users</div>
            </div>

            <div className="bg-white rounded shadow" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--gray-lighter)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '15px 20px' }}>User</th>
                            <th style={{ padding: '15px 20px' }}>Email</th>
                            <th style={{ padding: '15px 20px' }}>Role</th>
                            <th style={{ padding: '15px 20px' }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover-row">
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--gray-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaUser style={{ color: 'var(--gray)' }} />
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px', color: 'var(--text-gray)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaEnvelope /> {u.email}
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.85rem',
                                        background: u.role === 'admin' ? '#fee2e2' : u.role === 'seller' ? '#fef3c7' : '#e0f2fe',
                                        color: u.role === 'admin' ? '#991b1b' : u.role === 'seller' ? '#92400e' : '#075985',
                                        fontWeight: 600
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 20px', color: 'var(--text-gray)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaCalendarAlt /> {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-gray)' }}>
                        No users found in the system.
                    </div>
                )}
            </div>

            <style jsx>{`
                .hover-row:hover {
                    background-color: var(--gray-lighter);
                }
            `}</style>
        </AdminLayout>
    );
}
