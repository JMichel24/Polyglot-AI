import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, upgradeUserPlan, downgradeUserPlan } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch (err) {
                    console.error("Token validation / user fetch failed:", err);
                    if (err.status === 401 || err.status === 403 || err.status === 404) {
                        logout();
                    } else {
                        const username = localStorage.getItem('username');
                        const plan = localStorage.getItem('plan') || 'free';
                        setUser({ username, plan });
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        fetchUserData();
    }, [token]);

    const login = (newToken, username, plan = 'free') => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', username);
        localStorage.setItem('plan', plan);
        setToken(newToken);
        setUser({ username, plan });
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('plan');
    };

    const upgradePlan = async () => {
        try {
            const data = await upgradeUserPlan();
            if (data && data.plan) {
                localStorage.setItem('plan', data.plan);
                setUser(prev => prev ? { ...prev, plan: data.plan } : null);
                return data.plan;
            }
        } catch (error) {
            console.error("Upgrade plan context error:", error);
            throw error;
        }
    };

    const downgradePlan = async () => {
        try {
            const data = await downgradeUserPlan();
            if (data && data.plan) {
                localStorage.setItem('plan', data.plan);
                setUser(prev => prev ? { ...prev, plan: data.plan } : null);
                return data.plan;
            }
        } catch (error) {
            console.error("Downgrade plan context error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, upgradePlan, downgradePlan, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
