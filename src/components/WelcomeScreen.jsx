import React, { useState } from 'react';
import { MessageCircle, Globe, GraduationCap } from 'lucide-react';

const LANGUAGES = [
    { id: 'English', label: 'English', flag: '🇺🇸' },
    { id: 'Spanish', label: 'Español', flag: '🇪🇸' },
    { id: 'Korean', label: 'Korean', flag: '🇰🇷' },
    { id: 'Italian', label: 'Italiano', flag: '🇮🇹' },
    { id: 'French', label: 'Français', flag: '🇫🇷' },
    { id: 'German', label: 'Deutsch', flag: '🇩🇪' },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function WelcomeScreen({ onStart }) {
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].id);
    const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);

    return (
        <div className="flex flex-col h-full p-6 bg-slate-900 text-white">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-2">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <MessageCircle size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Polyglot AI</h1>
                    <p className="text-slate-400">Your immersive language companion</p>
                </div>

                <div className="w-full space-y-6">
                    <div className="space-y-3">
                        <label className="flex items-center text-sm font-medium text-slate-300 gap-2">
                            <Globe size={16} />
                            Target Language
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${selectedLanguage === lang.id
                                        ? 'bg-blue-600 border-blue-500 shadow-md shadow-blue-900/20'
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    <span className="mr-2 text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center text-sm font-medium text-slate-300 gap-2">
                            <GraduationCap size={16} />
                            Proficiency Level
                        </label>
                        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                            {LEVELS.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${selectedLevel === level
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onStart(selectedLanguage, selectedLevel)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                Start Conversation
            </button>
        </div>
    );
}
