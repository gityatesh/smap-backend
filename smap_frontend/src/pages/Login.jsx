import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Login = () => {
    // 1. State for our form inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Grab our global login function and the router navigator
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 3. The function that runs when the user clicks "Submit"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        setError(null);
        setIsLoading(true);

        try {
            // Send the credentials to your custom Django endpoint
            const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', { ////
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success! Package the user data exactly how AuthContext expects it
                const userData = {
                    username: data.username,
                    email: data.email,
                    balance: data.balance,
                };
                
                // Save it to global memory and local storage
                login(userData, data.access);
                
                // Redirect them to the explore page (or portfolio once we build it!)
                navigate('/explore');
            } else {
                // Backend rejected the credentials
                setError('Invalid username or password.');
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
                    Welcome Back
                </h2>
                
                {error && (
                    <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            Username
                        </label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ 
                                width: '100%', padding: '10px', borderRadius: '6px', 
                                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' 
                            }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            Password
                        </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ 
                                width: '100%', padding: '10px', borderRadius: '6px', 
                                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' 
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            marginTop: '10px', padding: '12px', borderRadius: '6px', border: 'none', 
                            backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '16px', 
                            cursor: isLoading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;