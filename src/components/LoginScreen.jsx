import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

export default function LoginScreen({ onRegisterClick }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginService(username, password);
            login(data.token, data.username);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>
            {error && <div className="p-3 bg-red-500/20 text-red-500 rounded-lg text-sm text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
                >
                    Sign In
                </button>
            </form>
            <p className="text-center text-slate-400 text-sm">
                Don't have an account?{' '}
                <button onClick={onRegisterClick} className="text-blue-400 hover:underline">
                    Sign up
                </button>
            </p>
        </div>
    );
}
