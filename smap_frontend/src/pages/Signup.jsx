import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // 1. Frontend Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        try {
            // 2. Send data to your Django Register API
            // const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            const response = await fetch('https://smap-backend-yrlx.onrender.com/api/accounts/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success! Send them to the login page to authenticate
                navigate('/login');
            } else {
                // Extract Django's error messages (e.g., "Username already exists")
                const errorMsg = data.username ? data.username[0] : 
                                 data.email ? data.email[0] : 
                                 'Registration failed. Please try again.';
                setError(errorMsg);
            }
        } catch (err) {
            setError('Could not connect to the server. Is Django running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '400px', 
                padding: '30px', 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-main)' }}>
                    Create an Account
                </h2>
                
                {error && (
                    <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
                    </div>

                    <button type="submit" disabled={isLoading}
                        style={{ marginTop: '10px', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;