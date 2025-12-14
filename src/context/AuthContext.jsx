import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // In a real app, we would validate the token with the backend here
            // For now, we just assume if it exists, we are logged in (or we decode it)
            const username = localStorage.getItem('username');
            setUser({ username });
        }
    }, [token]);

    const login = (newToken, username) => {
        setToken(newToken);
        setUser({ username });
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', username);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
