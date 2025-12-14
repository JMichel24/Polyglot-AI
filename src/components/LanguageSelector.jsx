import React from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
    { id: 'English', label: 'English', flag: '🇺🇸' },
    { id: 'Spanish', label: 'Español', flag: '🇪🇸' },
    { id: 'Korean', label: 'Korean', flag: '🇰🇷' },
    { id: 'Japanese', label: '日本語', flag: '🇯🇵' },
    { id: 'Italian', label: 'Italiano', flag: '🇮🇹' },
    { id: 'French', label: 'Français', flag: '🇫🇷' },
    { id: 'German', label: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSelector({
    nativeLanguage,
    setNativeLanguage,
    targetLanguage,
    setTargetLanguage,
    onNext
}) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                <div className="space-y-8 pb-6">
                    <div className="text-center space-y-2">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Globe size={32} className="text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Choose your languages</h2>
                        <p className="text-slate-400">Select your native language and the one you want to learn</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">I speak...</label>
                            <div className="grid grid-cols-2 gap-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={`native-${lang.id}`}
                                        onClick={() => setNativeLanguage(lang.id)}
                                        className={`p-3 rounded-xl border text-left transition-all ${nativeLanguage === lang.id
                                            ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20'
                                            : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700'
                                            }`}
                                    >
                                        <span className="mr-2 text-lg">{lang.flag}</span>
                                        <span className="font-medium">{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">I want to learn...</label>
                            <div className="grid grid-cols-2 gap-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={`target-${lang.id}`}
                                        onClick={() => setTargetLanguage(lang.id)}
                                        disabled={nativeLanguage === lang.id}
                                        className={`p-3 rounded-xl border text-left transition-all ${targetLanguage === lang.id
                                            ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/20'
                                            : nativeLanguage === lang.id
                                                ? 'bg-slate-800/50 border-slate-800 opacity-50 cursor-not-allowed'
                                                : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700'
                                            }`}
                                    >
                                        <span className="mr-2 text-lg">{lang.flag}</span>
                                        <span className="font-medium">{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="pt-4 mt-auto border-t border-slate-700/50 bg-slate-800 z-10">
                <button
                    onClick={onNext}
                    disabled={!nativeLanguage || !targetLanguage}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
