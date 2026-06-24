import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/auth`;

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const register = async ({ name, email, username, password, emailConsent }) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, emailConsent })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(errorData.error || 'Registration failed');
    }
    return response.json();
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const err = new Error('Failed to fetch user profile');
        err.status = response.status;
        throw err;
    }
    return response.json();
};

export const upgradeUserPlan = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_URL}/upgrade`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to upgrade plan');
    return response.json();
};

export const downgradeUserPlan = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_URL}/downgrade`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to downgrade plan');
    return response.json();
};

export const saveUserPreferences = async (prefs) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_URL}/preferences`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nativeLanguage: prefs.nativeLanguage,
            targetLanguage: prefs.language,
            level: prefs.level
        })
    });
    if (!response.ok) throw new Error('Failed to save preferences');
    return response.json();
};
