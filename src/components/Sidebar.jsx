import React from 'react';
import { BookOpen, MessageCircle, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose, onProfileClick, onSettingsClick }) {
    const { logout, user } = useAuth();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Content */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-blue-500">⚡</span> Polyglot AI
                    </h1>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <LogOut className="rotate-180" size={20} />
                    </button>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => onTabChange('classes')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'classes'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <BookOpen size={20} />
                        <span className="font-medium">Classes</span>
                    </button>

                    <button
                        onClick={() => onTabChange('practice')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'practice'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <MessageCircle size={20} />
                        <span className="font-medium">Practice</span>
                    </button>
                </div>

                <div className="p-4 border-t border-slate-800">
                    {/* User Info with Profile Button */}
                    <button
                        onClick={onProfileClick}
                        className="w-full flex items-center gap-3 px-4 py-3 mb-2 hover:bg-slate-800 rounded-xl transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                            <p className="text-xs text-slate-500 truncate">View Profile</p>
                        </div>
                    </button>

                    {/* Settings Button */}
                    <button
                        onClick={onSettingsClick}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm mb-2"
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>

                    {/* Sign Out Button */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}

