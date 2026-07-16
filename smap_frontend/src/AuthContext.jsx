import React, { createContext, useState, useEffect } from 'react';

// 1. Create the blank ID card
export const AuthContext = createContext();

// 2. Create the Provider (the machine that issues the ID card)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // When the app loads, check if they already logged in yesterday
    useEffect(() => {
        const storedToken = localStorage.getItem('smap_token');
        const storedUser = localStorage.getItem('smap_user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to run when they successfully log in
    const login = (userData, jwtToken) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('smap_token', jwtToken);
        localStorage.setItem('smap_user', JSON.stringify(userData));
    };

    // Function to run when they click Logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('smap_token');
        localStorage.removeItem('smap_user');
    };

    // Update only the balance field of the stored user
    const updateBalance = (newBalance) => {
        if (user) {
            const updatedUser = { ...user, balance: newBalance };
            setUser(updatedUser);
            localStorage.setItem('smap_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateBalance }}>
            {children}
        </AuthContext.Provider>
    );
};