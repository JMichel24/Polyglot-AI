import React from 'react';
import { X, Globe, GraduationCap } from 'lucide-react';

const LANGUAGES = [
    { id: 'English', label: 'English', flag: '🇺🇸' },
    { id: 'Spanish', label: 'Español', flag: '🇪🇸' },
    { id: 'Korean', label: 'Korean', flag: '🇰🇷' },
    { id: 'Japanese', label: '日本語', flag: '🇯🇵' },
    { id: 'Italian', label: 'Italiano', flag: '🇮🇹' },
    { id: 'French', label: 'Français', flag: '🇫🇷' },
    { id: 'German', label: 'Deutsch', flag: '🇩🇪' },
];

const LEVELS = [
    { id: 'A1', label: 'A1', description: 'Beginner' },
    { id: 'A2', label: 'A2', description: 'Elementary' },
    { id: 'B1', label: 'B1', description: 'Intermediate' },
    { id: 'B2', label: 'B2', description: 'Upper Int.' },
    { id: 'C1', label: 'C1', description: 'Advanced' },
    { id: 'C2', label: 'C2', description: 'Mastery' },
];

export default function SettingsModal({ isOpen, onClose, currentLanguage, currentLevel, onSave }) {
    const [selectedLanguage, setSelectedLanguage] = React.useState(currentLanguage);
    const [selectedLevel, setSelectedLevel] = React.useState(currentLevel);

    // Reset local state when modal opens with new props
    React.useEffect(() => {
        if (isOpen) {
            setSelectedLanguage(currentLanguage);
            setSelectedLevel(currentLevel);
        }
    }, [isOpen, currentLanguage, currentLevel]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(selectedLanguage, selectedLevel);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
                    <h3 className="font-bold text-white text-lg">Settings</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-6">
                    {/* Language Selection */}
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
                                    className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2 ${selectedLanguage === lang.id
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="text-sm font-medium">{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level Selection - CEFR Levels */}
                    <div className="space-y-3">
                        <label className="flex items-center text-sm font-medium text-slate-300 gap-2">
                            <GraduationCap size={16} />
                            Proficiency Level (CEFR)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {LEVELS.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`p-2.5 rounded-lg border text-center transition-all ${selectedLevel === level.id
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="text-lg font-bold block">{level.label}</span>
                                    <span className="text-xs opacity-70">{level.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
