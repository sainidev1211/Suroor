import React, { useState } from 'react';
import axios from 'axios';
import { FaUsers, FaMusic, FaHeart } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function AdminView() {
    const [secret, setSecret] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${BACKEND_URL}/api/admin/stats`, {
                headers: { 'x-admin-secret': secret }
            });
            setStats(res.data);
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            setError("Invalid Secret Key or Access Denied");
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                <div style={{ background: '#222', padding: 40, borderRadius: 12, width: 400, textAlign: 'center' }}>
                    <h2 style={{ marginBottom: 20 }}>Admin Access</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <input
                            type="password"
                            placeholder="Enter Secret Key"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            style={{ padding: 12, borderRadius: 4, border: 'none', background: '#333', color: 'white' }}
                        />
                        {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
                        <button type="submit" style={{ padding: 12, borderRadius: 24, border: 'none', background: 'var(--brand-gold)', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 40, color: 'white', overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
            <h1 style={{ marginBottom: 30 }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
                <StatCard icon={FaUsers} label="Total Users" value={stats.totalUsers} color="#4facfe" />
                <StatCard icon={FaMusic} label="Total Playlists" value={stats.totalPlaylists} color="#00f2fe" />
                <StatCard icon={FaHeart} label="Total Likes" value={stats.totalLiked} color="#ffbe0b" />
            </div>

            <h3>Recent Users</h3>
            <div style={{ background: '#222', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#333', textAlign: 'left' }}>
                            <th style={{ padding: 15 }}>Name</th>
                            <th style={{ padding: 15 }}>Email</th>
                            <th style={{ padding: 15 }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: 15 }}>{u.name}</td>
                                <td style={{ padding: 15, color: '#aaa' }}>{u.email}</td>
                                <td style={{ padding: 15, color: '#888' }}>{u.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div style={{ background: '#222', padding: 24, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ background: `${color}20`, padding: 16, borderRadius: '50%', color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <div style={{ fontSize: 14, color: '#aaa' }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
        </div>
    </div>
);
