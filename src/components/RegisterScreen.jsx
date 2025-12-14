import React, { useState } from 'react';
import { register as registerService } from '../services/authService';
import { User, Mail, AtSign, Lock, Bell, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterScreen({ onLoginClick }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailConsent, setEmailConsent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!email || !username || !password) {
            setError('Email, username and password are required');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            await registerService({ name, email, username, password, emailConsent });
            setSuccess(true);
            setTimeout(() => {
                onLoginClick();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-slate-400 text-sm">Join TutorSpeak and start learning today</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/20 text-green-400 rounded-lg text-sm">
                    <CheckCircle size={18} />
                    <span>Account created successfully! Redirecting...</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Full Name <span className="text-slate-500">(optional)</span>
                    </label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Email (Required) */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Username (Required) */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <AtSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Password (Required) */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
                </div>

                {/* Email Consent Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                    <div className="relative mt-0.5">
                        <input
                            type="checkbox"
                            id="emailConsent"
                            checked={emailConsent}
                            onChange={(e) => setEmailConsent(e.target.checked)}
                            className="sr-only peer"
                        />
                        <label
                            htmlFor="emailConsent"
                            className="flex items-center justify-center w-5 h-5 border-2 border-slate-600 rounded cursor-pointer peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors"
                        >
                            {emailConsent && <CheckCircle size={14} className="text-white" />}
                        </label>
                    </div>
                    <label htmlFor="emailConsent" className="flex items-start gap-2 cursor-pointer">
                        <Bell size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-400">
                            I'd like to receive learning tips, updates, and special offers via email
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || success}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none shadow-lg shadow-green-500/25"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-slate-400 text-sm">
                Already have an account?{' '}
                <button
                    onClick={onLoginClick}
                    className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
                >
                    Sign in
                </button>
            </p>
        </div>
    );
}
