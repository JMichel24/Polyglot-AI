import React from 'react';
import { X, User, Mail, Calendar, Globe, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose, language, level, nativeLanguage }) {
    const { user } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
                    <h3 className="font-bold text-white text-lg">My Profile</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Avatar */}
                <div className="p-6 flex flex-col items-center border-b border-slate-700/50">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/30">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h4 className="mt-4 text-xl font-bold text-white">{user?.username}</h4>
                    <p className="text-slate-400 text-sm">Language Learner</p>
                </div>

                {/* Info Cards */}
                <div className="p-4 space-y-3">
                    {/* Email */}
                    {user?.email && (
                        <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Mail size={18} className="text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-400">Email</p>
                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Learning Language */}
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Globe size={18} className="text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400">Learning</p>
                            <p className="text-sm font-medium text-white">{language}</p>
                        </div>
                    </div>

                    {/* Native Language */}
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Globe size={18} className="text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400">Native Language</p>
                            <p className="text-sm font-medium text-white">{nativeLanguage}</p>
                        </div>
                    </div>

                    {/* Level */}
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <GraduationCap size={18} className="text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400">Proficiency Level</p>
                            <p className="text-sm font-medium text-white">{level}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
