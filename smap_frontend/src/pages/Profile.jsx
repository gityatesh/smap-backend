import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext'; 
import ThemeToggle from '../ThemeToggle'; 

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('smap_token') || localStorage.getItem('token');
            console.log('profile token:', token);
            
            try {
                // Ensure this URL points perfectly to your Django server!
                // const response = await fetch('http://127.0.0.1:8000/api/portfolio/profile/', {
                //     headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                // });
                const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/profile/', {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                
                if (response.status === 401) {
                    // token invalid or expired — clear both possible keys and redirect
                    localStorage.removeItem('token');
                    localStorage.removeItem('smap_token');
                    navigate('/login');
                    return;
                }
                
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data.data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                // 👇 THIS IS THE FIX! This tells React to turn off the loading screen.
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        // Clear both possible token keys just to be completely safe
        localStorage.removeItem('smap_token'); 
        localStorage.removeItem('token'); 
        navigate('/login');
        window.location.reload(); 
    };

    if (loading) return <div style={{ padding: '40px', color: 'var(--text-main)', textAlign: 'center' }}>Loading profile...</div>;

    // Defensive accessors: backend may return slightly different keys or nest user data
    const username = profileData?.username ?? profileData?.user?.username ?? profileData?.User?.username ?? profileData?.name ?? profileData?.user_name ?? profileData?.handle ?? '-';
    const email = profileData?.email ?? profileData?.user?.email ?? profileData?.User?.email ?? profileData?.mail ?? '-';

    // Account creation date: try several common fields and format nicely
    const createdRaw = profileData?.created_at ?? profileData?.date_joined ?? profileData?.created_on ?? profileData?.createdAt ?? profileData?.joined_on ?? profileData?.User?.date_joined ?? null;
    const formatDate = (val) => {
        if (!val) return '-';
        try {
            const d = new Date(val);
            if (isNaN(d)) return String(val);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            return String(val);
        }
    };
    const createdAt = formatDate(createdRaw);

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: 'var(--text-main)' }}>
            <h2 style={{ marginBottom: '20px' }}>User Settings</h2>
            
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '8px', border: '1px solid var(--border-color)', transition: 'background-color 0.3s' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '12px' }}>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Username</p>
                        <h3 style={{ margin: '5px 0 0 0', color: 'var(--text-main)' }}>{username}</h3>
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Email Address</p>
                        <h3 style={{ margin: '5px 0 0 0', color: 'var(--text-main)' }}>{email}</h3>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Password</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>{'••••••••'}</h3>
                            <button
                                onClick={() => alert('Change password flow not implemented yet.')}
                                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Account Created</p>
                        <h3 style={{ margin: '5px 0 0 0', color: 'var(--text-main)' }}>{createdAt}</h3>
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--border-color)', marginBottom: '30px', transition: 'border-color 0.3s' }} />

                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-main)' }}>App Theme</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Currently in {theme === 'light' ? 'Light' : 'Dark'} Mode
                        </p>
                    </div>
                    
                    <ThemeToggle isLight={theme === 'light'} toggleTheme={toggleTheme} />
                </div>

                <hr style={{ borderColor: 'var(--border-color)', marginBottom: '30px', transition: 'border-color 0.3s' }} />

                <button 
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    LOG OUT
                </button>
            </div>
        </div>
    );
};

export default Profile;