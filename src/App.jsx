import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingFlow from './components/OnboardingFlow';
import ChatScreen from './components/ChatScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import ClassesScreen from './components/ClassesScreen';

import { Menu, User, Settings } from 'lucide-react';

function AppContent() {
    const { isAuthenticated, user } = useAuth();

    const [hasStarted, setHasStarted] = useState(false);
    const [language, setLanguage] = useState('English');
    const [nativeLanguage, setNativeLanguage] = useState('English');
    const [level, setLevel] = useState('A1');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [showRegister, setShowRegister] = useState(false);
    const [activeTab, setActiveTab] = useState('classes');
    const [activeLesson, setActiveLesson] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Load preferences when user changes
    React.useEffect(() => {
        if (user && user.username) {
            const key = `prefs_${user.username}`;
            const savedPrefs = localStorage.getItem(key);
            if (savedPrefs) {
                const prefs = JSON.parse(savedPrefs);
                setLanguage(prefs.language || 'English');
                setLevel(prefs.level || 'Basic');
                setNativeLanguage(prefs.nativeLanguage || 'English');
                setHasStarted(true);
            } else {
                // New user or no prefs saved
                setHasStarted(false);
                setLanguage('English');
                setLevel('Basic');
            }
        }
    }, [user]);

    const handleStart = (selectedLanguage, selectedLevel, selectedNativeLanguage) => {
        setLanguage(selectedLanguage);
        setLevel(selectedLevel);
        if (selectedNativeLanguage) setNativeLanguage(selectedNativeLanguage);

        if (user && user.username) {
            const prefs = {
                language: selectedLanguage,
                level: selectedLevel,
                nativeLanguage: selectedNativeLanguage || nativeLanguage
            };
            localStorage.setItem(`prefs_${user.username}`, JSON.stringify(prefs));
        }

        setHasStarted(true);
    };

    const handleBack = () => {
        if (activeLesson) {
            setActiveLesson(null);
        } else {
            setHasStarted(false);
        }
    };

    const handleStartLesson = (lesson) => {
        setActiveLesson(lesson);
        // Switch to chat view implicitly by rendering ChatScreen with lesson context
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
                {showRegister ? (
                    <RegisterScreen onLoginClick={() => setShowRegister(false)} />
                ) : (
                    <LoginScreen onRegisterClick={() => setShowRegister(true)} />
                )}
            </div>
        );
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
                <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700 h-[800px] max-h-[90vh] flex flex-col relative p-6">
                    <OnboardingFlow onComplete={handleStart} />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col md:flex-row bg-slate-900 text-white overflow-hidden">
            {/* Mobile Header - Only show if NOT in chat mode */}
            {(!activeLesson && activeTab !== 'practice') && (
                <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20 relative shrink-0">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-blue-500">⚡</span> Polyglot AI
                    </h1>
                    <div className="flex items-center gap-2">
                        {/* Profile Button */}
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Profile"
                        >
                            <User size={22} />
                        </button>
                        {/* Settings Button */}
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Settings"
                        >
                            <Settings size={22} />
                        </button>
                        {/* Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setActiveLesson(null); // Reset lesson when switching tabs
                    setIsMobileMenuOpen(false); // Close menu on selection
                }}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onProfileClick={() => {
                    setShowProfileModal(true);
                    setIsMobileMenuOpen(false);
                }}
                onSettingsClick={() => {
                    setShowSettingsModal(true);
                    setIsMobileMenuOpen(false);
                }}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {activeTab === 'classes' && !activeLesson && (
                    <ClassesScreen
                        language={language}
                        level={level}
                        onStartLesson={handleStartLesson}
                    />
                )}

                {activeTab === 'practice' && !activeLesson && (
                    <div className="flex-1 flex flex-col h-full relative">
                        <ChatScreen
                            language={language}
                            nativeLanguage={nativeLanguage}
                            level={level}
                            username={user?.username}
                            onBack={handleBack}
                            lessonContext={null}
                            chatMode="practice"
                            onUpdateSettings={(newLang, newLevel) => {
                                setLanguage(newLang);
                                setLevel(newLevel);
                                if (user && user.username) {
                                    const prefs = {
                                        language: newLang,
                                        level: newLevel,
                                        nativeLanguage: nativeLanguage
                                    };
                                    localStorage.setItem(`prefs_${user.username}`, JSON.stringify(prefs));
                                }
                            }}
                        />
                    </div>
                )}

                {activeLesson && (
                    <div className="flex-1 flex flex-col h-full relative">
                        <ChatScreen
                            language={language}
                            nativeLanguage={nativeLanguage}
                            level={level}
                            username={user?.username}
                            onBack={handleBack}
                            lessonContext={activeLesson}
                            chatMode="lesson"
                            onUpdateSettings={(newLang, newLevel) => {
                                setLanguage(newLang);
                                setLevel(newLevel);
                                if (user && user.username) {
                                    const prefs = {
                                        language: newLang,
                                        level: newLevel,
                                        nativeLanguage: nativeLanguage
                                    };
                                    localStorage.setItem(`prefs_${user.username}`, JSON.stringify(prefs));
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                language={language}
                level={level}
                nativeLanguage={nativeLanguage}
            />

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                currentLanguage={language}
                currentLevel={level}
                onSave={(newLang, newLevel) => {
                    setLanguage(newLang);
                    setLevel(newLevel);
                    if (user && user.username) {
                        const prefs = {
                            language: newLang,
                            level: newLevel,
                            nativeLanguage: nativeLanguage
                        };
                        localStorage.setItem(`prefs_${user.username}`, JSON.stringify(prefs));
                    }
                }}
            />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
